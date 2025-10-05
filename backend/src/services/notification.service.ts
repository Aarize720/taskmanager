import cron from 'node-cron';
import pool from '../config/database';
import transporter from '../config/email';
import { Task, User, NotificationType } from '../types';

// Check for tasks due soon (24 hours before)
const checkTasksDueSoon = async () => {
  try {
    const result = await pool.query<Task & { user_email: string; user_first_name: string }>(
      `SELECT t.*, u.email as user_email, u.first_name as user_first_name
       FROM tasks t
       JOIN users u ON t.user_id = u.id
       WHERE t.status != 'completed'
       AND t.due_date IS NOT NULL
       AND t.due_date > NOW()
       AND t.due_date <= NOW() + INTERVAL '24 hours'
       AND NOT EXISTS (
         SELECT 1 FROM notifications n
         WHERE n.user_id = t.user_id
         AND n.related_id = t.id
         AND n.type = 'task_due_soon'
         AND n.created_at > NOW() - INTERVAL '24 hours'
       )`
    );

    for (const task of result.rows) {
      // Create notification
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, related_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          task.user_id,
          NotificationType.TASK_DUE_SOON,
          'Task Due Soon',
          `Your task "${task.title}" is due in less than 24 hours`,
          task.id,
        ]
      );

      // Send email if configured
      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: task.user_email,
            subject: 'Task Due Soon - Task Manager',
            html: `
              <h2>Hello ${task.user_first_name},</h2>
              <p>This is a reminder that your task is due soon:</p>
              <h3>${task.title}</h3>
              <p><strong>Due Date:</strong> ${new Date(task.due_date!).toLocaleString()}</p>
              <p><strong>Priority:</strong> ${task.priority}</p>
              ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
              <p>Visit your <a href="${process.env.FRONTEND_URL}">Task Manager</a> to view details.</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    }

    if (result.rows.length > 0) {
      console.log(`✅ Created ${result.rows.length} "due soon" notifications`);
    }
  } catch (error) {
    console.error('Error checking tasks due soon:', error);
  }
};

// Check for overdue tasks
const checkOverdueTasks = async () => {
  try {
    const result = await pool.query<Task & { user_email: string; user_first_name: string }>(
      `SELECT t.*, u.email as user_email, u.first_name as user_first_name
       FROM tasks t
       JOIN users u ON t.user_id = u.id
       WHERE t.status != 'completed'
       AND t.due_date IS NOT NULL
       AND t.due_date < NOW()
       AND NOT EXISTS (
         SELECT 1 FROM notifications n
         WHERE n.user_id = t.user_id
         AND n.related_id = t.id
         AND n.type = 'task_overdue'
         AND n.created_at > NOW() - INTERVAL '24 hours'
       )`
    );

    for (const task of result.rows) {
      // Create notification
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, related_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          task.user_id,
          NotificationType.TASK_OVERDUE,
          'Task Overdue',
          `Your task "${task.title}" is overdue`,
          task.id,
        ]
      );

      // Send email if configured
      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: task.user_email,
            subject: 'Task Overdue - Task Manager',
            html: `
              <h2>Hello ${task.user_first_name},</h2>
              <p>Your task is now overdue:</p>
              <h3>${task.title}</h3>
              <p><strong>Due Date:</strong> ${new Date(task.due_date!).toLocaleString()}</p>
              <p><strong>Priority:</strong> ${task.priority}</p>
              ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
              <p>Visit your <a href="${process.env.FRONTEND_URL}">Task Manager</a> to update the task.</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    }

    if (result.rows.length > 0) {
      console.log(`✅ Created ${result.rows.length} "overdue" notifications`);
    }
  } catch (error) {
    console.error('Error checking overdue tasks:', error);
  }
};

// Initialize notification service
export const initNotificationService = () => {
  // Run every hour
  cron.schedule('0 * * * *', () => {
    console.log('🔔 Running notification checks...');
    checkTasksDueSoon();
    checkOverdueTasks();
  });

  console.log('✅ Notification service initialized');
};
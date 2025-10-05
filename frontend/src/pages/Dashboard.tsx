import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTasks } from '@/store/slices/taskSlice';
import { fetchEvents } from '@/store/slices/eventSlice';
import { fetchNotifications } from '@/store/slices/notificationSlice';
import './Dashboard.css';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  upcomingEvents: number;
  unreadNotifications: number;
}

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { events } = useAppSelector((state) => state.events);
  const { notifications } = useAppSelector((state) => state.notifications);

  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0,
    upcomingEvents: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, limit: 100 }));
    dispatch(fetchEvents({ page: 1, limit: 100 }));
    dispatch(fetchNotifications({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const todoTasks = tasks.filter((t) => t.status === 'todo').length;
    const overdueTasks = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < now && t.status !== 'completed'
    ).length;

    const upcomingEvents = events.filter((e) => {
      const eventStart = new Date(e.start_date);
      return eventStart >= now && eventStart <= weekFromNow;
    }).length;

    const unreadNotifications = notifications.filter((n) => !n.is_read).length;

    setStats({
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      upcomingEvents,
      unreadNotifications,
    });
  }, [tasks, events, notifications]);

  const recentTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  const upcomingEventsList = events
    .filter((e) => new Date(e.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      case 'todo':
        return 'status-todo';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.first_name}!</h1>
        <p className="dashboard-subtitle">Here's what's happening with your tasks today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Tasks</p>
            <p className="stat-value">{stats.totalTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats.completedTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{stats.inProgressTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Overdue</p>
            <p className="stat-value">{stats.overdueTasks}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <Link to="/tasks" className="section-link">
              View all
            </Link>
          </div>
          <div className="task-list">
            {recentTasks.length === 0 ? (
              <p className="empty-state">No tasks yet. Create your first task!</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <div className="task-meta">
                      <span className={`badge ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`badge ${getStatusClass(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.due_date && (
                        <span className="task-date">Due: {formatDate(task.due_date)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <Link to="/calendar" className="section-link">
              View calendar
            </Link>
          </div>
          <div className="event-list">
            {upcomingEventsList.length === 0 ? (
              <p className="empty-state">No upcoming events.</p>
            ) : (
              upcomingEventsList.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date-badge">
                    <span className="event-day">
                      {new Date(event.start_date).getDate()}
                    </span>
                    <span className="event-month">
                      {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    {event.description && <p className="event-description">{event.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
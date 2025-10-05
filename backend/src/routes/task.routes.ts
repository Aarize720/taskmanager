import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import * as taskController from '../controllers/task.controller';

const router = Router();

// All routes are protected
router.use(authenticate);

// Get all tasks
router.get('/', taskController.getTasks);

// Get task statistics
router.get('/stats', taskController.getTaskStats);

// Get single task
router.get(
  '/:id',
  validate([param('id').isInt()]),
  taskController.getTask
);

// Create task
router.post(
  '/',
  validate([
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('due_date').optional().isISO8601(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  ]),
  taskController.createTask
);

// Update task
router.put(
  '/:id',
  validate([
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('due_date').optional().isISO8601(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  ]),
  taskController.updateTask
);

// Delete task
router.delete(
  '/:id',
  validate([param('id').isInt()]),
  taskController.deleteTask
);

export default router;
import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

// All routes are protected
router.use(authenticate);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread/count', notificationController.getUnreadCount);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Mark single as read
router.put(
  '/:id/read',
  validate([param('id').isInt()]),
  notificationController.markAsRead
);

// Delete notification
router.delete(
  '/:id',
  validate([param('id').isInt()]),
  notificationController.deleteNotification
);

export default router;
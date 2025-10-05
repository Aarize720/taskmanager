import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import * as eventController from '../controllers/event.controller';

const router = Router();

// All routes are protected
router.use(authenticate);

// Get all events
router.get('/', eventController.getEvents);

// Get single event
router.get(
  '/:id',
  validate([param('id').isInt()]),
  eventController.getEvent
);

// Create event
router.post(
  '/',
  validate([
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('start_date').isISO8601(),
    body('end_date').isISO8601(),
    body('all_day').optional().isBoolean(),
    body('color').optional().trim(),
  ]),
  eventController.createEvent
);

// Update event
router.put(
  '/:id',
  validate([
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    body('all_day').optional().isBoolean(),
    body('color').optional().trim(),
  ]),
  eventController.updateEvent
);

// Delete event
router.delete(
  '/:id',
  validate([param('id').isInt()]),
  eventController.deleteEvent
);

export default router;
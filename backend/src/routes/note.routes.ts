import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import * as noteController from '../controllers/note.controller';

const router = Router();

// All routes are protected
router.use(authenticate);

// Get all notes
router.get('/', noteController.getNotes);

// Get single note
router.get(
  '/:id',
  validate([param('id').isInt()]),
  noteController.getNote
);

// Create note
router.post(
  '/',
  validate([
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
  ]),
  noteController.createNote
);

// Update note
router.put(
  '/:id',
  validate([
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
  ]),
  noteController.updateNote
);

// Delete note
router.delete(
  '/:id',
  validate([param('id').isInt()]),
  noteController.deleteNote
);

export default router;
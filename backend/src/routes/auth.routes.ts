import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Register
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
  ]),
  authController.register
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  authController.login
);

// Get profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// Update profile (protected)
router.put(
  '/profile',
  authenticate,
  validate([
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
    body('avatar_url').optional().isURL(),
  ]),
  authController.updateProfile
);

export default router;
import { Router } from 'express';
import {
  getAllEmails,
  getRandomEmail,
  getEmailById,
} from '../controllers/email.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Всі маршрути захищені
router.get('/', authMiddleware, getAllEmails);
router.get('/random', authMiddleware, getRandomEmail);
router.get('/:id', authMiddleware, getEmailById);

export default router;

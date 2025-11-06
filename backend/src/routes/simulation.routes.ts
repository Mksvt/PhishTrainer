import { Router } from 'express';
import {
  checkAnswer,
  getUserStats,
  getUserAnswerHistory,
  checkAnswerValidation,
} from '../controllers/simulation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Всі маршрути захищені
router.post('/check', authMiddleware, checkAnswerValidation, checkAnswer);
router.get('/stats', authMiddleware, getUserStats);
router.get('/history', authMiddleware, getUserAnswerHistory);

export default router;

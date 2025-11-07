import { Router } from "express";
import {
    checkAnswer,
    getUserStats,
    getUserAnswerHistory,
    getWeeklyProgress,
    checkAnswerValidation,
} from "../controllers/simulation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Всі маршрути захищені
router.post("/check", authMiddleware, checkAnswerValidation, checkAnswer);
router.get("/stats", authMiddleware, getUserStats);
router.get("/history", authMiddleware, getUserAnswerHistory);
router.get("/weekly-progress", authMiddleware, getWeeklyProgress);

export default router;

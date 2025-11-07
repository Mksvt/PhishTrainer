import { Router } from "express";
import {
    register,
    login,
    logout,
    getProfile,
    registerValidation,
    loginValidation,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Публічні маршрути
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Захищені маршрути
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logout);

export default router;

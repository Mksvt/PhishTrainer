import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import prisma from "../config/database";
import { generateToken, generateRefreshToken } from "../utils/jwt.utils";

// Валідація для реєстрації
export const registerValidation = [
    body("email").isEmail().withMessage("Невалідна електронна адреса"),
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Ім'я має містити мінімум 2 символи"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Пароль має містити мінімум 6 символів"),
];

// Валідація для входу
export const loginValidation = [
    body("email").isEmail().withMessage("Невалідна електронна адреса"),
    body("password").notEmpty().withMessage("Пароль обов'язковий"),
];

// Реєстрація
export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, name, password } = req.body;

        // Перевірка чи користувач існує
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Користувач з таким email вже існує" });
        }

        // Хешування паролю
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створення користувача
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                stats: {
                    create: {
                        rating: 0,
                        totalEmails: 0,
                        correctIdentified: 0,
                        incorrectIdentified: 0,
                        scamsClicked: 0,
                    },
                },
            },
            include: {
                stats: true,
            },
        });

        // Генерація токенів
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Встановлюємо HttpOnly cookie для токену
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
            path: "/",
        });

        // Встановлюємо HttpOnly cookie для refresh токену
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
            path: "/",
        });

        // НЕ відправляємо токени в body, тільки дані користувача
        res.status(201).json({
            message: "Користувача успішно зареєстровано",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                stats: user.stats,
            },
        });
    } catch (error) {
        console.error("Помилка реєстрації:", error);
        res.status(500).json({ error: "Помилка сервера при реєстрації" });
    }
};

// Вхід
export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Пошук користувача
        const user = await prisma.user.findUnique({
            where: { email },
            include: { stats: true },
        });

        if (!user) {
            return res
                .status(401)
                .json({ error: "Невірна електронна адреса або пароль" });
        }

        // Перевірка паролю
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: "Невірна електронна адреса або пароль" });
        }

        // Генерація токенів
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Встановлюємо HttpOnly cookie для токену
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
            path: "/",
        });

        // Встановлюємо HttpOnly cookie для refresh токену
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
            path: "/",
        });

        // НЕ відправляємо токени в body, тільки дані користувача
        res.json({
            message: "Успішний вхід",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                stats: user.stats,
            },
        });
    } catch (error) {
        console.error("Помилка входу:", error);
        res.status(500).json({ error: "Помилка сервера при вході" });
    }
};

// Отримання профілю користувача
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { stats: true },
        });

        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Помилка отримання профілю:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Вихід
export const logout = async (req: Request, res: Response) => {
    try {
        // Очищаємо всі cookies
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.json({
            message: "Успішний вихід",
            success: true,
        });
    } catch (error) {
        console.error("Помилка виходу:", error);
        res.status(500).json({ error: "Помилка сервера при виході" });
    }
};

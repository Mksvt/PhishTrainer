import { UserAnswer } from ".prisma/client";
import { Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/database";
import { phishingEmails } from "../data/phishing-emails";

// Валідація відповіді користувача
export const checkAnswerValidation = [
    body("emailId").notEmpty().withMessage("ID листа обов'язковий"),
    body("userAnswer")
        .isBoolean()
        .withMessage("Відповідь має бути булевим значенням"),
];

// Перевірка відповіді користувача
export const checkAnswer = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.userId!;
        const { emailId, userAnswer } = req.body;

        // Знаходимо лист
        const email = phishingEmails.find((e) => e.id === emailId);
        if (!email) {
            return res.status(404).json({ error: "Лист не знайдено" });
        }

        // Перевіряємо відповідь
        const isCorrect = userAnswer === email.isPhishing;

        // Зберігаємо відповідь користувача
        await prisma.userAnswer.create({
            data: {
                userId,
                emailId,
                userAnswer,
                isCorrect,
            },
        });

        // Оновлюємо статистику користувача
        const userStats = await prisma.userStats.findUnique({
            where: { userId },
        });

        if (userStats) {
            const updateData: any = {
                totalEmails: userStats.totalEmails + 1,
            };

            if (isCorrect) {
                updateData.correctIdentified = userStats.correctIdentified + 1;
                updateData.rating = userStats.rating + 10;
            } else {
                updateData.incorrectIdentified =
                    userStats.incorrectIdentified + 1;

                // Якщо користувач не розпізнав фішинг (впав на нього)
                if (email.isPhishing && !userAnswer) {
                    updateData.scamsClicked = userStats.scamsClicked + 1;
                    updateData.rating = Math.max(0, userStats.rating - 5);
                }
            }

            await prisma.userStats.update({
                where: { userId },
                data: updateData,
            });
        }

        // Повертаємо результат з поясненням
        res.json({
            isCorrect,
            correctAnswer: email.isPhishing,
            indicators: email.indicators,
            explanation: email.explanation,
            message: isCorrect
                ? "Правильно! Ви успішно розпізнали лист."
                : "Неправильно. Ознайомтеся з поясненням.",
        });
    } catch (error) {
        console.error("Помилка перевірки відповіді:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання статистики користувача
export const getUserStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        const stats = await prisma.userStats.findUnique({
            where: { userId },
        });

        if (!stats) {
            return res.status(404).json({ error: "Статистика не знайдена" });
        }

        // Обчислення точності
        const accuracy =
            stats.totalEmails > 0
                ? Math.round(
                      (stats.correctIdentified / stats.totalEmails) * 100
                  )
                : 0;

        res.json({
            stats: {
                ...stats,
                accuracy,
                level: Math.floor(stats.rating / 100) + 1,
            },
        });
    } catch (error) {
        console.error("Помилка отримання статистики:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання історії відповідей користувача
export const getUserAnswerHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const { limit = 50, offset = 0 } = req.query;

        const answers: UserAnswer[] = await prisma.userAnswer.findMany({
            where: { userId },
            orderBy: { answeredAt: "desc" },
            take: Number(limit),
            skip: Number(offset),
        });

        // Додаємо інформацію про листи
        const answersWithDetails = answers.map((answer) => {
            const email = phishingEmails.find((e) => e.id === answer.emailId);
            return {
                ...answer,
                email: email
                    ? {
                          subject: email.subject,
                          from: email.from,
                          category: email.category,
                          difficulty: email.difficulty,
                      }
                    : null,
            };
        });

        res.json({ answers: answersWithDetails });
    } catch (error) {
        console.error("Помилка отримання історії:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання прогресу за тижнями
export const getWeeklyProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const weeks = req.query.weeks ? Number(req.query.weeks) : 4;

        // Отримуємо всі відповіді користувача за останні кілька тижнів
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);

        const answers = await prisma.userAnswer.findMany({
            where: {
                userId,
                answeredAt: {
                    gte: startDate,
                },
            },
            orderBy: { answeredAt: "asc" },
        });

        // Групуємо по тижнях
        const weeklyData: {
            [key: string]: { correct: number; missed: number; clicked: number };
        } = {};

        answers.forEach((answer) => {
            // Отримуємо номер тижня та року
            const date = new Date(answer.answeredAt);
            const year = date.getFullYear();
            const week = Math.ceil(
                (date.getDate() +
                    new Date(year, date.getMonth(), 1).getDay() -
                    1) /
                    7
            );
            const key = `${year}-W${week}`;

            if (!weeklyData[key]) {
                weeklyData[key] = { correct: 0, missed: 0, clicked: 0 };
            }

            if (answer.isCorrect) {
                weeklyData[key].correct++;
            } else {
                // Перевіряємо, чи це фішинг, який користувач пропустив
                const email = phishingEmails.find(
                    (e) => e.id === answer.emailId
                );
                if (email && email.isPhishing && !answer.userAnswer) {
                    weeklyData[key].clicked++;
                } else {
                    weeklyData[key].missed++;
                }
            }
        });

        // Форматуємо результат
        const result = Object.entries(weeklyData).map(([week, data]) => ({
            week,
            ...data,
        }));

        res.json({ weeklyProgress: result });
    } catch (error) {
        console.error("Помилка отримання прогресу за тижнями:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

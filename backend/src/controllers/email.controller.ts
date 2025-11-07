import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { phishingEmails } from "../data/phishing-emails";
import {
    getRandomUnshownEmail,
    getRandomEmailByCategory,
    getShownEmails,
    clearUserEmailHistory,
} from "../utils/email-distribution.utils";

// Отримання всіх листів
export const getAllEmails = async (req: AuthRequest, res: Response) => {
    try {
        // Повертаємо листи без правильних відповідей для безпеки
        const emails = phishingEmails.map((email) => ({
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
        }));

        res.json({ emails });
    } catch (error) {
        console.error("Помилка отримання листів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання випадкового листа (з логікою избігання повторень)
export const getRandomEmail = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: "Користувач не авторизований" });
        }

        const email = await getRandomUnshownEmail(userId);

        res.json({ email });
    } catch (error) {
        console.error("Помилка отримання випадкового листа:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання листа за категорією
export const getEmailByCategory = async (req: AuthRequest, res: Response) => {
    try {
        const { category } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: "Користувач не авторизований" });
        }

        if (!category) {
            return res.status(400).json({ error: "Категорія не вказана" });
        }

        const email = await getRandomEmailByCategory(userId, category);

        res.json({ email });
    } catch (error) {
        console.error("Помилка отримання листа за категорією:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання конкретного листа
export const getEmailById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const email = phishingEmails.find((e) => e.id === id);

        if (!email) {
            return res.status(404).json({ error: "Лист не знайдено" });
        }

        res.json({
            email: {
                id: email.id,
                subject: email.subject,
                from: email.from,
                body: email.body,
                difficulty: email.difficulty,
                category: email.category,
            },
        });
    } catch (error) {
        console.error("Помилка отримання листа:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання деталей листа з правильною відповіддю (для перевірки)
export const getEmailDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const email = phishingEmails.find((e) => e.id === id);

        if (!email) {
            return res.status(404).json({ error: "Лист не знайдено" });
        }

        res.json({
            email: {
                id: email.id,
                subject: email.subject,
                from: email.from,
                body: email.body,
                difficulty: email.difficulty,
                category: email.category,
                isPhishing: email.isPhishing,
                indicators: email.indicators,
                explanation: email.explanation,
            },
        });
    } catch (error) {
        console.error("Помилка отримання деталей листа:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Отримання історії показаних листів
export const getEmailHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: "Користувач не авторизований" });
        }

        const shownEmailIds = await getShownEmails(userId);
        const shownEmails = phishingEmails.filter((e) =>
            shownEmailIds.includes(e.id)
        );

        res.json({ emails: shownEmails, count: shownEmails.length });
    } catch (error) {
        console.error("Помилка отримання історії листів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Очистити історію листів
export const clearEmailHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: "Користувач не авторизований" });
        }

        await clearUserEmailHistory(userId);

        res.json({ message: "Історія листів очищена" });
    } catch (error) {
        console.error("Помилка очищення історії листів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

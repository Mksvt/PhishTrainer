import redisClient from "../config/redis";
import { phishingEmails } from "../data/phishing-emails";

const SHOWN_EMAILS_KEY = "shown_emails:";
const SHOWN_EMAILS_EXPIRY = 15 * 60; // 15 minutes
const MAX_RECENT_EMAILS = 15; // Не повторювати останні 15 листів

/**
 * Отримати список листів, що були показані користувачу за останній час
 */
export const getShownEmails = async (userId: string): Promise<string[]> => {
    try {
        const key = `${SHOWN_EMAILS_KEY}${userId}`;
        const shown = await redisClient.lRange(key, 0, -1);
        return shown || [];
    } catch (error) {
        console.error("Error getting shown emails from Redis:", error);
        return [];
    }
};

/**
 * Додати лист до списку показаних
 */
export const addShownEmail = async (
    userId: string,
    emailId: string
): Promise<void> => {
    try {
        const key = `${SHOWN_EMAILS_KEY}${userId}`;
        // Добавити на початок списку
        await redisClient.lPush(key, emailId);
        // Зберігати тільки останні N листів
        await redisClient.lTrim(key, 0, MAX_RECENT_EMAILS - 1);
        // Встановити TTL
        await redisClient.expire(key, SHOWN_EMAILS_EXPIRY);
    } catch (error) {
        console.error("Error adding shown email to Redis:", error);
    }
};

/**
 * Отримати випадковий лист, який користувач ще не бачив (або давно бачив)
 */
export const getRandomUnshownEmail = async (userId: string) => {
    try {
        const shownEmailIds = await getShownEmails(userId);

        // Фільтруємо листи, що були показані
        const availableEmails = phishingEmails.filter(
            (email) => !shownEmailIds.includes(email.id)
        );

        // Якщо всі листи було показано, очищуємо список та повертаємо випадковий
        let selectedEmail;
        if (availableEmails.length === 0) {
            const randomIndex = Math.floor(
                Math.random() * phishingEmails.length
            );
            selectedEmail = phishingEmails[randomIndex];
        } else {
            const randomIndex = Math.floor(
                Math.random() * availableEmails.length
            );
            selectedEmail = availableEmails[randomIndex];
        }

        // Записуємо що цей лист було показано
        await addShownEmail(userId, selectedEmail.id);

        return {
            id: selectedEmail.id,
            subject: selectedEmail.subject,
            from: selectedEmail.from,
            body: selectedEmail.body,
            difficulty: selectedEmail.difficulty,
            category: selectedEmail.category,
        };
    } catch (error) {
        console.error("Error getting random unshown email:", error);
        // Fallback - повертаємо просто випадковий лист
        const randomIndex = Math.floor(Math.random() * phishingEmails.length);
        const email = phishingEmails[randomIndex];
        return {
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
        };
    }
};

/**
 * Отримати випадковий лист за категорією, який користувач ще не бачив
 */
export const getRandomEmailByCategory = async (
    userId: string,
    category: string
) => {
    try {
        const shownEmailIds = await getShownEmails(userId);

        // Фільтруємо листи за категорією та що не були показані
        const availableEmails = phishingEmails.filter(
            (email) =>
                email.category === category && !shownEmailIds.includes(email.id)
        );

        let selectedEmail;
        if (availableEmails.length === 0) {
            // Якщо всі листи в категорії було показано, повертаємо випадковий
            const categoryEmails = phishingEmails.filter(
                (email) => email.category === category
            );
            if (categoryEmails.length === 0) {
                throw new Error(`Category ${category} not found`);
            }
            const randomIndex = Math.floor(
                Math.random() * categoryEmails.length
            );
            selectedEmail = categoryEmails[randomIndex];
        } else {
            const randomIndex = Math.floor(
                Math.random() * availableEmails.length
            );
            selectedEmail = availableEmails[randomIndex];
        }

        await addShownEmail(userId, selectedEmail.id);

        return {
            id: selectedEmail.id,
            subject: selectedEmail.subject,
            from: selectedEmail.from,
            body: selectedEmail.body,
            difficulty: selectedEmail.difficulty,
            category: selectedEmail.category,
        };
    } catch (error) {
        console.error("Error getting random email by category:", error);
        throw error;
    }
};

/**
 * Очистити історію показаних листів для користувача
 */
export const clearUserEmailHistory = async (userId: string): Promise<void> => {
    try {
        const key = `${SHOWN_EMAILS_KEY}${userId}`;
        await redisClient.del(key);
    } catch (error) {
        console.error("Error clearing user email history:", error);
    }
};

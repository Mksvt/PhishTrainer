import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { phishingEmails } from '../data/phishing-emails';

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
    console.error('Помилка отримання листів:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

// Отримання випадкового листа
export const getRandomEmail = async (req: AuthRequest, res: Response) => {
  try {
    const randomIndex = Math.floor(Math.random() * phishingEmails.length);
    const email = phishingEmails[randomIndex];

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
    console.error('Помилка отримання випадкового листа:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

// Отримання конкретного листа
export const getEmailById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const email = phishingEmails.find((e) => e.id === id);

    if (!email) {
      return res.status(404).json({ error: 'Лист не знайдено' });
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
    console.error('Помилка отримання листа:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

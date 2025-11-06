import { UserAnswer } from '.prisma/client';
import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { phishingEmails } from '../data/phishing-emails';

// Валідація відповіді користувача
export const checkAnswerValidation = [
  body('emailId').notEmpty().withMessage("ID листа обов'язковий"),
  body('userAnswer')
    .isBoolean()
    .withMessage('Відповідь має бути булевим значенням'),
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
      return res.status(404).json({ error: 'Лист не знайдено' });
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
        updateData.incorrectIdentified = userStats.incorrectIdentified + 1;

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
        ? 'Правильно! Ви успішно розпізнали лист.'
        : 'Неправильно. Ознайомтеся з поясненням.',
    });
  } catch (error) {
    console.error('Помилка перевірки відповіді:', error);
    res.status(500).json({ error: 'Помилка сервера' });
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
      return res.status(404).json({ error: 'Статистика не знайдена' });
    }

    // Обчислення точності
    const accuracy =
      stats.totalEmails > 0
        ? Math.round((stats.correctIdentified / stats.totalEmails) * 100)
        : 0;

    res.json({
      stats: {
        ...stats,
        accuracy,
        level: Math.floor(stats.rating / 100) + 1,
      },
    });
  } catch (error) {
    console.error('Помилка отримання статистики:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

// Отримання історії відповідей користувача
export const getUserAnswerHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = 50, offset = 0 } = req.query;

    const answers: UserAnswer[] = await prisma.userAnswer.findMany({
      where: { userId },
      orderBy: { answeredAt: 'desc' },
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
    console.error('Помилка отримання історії:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

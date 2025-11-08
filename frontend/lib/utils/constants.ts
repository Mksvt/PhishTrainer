export const CHART_COLORS = {
    correct: "#65f741",
    incorrect: "#ff6b6b",
    clicked: "#ff9800",
} as const;

export const ACCURACY_LEVELS = {
    EXPERT: 80,
    GOOD: 50,
    BEGINNER: 0,
} as const;

export const ERROR_MESSAGES = {
    PASSWORD_MISMATCH: "Паролі не збігаються",
    PASSWORD_TOO_SHORT: "Пароль повинен містити мінімум 6 символів",
    INVALID_CREDENTIALS: "Невірна електронна адреса або пароль",
    REGISTRATION_ERROR: "Помилка при реєстрації. Спробуйте пізніше.",
    LOADING_ERROR: "Помилка завантаження даних",
    STATS_ERROR: "Помилка завантаження статистики",
    ANSWER_CHECK_ERROR: "Помилка перевірки відповіді",
    HISTORY_CLEAR_ERROR: "Помилка очищення історії",
    LOGOUT_ERROR: "Помилка виходу",
} as const;

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface DemoEmail {
    from: string;
    subject: string;
    preview: string;
    indicators: string[];
    danger: "high" | "medium" | "low";
}

export const DEMO_PHISHING_EMAILS: DemoEmail[] = [
    {
        from: "security@paypal-verify.com",
        subject: "Термінова перевірка акаунту",
        preview: "Ваш акаунт буде заблоковано через 24 години...",
        indicators: ["Підозріла адреса", "Терміновість", "Погрози"],
        danger: "high",
    },
    {
        from: "admin@company-internal.net",
        subject: "Оновлення корпоративної політики",
        preview: "Будь ласка, перегляньте нові правила безпеки...",
        indicators: ["Фальшивий домен", "Соціальна інженерія"],
        danger: "medium",
    },
    {
        from: "support@microsoft-secure.info",
        subject: "Незвичайна активність в акаунті",
        preview: "Виявлено підозрілий вхід з нового пристрою...",
        indicators: ["Імітація бренду", "Fake URL", "Запит даних"],
        danger: "high",
    },
];

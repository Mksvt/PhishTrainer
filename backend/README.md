# PhishTrainer Backend API

Backend сервер для PhishTrainer - платформи для навчання розпізнавання фішингових листів.

## Технології

- **Node.js** + **Express.js** - веб-сервер
- **TypeScript** - типізація
- **PostgreSQL** - база даних
- **Prisma** - ORM
- **JWT** - автентифікація
- **Docker** - контейнеризація бази даних

## Встановлення

### 1. Встановіть залежності

```bash
npm install
```

### 2. Налаштуйте змінні середовища

Створіть файл `.env` на основі `.env.example`:

```bash
cp .env.example .env
```

### 3. Запустіть PostgreSQL через Docker

```bash
docker-compose up -d
```

### 4. Запустіть міграції Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Запустіть сервер

**Режим розробки:**

```bash
npm run dev
```

**Продакшн:**

```bash
npm run build
npm start
```

## API Endpoints

### Автентифікація (`/api/auth`)

- `POST /api/auth/register` - Реєстрація нового користувача
- `POST /api/auth/login` - Вхід користувача
- `GET /api/auth/profile` - Отримання профілю (захищено)

### Листи (`/api/emails`)

- `GET /api/emails` - Отримання всіх листів (захищено)
- `GET /api/emails/random` - Отримання випадкового листа (захищено)
- `GET /api/emails/:id` - Отримання листа за ID (захищено)

### Симуляція (`/api/simulation`)

- `POST /api/simulation/check` - Перевірка відповіді користувача (захищено)
- `GET /api/simulation/stats` - Отримання статистики (захищено)
- `GET /api/simulation/history` - Історія відповідей (захищено)

## Структура проекту

```
backend/
├── prisma/
│   └── schema.prisma          # Схема бази даних
├── src/
│   ├── config/
│   │   └── database.ts        # Конфігурація Prisma
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── email.controller.ts
│   │   └── simulation.controller.ts
│   ├── data/
│   │   └── phishing-emails.ts # Дані про фішингові листи
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── email.routes.ts
│   │   └── simulation.routes.ts
│   ├── utils/
│   │   └── jwt.utils.ts       # JWT утиліти
│   └── server.ts              # Головний файл сервера
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Автентифікація

API використовує JWT токени для автентифікації.

**Приклад використання:**

1. Зареєструйтесь або увійдіть:

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

2. Отримайте токен у відповіді:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

3. Використовуйте токен у заголовках:

```bash
GET /api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## База даних

### Моделі

- **User** - Користувачі системи
- **UserStats** - Статистика користувача
- **UserAnswer** - Історія відповідей

### Prisma Studio

Для перегляду бази даних:

```bash
npm run prisma:studio
```

## Docker

Запуск PostgreSQL:

```bash
docker-compose up -d     # Запуск
docker-compose down      # Зупинка
docker-compose logs -f   # Перегляд логів
```

## Розробка

Файли автоматично перезавантажуються при зміні завдяки `nodemon`.

```bash
npm run dev
```

## Ліцензія

MIT

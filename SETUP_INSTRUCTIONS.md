# Інструкції для запуску проекту PhishTrainer

## Проблема з залежностями Frontend

У вас є конфлікт версій: React 19.2.0 несумісний з `vaul@0.9.9`.

### Рішення 1: Використати --legacy-peer-deps (швидке)

```powershell
cd frontend
npm install --legacy-peer-deps
```

### Рішення 2: Понизити React до версії 18 (рекомендовано)

```powershell
cd frontend
npm install react@18.2.0 react-dom@18.2.0
npm install
```

## Запуск Backend

### 1. Запустіть Docker Desktop (якщо встановлено)

Або встановіть PostgreSQL локально.

### 2. Запустіть базу даних

```powershell
cd backend
docker-compose up -d
```

Або використайте локальний PostgreSQL і змініть `DATABASE_URL` у `.env`.

### 3. Запустіть міграції

```powershell
cd backend
npm run prisma:migrate
```

### 4. Запустіть сервер

```powershell
cd backend
npm run dev
```

Сервер буде доступний на `http://localhost:3001`

## Запуск Frontend

```powershell
cd frontend
npm run dev
```

Frontend буде доступний на `http://localhost:3000`

## API Endpoints

### Автентифікація

- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `GET /api/auth/profile` - Профіль (потрібен токен)

### Листи

- `GET /api/emails` - Всі листи
- `GET /api/emails/random` - Випадковий лист
- `GET /api/emails/:id` - Лист за ID

### Симуляція

- `POST /api/simulation/check` - Перевірка відповіді
- `GET /api/simulation/stats` - Статистика користувача
- `GET /api/simulation/history` - Історія відповідей

## Підключення Frontend до Backend

У frontend створіть файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Потім оновіть код frontend для використання API замість localStorage.

## Структура бази даних

- **users** - Користувачі (email, password hash, name)
- **user_stats** - Статистика (rating, totalEmails, correctIdentified, etc.)
- **user_answers** - Історія відповідей користувачів

## Troubleshooting

### Docker не запускається

- Встановіть Docker Desktop з https://www.docker.com/products/docker-desktop/
- Або використайте локальний PostgreSQL

### Prisma помилки міграції

```powershell
cd backend
Remove-Item -Recurse -Force .\prisma\migrations
npx prisma migrate dev --name init
```

### Frontend npm помилки

```powershell
cd frontend
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Force .\package-lock.json
npm install --legacy-peer-deps
```

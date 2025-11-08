# 🔒 Покращення безпеки PhishTrainer

## Зміни, які були впроваджені

### ✅ Backend покращення

1. **JWT Utils** (`backend/src/utils/jwt.utils.ts`)

    - Додано обов'язкову перевірку JWT_SECRET
    - Додано refresh токени
    - Покращена валідація з issuer та audience
    - Детальна обробка помилок (expired, invalid)

2. **Auth Middleware** (`backend/src/middleware/auth.middleware.ts`)

    - Підтримка токенів як з Authorization header, так і з cookies
    - Валідація типу токену (access vs refresh)
    - Коди помилок для кращої обробки

3. **Auth Controller** (`backend/src/controllers/auth.controller.ts`)

    - Токени НЕ відправляються в response body
    - Використання HttpOnly cookies з правильними налаштуваннями
    - Secure flag для production
    - SameSite=strict для захисту від CSRF

4. **Server** (`backend/src/server.ts`)
    - Додано cookie-parser middleware

### ✅ Frontend покращення

1. **Validation Utils** (`frontend/lib/validation.ts`)

    - Створено типи User та UserStats
    - Функція validateUser для валідації даних
    - Безпечні функції для роботи з localStorage
    - Захист від XSS через валідацію

2. **API Slice** (`frontend/lib/api/apiSlice.ts`)

    - Видалено зберігання токенів в localStorage
    - Використання credentials: 'include' для cookies
    - Токени автоматично відправляються в cookies
    - Видалено логування токенів

3. **Middleware** (`frontend/middleware.ts`)

    - Покращена перевірка аутентифікації
    - Підтримка query параметрів для redirect
    - Більш конкретні matcher правила

4. **Компоненти та сторінки**
    - Navbar: типізація, валідація, умовне логування
    - Login/Signup: видалено маніпуляції з cookies на клієнті
    - Dashboard/Profile/Simulation: видалено перевірки токенів з localStorage

## 🔧 Необхідні налаштування

### 1. Backend Environment Variables

Оновіть `backend/.env`:

```env
# ВАЖЛИВО! Згенеруйте сильний секретний ключ
JWT_SECRET=your-super-secret-key-min-32-characters-long-use-crypto
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Production налаштування
NODE_ENV=production
CORS_ORIGIN=https://your-production-domain.com
```

**Генерація безпечного JWT_SECRET:**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Frontend Environment Variables

Оновіть `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development

# Для production
# NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
# NODE_ENV=production
```

### 3. Додаткові пакети

Backend пакети вже встановлені:

```json
{
    "cookie-parser": "^1.4.6",
    "@types/cookie-parser": "^1.4.6"
}
```

## 📊 Порівняння безпеки

### До змін (4/10):

❌ Токени в localStorage (вразливі до XSS)  
❌ Токени в response body  
❌ Немає валідації даних користувача  
❌ Console.log з токенами у production  
❌ Слабкий fallback JWT_SECRET  
❌ Немає refresh токенів  
❌ any типи без валідації

### Після змін (8.5/10):

✅ HttpOnly cookies (захист від XSS)  
✅ Secure та SameSite flags  
✅ Валідація всіх даних користувача  
✅ Умовне логування (тільки dev)  
✅ Обов'язковий JWT_SECRET  
✅ Refresh токени  
✅ Типізація TypeScript  
✅ Детальна обробка помилок

## 🚀 Запуск після змін

1. **Встановіть залежності** (вже зроблено):

```bash
cd backend
npm install
```

2. **Оновіть .env файли** з безпечними значеннями

3. **Запустіть проект**:

```bash
# Backend
cd backend
npm run dev

# Frontend (новий термінал)
cd frontend
npm run dev
```

4. **Перевірте**:
    - Зареєструйте нового користувача
    - Перевірте що токени в cookies (DevTools → Application → Cookies)
    - Перевірте що токенів немає в localStorage
    - Logout має очищати cookies

## 🔐 Додаткові рекомендації для production

1. **HTTPS обов'язково** - cookies зі Secure flag працюють тільки через HTTPS

2. **Rate Limiting**:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/auth", limiter);
```

3. **Helmet для безпеки headers**:

```bash
npm install helmet
```

```typescript
import helmet from "helmet";
app.use(helmet());
```

4. **CSRF токени** (опціонально, якщо не використовуєте SameSite=strict):

```bash
npm install csurf
```

5. **Моніторинг та логування**:
    - Winston для structured logging
    - Sentry для error tracking

## 📝 Що далі?

Для досягнення 10/10 безпеки:

-   [ ] Додати rate limiting
-   [ ] Додати helmet middleware
-   [ ] Впровадити token rotation
-   [ ] Додати 2FA (two-factor authentication)
-   [ ] Whitelist IP addresses
-   [ ] Додати security headers
-   [ ] Регулярні security audits
-   [ ] Pen testing

## 🆘 Troubleshooting

### Проблема: Cookies не встановлюються

**Рішення**:

-   Перевірте що backend і frontend на одному домені або правильно налаштований CORS
-   Для localhost використовуйте однаковий порт або proxy

### Проблема: Middleware не перенаправляє

**Рішення**:

-   Очистіть всі cookies
-   Перезапустіть frontend dev server

### Проблема: JWT_SECRET помилка

**Рішення**:

-   Переконайтеся що .env файл існує в backend директорії
-   Згенеруйте новий секретний ключ

## 📚 Додаткові ресурси

-   [OWASP Top 10](https://owasp.org/www-project-top-ten/)
-   [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
-   [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
-   [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

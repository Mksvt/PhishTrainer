# RTK Query API Integration Guide

## 📚 Огляд

Всі виклики API відбуваються через **RTK Query** (`@/lib/api/apiSlice`).

## 🎯 Доступні Hooks

### Authentication

```typescript
import {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from '@/lib/api/apiSlice';
```

#### **useRegisterMutation()**

Реєстрація нового користувача

```typescript
const [register, { isLoading, error }] = useRegisterMutation();

const handleRegister = async () => {
  try {
    const result = await register({
      email: 'user@example.com',
      name: 'John Doe',
      password: 'securePassword123',
    }).unwrap();

    // Токен автоматично збережено в localStorage та cookie
    console.log('User:', result.user);
    router.push('/dashboard');
  } catch (err) {
    console.error('Registration failed:', err);
  }
};
```

#### **useLoginMutation()**

Вхід користувача

```typescript
const [login, { isLoading }] = useLoginMutation();

const handleLogin = async () => {
  try {
    const result = await login({
      email: 'user@example.com',
      password: 'password123',
    }).unwrap();

    // Токен автоматично збережено
    router.push('/dashboard');
  } catch (err) {
    console.error('Login failed:', err);
  }
};
```

#### **useLogoutMutation()**

Вихід з системи

```typescript
const [logout] = useLogoutMutation();

const handleLogout = async () => {
  try {
    await logout().unwrap();
    // Токени автоматично видалено з localStorage та cookie
    window.location.href = '/login';
  } catch (err) {
    console.error('Logout error:', err);
  }
};
```

#### **useGetProfileQuery()**

Отримання профілю користувача зі статистикою

```typescript
const { data, isLoading, error } = useGetProfileQuery();

// data.user = { id, email, name, createdAt }
// data.user.stats = { rating, accuracy, totalEmails, ... }
```

---

### Email Endpoints

```typescript
import {
  useGetAllEmailsQuery,
  useGetRandomEmailQuery,
  useGetEmailByIdQuery,
} from '@/lib/api/apiSlice';
```

#### **useGetRandomEmailQuery()**

Отримання випадкового email для симуляції

```typescript
const { data: emailData, isLoading, refetch } = useGetRandomEmailQuery();

// emailData.email = { id, subject, sender, content, isPhishing, category, indicators }

// Отримати новий email
const fetchNewEmail = () => refetch();
```

#### **useGetAllEmailsQuery()**

Отримання всіх emails

```typescript
const { data, isLoading } = useGetAllEmailsQuery();

// data.emails = [{ id, subject, sender, ... }, ...]
```

#### **useGetEmailByIdQuery(id)**

Отримання email за ID

```typescript
const { data, isLoading } = useGetEmailByIdQuery('email-id');

// data.email = { id, subject, sender, ... }
```

---

### Simulation Endpoints

```typescript
import {
  useCheckAnswerMutation,
  useGetUserStatsQuery,
  useGetUserAnswerHistoryQuery,
  useGetWeeklyProgressQuery,
} from '@/lib/api/apiSlice';
```

#### **useCheckAnswerMutation()**

Перевірка відповіді користувача

```typescript
const [checkAnswer, { isLoading }] = useCheckAnswerMutation();

const handleAnswer = async (userAnswer: boolean) => {
  try {
    const result = await checkAnswer({
      emailId: 'email-123',
      userAnswer: true, // true = phishing, false = legitimate
    }).unwrap();

    console.log('Is Correct:', result.isCorrect);
    console.log('Explanation:', result.explanation);
    console.log('Updated Stats:', result.stats);
    console.log('Indicators:', result.indicators);
  } catch (err) {
    console.error('Check answer error:', err);
  }
};
```

#### **useGetUserStatsQuery()**

Отримання статистики користувача

```typescript
const { data: statsData, isLoading } = useGetUserStatsQuery();

// statsData.stats = {
//   rating: 1200,
//   accuracy: 85.5,
//   totalEmails: 50,
//   correctIdentified: 40,
//   incorrectIdentified: 10,
//   scamsClicked: 2
// }
```

#### **useGetUserAnswerHistoryQuery({ limit, offset })**

Історія відповідей користувача

```typescript
const { data, isLoading } = useGetUserAnswerHistoryQuery({
  limit: 20,
  offset: 0,
});

// data.answers = [
//   { id, emailId, userAnswer, isCorrect, answeredAt },
//   ...
// ]
```

#### **useGetWeeklyProgressQuery({ weeks })**

Тижневий прогрес

```typescript
const { data, isLoading } = useGetWeeklyProgressQuery({ weeks: 4 });

// data.weeklyProgress = [
//   { week: "2024-W01", totalEmails: 10, correctIdentified: 8, accuracy: 80 },
//   ...
// ]
```

---

## 🔧 Автоматичні Функції

### Автентифікація

RTK Query автоматично:

- ✅ Додає `Bearer {token}` до всіх запитів
- ✅ Зберігає токен в `localStorage` та `cookie` після login/register
- ✅ Видаляє токени після logout

### Кешування

- ✅ Автоматичне кешування даних
- ✅ Інвалідація кешу при змінах (tags: User, Stats, Emails, History)
- ✅ Оптимістичні оновлення

### Error Handling

```typescript
const { data, isLoading, error } = useGetUserStatsQuery();

if (isLoading) return <div>Завантаження...</div>;
if (error) return <div>Помилка: {error.data?.error}</div>;
```

---

## 📦 Приклади Використання

### Повний компонент симуляції

```typescript
'use client';

import { useState } from 'react';
import {
  useGetRandomEmailQuery,
  useCheckAnswerMutation,
} from '@/lib/api/apiSlice';

export default function SimulationPage() {
  const { data: emailData, isLoading, refetch } = useGetRandomEmailQuery();
  const [checkAnswer, { isLoading: isChecking }] = useCheckAnswerMutation();
  const [feedback, setFeedback] = useState<any>(null);

  const handleAnswer = async (userAnswer: boolean) => {
    if (!emailData?.email) return;

    try {
      const result = await checkAnswer({
        emailId: emailData.email.id,
        userAnswer,
      }).unwrap();

      setFeedback(result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    refetch();
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>{emailData?.email.subject}</h2>
      <p>Від: {emailData?.email.sender}</p>
      <div
        dangerouslySetInnerHTML={{ __html: emailData?.email.content || '' }}
      />

      {!feedback ? (
        <div>
          <button onClick={() => handleAnswer(true)} disabled={isChecking}>
            Це фішинг
          </button>
          <button onClick={() => handleAnswer(false)} disabled={isChecking}>
            Легітимний
          </button>
        </div>
      ) : (
        <div>
          <p>{feedback.isCorrect ? '✅ Правильно!' : '❌ Неправильно'}</p>
          <p>{feedback.explanation}</p>
          <button onClick={handleNext}>Наступний email</button>
        </div>
      )}
    </div>
  );
}
```

### Профіль користувача

```typescript
'use client';

import { useGetUserStatsQuery, useLogoutMutation } from '@/lib/api/apiSlice';

export default function ProfilePage() {
  const { data: statsData, isLoading } = useGetUserStatsQuery();
  const [logout] = useLogoutMutation();

  if (isLoading) return <div>Завантаження...</div>;

  const stats = statsData?.stats;

  return (
    <div>
      <h2>Статистика</h2>
      <p>Рейтинг: {stats?.rating}</p>
      <p>Точність: {stats?.accuracy}%</p>
      <p>Всього emails: {stats?.totalEmails}</p>
      <button onClick={() => logout().unwrap()}>Вийти</button>
    </div>
  );
}
```

---

## 🚨 Важливі Примітки

1. **НЕ використовуйте** старий файл `api-client.ts` - він видалений
2. **Всі API виклики** тільки через RTK Query hooks
3. **Токени** автоматично керуються RTK Query
4. **Типи даних** імпортуйте з `@/lib/api/types`

---

## 🔗 API Endpoints

| Endpoint                      | Method | Hook                           | Опис                |
| ----------------------------- | ------ | ------------------------------ | ------------------- |
| `/auth/register`              | POST   | `useRegisterMutation`          | Реєстрація          |
| `/auth/login`                 | POST   | `useLoginMutation`             | Вхід                |
| `/auth/logout`                | POST   | `useLogoutMutation`            | Вихід               |
| `/auth/profile`               | GET    | `useGetProfileQuery`           | Профіль + stats     |
| `/emails`                     | GET    | `useGetAllEmailsQuery`         | Всі emails          |
| `/emails/random`              | GET    | `useGetRandomEmailQuery`       | Випадковий email    |
| `/emails/:id`                 | GET    | `useGetEmailByIdQuery`         | Email за ID         |
| `/simulation/check`           | POST   | `useCheckAnswerMutation`       | Перевірка відповіді |
| `/simulation/stats`           | GET    | `useGetUserStatsQuery`         | Статистика          |
| `/simulation/history`         | GET    | `useGetUserAnswerHistoryQuery` | Історія             |
| `/simulation/weekly-progress` | GET    | `useGetWeeklyProgressQuery`    | Тижневий прогрес    |

---

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

**Створено для PhishTrainer** 🎣🛡️

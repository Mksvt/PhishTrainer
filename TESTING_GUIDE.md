# 🧪 Тестування PhishTrainer API

## Метод 1: Використання Postman

### Крок 1: Імпорт колекції

1. Відкрийте Postman
2. Натисніть **Import**
3. Оберіть файл `backend/PhishTrainer-API.postman_collection.json`
4. Колекція з'явиться у вашому робочому просторі

### Крок 2: Тестування endpoints

#### 1. Реєстрація користувача

```
POST http://localhost:3001/api/auth/register

Body (JSON):
{
  "email": "test@example.com",
  "name": "Test User",
  "password": "password123"
}
```

**Очікувана відповідь:**

```json
{
  "message": "Користувача успішно зареєстровано",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "stats": {
      "rating": 0,
      "totalEmails": 0,
      ...
    }
  }
}
```

#### 2. Вхід

```
POST http://localhost:3001/api/auth/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Зберігайте токен з відповіді!**

#### 3. Отримання профілю

```
GET http://localhost:3001/api/auth/profile

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. Отримання випадкового листа

```
GET http://localhost:3001/api/emails/random

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5. Перевірка відповіді

```
POST http://localhost:3001/api/simulation/check

Headers:
Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "emailId": "1",
  "userAnswer": true
}
```

**Очікувана відповідь:**

```json
{
  "isCorrect": true,
  "correctAnswer": true,
  "indicators": [...],
  "explanation": "...",
  "message": "Правильно! Ви успішно розпізнали лист."
}
```

#### 6. Отримання статистики

```
GET http://localhost:3001/api/simulation/stats

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

## Метод 2: Використання cURL

### Реєстрація

```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"password123\"}'
```

### Вхід та збереження токену

```powershell
$response = curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}' | ConvertFrom-Json

$token = $response.token
```

### Запит з токеном

```powershell
curl http://localhost:3001/api/emails/random `
  -H "Authorization: Bearer $token"
```

## Метод 3: Використання JavaScript Fetch

### У браузерній консолі (F12)

```javascript
// 1. Реєстрація
const registerResponse = await fetch(
  'http://localhost:3001/api/auth/register',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    }),
  }
);
const registerData = await registerResponse.json();
console.log('Register:', registerData);

// 2. Вхід та збереження токену
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }),
});
const loginData = await loginResponse.json();
const token = loginData.token;
console.log('Login:', loginData);

// 3. Отримання випадкового листа
const emailResponse = await fetch('http://localhost:3001/api/emails/random', {
  headers: { Authorization: `Bearer ${token}` },
});
const emailData = await emailResponse.json();
console.log('Random Email:', emailData);

// 4. Перевірка відповіді
const checkResponse = await fetch(
  'http://localhost:3001/api/simulation/check',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      emailId: emailData.email.id,
      userAnswer: true,
    }),
  }
);
const checkData = await checkResponse.json();
console.log('Check Answer:', checkData);

// 5. Отримання статистики
const statsResponse = await fetch(
  'http://localhost:3001/api/simulation/stats',
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
const statsData = await statsResponse.json();
console.log('Stats:', statsData);
```

## Тестовий сценарій

### Повний флоу користувача:

1. **Реєстрація** нового користувача
2. **Вхід** з отриманням JWT токену
3. **Отримання профілю** для підтвердження автентифікації
4. **Отримання випадкового листа** для симуляції
5. **Перевірка відповіді** (правильної або неправильної)
6. **Перегляд оновленої статистики**
7. **Отримання історії відповідей**

### Приклад PowerShell скрипту:

```powershell
# Реєстрація
$register = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test2@example.com","name":"Test User 2","password":"password123"}'

$token = $register.token
Write-Host "Token: $token"

# Отримання листа
$email = Invoke-RestMethod -Uri "http://localhost:3001/api/emails/random" `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "Email ID: $($email.email.id)"
Write-Host "Subject: $($email.email.subject)"

# Перевірка відповіді
$check = Invoke-RestMethod -Uri "http://localhost:3001/api/simulation/check" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body (@{"emailId"=$email.email.id;"userAnswer"=$true} | ConvertTo-Json)

Write-Host "Is Correct: $($check.isCorrect)"
Write-Host "Message: $($check.message)"

# Статистика
$stats = Invoke-RestMethod -Uri "http://localhost:3001/api/simulation/stats" `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "Rating: $($stats.stats.rating)"
Write-Host "Total Emails: $($stats.stats.totalEmails)"
Write-Host "Accuracy: $($stats.stats.accuracy)%"
```

## Перевірка стану сервера

```powershell
# Перевірка чи працює backend
curl http://localhost:3001

# Очікувана відповідь:
# {
#   "message": "PhishTrainer API Server",
#   "version": "1.0.0",
#   "endpoints": {...}
# }
```

## Помилки та їх вирішення

### 401 Unauthorized

- Токен не надано або невалідний
- Виконайте логін знову

### 404 Not Found

- Перевірте правильність URL
- Переконайтеся що backend запущений

### 500 Internal Server Error

- Перевірте логи backend сервера
- Переконайтеся що база даних працює

### Connection refused

- Backend не запущений
- Запустіть: `npm run dev` у папці backend

## Prisma Studio

Для перегляду бази даних:

```powershell
cd backend
npx prisma studio
```

Відкриється на `http://localhost:5555`

Тут ви можете:

- Переглядати всі таблиці
- Додавати/редагувати записи
- Переглядати статистику користувачів

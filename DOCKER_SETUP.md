# 🐳 Docker Setup для PhishTrainer

Цей проект повністю докеризований. Всі сервіси запускаються в контейнерах.

## 📋 Вимоги

-   Docker версії 20.10+
-   Docker Compose версії 1.29+

Встановити Docker можна з https://www.docker.com/products/docker-desktop

## 🚀 Запуск проекту

### Для Windows (PowerShell)

```powershell
# Запустити всі сервіси
.\docker-manage.ps1 up

# Переглянути логи
.\docker-manage.ps1 logs              # всі логи
.\docker-manage.ps1 logs backend      # тільки бекенд
.\docker-manage.ps1 logs frontend     # тільки фронтенд

# Перезапустити сервіс
.\docker-manage.ps1 restart            # всі
.\docker-manage.ps1 restart backend    # тільки бекенд

# Зупинити
.\docker-manage.ps1 down

# Очистити
.\docker-manage.ps1 clean

# Переглянути статус
.\docker-manage.ps1 status
```

### Для Linux/Mac

```bash
# Запустити всі сервіси
./docker-manage.sh up

# Переглянути логи
./docker-manage.sh logs              # всі логи
./docker-manage.sh logs backend      # тільки бекенд
./docker-manage.sh logs frontend     # тільки фронтенд

# Перезапустити сервіс
./docker-manage.sh restart            # всі
./docker-manage.sh restart backend    # тільки бекенд

# Зупинити
./docker-manage.sh down

# Очистити
./docker-manage.sh clean

# Переглянути статус
./docker-manage.sh status
```

### Без скриптів (прямо через Docker Compose)

```bash
# Запуск
docker-compose up -d

# Зупинення
docker-compose down

# Переглянути логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Очистка
docker-compose down -v
```

## 🌐 Доступні адреси

| Сервіс     | URL                   | Опис            |
| ---------- | --------------------- | --------------- |
| Frontend   | http://localhost:3000 | Next.js додаток |
| Backend    | http://localhost:3001 | Express API     |
| PostgreSQL | localhost:5432        | База даних      |
| Redis      | localhost:6379        | Кеш та сесії    |

## 📝 Структура контейнерів

```
PhishTrainer Network
├── phishtrainer-postgres     (Database)
├── phishtrainer-redis        (Cache)
├── phishtrainer-backend      (API)
└── phishtrainer-frontend     (UI)
```

## 🔧 Конфігурація

### Environment Variables

#### Backend (.env)

```
DATABASE_URL=postgresql://phishtrainer:phishtrainer123@postgres:5432/phishtrainer?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.production)

```
NEXT_PUBLIC_API_URL=http://backend:3001/api
```

## 🛠️ Управління контейнерами

### Перейти до shell контейнера

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U phishtrainer -d phishtrainer
```

### Переглянути логи в реальному часі

```bash
# Всі логи
docker-compose logs -f

# Конкретний сервіс
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Перезбудова образів

```bash
# Перезбудувати один образ
docker-compose build backend
docker-compose build frontend

# Перезбудувати все
docker-compose build
```

## 🐛 Вирішення проблем

### Порти вже використовуються

```bash
# Знайти процес на порту
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001

# Закрити процес (на Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Контейнер не запускається

```bash
# Переглянути детальні логи
docker-compose logs backend

# Перезбудувати без кешу
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Очистити все

```bash
# Видалити всі контейнери, томи та мережі
docker-compose down -v

# Видалити невикористані образи
docker image prune

# Видалити все невикористане
docker system prune -a --volumes
```

## 📊 Моніторинг

### Переглянути використання ресурсів

```bash
docker stats
```

### Отримати інформацію про контейнер

```bash
docker inspect phishtrainer-backend
docker inspect phishtrainer-frontend
```

## 🔐 Безпека

⚠️ **Важливо!** Змініть значення `JWT_SECRET` в продакшені!

```bash
# Генерувати криптографічно стійкий ключ
openssl rand -base64 32
```

## 🚢 Розгортання в продакшені

Для розгортання у продакшені потрібно:

1. **Змінити credentials** в `docker-compose.yml`
2. **Встановити JWT_SECRET** з безпечним значенням
3. **Настроїти CORS_ORIGIN** на реальну URL вашого фронтенду
4. **Користуватися керованою базою даних** замість локальної PostgreSQL
5. **Настроїти резервні копії** для бази даних
6. **Включити HTTPS**
7. **Користуватися Docker Swarm або Kubernetes** для оркестрування

## 📚 Додаткові ресурси

-   [Docker документація](https://docs.docker.com/)
-   [Docker Compose документація](https://docs.docker.com/compose/)
-   [Best practices for Docker](https://docs.docker.com/develop/dev-best-practices/)

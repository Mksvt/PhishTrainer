#!/bin/bash

# PhishTrainer Docker Management Script
# Для запуску на Linux/Mac

set -e

COMMAND=${1:-help}

case $COMMAND in
    up)
        echo "📦 Запуск всіх сервісів PhishTrainer..."
        docker-compose up -d
        echo "✅ Сервіси запущені!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔌 Backend: http://localhost:3001"
        echo "🗄️  PostgreSQL: localhost:5432"
        echo "💾 Redis: localhost:6379"
        ;;
    down)
        echo "🛑 Зупинення всіх сервісів..."
        docker-compose down
        echo "✅ Сервіси зупинені!"
        ;;
    logs)
        SERVICE=${2:-all}
        if [ "$SERVICE" = "all" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$SERVICE"
        fi
        ;;
    build)
        echo "🔨 Складання контейнерів..."
        docker-compose build
        echo "✅ Контейнери готові!"
        ;;
    restart)
        SERVICE=${2:-all}
        echo "🔄 Перезапуск $SERVICE..."
        if [ "$SERVICE" = "all" ]; then
            docker-compose restart
        else
            docker-compose restart "$SERVICE"
        fi
        echo "✅ Перезапущено!"
        ;;
    clean)
        echo "🧹 Очищення контейнерів та томів..."
        docker-compose down -v
        echo "✅ Очищено!"
        ;;
    status)
        echo "📊 Статус сервісів:"
        docker-compose ps
        ;;
    shell-backend)
        echo "🐚 Вхід до shell бекенду..."
        docker-compose exec backend sh
        ;;
    shell-frontend)
        echo "🐚 Вхід до shell фронтенду..."
        docker-compose exec frontend sh
        ;;
    help|*)
        echo "PhishTrainer Docker Manager"
        echo ""
        echo "Доступні команди:"
        echo "  up              - Запустити всі сервіси"
        echo "  down            - Зупинити всі сервіси"
        echo "  logs [SERVICE]  - Показати логи (SERVICE: backend, frontend, postgres, redis)"
        echo "  build           - Складання контейнерів"
        echo "  restart [SERVICE] - Перезапустити сервіс (або всі)"
        echo "  clean           - Видалити контейнери та дані"
        echo "  status          - Показати статус сервісів"
        echo "  shell-backend   - Вхід до shell бекенду"
        echo "  shell-frontend  - Вхід до shell фронтенду"
        echo "  help            - Показати цю довідку"
        echo ""
        echo "Приклади:"
        echo "  ./docker-manage.sh up"
        echo "  ./docker-manage.sh logs backend"
        echo "  ./docker-manage.sh restart frontend"
        ;;
esac

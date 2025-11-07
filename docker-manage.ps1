@echo off
REM PhishTrainer Docker Management Script for Windows PowerShell
REM Usage: docker-manage.ps1 [command] [service]

param(
    [string]$Command = "help",
    [string]$Service = "all"
)

switch ($Command.ToLower()) {
    "up" {
        Write-Host "📦 Запуск всіх сервісів PhishTrainer..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "✅ Сервіси запущені!" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "🔌 Backend: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "🗄️  PostgreSQL: localhost:5432" -ForegroundColor Cyan
        Write-Host "💾 Redis: localhost:6379" -ForegroundColor Cyan
    }
    "down" {
        Write-Host "🛑 Зупинення всіх сервісів..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Сервіси зупинені!" -ForegroundColor Green
    }
    "logs" {
        Write-Host "📋 Логи $Service..." -ForegroundColor Blue
        if ($Service -eq "all") {
            docker-compose logs -f
        }
        else {
            docker-compose logs -f $Service
        }
    }
    "build" {
        Write-Host "🔨 Складання контейнерів..." -ForegroundColor Blue
        docker-compose build
        Write-Host "✅ Контейнери готові!" -ForegroundColor Green
    }
    "restart" {
        Write-Host "🔄 Перезапуск $Service..." -ForegroundColor Yellow
        if ($Service -eq "all") {
            docker-compose restart
        }
        else {
            docker-compose restart $Service
        }
        Write-Host "✅ Перезапущено!" -ForegroundColor Green
    }
    "clean" {
        Write-Host "🧹 Очищення контейнерів та томів..." -ForegroundColor Red
        docker-compose down -v
        Write-Host "✅ Очищено!" -ForegroundColor Green
    }
    "status" {
        Write-Host "📊 Статус сервісів:" -ForegroundColor Blue
        docker-compose ps
    }
    "shell-backend" {
        Write-Host "🐚 Вхід до shell бекенду..." -ForegroundColor Magenta
        docker-compose exec backend sh
    }
    "shell-frontend" {
        Write-Host "🐚 Вхід до shell фронтенду..." -ForegroundColor Magenta
        docker-compose exec frontend sh
    }
    default {
        Write-Host "PhishTrainer Docker Manager" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Доступні команди:" -ForegroundColor Green
        Write-Host "  up              - Запустити всі сервіси"
        Write-Host "  down            - Зупинити всі сервіси"
        Write-Host "  logs [SERVICE]  - Показати логи (SERVICE: backend, frontend, postgres, redis)"
        Write-Host "  build           - Складання контейнерів"
        Write-Host "  restart [SERVICE] - Перезапустити сервіс (або всі)"
        Write-Host "  clean           - Видалити контейнери та дані"
        Write-Host "  status          - Показати статус сервісів"
        Write-Host "  shell-backend   - Вхід до shell бекенду"
        Write-Host "  shell-frontend  - Вхід до shell фронтенду"
        Write-Host "  help            - Показати цю довідку"
        Write-Host ""
        Write-Host "Приклади:" -ForegroundColor Yellow
        Write-Host "  .\docker-manage.ps1 up"
        Write-Host "  .\docker-manage.ps1 logs backend"
        Write-Host "  .\docker-manage.ps1 restart frontend"
    }
}

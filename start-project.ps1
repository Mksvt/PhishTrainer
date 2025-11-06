# PowerShell скрипт для швидкого запуску проекту

Write-Host "🛡️  PhishTrainer - Запуск проекту" -ForegroundColor Cyan
Write-Host ""

# Перевірка чи запущений Docker
Write-Host "📦 Перевірка Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker не запущений або не встановлений" -ForegroundColor Red
    Write-Host "   Опції:" -ForegroundColor Yellow
    Write-Host "   1. Встановіть Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Gray
    Write-Host "   2. Або використайте локальний PostgreSQL" -ForegroundColor Gray
    Write-Host "   3. Змініть DATABASE_URL у backend/.env" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Продовжити без Docker? (y/n)"
    if ($continue -ne 'y') {
        exit
    }
} else {
    Write-Host "✅ Docker запущений" -ForegroundColor Green
    
    # Запуск PostgreSQL
    Write-Host "🐘 Запуск PostgreSQL..." -ForegroundColor Yellow
    Set-Location backend
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL запущений" -ForegroundColor Green
    } else {
        Write-Host "❌ Помилка запуску PostgreSQL" -ForegroundColor Red
    }
    Set-Location ..
}

Write-Host ""
Write-Host "📦 Встановлення залежностей backend..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    npm install
}

Write-Host "🔧 Генерація Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "🗄️  Запуск міграцій..." -ForegroundColor Yellow
npx prisma migrate dev --name init

Write-Host ""
Write-Host "🚀 Запуск backend сервера..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location ..

Write-Host ""
Write-Host "📦 Встановлення залежностей frontend..." -ForegroundColor Yellow
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    npm install --legacy-peer-deps
}

# Створення .env.local якщо не існує
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Створення .env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:3001/api" | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host ""
Write-Host "🚀 Запуск frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location ..

Write-Host ""
Write-Host "✅ Проект запущено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Prisma Studio: npx prisma studio (у папці backend)" -ForegroundColor Gray
Write-Host ""

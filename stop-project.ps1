# PowerShell скрипт для зупинки проекту

Write-Host "🛑 Зупинка PhishTrainer..." -ForegroundColor Yellow
Write-Host ""

# Зупинка Docker контейнерів
Write-Host "🐘 Зупинка PostgreSQL..." -ForegroundColor Yellow
Set-Location backend
docker-compose down 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL зупинено" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL не був запущений або Docker недоступний" -ForegroundColor Gray
}
Set-Location ..

# Зупинка Node.js процесів (опціонально)
Write-Host ""
Write-Host "ℹ️  Закрийте вікна PowerShell з запущеними серверами" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green

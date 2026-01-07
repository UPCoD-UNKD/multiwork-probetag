# Сбрасываем DOCKER_HOST, чтобы использовать локальный Docker
if (Test-Path Env:\DOCKER_HOST) {
    Remove-Item Env:\DOCKER_HOST
}

# Путь к docker-compose файлу (используем относительный путь)
$composeFile = Join-Path $PSScriptRoot "docker-compose.yml"

# Имя проекта локально
$projectName = "mwproject-local"

# Список контейнеров (включая старые, которые могли остаться)
$containers = @("multiwork-backend", "multiwork-frontend", "multiwork-nginx", "multiwork-gateway", "redis-local")

# Останавливаем и удаляем старые контейнеры
Write-Host "Остановка старых контейнеров..." -ForegroundColor Cyan
foreach ($c in $containers) {
    $existing = docker ps -a --filter "name=$c" --format "{{.ID}}"
    if ($existing) {
        Write-Host "  Остановка $c..." -ForegroundColor Gray
        docker stop $existing 2>&1 | Out-Null
        docker rm $existing 2>&1 | Out-Null
    }
}

# Останавливаем все контейнеры проекта (на случай если что-то осталось)
Write-Host "Очистка orphan контейнеров..." -ForegroundColor Cyan
docker compose -f $composeFile -p $projectName down --remove-orphans 2>&1 | Out-Null

# Поднимаем весь стек локально с удалением orphan контейнеров
Write-Host "Запуск локального окружения..." -ForegroundColor Cyan
docker compose -f $composeFile -p $projectName up --build -d --remove-orphans
#docker compose -f $composeFile -p $projectName up -d

Write-Host "Локальный проект запущен: backend + frontend" -ForegroundColor Green
Write-Host "   Backend API: http://localhost:8080" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:80" -ForegroundColor Yellow
Write-Host "   H2 Console: http://localhost:8080/h2-console" -ForegroundColor Yellow

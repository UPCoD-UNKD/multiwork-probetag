# Сбрасываем DOCKER_HOST, чтобы использовать локальный Docker
if (Test-Path Env:\DOCKER_HOST) {
    Remove-Item Env:\DOCKER_HOST
}

# Путь к docker-compose файлу
$composeFile = "C:\Users\Administrator\Desktop\MWProject\docker-compose.yml"

# Имя проекта локально
$projectName = "mwproject-local"

# Список контейнеров
$containers = @("multiwork-backend", "multiwork-frontend", "multiwork-nginx", "redis-local")

# Останавливаем и удаляем старые контейнеры
foreach ($c in $containers) {
    $existing = docker ps -a --filter "name=$c" --format "{{.ID}}"
    if ($existing) {
        docker stop $existing
        docker rm $existing
    }
}

# Поднимаем весь стек локально
docker compose -f $composeFile -p $projectName up --build -d
#docker compose -f $composeFile -p $projectName up -d

Write-Host "Локальный проект запущен: backend + frontend + nginx"

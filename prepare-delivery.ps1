# Скрипт для подготовки и отправки production версии заказчику
# prepare-delivery.ps1

$branchName = "delivery/production-v1.0"

Write-Host "=== Подготовка delivery версии ===" -ForegroundColor Green

# 1. Создаем новую ветку
Write-Host "`n1. Создание ветки $branchName..." -ForegroundColor Cyan
cd C:\Users\Administrator\Desktop\MWProject
git checkout -b $branchName

# 2. Закоммичиваем изменения в submodules
Write-Host "`n2. Коммит изменений в multiwork-backend..." -ForegroundColor Cyan
cd C:\Users\Administrator\Desktop\MWProject\multiwork-backend
git add -A
git commit -m "Production code delivery - clean version without build artifacts" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Backend закоммичен" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Backend: возможно нет изменений или уже закоммичен" -ForegroundColor Yellow
}

Write-Host "`n3. Коммит изменений в multiwork-frontend..." -ForegroundColor Cyan
cd C:\Users\Administrator\Desktop\MWProject\multiwork-frontend
git add -A
git commit -m "Production code delivery - clean version without dependencies" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Frontend закоммичен" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Frontend: возможно нет изменений или уже закоммичен" -ForegroundColor Yellow
}

Write-Host "`n4. Коммит изменений в multiwork-app-android..." -ForegroundColor Cyan
cd C:\Users\Administrator\Desktop\MWProject\multiwork-app-android
git add -A
git commit -m "Production code delivery" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Android закоммичен" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Android: возможно нет изменений или уже закоммичен" -ForegroundColor Yellow
}

# 3. Возвращаемся в основной репозиторий и обновляем ссылки на submodules
Write-Host "`n5. Обновление ссылок на submodules в основном репозитории..." -ForegroundColor Cyan
cd C:\Users\Administrator\Desktop\MWProject
git add multiwork-backend multiwork-frontend multiwork-app-android

# 4. Добавляем остальные изменения
Write-Host "`n6. Добавление остальных изменений..." -ForegroundColor Cyan
git add .gitignore docker-compose.yml docker-compose.prod.yml nginx/

# 5. Коммит в основном репозитории
Write-Host "`n7. Коммит в основном репозитории..." -ForegroundColor Cyan
git commit -m "Production delivery: Update submodules with clean code and add docker configuration

- Updated all submodules with production-ready code
- Added docker-compose configurations
- Added nginx configuration
- Updated .gitignore to exclude build artifacts"

Write-Host "`n=== Готово! ===" -ForegroundColor Green
Write-Host "`nСледующие шаги:" -ForegroundColor Yellow
Write-Host "1. Проверьте изменения: git log --oneline -5" -ForegroundColor White
Write-Host "2. Запушьте ветку: git push -u origin $branchName" -ForegroundColor White
Write-Host "3. После проверки заказчиком можно смержить в main" -ForegroundColor White

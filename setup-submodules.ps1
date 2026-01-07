# Скрипт для настройки submodules в MWProject
# Превращает папки backend/frontend в полноценные git-репозитории с двумя remotes

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "НАСТРОЙКА SUBMODULES ДЛЯ MWPROJECT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Administrator\Desktop\MWProject"

# === 1. BACKEND ===
Write-Host "`n[1/3] Настройка multiwork-backend..." -ForegroundColor Green
cd "$projectRoot\multiwork-backend"

if (-not (Test-Path ".git")) {
    Write-Host "  → Инициализация git репозитория..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Backend codebase with current changes"
    
    Write-Host "  → Настройка remotes..." -ForegroundColor Yellow
    git remote add origin https://github.com/GreedMitya/multiwork-backend
    git remote add corporate https://github.com/UPCoD-UNKD/multiwork-backend
    
    Write-Host "  → Создание main ветки..." -ForegroundColor Yellow
    git branch -M main
    
    Write-Host "  ✓ Backend готов" -ForegroundColor Green
} else {
    Write-Host "  ✓ Backend уже имеет .git" -ForegroundColor Green
}

# === 2. FRONTEND ===
Write-Host "`n[2/3] Настройка multiwork-frontend..." -ForegroundColor Green
cd "$projectRoot\multiwork-frontend"

if (-not (Test-Path ".git")) {
    Write-Host "  → Инициализация git репозитория..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Frontend codebase with current changes"
    
    Write-Host "  → Настройка remotes..." -ForegroundColor Yellow
    git remote add origin https://github.com/GreedMitya/multiwork-frontend
    git remote add corporate https://github.com/UPCoD-UNKD/multiwork-frontend
    
    Write-Host "  → Создание main ветки..." -ForegroundColor Yellow
    git branch -M main
    
    Write-Host "  ✓ Frontend готов" -ForegroundColor Green
} else {
    Write-Host "  ✓ Frontend уже имеет .git" -ForegroundColor Green
}

# === 3. ANDROID (уже есть .git, только проверяем remotes) ===
Write-Host "`n[3/3] Проверка multiwork-app-android..." -ForegroundColor Green
cd "$projectRoot\multiwork-app-android"
Write-Host "  ✓ Android уже настроен" -ForegroundColor Green

# === ФИНАЛЬНАЯ КОНФИГУРАЦИЯ ===
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ФИНАЛЬНАЯ КОНФИГУРАЦИЯ REMOTES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "BACKEND:" -ForegroundColor Green
cd "$projectRoot\multiwork-backend"
git remote -v

Write-Host "`nFRONTEND:" -ForegroundColor Green
cd "$projectRoot\multiwork-frontend"
git remote -v

Write-Host "`nANDROID:" -ForegroundColor Green
cd "$projectRoot\multiwork-app-android"
git remote -v

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ГОТОВО!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Следующие шаги:" -ForegroundColor Yellow
Write-Host "1. Создайте пустые репозитории на GitHub:" -ForegroundColor White
Write-Host "   - https://github.com/GreedMitya/multiwork-backend" -ForegroundColor Gray
Write-Host "   - https://github.com/GreedMitya/multiwork-frontend" -ForegroundColor Gray
Write-Host "   - https://github.com/GreedMitya/multiwork-app-android" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Запустите скрипт для первого push:" -ForegroundColor White
Write-Host "   .\push-to-personal.ps1" -ForegroundColor Gray
Write-Host ""

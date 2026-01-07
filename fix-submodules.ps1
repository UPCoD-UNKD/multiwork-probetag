# Скрипт для правильной настройки submodules
# Удаляет папки из git индекса главного репозитория и добавляет их как submodules

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "НАСТРОЙКА SUBMODULES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Administrator\Desktop\MWProject"
cd $projectRoot

# Проверяем, что мы в главном репозитории
if (-not (Test-Path ".git")) {
    Write-Host "Ошибка: это не git репозиторий!" -ForegroundColor Red
    exit 1
}

Write-Host "Важно: Мы удалим папки из git индекса главного репозитория," -ForegroundColor Yellow
Write-Host "но сами папки и их содержимое НЕ будут удалены!`n" -ForegroundColor Yellow

# 1. Удаляем папки из git индекса (не удаляя сами папки!)
Write-Host "[1/4] Удаление папок из git индекса главного репозитория..." -ForegroundColor Green

# Удаляем multiwork-backend из индекса
Write-Host "  → multiwork-backend..." -ForegroundColor Yellow
git rm -r --cached multiwork-backend 2>&1 | Out-Null

# Удаляем multiwork-frontend из индекса
Write-Host "  → multiwork-frontend..." -ForegroundColor Yellow
git rm -r --cached multiwork-frontend 2>&1 | Out-Null

# Удаляем multiwork-app-android из индекса (если был добавлен как обычная папка)
Write-Host "  → multiwork-app-android..." -ForegroundColor Yellow
git rm -r --cached multiwork-app-android 2>&1 | Out-Null

Write-Host "  ✓ Папки удалены из git индекса`n" -ForegroundColor Green

# 2. Добавляем .gitmodules в индекс (если еще не добавлен)
Write-Host "[2/4] Добавление .gitmodules..." -ForegroundColor Green
if (Test-Path ".gitmodules") {
    git add .gitmodules
    Write-Host "  ✓ .gitmodules добавлен`n" -ForegroundColor Green
}

# 3. Добавляем папки как submodules
Write-Host "[3/4] Добавление папок как submodules..." -ForegroundColor Green

# Добавляем multiwork-backend как submodule
Write-Host "  → multiwork-backend..." -ForegroundColor Yellow
$backendUrl = "https://github.com/GreedMitya/multiwork-backend"
git submodule add -f $backendUrl multiwork-backend 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✓ Backend добавлен как submodule" -ForegroundColor Green
}

# Добавляем multiwork-frontend как submodule
Write-Host "  → multiwork-frontend..." -ForegroundColor Yellow
$frontendUrl = "https://github.com/GreedMitya/multiwork-frontend"
git submodule add -f $frontendUrl multiwork-frontend 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✓ Frontend добавлен как submodule" -ForegroundColor Green
}

# Добавляем multiwork-app-android как submodule
Write-Host "  → multiwork-app-android..." -ForegroundColor Yellow
$androidUrl = "https://github.com/GreedMitya/multiwork-app-android"
git submodule add -f $androidUrl multiwork-app-android 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✓ Android добавлен как submodule" -ForegroundColor Green
}

Write-Host ""

# 4. Инициализируем submodules
Write-Host "[4/4] Инициализация submodules..." -ForegroundColor Green
git submodule update --init --recursive 2>&1 | Out-Null
Write-Host "  ✓ Submodules инициализированы`n" -ForegroundColor Green

# Проверяем результат
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "РЕЗУЛЬТАТ" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Проверка статуса submodules:" -ForegroundColor Yellow
git submodule status

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ SUBMODULES НАСТРОЕНЫ!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Следующий шаг:" -ForegroundColor Yellow
Write-Host "  Закоммитьте изменения в главном репозитории:" -ForegroundColor White
Write-Host "    git add .gitmodules" -ForegroundColor Gray
Write-Host "    git commit -m 'feat: Add submodules for backend, frontend, and android'" -ForegroundColor Gray
Write-Host ""

# Скрипт для первого push в личные репозитории
# Используется после setup-submodules.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PUSH В ЛИЧНЫЕ РЕПОЗИТОРИИ" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Administrator\Desktop\MWProject"

# === BACKEND ===
Write-Host "`n[1/3] Push multiwork-backend..." -ForegroundColor Green
cd "$projectRoot\multiwork-backend"

# Проверяем, есть ли uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "  → Коммит текущих изменений..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: Save current state before push to personal"
}

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Backend запушен в origin (personal)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Ошибка при push backend" -ForegroundColor Red
}

# === FRONTEND ===
Write-Host "`n[2/3] Push multiwork-frontend..." -ForegroundColor Green
cd "$projectRoot\multiwork-frontend"

# Проверяем, есть ли uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "  → Коммит текущих изменений..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: Save current state before push to personal"
}

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Frontend запушен в origin (personal)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Ошибка при push frontend" -ForegroundColor Red
}

# === ANDROID ===
Write-Host "`n[3/3] Push multiwork-app-android..." -ForegroundColor Green
cd "$projectRoot\multiwork-app-android"

# Проверяем, есть ли uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "  → Коммит текущих изменений..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: Save current state before push to personal"
}

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Android запушен в origin (personal)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Ошибка при push android" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ГОТОВО!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Теперь вы можете:" -ForegroundColor Yellow
Write-Host "• Работать в IDEA с каждым модулем отдельно" -ForegroundColor White
Write-Host "• Коммитить и пушить в личные репозитории (origin)" -ForegroundColor White
Write-Host "• Мерджить из личных в корпоративные (corporate)" -ForegroundColor White
Write-Host ""

# Скрипт для синхронизации изменений из личных репозиториев в корпоративные
# Workflow: Local → Personal (origin) → Corporate
#
# Использование:
# 1. Сначала закоммитьте и запуште изменения в личные репозитории:
#    git push origin main
# 2. Затем запустите этот скрипт для push в корпоративные репозитории

param(
    [string]$Module = "all",  # backend, frontend, android, или all
    [string]$Branch = "main"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "СИНХРОНИЗАЦИЯ В КОРПОРАТИВНЫЕ РЕПОЗИТОРИИ" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Administrator\Desktop\MWProject"

function Sync-Module {
    param($Name, $Path)
    
    Write-Host "`nСинхронизация $Name..." -ForegroundColor Green
    cd $Path
    
    # Проверяем, есть ли uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "  ⚠ Есть uncommitted изменения!" -ForegroundColor Yellow
        Write-Host "  Сначала закоммитьте изменения: git add . && git commit -m 'message'" -ForegroundColor Yellow
        return $false
    }
    
    # Проверяем, что origin синхронизирован
    Write-Host "  → Проверка синхронизации с origin..." -ForegroundColor Gray
    git fetch origin
    $behind = git rev-list HEAD..origin/$Branch --count
    if ($behind -gt 0) {
        Write-Host "  ⚠ Локальная версия отстает от origin на $behind коммитов" -ForegroundColor Yellow
        Write-Host "  Выполните: git pull origin $Branch" -ForegroundColor Yellow
        return $false
    }
    
    # Push в корпоративный репозиторий
    Write-Host "  → Push в corporate remote..." -ForegroundColor Yellow
    git push corporate $Branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $Name синхронизирован с corporate" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ Ошибка при push в corporate" -ForegroundColor Red
        return $false
    }
}

$results = @{}

if ($Module -eq "all" -or $Module -eq "backend") {
    $results["backend"] = Sync-Module "Backend" "$projectRoot\multiwork-backend"
}

if ($Module -eq "all" -or $Module -eq "frontend") {
    $results["frontend"] = Sync-Module "Frontend" "$projectRoot\multiwork-frontend"
}

if ($Module -eq "all" -or $Module -eq "android") {
    $results["android"] = Sync-Module "Android" "$projectRoot\multiwork-app-android"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "РЕЗУЛЬТАТЫ СИНХРОНИЗАЦИИ" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

foreach ($key in $results.Keys) {
    $status = if ($results[$key]) { "✓" } else { "✗" }
    $color = if ($results[$key]) { "Green" } else { "Red" }
    Write-Host "$status $key" -ForegroundColor $color
}

Write-Host ""

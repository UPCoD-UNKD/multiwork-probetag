# Скрипт для проверки доступности репозиториев на GitHub
# Проверяет, созданы ли все 3 необходимых репозитория
# Использует git команды для проверки Private репозиториев

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ПРОВЕРКА РЕПОЗИТОРИЕВ НА GITHUB" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Administrator\Desktop\MWProject"

$repos = @(
    @{Name="multiwork-backend"; Path="$projectRoot\multiwork-backend"; Url="https://github.com/GreedMitya/multiwork-backend"},
    @{Name="multiwork-frontend"; Path="$projectRoot\multiwork-frontend"; Url="https://github.com/GreedMitya/multiwork-frontend"},
    @{Name="multiwork-app-android"; Path="$projectRoot\multiwork-app-android"; Url="https://github.com/GreedMitya/multiwork-app-android"}
)

$allAvailable = $true
$results = @()

foreach ($repo in $repos) {
    Write-Host "Проверка $($repo.Name)... " -NoNewline -ForegroundColor Yellow
    
    # Проверяем через git ls-remote (работает для Private репозиториев)
    cd $repo.Path
    
    # Сначала проверяем, настроен ли remote
    $originUrl = git remote get-url origin 2>$null
    if (-not $originUrl) {
        Write-Host "✗ origin не настроен" -ForegroundColor Red
        $allAvailable = $false
        $results += @{Name=$repo.Name; Status="not-configured"}
        continue
    }
    
    # Проверяем доступность репозитория через git fetch или ls-remote
    Write-Host "" -NoNewline
    $checkResult = git ls-remote --heads origin main 2>&1
    
    if ($LASTEXITCODE -eq 0 -or ($checkResult -like "*main*" -or $checkResult -like "*HEAD*")) {
        # Репозиторий существует (даже если пустой)
        Write-Host "✓ Репозиторий найден" -ForegroundColor Green
        $results += @{Name=$repo.Name; Status="found"}
    }
    elseif ($checkResult -like "*fatal: could not read Username*" -or $checkResult -like "*authentication*") {
        # Нужна авторизация, но репозиторий скорее всего существует
        Write-Host "✓ Репозиторий существует (нужна авторизация)" -ForegroundColor Green
        $results += @{Name=$repo.Name; Status="found-auth"}
    }
    elseif ($checkResult -like "*fatal: repository*not found*" -or $checkResult -like "*404*") {
        Write-Host "✗ Репозиторий НЕ найден" -ForegroundColor Red
        Write-Host "   URL: $($repo.Url)" -ForegroundColor Gray
        $allAvailable = $false
        $results += @{Name=$repo.Name; Status="not-found"}
    }
    else {
        # Репозиторий пустой (что нормально для нового репозитория)
        Write-Host "✓ Репозиторий найден (пустой - это нормально)" -ForegroundColor Green
        $results += @{Name=$repo.Name; Status="found-empty"}
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "РЕЗУЛЬТАТЫ ПРОВЕРКИ" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Подсчитываем результаты
$foundCount = ($results | Where-Object {$_.Status -like "found*"}).Count
$notFoundCount = ($results | Where-Object {$_.Status -eq "not-found"}).Count
$notConfiguredCount = ($results | Where-Object {$_.Status -eq "not-configured"}).Count

Write-Host "Найдено репозиториев: " -NoNewline -ForegroundColor White
Write-Host "$foundCount из 3" -ForegroundColor Green

if ($notFoundCount -gt 0) {
    Write-Host "Не найдено: " -NoNewline -ForegroundColor White
    Write-Host "$notFoundCount" -ForegroundColor Red
}

if ($notConfiguredCount -gt 0) {
    Write-Host "Не настроено remotes: " -NoNewline -ForegroundColor White
    Write-Host "$notConfiguredCount" -ForegroundColor Yellow
}

Write-Host ""

# Детальная информация
Write-Host "Детали:`n" -ForegroundColor Yellow
foreach ($result in $results) {
    $status = switch ($result.Status) {
        "found" { "✓ Найден и доступен" }
        "found-auth" { "✓ Найден (нужна авторизация)" }
        "found-empty" { "✓ Найден (пустой - это нормально)" }
        "not-found" { "✗ НЕ найден" }
        "not-configured" { "⚠ Remote не настроен" }
        default { "? Неизвестный статус" }
    }
    $color = if ($result.Status -like "found*") { "Green" } 
             elseif ($result.Status -eq "not-found") { "Red" } 
             else { "Yellow" }
    
    Write-Host "  $($result.Name)" -NoNewline -ForegroundColor Cyan
    Write-Host " → " -NoNewline -ForegroundColor Gray
    Write-Host $status -ForegroundColor $color
}

Write-Host "`n========================================" -ForegroundColor Cyan

# Рекомендации
if ($foundCount -eq 3) {
    Write-Host "✓ ВСЕ РЕПОЗИТОРИИ НАЙДЕНЫ!" -ForegroundColor Green
    Write-Host "`nСледующий шаг:" -ForegroundColor Yellow
    Write-Host "  .\push-to-personal.ps1" -ForegroundColor White
    Write-Host "`nЭто запушит весь код в ваши личные репозитории." -ForegroundColor Gray
}
elseif ($notFoundCount -eq 0 -and $foundCount -gt 0) {
    Write-Host "⚠ Некоторые репозитории могут быть Private и требовать авторизации" -ForegroundColor Yellow
    Write-Host "`nРекомендация:" -ForegroundColor Yellow
    Write-Host "  Попробуйте запустить push - он покажет реальную ситуацию:" -ForegroundColor White
    Write-Host "  .\push-to-personal.ps1" -ForegroundColor Cyan
}
else {
    Write-Host "⚠ ЕСТЬ ПРОБЛЕМЫ С РЕПОЗИТОРИЯМИ" -ForegroundColor Yellow
    Write-Host "`nЧто делать:" -ForegroundColor Yellow
    Write-Host "1. Проверьте, что вы создали все 3 репозитория на GitHub:" -ForegroundColor White
    Write-Host "   https://github.com/GreedMitya?tab=repositories" -ForegroundColor Cyan
    Write-Host "`n2. Убедитесь, что репозитории называются точно:" -ForegroundColor White
    Write-Host "   • multiwork-backend" -ForegroundColor Gray
    Write-Host "   • multiwork-frontend" -ForegroundColor Gray
    Write-Host "   • multiwork-app-android" -ForegroundColor Gray
    Write-Host "`n3. Если репозитории созданы, попробуйте push:" -ForegroundColor White
    Write-Host "   .\push-to-personal.ps1" -ForegroundColor Cyan
    Write-Host "`n4. Если нужна помощь, смотрите:" -ForegroundColor White
    Write-Host "   create-repos-guide.md" -ForegroundColor Cyan
}

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Дополнительная проверка remotes
Write-Host "Проверка настроенных remotes:`n" -ForegroundColor Yellow

foreach ($repo in $repos) {
    Write-Host "  $($repo.Name)" -NoNewline -ForegroundColor Cyan
    cd $repo.Path
    
    $originUrl = git remote get-url origin 2>$null
    $corporateUrl = git remote get-url corporate 2>$null
    
    if ($originUrl) {
        Write-Host "`n    origin:    $originUrl" -ForegroundColor Gray
    } else {
        Write-Host "`n    origin:    ⚠ не настроен" -ForegroundColor Red
    }
    
    if ($corporateUrl) {
        Write-Host "    corporate: $corporateUrl" -ForegroundColor Gray
    } else {
        Write-Host "    corporate: ⚠ не настроен" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

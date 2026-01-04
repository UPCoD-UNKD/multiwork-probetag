# docker-azure.ps1 - Управление Docker на Azure VM
# Использование: .\docker-azure.ps1 -Action <up|down|logs|restart|status|tunnel>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("up", "down", "logs", "restart", "status", "tunnel", "context")]
    [string]$Action,
    
    [string]$Service = "backend"
)

# ============================================
# НАСТРОЙКИ
# ============================================
$vmUser = "dimappkv92"          # Username на Azure VM
$vmIp = "4.206.188.103"         # IP адрес Azure VM
$projectPath = "~/multiwork-backend"
$composeFile = "docker-compose.production.yml"
# ============================================

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Start-Tunnel {
    Write-Info "Запуск SSH туннеля для Docker..."
    Write-Warning "ВАЖНО: Оставьте это окно открытым!"
    Write-Warning "Нажмите Ctrl+C для остановки туннеля"
    Write-Host ""
    ssh -N -L 2376:localhost:2376 ${vmUser}@${vmIp}
}

function Invoke-DockerCompose {
    param([string]$Command)
    $fullCommand = "cd $projectPath && docker-compose -f $composeFile $Command"
    ssh ${vmUser}@${vmIp} $fullCommand
}

function Setup-DockerContext {
    Write-Info "Настройка Docker Context для Azure VM..."
    
    # Проверка SSH туннеля
    Write-Info "Проверка SSH туннеля..."
    $tunnelTest = Test-NetConnection -ComputerName localhost -Port 2376 -WarningAction SilentlyContinue
    if (-not $tunnelTest.TcpTestSucceeded) {
        Write-Error "ОШИБКА: SSH туннель не активен!"
        Write-Warning "Сначала запустите: .\docker-azure.ps1 -Action tunnel"
        Write-Warning "В отдельном окне PowerShell"
        return
    }
    
    Write-Success "SSH туннель активен ✓"
    
    # Проверка существующего контекста
    $existingContext = docker context ls --format "{{.Name}}" | Select-String "azure-vm"
    if ($existingContext) {
        Write-Warning "Контекст 'azure-vm' уже существует"
        $overwrite = Read-Host "Пересоздать? (y/n)"
        if ($overwrite -eq "y") {
            docker context rm azure-vm -f
        } else {
            Write-Info "Используем существующий контекст"
            docker context use azure-vm
            return
        }
    }
    
    # Создание контекста
    Write-Info "Создание Docker Context..."
    docker context create azure-vm --docker "host=tcp://localhost:2376"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Контекст 'azure-vm' создан успешно!"
        Write-Info "Переключение на контекст azure-vm..."
        docker context use azure-vm
        
        Write-Host ""
        Write-Success "✓ Настройка завершена!"
        Write-Info "Теперь вы можете использовать Docker Desktop для управления контейнерами на Azure VM"
        Write-Info "В Docker Desktop выберите контекст 'azure-vm' из выпадающего списка"
    } else {
        Write-Error "Ошибка при создании контекста"
    }
}

switch ($Action) {
    "tunnel" {
        Start-Tunnel
    }
    "context" {
        Setup-DockerContext
    }
    "up" {
        Write-Info "Запуск контейнеров на Azure VM..."
        Invoke-DockerCompose "up -d --build"
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Контейнеры запущены!"
            Write-Info "Проверка статуса..."
            Start-Sleep -Seconds 2
            Invoke-DockerCompose "ps"
        }
    }
    "down" {
        Write-Warning "Остановка контейнеров на Azure VM..."
        Invoke-DockerCompose "down"
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Контейнеры остановлены"
        }
    }
    "logs" {
        Write-Info "Просмотр логов $Service..."
        Write-Warning "Нажмите Ctrl+C для выхода"
        Invoke-DockerCompose "logs -f $Service"
    }
    "restart" {
        Write-Info "Перезапуск $Service..."
        Invoke-DockerCompose "restart $Service"
        if ($LASTEXITCODE -eq 0) {
            Write-Success "$Service перезапущен"
        }
    }
    "status" {
        Write-Info "Статус контейнеров на Azure VM:"
        Invoke-DockerCompose "ps"
        Write-Host ""
        Write-Info "Использование ресурсов:"
        ssh ${vmUser}@${vmIp} "docker stats --no-stream"
    }
}

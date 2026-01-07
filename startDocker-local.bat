@echo off
REM Открываем PowerShell и запускаем скрипт локально
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1"
pause

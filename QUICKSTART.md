# Быстрый старт Docker

## Запуск проекта

```bash
# 1. Сборка и запуск всех сервисов
docker-compose up --build -d

# 2. Просмотр логов
docker-compose logs -f

# 3. Проверка статуса
docker-compose ps
```

## Доступ к приложению

После запуска откройте в браузере:
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/api/actuator/health

## Остановка

```bash
docker-compose down
```

## Пересборка после изменений

```bash
# Пересборка конкретного сервиса
docker-compose up --build -d frontend
docker-compose up --build -d backend

# Пересборка всех сервисов
docker-compose up --build -d
```

## Структура

```
project-root/
├── docker-compose.yml      # Основная конфигурация
├── nginx/
│   └── default.conf        # Nginx reverse proxy
├── multiwork-frontend/
│   └── Dockerfile          # Frontend сборка
└── multiwork-backend/
    └── Dockerfile          # Backend сборка
```

## Troubleshooting

Если что-то не работает:

1. Проверьте логи: `docker-compose logs [service-name]`
2. Проверьте статус: `docker-compose ps`
3. Пересоберите: `docker-compose up --build -d`
4. Очистите все: `docker-compose down -v` (удалит данные БД!)

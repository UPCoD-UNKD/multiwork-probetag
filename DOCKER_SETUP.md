# Docker Setup Guide

Этот проект настроен для запуска в Docker контейнерах с использованием Docker Compose.

## Структура проекта

```
project-root/
│
├── docker-compose.yml          # Основной файл оркестрации
│
├── nginx/
│   └── default.conf            # Конфигурация Nginx reverse proxy
│
├── multiwork-frontend/
│   ├── Dockerfile              # Dockerfile для frontend
│   ├── package.json
│   └── src/
│
└── multiwork-backend/
    ├── Dockerfile              # Dockerfile для backend
    ├── .env                    # Переменные окружения (не в git)
    └── target/app.jar          # Собранный JAR файл
```

## Быстрый старт

### 1. Подготовка

Убедитесь, что у вас установлены:
- Docker Desktop (или Docker + Docker Compose)
- Git

### 2. Настройка переменных окружения

Скопируйте пример файла окружения:
```bash
cp .env.example .env
```

Отредактируйте `.env` файл при необходимости (для локальной разработки значения по умолчанию подойдут).

### 3. Запуск проекта

```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Или в фоновом режиме
docker-compose up -d --build
```

### 4. Проверка работы

После запуска все сервисы будут доступны:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Backend Health Check**: http://localhost/api/actuator/health

## Управление контейнерами

```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes (удалит данные БД!)
docker-compose down -v

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Перезапуск конкретного сервиса
docker-compose restart backend

# Пересборка и перезапуск
docker-compose up --build -d
```

## Архитектура

### Сервисы

1. **backend** (порт 8080 внутри сети)
   - Spring Boot приложение
   - Использует H2 базу данных для локальной разработки
   - Данные сохраняются в `multiwork-backend/data/`

2. **frontend** (порт 80 внутри сети)
   - React приложение (production build)
   - Статические файлы обслуживаются через Nginx

3. **nginx** (порт 80 на хосте)
   - Reverse proxy
   - Маршрутизирует `/api/*` запросы к backend
   - Обслуживает статические файлы frontend

### Сеть

Все сервисы находятся в одной Docker сети `multiwork-network` и могут обращаться друг к другу по именам сервисов.

## Переменные окружения

Основные переменные окружения настраиваются в `.env` файле в корне проекта:

- `SPRING_PROFILES_ACTIVE` - профиль Spring (local, azure, production)
- `SPRING_DATASOURCE_URL` - URL базы данных
- `APP_JWT_SECRET` - секретный ключ для JWT токенов
- `APP_CORS_ALLOWED_ORIGINS` - разрешенные источники для CORS

## Развертывание на VM

### Подготовка

1. Убедитесь, что на VM установлены Docker и Docker Compose
2. Скопируйте весь проект на VM
3. Настройте `.env` файл для production окружения
4. Для production используйте PostgreSQL вместо H2

### Запуск на VM

```bash
# На VM
cd /path/to/project
docker-compose up -d --build
```

### Обновление на VM

```bash
# Получить последние изменения
git pull

# Пересобрать и перезапустить
docker-compose up -d --build
```

## Troubleshooting

### Backend не запускается

```bash
# Проверьте логи
docker-compose logs backend

# Проверьте, что порт 8080 не занят
netstat -an | grep 8080
```

### Frontend не собирается

```bash
# Проверьте логи сборки
docker-compose logs frontend

# Попробуйте собрать локально
cd multiwork-frontend
npm install
npm run build
```

### Nginx не проксирует запросы

```bash
# Проверьте конфигурацию Nginx
docker-compose exec nginx nginx -t

# Проверьте логи
docker-compose logs nginx
```

### Проблемы с базой данных

```bash
# Если нужно сбросить базу данных
docker-compose down -v
docker-compose up -d
```

## Production рекомендации

1. **Безопасность**:
   - Измените `APP_JWT_SECRET` на безопасный ключ
   - Отключите H2 console (`SPRING_H2_CONSOLE_ENABLED=false`)
   - Используйте PostgreSQL вместо H2
   - Настройте HTTPS через Nginx

2. **Производительность**:
   - Настройте кэширование в Nginx
   - Используйте production профиль Spring Boot
   - Настройте мониторинг и логирование

3. **Масштабирование**:
   - Используйте внешнюю базу данных
   - Рассмотрите использование Docker Swarm или Kubernetes
   - Настройте load balancing для backend

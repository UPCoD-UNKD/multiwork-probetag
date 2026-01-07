# Workflow Guide для работы с MWProject

## 📁 Структура проекта

```
MWProject/                          (главный репозиторий)
├── multiwork-backend/              (submodule: отдельный git repo)
├── multiwork-frontend/             (submodule: отдельный git repo)
└── multiwork-app-android/          (submodule: отдельный git repo)
```

Каждый модуль — это **независимый git-репозиторий** с двумя remotes:
- `origin` → личный репозиторий (GreedMitya)
- `corporate` → корпоративный репозиторий (UPCoD-UNKD)

## 🔄 Workflow: Работа с изменениями

### Ежедневная разработка

1. **Работайте в IDEA** с каждым модулем как с отдельным проектом
2. **Коммитьте изменения** в нужном модуле:
   ```bash
   cd multiwork-backend
   git add .
   git commit -m "feat: добавил новую фичу"
   ```

3. **Пушьте в личный репозиторий** (origin):
   ```bash
   git push origin main
   ```

### Синхронизация с корпоративным репозиторием

Когда изменения готовы для корпоративного репозитория:

```powershell
# Синхронизировать все модули
.\sync-to-corporate.ps1

# Или синхронизировать только один модуль
.\sync-to-corporate.ps1 -Module backend
.\sync-to-corporate.ps1 -Module frontend
.\sync-to-corporate.ps1 -Module android
```

## 🚀 Первоначальная настройка

### 1. Создайте личные репозитории на GitHub

Создайте **пустые** репозитории (без README):
- https://github.com/GreedMitya/multiwork-backend
- https://github.com/GreedMitya/multiwork-frontend
- https://github.com/GreedMitya/multiwork-app-android

### 2. Запустите первый push

```powershell
.\push-to-personal.ps1
```

Этот скрипт запушит все модули в ваши личные репозитории.

## 📝 Полезные команды

### Проверить статус всех модулей

```powershell
cd multiwork-backend; git status
cd ..\multiwork-frontend; git status
cd ..\multiwork-app-android; git status
```

### Посмотреть remotes каждого модуля

```powershell
cd multiwork-backend; git remote -v
cd ..\multiwork-frontend; git remote -v
cd ..\multiwork-app-android; git remote -v
```

### Pull из корпоративного репозитория

Если коллеги внесли изменения в корпоративный репозиторий:

```bash
cd multiwork-backend
git fetch corporate
git merge corporate/main
# или
git pull corporate main
```

### Cherry-pick коммитов

Если нужно перенести конкретный коммит:

```bash
cd multiwork-backend
git cherry-pick <commit-hash>
git push origin main
```

## 🔧 Работа в IDEA

### Открытие проектов

1. **Главный проект**: открывайте `MWProject` как обычный проект
2. **Модули отдельно**: можете открыть каждый модуль в отдельном окне IDEA:
   - `File → Open → multiwork-backend`
   - `File → Open → multiwork-frontend`
   - `File → Open → multiwork-app-android`

### Git в IDEA

- IDEA автоматически определит, что каждый модуль — отдельный git-репозиторий
- В меню `Git` → `Manage Remotes` увидите оба remote (origin и corporate)
- При push/pull можете выбирать, с каким remote работать

## ⚠️ Важные моменты

1. **Всегда коммитьте и пушьте сначала в origin (личный)**
2. **Синхронизируйте с corporate только проверенный код**
3. **Не забывайте пулить изменения из corporate**, если работаете в команде
4. **Каждый модуль независим** — изменения в одном не влияют на другие

## 🎯 Типичные сценарии

### Сценарий 1: Разработка новой фичи

```bash
# 1. Работаем в backend
cd multiwork-backend
git checkout -b feature/new-api
# ... делаем изменения ...
git add .
git commit -m "feat: новый API endpoint"
git push origin feature/new-api

# 2. Создаем PR в личном репозитории
# 3. После ревью мерджим в main
# 4. Синхронизируем с corporate
git checkout main
git pull origin main
cd ..
.\sync-to-corporate.ps1 -Module backend
```

### Сценарий 2: Получение изменений от команды

```bash
# 1. Пулим из корпоративного репозитория
cd multiwork-backend
git fetch corporate
git merge corporate/main

# 2. Пушим в личный репозиторий
git push origin main
```

### Сценарий 3: Hotfix в production

```bash
# 1. Пулим актуальное состояние из corporate
cd multiwork-backend
git pull corporate main

# 2. Делаем hotfix
git checkout -b hotfix/critical-bug
# ... исправляем баг ...
git add .
git commit -m "fix: критический баг"

# 3. Пушим в оба репозитория
git push origin hotfix/critical-bug
git push corporate hotfix/critical-bug

# 4. Создаем PR в обоих репозиториях
```

## 📚 Дополнительные скрипты

- `setup-submodules.ps1` — первоначальная настройка (уже выполнен)
- `push-to-personal.ps1` — первый push в личные репозитории
- `sync-to-corporate.ps1` — синхронизация с корпоративными репозиториями
- `prepare-delivery.ps1` — подготовка production-версии для заказчика

## 🆘 Troubleshooting

### Проблема: "remote corporate already exists"

```bash
git remote remove corporate
git remote add corporate https://github.com/UPCoD-UNKD/multiwork-backend
```

### Проблема: Конфликты при merge

```bash
git fetch corporate
git merge corporate/main
# Решаем конфликты вручную
git add .
git commit -m "merge: resolve conflicts with corporate"
```

### Проблема: Нужно откатить изменения

```bash
# Откатить uncommitted изменения
git checkout .

# Откатить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Откатить последний коммит (удалить изменения)
git reset --hard HEAD~1
```

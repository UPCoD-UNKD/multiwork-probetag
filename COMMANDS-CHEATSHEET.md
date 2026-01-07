# 🚀 Шпаргалка команд для MWProject

## ⚡ Быстрый старт

```powershell
# Первый запуск (после создания репозиториев на GitHub)
.\push-to-personal.ps1

# Синхронизация с корпоративным
.\sync-to-corporate.ps1
```

---

## 📝 Ежедневная разработка

### Работа с одним модулем

```bash
# Переход в модуль
cd multiwork-backend

# Проверка статуса
git status

# Добавление изменений
git add .
git commit -m "feat: описание изменений"

# Push в личный репозиторий
git push origin main

# Pull из личного репозитория
git pull origin main
```

### Создание feature branch

```bash
cd multiwork-backend
git checkout -b feature/my-feature
# ... делаете изменения ...
git add .
git commit -m "feat: моя фича"
git push origin feature/my-feature
```

---

## 🔄 Синхронизация

### Push в личные репозитории

```bash
cd multiwork-backend
git push origin main
```

### Sync в корпоративные репозитории

```powershell
# Все модули
.\sync-to-corporate.ps1

# Конкретный модуль
.\sync-to-corporate.ps1 -Module backend
.\sync-to-corporate.ps1 -Module frontend
.\sync-to-corporate.ps1 -Module android
```

### Pull из корпоративного репозитория

```bash
cd multiwork-backend
git pull corporate main
```

---

## 🔍 Проверка состояния

### Статус всех модулей

```powershell
cd multiwork-backend; git status --short
cd ..\multiwork-frontend; git status --short
cd ..\multiwork-app-android; git status --short
```

### Remotes всех модулей

```powershell
cd multiwork-backend; git remote -v
cd ..\multiwork-frontend; git remote -v
cd ..\multiwork-app-android; git remote -v
```

### История коммитов

```bash
# Последние 5 коммитов
git log --oneline -5

# Графическое представление
git log --oneline --graph --all -10
```

---

## 🌿 Работа с ветками

### Создание новой ветки

```bash
git checkout -b feature/my-feature
```

### Переключение между ветками

```bash
git checkout main
git checkout feature/my-feature
```

### Список веток

```bash
# Локальные ветки
git branch

# Все ветки (включая remote)
git branch -a
```

### Удаление ветки

```bash
# Локально
git branch -d feature/my-feature

# На remote
git push origin --delete feature/my-feature
```

---

## 🔀 Merge и rebase

### Merge из другой ветки

```bash
git checkout main
git merge feature/my-feature
```

### Pull с rebase

```bash
git pull --rebase origin main
```

### Merge из корпоративного

```bash
git fetch corporate
git merge corporate/main
```

---

## 🛠️ Полезные команды

### Отмена изменений

```bash
# Отменить uncommitted изменения в файле
git checkout -- filename.js

# Отменить все uncommitted изменения
git checkout .

# Отменить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалить изменения)
git reset --hard HEAD~1
```

### Stash (временное сохранение)

```bash
# Сохранить текущие изменения
git stash

# Посмотреть список stash
git stash list

# Применить последний stash
git stash pop

# Применить конкретный stash
git stash apply stash@{0}
```

### Cherry-pick коммита

```bash
# Перенести конкретный коммит
git cherry-pick <commit-hash>
```

### Изменить последний коммит

```bash
# Изменить сообщение
git commit --amend -m "новое сообщение"

# Добавить файлы к последнему коммиту
git add forgotten-file.js
git commit --amend --no-edit
```

---

## 📊 Информация о репозитории

### Различия между версиями

```bash
# Изменения в рабочей директории
git diff

# Изменения в staged файлах
git diff --staged

# Различия между ветками
git diff main feature/my-feature
```

### Информация о коммите

```bash
# Детали коммита
git show <commit-hash>

# Файлы в коммите
git show --name-only <commit-hash>
```

### Кто изменял файл

```bash
git blame filename.js
```

---

## 🔧 Настройка remotes

### Просмотр remotes

```bash
git remote -v
```

### Добавление remote

```bash
git remote add <name> <url>
```

### Изменение URL remote

```bash
git remote set-url origin https://github.com/GreedMitya/multiwork-backend
```

### Удаление remote

```bash
git remote remove <name>
```

---

## 🚨 Решение проблем

### Конфликты при merge

```bash
# 1. Увидите конфликты в git status
git status

# 2. Откройте конфликтующие файлы и разрешите конфликты вручную
# 3. Добавьте разрешенные файлы
git add .

# 4. Завершите merge
git commit -m "merge: resolved conflicts"
```

### Откат к предыдущему состоянию

```bash
# Откатиться на N коммитов назад
git reset --hard HEAD~3

# Откатиться к конкретному коммиту
git reset --hard <commit-hash>
```

### Удалить untracked файлы

```bash
# Посмотреть, что будет удалено
git clean -n

# Удалить untracked файлы
git clean -f

# Удалить untracked файлы и директории
git clean -fd
```

---

## 📦 Работа с submodules (для главного репозитория)

### Клонирование проекта с submodules

```bash
git clone --recursive https://github.com/GreedMitya/ProdMW
```

### Обновление submodules

```bash
git submodule update --remote --merge
```

### Инициализация submodules (если забыли --recursive)

```bash
git submodule init
git submodule update
```

---

## 🎯 Полезные алиасы (опционально)

Добавьте в `.gitconfig`:

```ini
[alias]
    st = status --short
    co = checkout
    br = branch
    cm = commit -m
    ps = push origin
    pl = pull origin
    lg = log --oneline --graph --all -10
    unstage = reset HEAD --
    last = log -1 HEAD
```

Использование:
```bash
git st         # вместо git status --short
git lg         # вместо git log --oneline --graph --all -10
git cm "text"  # вместо git commit -m "text"
```

---

## 📚 Документация

- **SETUP-COMPLETE.md** — что было сделано и следующие шаги
- **SUBMODULES-QUICK-START.md** — быстрый старт
- **workflow-guide.md** — подробное руководство
- **sync-to-corporate.ps1** — скрипт синхронизации

---

**💡 Совет:** Добавьте этот файл в закладки для быстрого доступа к командам!

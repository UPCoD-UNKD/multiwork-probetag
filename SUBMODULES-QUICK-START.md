# 🚀 Quick Start: Submodules Setup

## ✅ Что уже настроено

Ваш проект **MWProject** теперь полностью модульный! Каждый компонент — это независимый git-репозиторий:

### 📦 Модули

| Модуль | Personal (origin) | Corporate |
|--------|-------------------|-----------|
| **Backend** | `GreedMitya/multiwork-backend` | `UPCoD-UNKD/multiwork-backend` |
| **Frontend** | `GreedMitya/multiwork-frontend` | `UPCoD-UNKD/multiwork-frontend` |
| **Android** | `GreedMitya/multiwork-app-android` | `UPCoD-UNKD/multiwork-app-android` |

### 🎯 Каждый модуль имеет:
- ✅ Собственный `.git` репозиторий
- ✅ Два remotes: `origin` (личный) и `corporate` (корпоративный)
- ✅ Все текущие изменения закоммичены
- ✅ Готов к push в личные репозитории

---

## 📝 Следующие шаги

### Шаг 1: Создайте личные репозитории на GitHub

Зайдите на https://github.com/GreedMitya и создайте **3 пустых репозитория** (БЕЗ README):

1. ➕ **New repository** → `multiwork-backend`
   - ☑️ Private (или Public, на ваш выбор)
   - ⚠️ **НЕ добавляйте** README, .gitignore, license

2. ➕ **New repository** → `multiwork-frontend`
   - ☑️ Private (или Public)
   - ⚠️ **НЕ добавляйте** README, .gitignore, license

3. ➕ **New repository** → `multiwork-app-android`
   - ☑️ Private (или Public)
   - ⚠️ **НЕ добавляйте** README, .gitignore, license

---

### Шаг 2: Запустите первый push

Откройте PowerShell в папке `MWProject` и выполните:

```powershell
.\push-to-personal.ps1
```

Этот скрипт:
- ✅ Запушит backend в `GreedMitya/multiwork-backend`
- ✅ Запушит frontend в `GreedMitya/multiwork-frontend`
- ✅ Запушит android в `GreedMitya/multiwork-app-android`

---

## 🎓 Как работать дальше

### Ежедневная разработка

```bash
# 1. Открываете модуль в IDEA
# Например: File → Open → MWProject/multiwork-backend

# 2. Делаете изменения, коммитите
git add .
git commit -m "feat: добавил новую функцию"

# 3. Пушите в личный репозиторий
git push origin main
```

### Синхронизация с корпоративным репозиторием

Когда код готов к отправке в корпоративный репозиторий:

```powershell
# Синхронизировать все модули
.\sync-to-corporate.ps1

# Или только конкретный модуль
.\sync-to-corporate.ps1 -Module backend
```

---

## 📚 Полезные ресурсы

- 📖 **[workflow-guide.md](workflow-guide.md)** — подробное руководство по работе
- 🔧 **[sync-to-corporate.ps1](sync-to-corporate.ps1)** — скрипт синхронизации
- 📦 **[.gitmodules](.gitmodules)** — конфигурация submodules

---

## 🆘 Помощь

### Проверить статус всех модулей

```powershell
cd multiwork-backend; git status; cd ..
cd multiwork-frontend; git status; cd ..
cd multiwork-app-android; git status; cd ..
```

### Посмотреть все remotes

```powershell
cd multiwork-backend; git remote -v
cd multiwork-frontend; git remote -v
cd multiwork-app-android; git remote -v
```

### Если что-то пошло не так

1. Проверьте, что личные репозитории созданы на GitHub
2. Убедитесь, что у вас есть права на push
3. Если нужна помощь — откройте `workflow-guide.md`

---

## ✨ Преимущества текущей настройки

✅ **Каждый модуль независим** — можете работать с ними отдельно в IDEA

✅ **Двойная синхронизация** — разрабатываете в личном, синхронизируете с корпоративным

✅ **Гибкость** — можете делать cherry-pick, feature branches, hotfixes

✅ **Безопасность** — ваши эксперименты в личном репозитории, production в корпоративном

---

**Готово! 🎉 Можете начинать работу с модулями!**

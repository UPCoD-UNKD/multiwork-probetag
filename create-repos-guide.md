# 📘 Пошаговая инструкция: Создание репозиториев на GitHub

## 🎯 Что нужно создать

Вам нужно создать **3 пустых репозитория** на GitHub в вашем аккаунте **GreedMitya**:

1. `multiwork-backend`
2. `multiwork-frontend`
3. `multiwork-app-android`

---

## 📝 Пошаговая инструкция (5 минут)

### Шаг 1: Откройте GitHub

1. Откройте браузер
2. Перейдите на https://github.com/GreedMitya
3. Убедитесь, что вы залогинены в аккаунт **GreedMitya**

---

### Шаг 2: Создайте первый репозиторий (Backend)

1. **Нажмите** зеленую кнопку **"New"** (или перейдите на https://github.com/new)

2. **Заполните форму:**
   ```
   Repository name: multiwork-backend
   
   Description: (опционально)
   Backend service for MultiWork platform - Java Spring Boot
   
   Visibility: 
   ○ Public    ← можете выбрать Public
   ● Private   ← или Private (на ваш выбор)
   
   ⚠️ ВАЖНО: НЕ ставьте галочки ниже!
   ☐ Add a README file          ← НЕ ставьте галочку!
   ☐ Add .gitignore             ← НЕ ставьте галочку!
   ☐ Choose a license           ← НЕ ставьте галочку!
   ```

3. **Нажмите** зеленую кнопку **"Create repository"**

4. ✅ **Репозиторий создан!** GitHub покажет инструкции для push

---

### Шаг 3: Создайте второй репозиторий (Frontend)

1. **Вернитесь** на https://github.com/GreedMitya

2. **Нажмите** снова кнопку **"New"**

3. **Заполните форму:**
   ```
   Repository name: multiwork-frontend
   
   Description: (опционально)
   Frontend application for MultiWork platform - React 18
   
   Visibility: 
   ● Private/Public (на ваш выбор, как и backend)
   
   ⚠️ ВАЖНО: НЕ добавляйте README, .gitignore, license!
   ☐ Add a README file          ← НЕ ставьте галочку!
   ☐ Add .gitignore             ← НЕ ставьте галочку!
   ☐ Choose a license           ← НЕ ставьте галочку!
   ```

4. **Нажмите** **"Create repository"**

5. ✅ **Второй репозиторий создан!**

---

### Шаг 4: Создайте третий репозиторий (Android)

1. **Вернитесь** на https://github.com/GreedMitya

2. **Нажмите** кнопку **"New"**

3. **Заполните форму:**
   ```
   Repository name: multiwork-app-android
   
   Description: (опционально)
   Android mobile app for MultiWork platform
   
   Visibility: 
   ● Private/Public (на ваш выбор)
   
   ⚠️ ВАЖНО: НЕ добавляйте README, .gitignore, license!
   ☐ Add a README file          ← НЕ ставьте галочку!
   ☐ Add .gitignore             ← НЕ ставьте галочку!
   ☐ Choose a license           ← НЕ ставьте галочку!
   ```

4. **Нажмите** **"Create repository"**

5. ✅ **Третий репозиторий создан!**

---

## ✅ Проверка

После создания всех трех репозиториев:

1. Перейдите на https://github.com/GreedMitya?tab=repositories
2. Вы должны увидеть 3 новых репозитория:
   - ✅ `multiwork-backend`
   - ✅ `multiwork-frontend`
   - ✅ `multiwork-app-android`

---

## 🚀 Следующий шаг

После создания всех репозиториев, вернитесь в PowerShell и выполните:

```powershell
cd C:\Users\Administrator\Desktop\MWProject

# Проверить, что репозитории созданы
.\check-repos.ps1

# Если все ОК, запустить первый push
.\push-to-personal.ps1
```

---

## 💡 Альтернативный способ: GitHub CLI

Если у вас установлен GitHub CLI (`gh`), можете создать репозитории командами:

```bash
gh auth login
gh repo create GreedMitya/multiwork-backend --private
gh repo create GreedMitya/multiwork-frontend --private
gh repo create GreedMitya/multiwork-app-android --private
```

---

## ❓ Часто задаваемые вопросы

**Q: Какую видимость выбрать (Private/Public)?**
- **Private** — если код конфиденциальный
- **Public** — если хотите открыть код сообществу
- Можно потом изменить в Settings → Danger Zone → Change visibility

**Q: Почему нельзя добавлять README/gitignore при создании?**
- Потому что у нас уже есть полный код с историей
- GitHub создаст initial commit с README, что помешает push
- Мы сделаем push нашего кода с полной историей

**Q: А если я случайно добавил README?**
- Ничего страшного, можно удалить репозиторий и создать заново
- Settings → Danger Zone → Delete this repository

**Q: Сколько места занимают репозитории?**
- Backend: ~5-10 MB
- Frontend: ~1-3 MB (без node_modules)
- Android: ~1-2 MB

---

## 🆘 Проблемы?

Если что-то пошло не так:

1. **"Repository already exists"**
   - Репозиторий уже создан, проверьте https://github.com/GreedMitya

2. **"You have reached your repository limit"**
   - Free план GitHub: неограниченно Public + Private репозитории
   - Проблем быть не должно

3. **Не могу найти кнопку "New"**
   - Проверьте, что вы залогинены
   - Кнопка находится на главной странице или в https://github.com/new

---

**📞 После создания репозиториев запустите: `.\check-repos.ps1` для проверки!**

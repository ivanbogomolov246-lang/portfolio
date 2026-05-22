# Лендинг-портфолио разработчика (Frontend + Backend + AI)

Современный адаптивный лендинг-портфолио для **Ивана Богомолова** с полноценным frontend, backend API, формой обратной связи и AI helper для генерации краткого описания проекта.

## Стек

- Frontend: `React`, `TypeScript`, `Vite`, `SCSS`
- Backend: `Node.js`, `Express`, `TypeScript`
- Валидация и безопасность: `Zod`, `Helmet`, `CORS`, `Morgan`, `express-rate-limit`
- Почта: `Nodemailer`
- AI: `OpenAI API`, `DeepSeek API`
- Локальное тестирование AI: `Ollama` (**использовалась только для теста**)

## Реализованный функционал

### 1) Блок «Обо мне»

- Имя: Иван Богомолов
- Роль: Fullstack разработчик
- Стек: JavaScript, TypeScript, Node.js, NestJS, React, PostgreSQL, Redis, WebSocket, Docker
- Опыт:
  - backend-сервисы на NestJS
  - работа с LLM
  - REST API
  - WebSocket
  - интеграции
  - Redis-кеширование
  - frontend на React
- Направления:
  - Fullstack
  - Backend
  - AI-интеграции
  - автоматизация

### 2) Блок «Как я работаю»

- Анализ требований
- Проектирование
- Разработка
- Тестирование
- Оптимизация

Отдельно отражено применение AI:

- ChatGPT
- Cursor
- Codex
- Генерация идей
- Рефакторинг
- Ускорение рутинных задач

### 3) Блок «Кейсы»

- LLM-сервис на NestJS:
  - ~110 запросов в день
  - Redis снизил внешние запросы на 40%
  - WebSocket
  - API
- CRM + личные кабинеты:
  - интеграции
  - JWT
  - оптимизация
- AI workflow / Telegram bot / n8n

### 4) Контакты и форма

- Контакты: GitHub, Telegram, Email
- Поля формы: имя, телефон, email, комментарий
- Состояния UI: loading, success, error
- Обработки ошибок:
  - пустые поля
  - некорректный email
  - сетевые ошибки
  - серверные ошибки
- Backend-логика:
  - валидация входных данных
  - отправка письма владельцу
  - отправка копии пользователю

### 5) AI helper

- Кнопка: «Сгенерировать краткое описание»
- Endpoint: `POST /api/ai-summary`
- Состояния: loading / error / результат

## API backend

- `GET /api/health` — проверка здоровья сервиса
- `POST /api/contact` — отправка формы обратной связи
- `POST /api/ai-summary` — генерация краткого описания проекта

## Структура проекта

```text
frontend/
  src/
    components/
    pages/
    services/
    hooks/
    styles/

backend/
  src/
    routes/
    controllers/
    services/
    utils/
```

## Запуск проекта локально

### 1. Установка зависимостей

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Настройка `.env`

Скопируйте примеры:

```bash
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

(или вручную создайте файлы по примеру)

### 3. Запуск backend

```bash
cd backend
npm run dev
```

### 4. Запуск frontend

```bash
cd frontend
npm run dev
```

По умолчанию:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Настройка SMTP (форма обратной связи)

Для Gmail:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=ваш_gmail`
- `SMTP_PASS=пароль_приложения_Google`

Важно:

- нужен именно **App Password** Google (не обычный пароль аккаунта)
- при активном VPN SMTP может не работать корректно

## AI-провайдеры

Поддерживаются `openai`, `deepseek`, `ollama`.

### Ollama (только для локального теста)

`Ollama` в этом проекте использовалась **только для тестирования AI-функции**, когда не использовались платные API.

Пример:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=llama3.2:3b
```

## GitHub: быстрая публикация

```bash
git remote add origin https://github.com/ivanbogomolov246-lang/portfolio.git
git push -u origin main
```

## Деплой (Render)

В проект добавлен `render.yaml` для деплоя frontend+backend одним сервисом.

Формат ссылки для one-click deploy:

```text
https://render.com/deploy?repo=https://github.com/ivanbogomolov246-lang/portfolio
```

## Что делалось с помощью AI

- Варианты формулировок контента
- Быстрый брейншторминг по edge-case сценариям
- Подсказки по структуре модулей и обработке ошибок

## Что исправлялось вручную

- Финальная архитектура `routes/controllers/services/utils`
- Валидация и контракты ошибок API
- UI/UX правки и адаптив
- Интеграция и стабилизация SMTP-отправки
- Диагностика и фиксы по AI-провайдерам, timeout и fallback-сценариям
- Подготовка конфигурации деплоя

## Полезные команды

### Frontend

```bash
npm run typecheck
npm run build
npm run preview
```

### Backend

```bash
npm run typecheck
npm run build
npm run start
```

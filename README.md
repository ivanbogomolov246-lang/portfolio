# Developer Portfolio Landing (Frontend + Backend + AI)

Production-style adaptive portfolio landing for **Ivan Bogomolov** with full frontend, backend API, contact workflow, and AI summary helper.

## Stack

- Frontend: React, TypeScript, Vite, SCSS
- Backend: Node.js, Express, TypeScript
- Integrations: Nodemailer, OpenAI API, DeepSeek API
- Testing only: Ollama (local), used only for AI feature testing
- Platform: Helmet, CORS, Morgan, Rate limiting, Zod validation

## Implemented Features

### About section
- Name and role: Ivan Bogomolov, Fullstack developer
- Stack: JavaScript, TypeScript, Node.js, NestJS, React, PostgreSQL, Redis, WebSocket, Docker
- Experience focus: NestJS backend, LLM work, REST API, WebSocket, integrations, Redis caching, React frontend
- Directions: Fullstack, Backend, AI integrations, automation

### How I work section
- Stages: requirements analysis, architecture, development, testing, optimization
- AI usage: ChatGPT, Cursor, Codex, AI for ideation/refactoring/routine acceleration

### Cases section
- LLM service on NestJS (~110 req/day, Redis -40% external calls, WebSocket, API)
- CRM + dashboards (integrations, JWT, optimization)
- AI workflow / Telegram bot / n8n

### Contacts + form
- Contact links: GitHub, Telegram, Email
- Form fields: name, phone, email, comment
- UX states: loading, success, error
- Error coverage: empty fields, invalid email, network errors, server errors
- Backend behavior: validates payload, sends owner email, sends user copy

### AI helper
- Button: "Generate short summary"
- API endpoint: `POST /api/ai-summary`
- UX states: loading, error, result

## Backend API

- `GET /api/health` - health check
- `POST /api/contact` - validated contact submission + dual email delivery
- `POST /api/ai-summary` - validated project text + OpenAI summary response

## Free Local AI (Ollama)

Ollama was used only for local testing of AI summary when paid API quotas were unavailable.

1. Install Ollama and start it.
2. Pull a model:

```bash
ollama pull llama3.2:3b
```

3. In `backend/.env` set:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=llama3.2:3b
```

4. Restart backend.

## Project Structure

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

## Run Locally

1. Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
```

2. Create env files:
- copy `frontend/.env.example` to `frontend/.env`
- copy `backend/.env.example` to `backend/.env`
- optional unified template: root `.env.example`

3. Start backend:

```bash
cd backend
npm run dev
```

4. Start frontend:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Useful Commands

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

## AI vs Manual Work

- AI-assisted: initial section wording options, endpoint-level edge-case brainstorming, and service structure sanity checks.
- Manually finalized: architecture split (`routes/controllers/services/utils`), validation/error contracts, adaptive UI behavior, and production hardening.

## Validation Before Delivery

- Frontend typecheck: passed
- Frontend build: passed
- Backend typecheck: passed
- Backend build: passed
- Backend runtime smoke test: `GET /api/health` passed

# Comparador de Instrumentos Musicales

TFG — Aplicación web para comparar instrumentos musicales con IA.

## Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui → Vercel
- **Backend:** FastAPI (Python) → Railway/Render
- **Base de datos:** Firebase Firestore
- **LLM:** Claude (Anthropic API)
- **Discovery:** Tavily

## Estructura

```
comparador-instrumentos/
├── web/        # Next.js 15 (frontend + API routes)
├── api/        # FastAPI (scraping, procesamiento pesado)
└── docs/       # ADRs, planes, arquitectura
```

## Arrancar en local

### Frontend
```bash
cd web
npm install
cp ../.env.example .env.local  # rellena tus claves
npm run dev
```

### Backend
```bash
cd api
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

## Variables de entorno

Copia `.env.example` → `web/.env.local` y rellena cada valor.
Nunca subas `.env.local` al repositorio.

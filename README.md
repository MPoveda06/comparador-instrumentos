# Sound Compare

TFG — Comparador de instrumentos musicales con IA.

## Stack

- **Frontend:** Angular + TypeScript + SCSS → Firebase Hosting / Vercel
- **Backend:** NestJS (TypeScript) → Railway / Render
- **Base de datos:** Firebase Firestore
- **LLM:** Claude (Anthropic API)
- **Búsqueda:** Tavily

## Estructura

```
comparador-instrumentos/
├── frontend/    # Angular (UI)
├── api/         # NestJS (REST API)
└── docs/        # ADRs, diseño, capturas
```

## Arrancar en local

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd api
npm install
npm run start:dev
```

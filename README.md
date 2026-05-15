# NamibiaTimes Monorepo Layout

This project is now separated into clear app boundaries:

- `frontend/`: Next.js application (UI + frontend API routes + Prisma schema for local frontend data)
- `backend/`: FastAPI service and processing pipeline
- `data-agent/`: scraper and ingestion agent
- `ops/`: operational/infrastructure assets

## Run Frontend

```bash
cd frontend
npm run dev
```

## Run Backend

```bash
uvicorn backend.main:app --reload --port 8000
```

## Run Data Agent

```bash
cd data-agent
python -m scraper.main
```

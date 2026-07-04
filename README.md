# Times of Namibia

> **Applied AI. Built in Africa.** — A TANGISON news outlet.
> Real-time verified news, tender analysis, job market intelligence, and market
> data for Namibia and the continent.

A three-tier news platform: a Next.js 16 frontend, a FastAPI backend with LLM
enrichment, and a Python data-agent that scrapes 30+ Namibian and African
sources. Published by [TANGISON](https://tangison.com) — the applied AI
laboratory that builds systems for African operating conditions.

**Data backend**: Convex (preferred, real-time reactive queries) with automatic
fallback to FastAPI + Postgres. See [Convex setup](#convex-setup) below.

---

## Repository layout

```
timesofnamibia/
├── frontend-new/   Next.js 16 + TypeScript + Tailwind v4 + Prisma (Postgres)
├── backend/        FastAPI + SQLAlchemy + Postgres + Groq LLM
├── data-agent/     Python scraper — RSS, jobs, tenders, market, parliament
├── Caddyfile       Reverse proxy with TLS, HTTP/3, compression
├── docker-compose.yml
└── .github/workflows/  CI
```

---

## Quick start (local dev)

### Prerequisites

- Node.js 22+, npm
- Python 3.12+, pip
- PostgreSQL 16+

### 1. Clone & install

```bash
git clone https://github.com/Pauk-creator/timesofnamibia.git
cd timesofnamibia
cp .env.example .env   # then edit .env to fill in real secrets
```

### 2. Frontend (Next.js)

```bash
cd frontend-new
npm install
npx prisma generate
npx prisma db push     # creates the `frontend` schema in Postgres
npm run dev            # http://localhost:3000
```

### 3. Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/docs

### 4. Data agent (Python scraper)

```bash
cd data-agent
pip install -r requirements.txt
python -m scraper.main
```

---

## Quick start (Docker)

```bash
cp .env.example .env
# Fill in: INTERNAL_API_SECRET, ADMIN_TOKEN, POSTGRES_PASSWORD
docker compose up --build
```

Services: frontend (:3000), backend (:8000), postgres (:5432), caddy (:80/:443)

---

## Environment variables

See [`.env.example`](./.env.example) for the complete list. Critical:

| Variable                  | Required | Purpose                                          |
| ------------------------- | -------- | ------------------------------------------------ |
| `INTERNAL_API_SECRET`     | **yes**  | Shared secret between frontend proxy and backend |
| `ADMIN_TOKEN`             | **yes**  | Bearer token for admin-only API routes           |
| `DATABASE_URL`            | yes      | Postgres connection (frontend Prisma, `?schema=frontend`) |
| `POSTGRES_PASSWORD`       | Docker   | Postgres password                                |
| `GROQ_API_KEY`            | optional | For LLM article summarization                    |
| `NEXT_PUBLIC_GA_ID`       | optional | Google Analytics measurement ID                  |
| `MAINTENANCE_MODE`        | optional | `true` redirects all traffic to `/maintenance`   |

---

## Scripts

### Frontend (`cd frontend-new`)

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Dev server on :3000                        |
| `npm run build`        | Production build (standalone)              |
| `npm run lint`         | ESLint                                     |
| `npm run typecheck`    | `tsc --noEmit`                             |
| `npm test`             | Vitest                                     |
| `npm run test:coverage`| Vitest + V8 coverage                       |
| `npm run db:push`      | Push Prisma schema to Postgres             |

### Backend (`cd backend`)

| Command                                            | Description                  |
| -------------------------------------------------- | ---------------------------- |
| `uvicorn app.main:app --reload --port 8000`        | Dev server                   |
| `pytest`                                           | Test suite                   |
| `ruff check app/`                                  | Lint                         |

---

## Brand: TANGISON

This site is a TANGISON news outlet. The brand system is applied via
`frontend-new/src/app/globals.css`:

- **Colors**: Warm White `#FAFAF8`, Atlantic Black `#111315`, Rust Signal
  `#C56A4A`, Signal Teal `#2CB5B4`, Deep Ocean `#16353D`.
- **Typography**: Cabinet Grotesk (display), Satoshi (body), JetBrains Mono
  (technical) — loaded via Fontshare + Google Fonts.
- **Voice**: Clear before clever. Direct before diplomatic. Confident without
  arrogance.
- **Tagline**: "Applied AI. Built in Africa."

---

## Convex setup

The site uses [Convex](https://convex.dev) as its preferred data backend
(real-time reactive queries, end-to-end TypeScript). When
`NEXT_PUBLIC_CONVEX_URL` is not set, the site falls back to FastAPI + Postgres.

### One-time provisioning (free, ~2 minutes)

```bash
cd frontend-new
npx convex dev
```

This will:
1. Open your browser → sign in at **app.convex.dev** with GitHub (free, no credit card)
2. Create a new Convex deployment
3. Generate `convex/_generated/*` with full TypeScript types (overwrites the stubs)
4. Push `convex/schema.ts` (26 tables) to your new deployment
5. Print a URL like `https://happy-anon-123.convex.cloud`

### Configure env vars

Add the following to your `.env.local` (and to Vercel env vars for production):

```bash
NEXT_PUBLIC_CONVEX_URL=https://happy-anon-123.convex.cloud
CONVEX_ADMIN_TOKEN=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
```

The `CONVEX_ADMIN_TOKEN` is used by the data-agent scraper to authenticate
ingestion mutations (`ingestArticle`, `ingestJob`, `ingestTender`, etc.) in
`convex/mutationsAdmin.ts`.

### Redeploy

After adding the env vars, redeploy:
```bash
vercel --prod
```

All data-layer calls will now route to Convex automatically.

### Convex schema

26 tables ported from the original Prisma schema:
`user`, `category`, `tag`, `articleTag`, `article`, `media`, `articleMedia`,
`articleRevision`, `comment`, `bookmark`, `articleView`, `rssFeed`, `rssItem`,
`job`, `tender`, `tenderSummary`, `tenderKeyDate`, `tenderCompliance`,
`wireSubmission`, `newsletterSubscriber`, `marketDatum`, `tickerItem`,
`faqItem`, `page`, `advert`, `siteConfig`.

See `frontend-new/convex/schema.ts` for the full schema with indexes.

---

## License

© TANGISON. All rights reserved.

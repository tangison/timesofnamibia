# Times of Namibia

**Namibia's digital broadsheet — unbiased news, global reach.**
Published by [TANGISON](https://tangison.com).

Live site: <https://ton.tangison.com/>

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config in `src/app/globals.css`) |
| UI primitives | shadcn/ui (Radix UI) |
| Database | Prisma + PostgreSQL (Vercel Postgres / external) — primary |
| Legacy DB | Convex (fallback, currently disabled on free plan) |
| Static data | `src/data/namibia.ts` — 186 curated Namibian topics (Wikipedia CC-BY-SA 4.0) |
| AI providers | OpenRouter (free router) with Groq fallback |
| Maps | Leaflet + OpenStreetMap tiles |
| Animations | Framer Motion (Premium archetype: cubic-bezier(0.4,0,0.2,1)) |
| Deployment | Vercel (Hobby tier) |
| Fonts | UnifrakturMaguntia (wordmark), Merriweather (headlines), Lato (body), JetBrains Mono (metadata) |

## Brand palette

| Token | Value | Use |
|---|---|---|
| `--color-ton-cream` | `#FAFAF8` | Primary background |
| `--color-ton-black` | `#111315` | Primary text / dark sections |
| `--color-ton-red` | `#9A3F18` | Primary accent, CTAs (WCAG 2 AA on cream & white) |
| `--color-ton-teal` | `#2CB5B4` | Secondary accent |
| `--color-ton-ocean` | `#16353D` | Deep dark accents |

## Project layout

```
src/
├─ app/                    # Next.js App Router pages
│  ├─ article/[slug]/      # Article detail page
│  ├─ section/[slug]/      # Category landing pages
│  ├─ know-namibia/        # Static directory (186 topics, SSG)
│  ├─ africa/, world/      # Continental desks
│  ├─ jobs/, tender/       # Namibian job & tender listings
│  ├─ about/, contact/     # Static pages
│  ├─ cultural-groups/     # 11 ethnic group pages
│  ├─ history-of-namibia/  # Long-form history
│  ├─ games/               # Sudoku + Wordle
│  └─ api/                 # Route handlers
├─ components/
│  ├─ ton/                 # Times of Namibia components
│  └─ ui/                  # shadcn/ui primitives
├─ data/
│  └─ namibia.ts           # 186 static topics (Wikipedia-sourced)
├─ lib/
│  ├─ data.ts              # 3-tier data layer (Prisma → Convex → FastAPI)
│  ├─ dataPrisma.ts        # Prisma/Postgres data layer (primary)
│  ├─ directoryData.ts     # Directory data (static-first)
│  └─ convex.ts            # Convex client (legacy fallback)
└─ convex/                 # Convex backend (schema, mutations, queries)
```

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # production build (standalone output)
```

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production canonical URL (https://ton.tangison.com) |
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL (legacy fallback) |
| `OPENROUTER_API_KEY` | AI article rewriting |
| `GROQ_API_KEY` | Fallback AI provider |
| `TAVILY_API_KEY` | Web search fallback |

## Audit

This project uses the Universal Audit skill. Run:
```bash
npx tsc --noEmit          # type check
npx eslint .              # lint
npm audit                 # dependencies
npx lighthouse <url>      # SEO/perf/a11y
npx @axe-core/cli <url>   # accessibility
```

## License

© TANGISON. All rights reserved.

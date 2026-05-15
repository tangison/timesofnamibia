# NamibiaTimes Backend (Rebuilt)

Fresh backend for:
- News
- Jobs
- Tenders
- Internships

Stack:
- FastAPI
- PostgreSQL (SQLAlchemy)
- Scrapy spiders
- AI enrichment agents (summary, classify, dedup, relevance)

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Main endpoints

- `GET /api/v1/articles`
- `GET /api/v1/jobs`
- `GET /api/v1/tenders`
- `GET /api/v1/internships`
- `POST /api/v1/ingest/items` (raw scraped payloads)
- `POST /api/v1/ingest/run-scrapers`
- `GET /api/v1/stats`
- `GET /health`

## Scraping

Scrapy spiders live in `app/scraper/spiders/`:
- `news_spider.py`
- `jobs_spider.py`
- `tenders_spider.py`
- `internships_spider.py`

Run manually:

```bash
cd backend
python -m app.scraper.runner
```

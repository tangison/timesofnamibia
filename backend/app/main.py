from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.content import router as content_router
from app.api.ingest import router as ingest_router
from app.api.market import router as market_router
from app.api.stats import router as stats_router
from app.core.config import settings
from app.db.init_db import init_db


app = FastAPI(title=settings.app_name, version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content_router, prefix=settings.api_v1_prefix)
app.include_router(ingest_router, prefix=settings.api_v1_prefix)
app.include_router(market_router, prefix=settings.api_v1_prefix)
app.include_router(stats_router, prefix=settings.api_v1_prefix)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"service": settings.app_name, "version": "2.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}

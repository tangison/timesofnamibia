import os
import subprocess

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.schemas import IngestPayload, SourceItemOut
from app.services.repository import SourceItemRepository

router = APIRouter(tags=["ingest"])


@router.post("/ingest/items", response_model=list[SourceItemOut])
def ingest_items(
    payload: IngestPayload,
    db: Session = Depends(get_db),
    x_internal_secret: str | None = Header(default=None),
):
    if x_internal_secret != settings.internal_api_secret:
        raise HTTPException(status_code=401, detail="Invalid internal secret")

    repo = SourceItemRepository(db)
    return [repo.ingest(item) for item in payload.items]


@router.post("/ingest/run-scrapers")
def run_scrapers(x_internal_secret: str | None = Header(default=None)):
    if x_internal_secret != settings.internal_api_secret:
        raise HTTPException(status_code=401, detail="Invalid internal secret")
    here = os.path.dirname(os.path.dirname(__file__))
    runner = os.path.join(here, "scraper", "runner.py")
    subprocess.Popen(["python", runner], cwd=os.path.dirname(os.path.dirname(here)))
    return {"status": "started"}

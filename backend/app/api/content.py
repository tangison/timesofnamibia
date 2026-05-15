from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ItemType
from app.models.schemas import SourceItemOut
from app.services.repository import SourceItemRepository

router = APIRouter(tags=["content"])


@router.get("/articles", response_model=list[SourceItemOut])
def articles(
    limit: int = Query(50, ge=1, le=200),
    section: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return SourceItemRepository(db).list_by_type(ItemType.news, limit=limit, section=section)


@router.get("/jobs", response_model=list[SourceItemOut])
def jobs(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    return SourceItemRepository(db).list_by_type(ItemType.job, limit=limit)


@router.get("/tenders", response_model=list[SourceItemOut])
def tenders(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    return SourceItemRepository(db).list_by_type(ItemType.tender, limit=limit)


@router.get("/internships", response_model=list[SourceItemOut])
def internships(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    return SourceItemRepository(db).list_by_type(ItemType.internship, limit=limit)

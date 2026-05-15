from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.schemas import StatsOut
from app.services.repository import SourceItemRepository

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    return SourceItemRepository(db).stats()

from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class ItemType(str, Enum):
    news = "news"
    job = "job"
    tender = "tender"
    internship = "internship"


class SourceItem(Base):
    __tablename__ = "source_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_type: Mapped[ItemType] = mapped_column(SAEnum(ItemType), index=True)
    title: Mapped[str] = mapped_column(String(500), index=True)
    source_name: Mapped[str] = mapped_column(String(255), index=True)
    source_url: Mapped[str] = mapped_column(String(2048), unique=True, index=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    tags: Mapped[str | None] = mapped_column(String(500), nullable=True)
    relevance_score: Mapped[float] = mapped_column(Float, default=0.0)
    dedup_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    closing_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    amount_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def section(self) -> str:
        blob = " ".join(
            [
                (self.title or ""),
                (self.category or ""),
                (self.tags or ""),
                (self.source_url or ""),
            ]
        ).lower()
        if any(k in blob for k in ("politic", "cabinet", "parliament", "election", "minister")):
            return "politics"
        if any(k in blob for k in ("economy", "finance", "bank", "inflation", "fiscal")):
            return "economy"
        if any(k in blob for k in ("mine", "uranium", "diamond", "lithium", "rossing")):
            return "mining"
        if any(k in blob for k in ("energy", "power", "electric", "solar", "hydrogen")):
            return "energy"
        if any(k in blob for k in ("africa", "sadc", "au ", "african")):
            return "africa"
        if any(k in blob for k in ("world", "global", "international", "united nations", "un ")):
            return "world"
        if any(k in blob for k in ("sport", "football", "rugby", "cricket", "athletics")):
            return "sport"
        if any(k in blob for k in ("tender", "bid", "rfq", "procurement")):
            return "tenders"
        if any(k in blob for k in ("job", "vacancy", "hiring", "position", "employment")):
            return "jobs"
        if any(k in blob for k in ("environment", "climate", "wildlife", "conservation")):
            return "environment"
        return "national"

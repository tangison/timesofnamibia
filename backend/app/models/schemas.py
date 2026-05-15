from datetime import datetime
from typing import Literal

from pydantic import BaseModel, HttpUrl


ItemTypeLiteral = Literal["news", "job", "tender", "internship"]


class SourceItemIn(BaseModel):
    item_type: ItemTypeLiteral
    title: str
    source_name: str
    source_url: HttpUrl
    region: str | None = None
    organization: str | None = None
    content: str | None = None
    published_at: datetime | None = None
    closing_date: datetime | None = None
    amount_text: str | None = None


class SourceItemOut(BaseModel):
    id: int
    item_type: ItemTypeLiteral
    title: str
    source_name: str
    source_url: str
    region: str | None
    organization: str | None
    summary: str | None
    category: str | None
    tags: str | None
    relevance_score: float
    published_at: datetime | None
    closing_date: datetime | None
    amount_text: str | None
    section: str
    created_at: datetime

    class Config:
        from_attributes = True


class IngestPayload(BaseModel):
    items: list[SourceItemIn]


class StatsOut(BaseModel):
    news: int
    jobs: int
    tenders: int
    internships: int
    total: int

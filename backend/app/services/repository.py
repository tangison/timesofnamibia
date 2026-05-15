from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models.entities import ItemType, SourceItem
from app.models.schemas import SourceItemIn
from app.services.pipeline import EnrichmentPipeline


class SourceItemRepository:
    def __init__(self, db: Session):
        self.db = db
        self.pipeline = EnrichmentPipeline()

    def ingest(self, item: SourceItemIn) -> SourceItem:
        enriched = self.pipeline.run(item)
        existing = self.db.scalar(select(SourceItem).where(SourceItem.source_url == str(item.source_url)))
        if existing:
            return existing

        row = SourceItem(
            item_type=ItemType(item.item_type),
            title=item.title,
            source_name=item.source_name,
            source_url=str(item.source_url),
            region=item.region,
            organization=item.organization,
            content=item.content,
            summary=enriched.summary,
            category=enriched.category,
            tags=enriched.tags,
            relevance_score=enriched.relevance_score,
            dedup_hash=enriched.dedup_hash,
            published_at=item.published_at,
            closing_date=item.closing_date,
            amount_text=item.amount_text,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_by_type(self, item_type: ItemType, limit: int = 50, section: str | None = None) -> list[SourceItem]:
        stmt = (
            select(SourceItem)
            .where(SourceItem.item_type == item_type, SourceItem.is_active.is_(True))
            .order_by(desc(SourceItem.published_at), desc(SourceItem.created_at))
            .limit(limit)
        )
        rows = list(self.db.scalars(stmt).all())
        if section:
            section = section.strip().lower()
            rows = [r for r in rows if r.section == section]
        return rows

    def stats(self) -> dict[str, int]:
        def count(kind: ItemType) -> int:
            stmt = select(SourceItem).where(SourceItem.item_type == kind, SourceItem.is_active.is_(True))
            return len(list(self.db.scalars(stmt).all()))

        news = count(ItemType.news)
        jobs = count(ItemType.job)
        tenders = count(ItemType.tender)
        internships = count(ItemType.internship)
        return {
            "news": news,
            "jobs": jobs,
            "tenders": tenders,
            "internships": internships,
            "total": news + jobs + tenders + internships,
        }

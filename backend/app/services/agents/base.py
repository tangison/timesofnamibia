from dataclasses import dataclass

from app.models.schemas import SourceItemIn


@dataclass
class AgentContext:
    item: SourceItemIn
    summary: str | None = None
    category: str | None = None
    tags: str | None = None
    relevance_score: float = 0.0
    dedup_hash: str | None = None

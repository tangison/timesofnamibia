from app.models.schemas import SourceItemIn
from app.services.agents.base import AgentContext
from app.services.agents.classifier import ClassifierAgent
from app.services.agents.deduper import DeduperAgent
from app.services.agents.relevance import RelevanceAgent
from app.services.agents.summarizer import SummarizerAgent


class EnrichmentPipeline:
    def __init__(self):
        self.summarizer = SummarizerAgent()
        self.classifier = ClassifierAgent()
        self.deduper = DeduperAgent()
        self.relevance = RelevanceAgent()

    def run(self, item: SourceItemIn) -> AgentContext:
        ctx = AgentContext(item=item)
        ctx = self.summarizer.run(ctx)
        ctx = self.classifier.run(ctx)
        ctx = self.deduper.run(ctx)
        ctx = self.relevance.run(ctx)
        return ctx

import hashlib

from app.services.agents.base import AgentContext


class DeduperAgent:
    def run(self, ctx: AgentContext) -> AgentContext:
        fingerprint = f"{ctx.item.title.strip().lower()}|{str(ctx.item.source_url)}"
        ctx.dedup_hash = hashlib.sha256(fingerprint.encode("utf-8")).hexdigest()
        return ctx

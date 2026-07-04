from app.services.agents.base import AgentContext


class RelevanceAgent:
    def run(self, ctx: AgentContext) -> AgentContext:
        score = 0.2
        text = ((ctx.item.title or "") + " " + (ctx.item.content or "")).lower()
        if "namibia" in text:
            score += 0.3
        if ctx.item.item_type in {"job", "tender", "internship"}:
            score += 0.3
        if ctx.item.region:
            score += 0.2
        ctx.relevance_score = min(score, 1.0)
        return ctx

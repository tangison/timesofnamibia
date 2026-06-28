from app.services.agents.base import AgentContext
from app.services.llm_groq import GroqClient


class SummarizerAgent:
    def __init__(self):
        self.groq = GroqClient()

    def run(self, ctx: AgentContext) -> AgentContext:
        if self.groq.available() and (ctx.item.content or ctx.item.title):
            try:
                result = self.groq.chat_json(
                    system="You summarize scraped public information for a Namibia news platform.",
                    user=(
                        "Return JSON with key 'summary'. Max 2 sentences, factual only.\n\n"
                        f"Title: {ctx.item.title}\n"
                        f"Content: {ctx.item.content or ''}"
                    ),
                )
                summary = (result.get("summary") or "").strip()
                if summary:
                    ctx.summary = summary[:500]
                    return ctx
            except Exception:
                pass

        if ctx.item.content:
            text = ctx.item.content.strip().replace("\n", " ")
            ctx.summary = text[:280]
        else:
            ctx.summary = ctx.item.title
        return ctx

from app.services.agents.base import AgentContext
from app.services.llm_groq import GroqClient


class ClassifierAgent:
    def __init__(self):
        self.groq = GroqClient()

    def run(self, ctx: AgentContext) -> AgentContext:
        if self.groq.available():
            try:
                result = self.groq.chat_json(
                    system=(
                        "You classify scraped Namibia-focused content. "
                        "Output JSON: category, tags (array of max 5 short tags)."
                    ),
                    user=(
                        "Use one category from: news, employment, procurement, internship.\n\n"
                        f"Item type: {ctx.item.item_type}\n"
                        f"Title: {ctx.item.title}\n"
                        f"Content: {ctx.item.content or ''}\n"
                        f"Region: {ctx.item.region or ''}"
                    ),
                )
                category = (result.get("category") or "").strip().lower()
                tags = result.get("tags") or []
                if isinstance(tags, list):
                    tags = [str(t).strip().lower() for t in tags if str(t).strip()]
                else:
                    tags = []
                if category in {"news", "employment", "procurement", "internship"}:
                    ctx.category = category
                    tag_set = sorted(set(tags + [(ctx.item.region or "namibia").lower()]))
                    ctx.tags = ",".join(tag_set[:8])
                    return ctx
            except Exception:
                pass

        t = (ctx.item.title + " " + (ctx.item.content or "")).lower()
        if ctx.item.item_type == "tender" or "tender" in t or "rfq" in t:
            ctx.category = "procurement"
        elif ctx.item.item_type == "internship" or "internship" in t:
            ctx.category = "internship"
        elif ctx.item.item_type == "job" or "vacancy" in t or "hiring" in t:
            ctx.category = "employment"
        else:
            ctx.category = "news"
        ctx.tags = ",".join(sorted(set((ctx.category + "," + (ctx.item.region or "namibia")).split(","))))
        return ctx

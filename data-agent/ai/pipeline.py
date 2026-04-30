# ============================================================
# Times of Namibia — AI Pipeline
# Batch AI analysis with Gemini for scoring and summarisation
# ============================================================

import json
import yaml
from pathlib import Path
from ai.client import generate


def analyse_batch(items: list[dict], context: str = "", preference_prompt: str = "") -> list[dict]:
    """
    Analyse items in batches using Gemini.
    Returns items enriched with AI fields: ai_score, ai_summary, ai_notes.
    """
    config_path = Path(__file__).parent.parent / "config.yaml"
    config = yaml.safe_load(config_path.read_text())
    ai_config = config.get("ai", {})

    model = ai_config.get("model", "gemini-2.5-flash")
    rate_limit = ai_config.get("rate_limit_seconds", 7.0)
    min_score = ai_config.get("min_score", 0)
    batch_size = ai_config.get("batch_size", 5)

    batches = [items[i:i + batch_size] for i in range(0, len(items), batch_size)]
    print(f"  [AI] {len(items)} items -> {len(batches)} API calls (batch size {batch_size})")

    enriched = []
    for i, batch in enumerate(batches):
        print(f"  [AI] Batch {i + 1}/{len(batches)}...")
        prompt = _build_prompt(batch, context, preference_prompt, config)
        result = generate(prompt, model=model, rate_limit=rate_limit)

        analyses = result.get("analyses", [])
        for j, item in enumerate(batch):
            ai = analyses[j] if j < len(analyses) else {}
            if ai:
                score = max(0, min(100, int(ai.get("score", 0))))
                if min_score and score < min_score:
                    continue
                enriched.append({
                    **item,
                    "ai_score": score,
                    "ai_summary": ai.get("summary", ""),
                    "ai_notes": ai.get("notes", ""),
                })
            else:
                enriched.append(item)

    return enriched


def _build_prompt(batch, context, preference_prompt, config):
    """Build the Gemini prompt for a batch of items."""
    priorities = config.get("priorities", [])
    items_text = "\n\n".join(
        f"Item {i+1}: {json.dumps({k: v for k, v in item.items() if not k.startswith('_') and k != 'content'}, default=str)}"
        for i, item in enumerate(batch)
    )

    return f"""Analyse these {len(batch)} items for the Times of Namibia news portal.

# Items
{items_text}

# Editorial Context
{context[:800] if context else "Times of Namibia is a digital-first news portal serving Namibia's 2.6 million citizens with authoritative, efficient, and uniquely Namibian information."}

# Editorial Priorities
{chr(10).join(f"- {p}" for p in priorities)}

{preference_prompt}

# Instructions
Return: {{"analyses": [{{"score": <0-100>, "summary": "<2 sentences>", "notes": "<why this matches or doesn't match Namibian audience>"}} for each item in order]}}
Be concise. Score 90+=excellent match for Namibian audience, 70-89=good, 50-69=ok, <50=weak match.
Consider: direct impact on Namibians, government policy, economic developments, regional relevance."""

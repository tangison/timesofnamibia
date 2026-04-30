# ============================================================
# Times of Namibia — AI Pipeline
# Batch AI analysis with Gemini for scoring and summarisation
# Brand-aware: Stoic Observer voice, //Kharas spelling, JetBrains Mono
# ============================================================

import json
import yaml
from pathlib import Path
from ai.client import generate


def analyse_batch(items: list[dict], context: str = "", preference_prompt: str = "") -> list[dict]:
    """
    Analyse items in batches using Gemini.
    Returns items enriched with AI fields: ai_score, ai_summary, ai_notes, ton_category, urgency.
    """
    config_path = Path(__file__).parent.parent / "config.yaml"
    config = yaml.safe_load(config_path.read_text())
    ai_config = config.get("ai", {})

    model = ai_config.get("model", "gemini-2.5-flash")
    rate_limit = ai_config.get("rate_limit_seconds", 7.0)
    min_score = ai_config.get("min_score", 60)
    batch_size = ai_config.get("batch_size", 4)

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

                # Apply category boosts
                ton_category = ai.get("ton_category", item.get("section", "national"))
                category_boosts = ai_config.get("category_boosts", {})
                boost = category_boosts.get(ton_category, 0)
                score = min(100, score + boost)

                if min_score and score < min_score:
                    continue

                enriched.append({
                    **item,
                    "ai_score": score,
                    "ai_summary": ai.get("summary", ""),
                    "ai_notes": ai.get("notes", ""),
                    "ton_category": ton_category,
                    "urgency": ai.get("urgency", "low"),
                })
            else:
                enriched.append(item)

    return enriched


def _build_prompt(batch, context, preference_prompt, config):
    """Build the Gemini prompt for a batch of items — TON brand-aware."""
    priorities = config.get("priorities", [])
    prompt_suffix = config.get("ai", {}).get("prompt_suffix", "")

    items_text = "\n\n".join(
        f"Item {i+1}: {json.dumps({k: v for k, v in item.items() if not k.startswith('_') and k != 'content'}, default=str)}"
        for i, item in enumerate(batch)
    )

    return f"""Analyse these {len(batch)} items for Times of Namibia.

# Items
{items_text}

# Editorial Guidelines (Broadsheet Digital)
- Voice: Stoic Observer. Intellectual, precise, Namibian-rooted.
- No emojis unless functional ([LIVE], ->).
- Geography: Spell //Kharas with click character. Oshana not Oshanaa.
- Typography: Playfair Display for headlines, Inter for UI, JetBrains Mono for data.
- Visuals: Grayscale by default, color on hover. Sharp corners only.
- Palette: Cream (#F9F8F6), Black (#111111), Red (#CB102E for urgency only).

# User Context
{context[:800] if context else "Times of Namibia is a digital-first news portal serving Namibia's 2.6 million citizens with authoritative, efficient, and uniquely Namibian information."}

# Editorial Priorities
{chr(10).join(f"- {p}" for p in priorities)}

{preference_prompt}

{prompt_suffix}

# Instructions
Return: {{"analyses": [{{"score": <0-100>, "summary": "<2 sentences, Playfair-ready>", "notes": "<why this matches TON editorial standards>", "ton_category": "<suggested category: national|economy|mining|energy|politics|africa|world|sport|infrastructure|environment|technology|opinion>", "urgency": "<low|medium|high|breaking>"}} for each item in order]}}

Scoring: 90+ = front-page worthy • 70-89 = section lead • 50-69 = filler • <50 = reject"""

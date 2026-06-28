# ============================================================
# Times of Namibia — Feedback Learning System
# Learns from editorial decisions to improve future scoring
# ============================================================

import json
from pathlib import Path

FEEDBACK_PATH = Path(__file__).parent.parent / "data" / "feedback.json"


def load_feedback() -> dict:
    """Load feedback history from file."""
    if FEEDBACK_PATH.exists():
        try:
            return json.loads(FEEDBACK_PATH.read_text())
        except (json.JSONDecodeError, OSError):
            pass
    return {"positive": [], "negative": []}


def save_feedback(fb: dict):
    """Save feedback history to file."""
    FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
    FEEDBACK_PATH.write_text(json.dumps(fb, indent=2))


def build_preference_prompt(feedback: dict, max_examples: int = 15) -> str:
    """Convert feedback history into a prompt bias section for AI scoring."""
    lines = []
    if feedback.get("positive"):
        lines.append("# Items the editorial team FEATURED (positive signal):")
        for e in feedback["positive"][-max_examples:]:
            lines.append(f"- {e}")
    if feedback.get("negative"):
        lines.append("\n# Items the editorial team SKIPPED/DELETED (negative signal):")
        for e in feedback["negative"][-max_examples:]:
            lines.append(f"- {e}")
    if lines:
        lines.append("\nUse these patterns to bias scoring on new items.")
    return "\n".join(lines)


def record_decision(item_title: str, decision: str):
    """
    Record an editorial decision for an item.
    decision: "positive" (featured/published) or "negative" (deleted/skipped)
    """
    fb = load_feedback()
    if decision == "positive":
        if "positive" not in fb:
            fb["positive"] = []
        fb["positive"].append(item_title[:100])
        # Keep only last 50
        fb["positive"] = fb["positive"][-50:]
    elif decision == "negative":
        if "negative" not in fb:
            fb["negative"] = []
        fb["negative"].append(item_title[:100])
        fb["negative"] = fb["negative"][-50:]
    save_feedback(fb)

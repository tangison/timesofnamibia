#!/usr/bin/env python3
# ============================================================
# Times of Namibia — Data Scraper Agent Orchestrator
# Scrape → Enrich → Store pipeline
# ============================================================

import os
import sys
import yaml
import json
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Import sources
from scraper.sources.rss_generic import fetch_all_ton_feeds
from scraper.sources.parliament import fetch as fetch_parliament
from scraper.sources.tenders import fetch as fetch_tenders
from scraper.sources.jobs import fetch as fetch_jobs
from scraper.sources.legal import fetch as fetch_legal
from scraper.sources.government import fetch as fetch_government
from scraper.sources.markets import fetch as fetch_markets
from scraper.sources.sports import fetch as fetch_sports
from scraper.sources.culture import fetch as fetch_culture
from scraper.sources.environment import fetch as fetch_environment

# Import storage
from storage.sqlite_sync import sync

# Import AI
from ai.memory import load_feedback, build_preference_prompt


def ai_enabled() -> bool:
    """Check if AI enrichment is available."""
    return bool(os.environ.get("GEMINI_API_KEY"))


def load_config() -> dict:
    """Load the main configuration."""
    config_path = Path(__file__).parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


# ── SOURCE REGISTRY ───────────────────────────────────────────

SOURCES = [
    ("RSS Feeds", fetch_all_ton_feeds),
    ("Parliament of Namibia", fetch_parliament),
    ("Government Portals", fetch_government),
    ("Legal Desk", fetch_legal),
    ("Tenders Live", fetch_tenders),
    ("Job Scraper", fetch_jobs),
    ("Market Data", fetch_markets),
    ("Sports", fetch_sports),
    ("Culture & Education", fetch_culture),
    ("Environment", fetch_environment),
]


def main():
    """Main orchestrator: collect → enrich → store."""
    start_time = datetime.now(timezone.utc)
    print("=" * 60)
    print(f"TIMES OF NAMIBIA — Data Scraper Agent")
    print(f"Started: {start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print("=" * 60)

    config = load_config()

    # ── PHASE 1: COLLECT ───────────────────────────────────────
    print("\n📥 PHASE 1: COLLECTING DATA")
    print("-" * 40)
    all_items = []

    for name, fetch_fn in SOURCES:
        try:
            print(f"\n  [{name}] Fetching...")
            items = fetch_fn()
            print(f"  [{name}] {len(items)} items collected")
            all_items.extend(items)
        except Exception as e:
            print(f"  [{name}] FAILED: {e}")

    # ── DEDUPLICATE ────────────────────────────────────────────
    print(f"\n📊 Total raw items: {len(all_items)}")
    seen_urls = set()
    deduped = []
    for item in all_items:
        url = item.get("url", "")
        guid = item.get("guid", "")
        key = guid or url
        if key and key not in seen_urls:
            seen_urls.add(key)
            deduped.append(item)
    print(f"📊 Unique items after dedup: {len(deduped)}")

    # ── CATEGORISE BY TYPE ─────────────────────────────────────
    articles = [i for i in deduped if i.get("item_type") == "article"]
    tenders = [i for i in deduped if i.get("item_type") == "tender"]
    jobs = [i for i in deduped if i.get("item_type") == "job"]
    markets = [i for i in deduped if i.get("item_type") == "market"]
    print(f"  Articles: {len(articles)}")
    print(f"  Tenders:  {len(tenders)}")
    print(f"  Jobs:     {len(jobs)}")
    print(f"  Markets:  {len(markets)}")

    # ── PHASE 2: ENRICH ────────────────────────────────────────
    print("\n🧠 PHASE 2: AI ENRICHMENT")
    print("-" * 40)

    enriched_items = deduped
    if ai_enabled() and articles:
        try:
            from ai.pipeline import analyse_batch

            feedback = load_feedback()
            preference = build_preference_prompt(feedback)

            context_path = Path(__file__).parent.parent / "profile" / "context.md"
            context = context_path.read_text() if context_path.exists() else ""

            print(f"  Enriching {len(articles)} articles with Gemini AI...")
            enriched_articles = analyse_batch(articles, context=context, preference_prompt=preference)

            # Replace articles in the deduped list
            enriched_items = []
            for item in deduped:
                if item.get("item_type") == "article":
                    # Find matching enriched article
                    matched = next((e for e in enriched_articles if e.get("guid") == item.get("guid")), item)
                    enriched_items.append(matched)
                else:
                    enriched_items.append(item)

            ai_scored = [i for i in enriched_items if i.get("ai_score") is not None]
            print(f"  AI scored {len(ai_scored)} articles")
            if ai_scored:
                avg_score = sum(i["ai_score"] for i in ai_scored) / len(ai_scored)
                print(f"  Average AI score: {avg_score:.1f}")
        except Exception as e:
            print(f"  [AI] Enrichment failed: {e}")
            print(f"  [AI] Continuing without AI enrichment...")
    else:
        if not ai_enabled():
            print("  [AI] Skipped — GEMINI_API_KEY not set")
        else:
            print("  [AI] Skipped — no articles to enrich")

    # ── PHASE 3: STORE ─────────────────────────────────────────
    print("\n💾 PHASE 3: STORING DATA")
    print("-" * 40)

    db_path = config.get("storage", {}).get("db_path", "../db/custom.db")
    # Resolve relative path
    db_path_resolved = (Path(__file__).parent.parent / db_path).resolve()

    summary = sync(enriched_items, db_path=str(db_path_resolved))

    for item_type, counts in summary.items():
        if "added" in counts:
            print(f"  {item_type.title()}: {counts['added']} added, {counts['skipped']} skipped")
        elif "updated" in counts:
            print(f"  {item_type.title()}: {counts['updated']} updated, {counts['skipped']} skipped")

    # ── SUMMARY ────────────────────────────────────────────────
    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()

    print("\n" + "=" * 60)
    print(f"SCRAPING COMPLETE")
    print(f"Duration: {duration:.1f}s")
    print(f"Sources: {len(SOURCES)}")
    print(f"Items collected: {len(all_items)}")
    print(f"Items after dedup: {len(deduped)}")
    print(f"Database summary: {json.dumps(summary)}")
    print(f"Completed: {end_time.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print("=" * 60)

    # Write run log
    run_log = {
        "timestamp": end_time.isoformat(),
        "duration_seconds": duration,
        "sources_count": len(SOURCES),
        "items_collected": len(all_items),
        "items_deduped": len(deduped),
        "ai_enabled": ai_enabled(),
        "summary": summary,
    }
    log_path = Path(__file__).parent.parent / "data" / "last_run.json"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log_path.write_text(json.dumps(run_log, indent=2))


if __name__ == "__main__":
    main()

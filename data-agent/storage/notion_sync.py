# ============================================================
# Times of Namibia — Notion Storage Sync
# Push scraped items to Notion database for editorial review
# ============================================================

import os
from datetime import datetime, timezone
from typing import Optional

try:
    from notion_client import Client
    from notion_client.errors import APIResponseError
    HAS_NOTION = True
except ImportError:
    HAS_NOTION = False

_client = None


def get_client():
    """Get or create Notion client."""
    global _client
    if _client is None and HAS_NOTION:
        token = os.environ.get("NOTION_TOKEN", "")
        if token:
            _client = Client(auth=token)
    return _client


def get_existing_urls(db_id: str) -> set:
    """Fetch all URLs already stored — used for deduplication."""
    client = get_client()
    if not client:
        return set()

    seen, cursor = set(), None
    while True:
        resp = client.databases.query(
            database_id=db_id,
            page_size=100,
            **({"start_cursor": cursor} if cursor else {}),
        )
        for page in resp["results"]:
            url = page["properties"].get("URL", {}).get("url", "")
            if url:
                seen.add(url)
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
    return seen


def push_item(db_id: str, item: dict) -> bool:
    """Push one item to Notion with TON property mapping."""
    client = get_client()
    if not client:
        return False

    props = {
        "Headline": {"title": [{"text": {"content": item.get("name", "")[:100]}}]},
        "URL": {"url": item.get("url")},
        "Source": {"select": {"name": item.get("source", "Unknown")}},
        "Category": {"select": {"name": item.get("ton_category", item.get("section", "Uncategorized"))}},
        "Date Found": {"date": {"start": item.get("date_found")}},
        "Urgency": {"select": {"name": item.get("urgency", "low")}},
        "Status": {"select": {"name": "New"}},
    }

    # AI enrichment fields (JetBrains Mono for data)
    if item.get("ai_score") is not None:
        props["Relevance Score"] = {"number": item["ai_score"]}
    if item.get("ai_summary"):
        props["Editorial Summary"] = {"rich_text": [{"text": {"content": item["ai_summary"][:500]}}]}
    if item.get("ai_notes"):
        props["Scraper Notes"] = {"rich_text": [{"text": {"content": item["ai_notes"][:500]}}]}

    # Times OS timestamp convention (CAT timezone +02:00)
    props["Scraped At"] = {
        "rich_text": [
            {"text": {"content": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+02:00")}}
        ]
    }

    try:
        client.pages.create(parent={"database_id": db_id}, properties=props)
        return True
    except APIResponseError as e:
        print(f"  [TON/Notion] Push failed: {e}")
        return False


def sync(db_id: str, items: list[dict]) -> tuple[int, int]:
    """
    Sync items to Notion database.
    Returns (added, skipped) counts.
    """
    if not HAS_NOTION:
        print("  [Notion] notion-client not installed, skipping")
        return 0, len(items)

    client = get_client()
    if not client:
        print("  [Notion] NOTION_TOKEN not set, skipping")
        return 0, len(items)

    existing = get_existing_urls(db_id)
    added = skipped = 0

    for item in items:
        url = item.get("url", "")
        if url in existing:
            skipped += 1
            continue

        if push_item(db_id, item):
            added += 1
            existing.add(url)
        else:
            skipped += 1

    return added, skipped

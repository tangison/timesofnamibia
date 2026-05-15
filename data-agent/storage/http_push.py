# ============================================================
# Times of Namibia — Scraper Integration: HTTP Push Mode
# Add this to data-agent/storage/ alongside sqlite_sync.py
#
# When BACKEND_URL is set, scraped items are POSTed to the
# FastAPI backend instead of (or in addition to) SQLite.
# ============================================================

from __future__ import annotations

import os
import json
import time
from typing import List

import requests

_BACKEND_URL = os.environ.get("BACKEND_URL", "").rstrip("/")
_SECRET = os.environ.get("INTERNAL_API_SECRET", "")
_TIMEOUT = 30  # seconds
_BATCH_SIZE = 100  # items per POST request


def push_to_backend(items: List[dict], source_name: str = "") -> dict:
    """
    Push scraped items to the FastAPI backend's /api/ingest endpoint.
    Falls back gracefully if the backend is unreachable.

    Returns: {"sent": int, "failed": int, "skipped": int}
    """
    if not _BACKEND_URL:
        return {"sent": 0, "failed": 0, "skipped": len(items)}

    endpoint = f"{_BACKEND_URL}/api/ingest"
    headers = {
        "Content-Type": "application/json",
        "X-Internal-Secret": _SECRET,
    }

    total_sent = 0
    total_failed = 0

    # Send in batches to avoid large payloads
    batches = [items[i:i + _BATCH_SIZE] for i in range(0, len(items), _BATCH_SIZE)]

    for batch_idx, batch in enumerate(batches):
        payload = {
            "items": _normalise_items(batch),
            "source_name": source_name,
            "run_pipeline": batch_idx == len(batches) - 1,  # trigger on last batch
        }

        try:
            response = requests.post(
                endpoint,
                data=json.dumps(payload, default=str),
                headers=headers,
                timeout=_TIMEOUT,
            )
            response.raise_for_status()
            result = response.json()
            total_sent += result.get("queued", len(batch))
            print(f"  [Push] Batch {batch_idx + 1}/{len(batches)}: "
                  f"{result.get('queued', '?')} queued, "
                  f"{result.get('skipped', '?')} skipped")
        except requests.exceptions.ConnectionError:
            print(f"  [Push] Backend unreachable at {endpoint} — falling back to SQLite")
            return {"sent": total_sent, "failed": len(items) - total_sent, "skipped": 0}
        except Exception as e:
            print(f"  [Push] Batch {batch_idx + 1} failed: {e}")
            total_failed += len(batch)

        # Small delay between batches
        if batch_idx < len(batches) - 1:
            time.sleep(0.5)

    return {"sent": total_sent, "failed": total_failed, "skipped": 0}


def _normalise_items(items: List[dict]) -> List[dict]:
    """
    Normalise scraped item dicts to match the IngestRequest schema.
    Maps data-agent field names to backend API field names.
    """
    normalised = []
    for item in items:
        n = {
            "title":          item.get("title") or item.get("headline") or "Untitled",
            "content":        item.get("content") or item.get("description") or "",
            "url":            item.get("url") or item.get("link"),
            "source":         item.get("source") or item.get("feed_name") or "",
            "category":       item.get("section") or item.get("category") or item.get("ton_category"),
            "published_date": _str_date(item.get("pub_date") or item.get("published_date")),
            "item_type":      item.get("item_type") or "article",
            "guid":           item.get("guid"),
            # Job fields
            "company":        item.get("company"),
            "location":       item.get("location"),
            "region":         item.get("region"),
            "salary":         item.get("salary"),
            "job_type":       item.get("type") or item.get("job_type"),
            # Tender fields
            "doc_id":         item.get("doc_id"),
            "department":     item.get("department"),
            "deadline":       _str_date(item.get("deadline")),
            "estimated_value": item.get("estimated_value"),
            "status":         item.get("status") or "open",
            # Market fields
            "pair":           item.get("pair"),
            "rate":           item.get("rate"),
            "change":         item.get("change"),
            "direction":      item.get("direction") or "flat",
        }
        # Strip None values to keep payload lean
        n = {k: v for k, v in n.items() if v is not None}
        normalised.append(n)
    return normalised


def _str_date(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        return value
    try:
        return value.isoformat()
    except Exception:
        return str(value)

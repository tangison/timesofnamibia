# ============================================================
# Times of Namibia — Scraper Integration: HTTP Push Mode (TANGISON)
# POSTs scraped items to FastAPI /api/v1/ingest/items.
# SECURITY: INTERNAL_API_SECRET required when BACKEND_URL is set.
# ============================================================

from __future__ import annotations

import os
import json
import time
from typing import List

import requests

_BACKEND_URL = os.environ.get("BACKEND_URL", "").rstrip("/")
_SECRET = os.environ.get("INTERNAL_API_SECRET", "")
_TIMEOUT = 30
_BATCH_SIZE = 100

_ITEM_TYPE_MAP = {
    "article": "news",
    "news": "news",
    "job": "job",
    "tender": "tender",
    "internship": "internship",
    "market": "news",
}


def push_to_backend(items: List[dict], source_name: str = "") -> dict:
    """Push scraped items to the FastAPI backend's /api/v1/ingest/items endpoint."""
    if not _BACKEND_URL:
        return {"sent": 0, "failed": 0, "skipped": len(items)}

    if not _SECRET:
        raise RuntimeError(
            "INTERNAL_API_SECRET env var is required when BACKEND_URL is set. "
            "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
        )

    endpoint = f"{_BACKEND_URL}/api/v1/ingest/items"
    headers = {
        "Content-Type": "application/json",
        "X-Internal-Secret": _SECRET,
    }

    total_sent = 0
    total_failed = 0
    batches = [items[i:i + _BATCH_SIZE] for i in range(0, len(items), _BATCH_SIZE)]

    for batch_idx, batch in enumerate(batches):
        payload = {"items": _normalise_items(batch)}
        try:
            response = requests.post(
                endpoint,
                data=json.dumps(payload, default=str),
                headers=headers,
                timeout=_TIMEOUT,
            )
            response.raise_for_status()
            result = response.json()
            sent_count = len(result) if isinstance(result, list) else 0
            total_sent += sent_count
            print(f"  [Push] Batch {batch_idx + 1}/{len(batches)}: {sent_count} items ingested")
        except requests.exceptions.ConnectionError:
            print(f"  [Push] Backend unreachable at {endpoint} — falling back to SQLite")
            return {"sent": total_sent, "failed": len(items) - total_sent, "skipped": 0}
        except requests.exceptions.HTTPError as e:
            print(f"  [Push] Batch {batch_idx + 1} HTTP error: {e}")
            print(f"  [Push] Response body: {response.text[:500]}")
            total_failed += len(batch)
        except Exception as e:
            print(f"  [Push] Batch {batch_idx + 1} failed: {e}")
            total_failed += len(batch)
        if batch_idx < len(batches) - 1:
            time.sleep(0.5)

    return {"sent": total_sent, "failed": total_failed, "skipped": 0}


def _normalise_items(items: List[dict]) -> List[dict]:
    """Normalise scraped item dicts to match the backend's SourceItemIn schema."""
    normalised = []
    for item in items:
        raw_type = item.get("item_type") or "article"
        backend_type = _ITEM_TYPE_MAP.get(raw_type, "news")
        url = item.get("url") or item.get("link") or item.get("source_url")
        if not url:
            continue
        source = (
            item.get("source")
            or item.get("source_name")
            or item.get("feed_name")
            or source_name
            or "data-agent"
        )
        n = {
            "item_type": backend_type,
            "title": item.get("title") or item.get("headline") or "Untitled",
            "source_name": source,
            "source_url": url,
            "content": item.get("content") or item.get("description") or "",
            "published_at": _str_date(item.get("pub_date") or item.get("published_date") or item.get("published_at")),
            "region": item.get("region") or item.get("location"),
            "organization": item.get("company") or item.get("organization") or item.get("department"),
            "closing_date": _str_date(item.get("deadline") or item.get("closing_date")),
            "amount_text": item.get("estimated_value") or item.get("salary") or item.get("amount_text"),
        }
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

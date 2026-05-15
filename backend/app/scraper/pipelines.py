import os
from datetime import datetime

import httpx


class BackendPushPipeline:
    def open_spider(self, spider):
        self.buffer = []
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
        self.secret = os.getenv("INTERNAL_API_SECRET", "change-me")

    def process_item(self, item, spider):
        normalized = dict(item)
        for key in ("published_at", "closing_date"):
            val = normalized.get(key)
            if isinstance(val, datetime):
                normalized[key] = val.isoformat()
        self.buffer.append(normalized)
        return item

    def close_spider(self, spider):
        if not self.buffer:
            return
        payload = {"items": self.buffer}
        try:
            with httpx.Client(timeout=60) as client:
                resp = client.post(
                    f"{self.backend_url}/api/v1/ingest/items",
                    json=payload,
                    headers={"x-internal-secret": self.secret},
                )
                resp.raise_for_status()
        except Exception as exc:
            spider.logger.error("Failed to push scraped items to backend ingest: %s", exc)

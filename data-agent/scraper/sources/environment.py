# ============================================================
# Times of Namibia — Environment Source
# Scrapes conservation, climate, and environmental news
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}


def fetch() -> list[dict]:
    """
    Scrape environmental and conservation news relevant to Namibia.
    Covers climate, conservation, desert ecology, water resources.
    """
    results = []

    # ── Ministry of Environment ────────────────────────────────
    try:
        mef_url = "https://www.mef.gov.na"  # Ministry of Environment, Forestry and Tourism
        resp = requests.get(mef_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select("article, .news-item, .press-release, .announcement"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{mef_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or mef_url,
                    "source": "MEFT",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Environment news — {title}",
                    "description": f"Ministry of Environment: {title[:200]}",
                    "author": None,
                    "guid": f"mef-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "environment",
                    "item_type": "article",
                    "metadata": {"type": "environment"},
                })
    except Exception as e:
        print(f"  [Environment] MEFT error: {e}")

    # ── Namibian environmental RSS feeds ───────────────────────
    try:
        from scraper.sources.rss_generic import fetch as fetch_rss

        env_feeds = [
            ("Namibian Nature Foundation", "https://www.nnf.org.na/feed", "environment"),
        ]

        for feed_name, feed_url, category in env_feeds:
            items = fetch_rss(feed_url, feed_name, category)
            results.extend(items)
    except Exception as e:
        print(f"  [Environment] RSS error: {e}")

    return results

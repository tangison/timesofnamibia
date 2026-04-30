# ============================================================
# Times of Namibia — Sports Source
# Scrapes sports news: Brave Warriors, NPL, athletics, rugby
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}


def fetch() -> list[dict]:
    """
    Scrape sports news from Namibian and African sports sources.
    Covers football (Brave Warriors, NPL), rugby, cricket, athletics.
    """
    results = []

    # ── NFA (Namibia Football Association) ─────────────────────
    try:
        nfa_url = "https://www.nfa.org.na"
        resp = requests.get(nfa_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select("article, .news-item, .post"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{nfa_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or nfa_url,
                    "source": "NFA",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Football news — {title}",
                    "description": f"Namibia Football Association: {title[:200]}",
                    "author": None,
                    "guid": f"nfa-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "sport",
                    "item_type": "article",
                    "metadata": {"type": "sport", "discipline": "football"},
                })
    except Exception as e:
        print(f"  [Sports] NFA error: {e}")

    # ── RSS feeds for sports ───────────────────────────────────
    try:
        from scraper.sources.rss_generic import fetch as fetch_rss

        sports_feeds = [
            ("BBC Sport Africa", "https://feeds.bbci.co.uk/sport/africa/rss.xml", "sport"),
            ("SuperSport", "https://www.supersport.com/rss", "sport"),
        ]

        for feed_name, feed_url, category in sports_feeds:
            items = fetch_rss(feed_url, feed_name, category)
            # Only keep items relevant to Namibia
            namibia_items = [
                item for item in items
                if any(kw in item.get("name", "").lower() for kw in
                       ["namibia", "brave warriors", "welwitschias", "npl", "windhoek"])
            ]
            # Also include a sample of general African sports
            if len(namibia_items) < 5:
                namibia_items.extend(items[:5 - len(namibia_items)])
            results.extend(namibia_items)
    except Exception as e:
        print(f"  [Sports] RSS error: {e}")

    return results

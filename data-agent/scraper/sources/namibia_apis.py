# ============================================================
# Times of Namibia — Namibia-Specific API Sources
# REST APIs: WorldNewsAPI, NewsData.io, GNews.io
# RSS feeds: Namibian Sun, Economist, Informante, etc.
# ============================================================

import os
import requests
import feedparser
from datetime import datetime, timezone
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibia-Bot/1.0 (Broadsheet Digital; GemsWeb)",
}


def fetch_worldnewsapi() -> list[dict]:
    """WorldNewsAPI Namibia — 4 sources, 30+ items/day."""
    results = []
    api_key = os.environ.get("WORLDNEWSAPI_KEY", "")
    if not api_key:
        return results

    url = "https://api.worldnewsapi.com/v2/articles"
    params = {
        "api-key": api_key,
        "country": "na",
        "language": "en",
        "sort": "published_at_desc",
        "number": 50,
    }

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("articles", []):
                title = item.get("title", "")
                if not is_relevant(title, category="national"):
                    continue
                results.append({
                    "name": title,
                    "url": item.get("url", ""),
                    "source": "WorldNewsAPI-NA",
                    "date_found": item.get("published_at", datetime.now(timezone.utc).date().isoformat())[:10],
                    "content": item.get("summary", ""),
                    "description": item.get("summary", "")[:500],
                    "author": item.get("author", None),
                    "guid": f"wnapi-{hash(title)}",
                    "pub_date": item.get("published_at", datetime.now(timezone.utc).isoformat()),
                    "section": classify_section(title),
                    "item_type": "article",
                })
    except Exception as e:
        print(f"  [WorldNewsAPI] Error: {e}")

    return results


def fetch_newsdata() -> list[dict]:
    """NewsData.io Namibia API — live + historical."""
    results = []
    api_key = os.environ.get("NEWSDATA_API_KEY", "")
    if not api_key:
        return results

    url = "https://newsdata.io/api/1/latest"
    params = {
        "apikey": api_key,
        "country": "na",
        "language": "en",
        "size": 50,
    }

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("results", []):
                title = item.get("title", "")
                if not is_relevant(title, category="national"):
                    continue
                results.append({
                    "name": title,
                    "url": item.get("link", ""),
                    "source": "NewsData-NA",
                    "date_found": item.get("pubDate", datetime.now(timezone.utc).date().isoformat())[:10],
                    "content": item.get("description", ""),
                    "description": item.get("description", "")[:500],
                    "author": item.get("creator", [None])[0] if item.get("creator") else None,
                    "guid": f"nd-{hash(title)}",
                    "pub_date": item.get("pubDate", datetime.now(timezone.utc).isoformat()),
                    "section": classify_section(title),
                    "item_type": "article",
                })
    except Exception as e:
        print(f"  [NewsData] Error: {e}")

    return results


def fetch_gnews() -> list[dict]:
    """GNews.io Namibia — top headlines."""
    results = []
    api_key = os.environ.get("GNEWS_API_KEY", "")
    if not api_key:
        return results

    url = "https://gnews.io/api/v4/top-headlines"
    params = {
        "category": "general",
        "country": "na",
        "lang": "en",
        "max": 50,
        "apikey": api_key,
    }

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("articles", []):
                title = item.get("title", "")
                if not is_relevant(title, category="national"):
                    continue
                results.append({
                    "name": title,
                    "url": item.get("url", ""),
                    "source": "GNews-NA",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": item.get("description", ""),
                    "description": item.get("description", "")[:500],
                    "author": None,
                    "guid": f"gn-{hash(title)}",
                    "pub_date": item.get("publishedAt", datetime.now(timezone.utc).isoformat()),
                    "section": classify_section(title),
                    "item_type": "article",
                })
    except Exception as e:
        print(f"  [GNews] Error: {e}")

    return results


# ── EXPANDED RSS FEEDS ───────────────────────────────────────

TON_EXPANDED_RSS = [
    # Critical priority
    {"name": "Namibia Press Agency (NAMPA)", "url": "https://nampa.org.na/rss", "category": "national"},
    {"name": "New Era", "url": "https://newera.com.na/feed", "category": "national"},
    {"name": "Bank of Namibia", "url": "https://bankofnamibia.org.na/rss", "category": "economy"},
    # High priority
    {"name": "Namibian Sun", "url": "https://www.namibiansun.com/rss", "category": "national"},
    {"name": "Namibia Economist", "url": "https://namibiaeconomist.com/feed", "category": "economy"},
    {"name": "AllAfrica Namibia", "url": "https://allafrica.com/tools/headlines/rdf/namibia/headlines.rdf", "category": "africa"},
    {"name": "UNAM News", "url": "https://unam.edu.na/rss", "category": "technology"},
    {"name": "NUST Updates", "url": "https://nust.na/feed", "category": "technology"},
    # Medium priority
    {"name": "Informante", "url": "https://informante.web.na/feed", "category": "national"},
    {"name": "Windhoek Observer", "url": "https://observer.com.na/feed", "category": "politics"},
    {"name": "EIN Presswire Namibia", "url": "https://einnews.com/country/namibia/rss", "category": "national"},
    # International Africa desks
    {"name": "BBC Africa", "url": "https://feeds.bbci.co.uk/news/world/africa/rss.xml", "category": "africa"},
    {"name": "France24 Afrique", "url": "https://www.france24.com/en/africa/rss", "category": "africa"},
    {"name": "DW Africa", "url": "https://rss.dw.com/rdf/rss-en-afr", "category": "africa"},
    # Specialized
    {"name": "Mining Weekly", "url": "https://www.miningweekly.com/rss", "category": "mining"},
    {"name": "ESI Africa", "url": "https://www.esi-africa.com/feed/", "category": "energy"},
]


def fetch_expanded_rss() -> list[dict]:
    """Fetch all expanded RSS feeds from the verified sources list."""
    from scraper.sources.rss_generic import fetch as fetch_rss

    all_items = []
    for feed_config in TON_EXPANDED_RSS:
        try:
            items = fetch_rss(
                feed_url=feed_config["url"],
                feed_name=feed_config["name"],
                feed_category=feed_config["category"],
            )
            all_items.extend(items)
        except Exception as e:
            print(f"  [RSS] {feed_config['name']} error: {e}")

    return all_items


def fetch_all() -> list[dict]:
    """Fetch from all Namibia API sources + expanded RSS."""
    results = []
    results.extend(fetch_worldnewsapi())
    results.extend(fetch_newsdata())
    results.extend(fetch_gnews())
    results.extend(fetch_expanded_rss())
    return results

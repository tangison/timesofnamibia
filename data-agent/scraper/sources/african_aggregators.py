# ============================================================
# Times of Namibia — African News Aggregators
# Pan-African sources: EIN Presswire, Apify, NewsNow
# ============================================================

import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibia-Bot/1.0 (Broadsheet Digital; TANGISON)",
}


def fetch_ein_presswire() -> list[dict]:
    """EIN Presswire Namibia Newswire."""
    results = []
    url = "https://www.einnews.com/country/namibia"

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for article in soup.select(".news_item, .newsitem, article")[:30]:
                title_el = article.select_one("a.title, a, h3, h4")
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                if not is_relevant(title, category="national"):
                    continue

                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"https://einnews.com{link}"

                date_el = article.select_one(".date, time, .timestamp")
                date_str = date_el.get_text(strip=True) if date_el else datetime.now(timezone.utc).date().isoformat()

                results.append({
                    "name": title,
                    "url": link or url,
                    "source": "EIN-Presswire",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": article.get_text(strip=True)[:500],
                    "description": article.get_text(strip=True)[:200],
                    "author": None,
                    "guid": f"ein-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": classify_section(title),
                    "item_type": "article",
                })
    except Exception as e:
        print(f"  [EIN Presswire] Error: {e}")

    return results


def fetch_apify_african_news() -> list[dict]:
    """Apify African News Aggregator API — requires API token."""
    results = []
    api_token = os.environ.get("APIFY_TOKEN", "")
    if not api_token:
        return results

    dataset_id = os.environ.get("APIFY_DATASET_ID", "")
    if not dataset_id:
        return results

    url = f"https://api.apify.com/v2/datasets/{dataset_id}/items"
    params = {"token": api_token}

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for item in data:
                # Filter for Namibia content
                title = item.get("title", "")
                country = item.get("country", "").lower()
                if "namibia" not in country and not is_relevant(title, category="africa"):
                    continue

                results.append({
                    "name": title,
                    "url": item.get("url", ""),
                    "source": "Apify-Africa",
                    "date_found": item.get("publishedAt", datetime.now(timezone.utc).date().isoformat())[:10],
                    "content": item.get("content", ""),
                    "description": item.get("content", "")[:500],
                    "author": None,
                    "guid": f"apify-{hash(title)}",
                    "pub_date": item.get("publishedAt", datetime.now(timezone.utc).isoformat()),
                    "section": "africa",
                    "item_type": "article",
                })
    except Exception as e:
        print(f"  [Apify] Error: {e}")

    return results


def fetch_all() -> list[dict]:
    """Fetch from all African aggregator sources."""
    results = []
    results.extend(fetch_ein_presswire())
    results.extend(fetch_apify_african_news())
    return results

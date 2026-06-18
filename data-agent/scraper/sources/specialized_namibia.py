# ============================================================
# Times of Namibia — Specialized Sources
# Mining, Oil & Gas, Tourism, Sports, Climate/Weather
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibia-Bot/1.0 (Broadsheet Digital; TANGISON)",
}


def fetch_mining_news() -> list[dict]:
    """Namibia mining sector news from Mining Journal and specialist sites."""
    results = []
    urls = [
        ("MiningJournal-NA", "https://www.miningjournal.net/namibia"),
        ("NamOilAndGas", "https://namibianoilandgas.com/news"),
    ]

    for source_name, url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "lxml")
            for article in soup.select("article, .news-item, .post, .entry")[:20]:
                title_el = article.select_one("h2, h3, h4, .title, .entry-title")
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                # Broad acceptance for mining/oil — any African mining is relevant
                if not is_relevant(title, extra_keywords=["mining", "diamond", "uranium", "oil", "gas"], category="mining"):
                    continue

                link_el = article.select_one("a")
                link = link_el.get("href", "") if link_el else ""
                if link and not link.startswith("http"):
                    link = f"{url.rstrip('/')}/{link.lstrip('/')}"

                results.append({
                    "name": title,
                    "url": link or url,
                    "source": source_name,
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": article.get_text(strip=True)[:500],
                    "description": article.get_text(strip=True)[:200],
                    "author": None,
                    "guid": f"mining-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "mining",
                    "item_type": "article",
                    "metadata": {"type": "mining"},
                })
        except Exception as e:
            print(f"  [Mining {source_name}] Error: {e}")

    return results


def fetch_namibia_sports() -> list[dict]:
    """NFA, NPL, NOCR, rugby, cricket — Namibia sports news."""
    results = []
    sources = [
        ("NFA", "https://nfa.com.na/news"),
        ("NPL", "https://namibiapremierleague.com/news"),
        ("NOCR", "https://nocr.org.na/news"),
        ("NamibiaRugby", "https://namibiarugby.com/news"),
        ("NamibiaCricket", "https://namibiacricket.com/press"),
    ]

    for source_name, url in sources:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "lxml")
            for article in soup.select("article, .news-item, .post, .match-report")[:25]:
                title_el = article.select_one("h2, h3, h4, .title")
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                if not is_relevant(title, extra_keywords=["sport", "football", "rugby", "cricket", "warriors"], category="sport"):
                    continue

                link_el = article.select_one("a")
                link = link_el.get("href", "") if link_el else ""
                if link and not link.startswith("http"):
                    base = "/".join(url.split("/")[:3])
                    link = f"{base}{link}"

                results.append({
                    "name": title,
                    "url": link or url,
                    "source": f"Sports-{source_name}",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": article.get_text(strip=True)[:500],
                    "description": article.get_text(strip=True)[:200],
                    "author": None,
                    "guid": f"sport-{source_name.lower()}-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "sport",
                    "item_type": "article",
                    "metadata": {"type": "sport", "discipline": source_name.lower()},
                })
        except Exception as e:
            print(f"  [Sports {source_name}] Error: {e}")

    return results


def fetch_climate_alerts() -> list[dict]:
    """Namibia Meteorological Service — drought and weather alerts."""
    results = []
    urls = [
        ("MetService-NA", "https://met.gov.na/alerts"),
        ("MetService-Drought", "https://met.gov.na/drought"),
    ]

    for source_name, url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "lxml")
            for alert in soup.select(".alert, .warning, .bulletin, article, .notice")[:10]:
                title_el = alert.select_one("h2, h3, .title, .alert-title")
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                urgency = "high" if any(w in title.lower() for w in ["warning", "alert", "drought", "severe"]) else "medium"

                results.append({
                    "name": title,
                    "url": url,
                    "source": source_name,
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": alert.get_text(strip=True)[:500],
                    "description": alert.get_text(strip=True)[:200],
                    "author": None,
                    "guid": f"met-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "environment",
                    "item_type": "article",
                    "metadata": {"type": "climate_alert", "urgency": urgency},
                })
        except Exception as e:
            print(f"  [Climate {source_name}] Error: {e}")

    return results


def fetch_tourism_news() -> list[dict]:
    """Namibia Tourism Board and related tourism news."""
    results = []
    urls = [
        ("NamibiaTourism", "https://namibiatourism.com.na/news"),
        ("HAN-Namibia", "https://hannamibia.com/members"),
    ]

    for source_name, url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "lxml")
            for article in soup.select("article, .news-item, .post")[:15]:
                title_el = article.select_one("h2, h3, h4, .title")
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                if not is_relevant(title, extra_keywords=["tourism", "travel", "hospitality", "safari", "lodge"], category="national"):
                    continue

                link_el = article.select_one("a")
                link = link_el.get("href", "") if link_el else ""

                results.append({
                    "name": title,
                    "url": link or url,
                    "source": source_name,
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": article.get_text(strip=True)[:500],
                    "description": article.get_text(strip=True)[:200],
                    "author": None,
                    "guid": f"tourism-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "national",
                    "item_type": "article",
                    "metadata": {"type": "tourism"},
                })
        except Exception as e:
            print(f"  [Tourism {source_name}] Error: {e}")

    return results


def fetch_all() -> list[dict]:
    """Fetch from all specialized Namibia sources."""
    results = []
    results.extend(fetch_mining_news())
    results.extend(fetch_namibia_sports())
    results.extend(fetch_climate_alerts())
    results.extend(fetch_tourism_news())
    return results

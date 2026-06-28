# ============================================================
# Times of Namibia — Culture & Education Source
# Scrapes cultural, educational, and historical content
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
    Scrape cultural and educational content from Namibian institutions.
    Covers arts, heritage, education, and 'Today in History'.
    """
    results = []

    # ── University of Namibia (UNAM) ──────────────────────────
    try:
        unam_url = "https://www.unam.edu.na"
        resp = requests.get(unam_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select("article, .news-item, .post, .announcement"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{unam_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or unam_url,
                    "source": "UNAM",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Education news — {title}",
                    "description": f"University of Namibia: {title[:200]}",
                    "author": None,
                    "guid": f"unam-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "technology",
                    "item_type": "article",
                    "metadata": {"type": "education"},
                })
    except Exception as e:
        print(f"  [Culture] UNAM error: {e}")

    # ── Arts Council of Namibia ────────────────────────────────
    try:
        arts_url = "https://www.artscouncilnamibia.org"
        resp = requests.get(arts_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select("article, .news-item, .event, .post"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{arts_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or arts_url,
                    "source": "Arts Council of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Arts and culture — {title}",
                    "description": f"Arts Council: {title[:200]}",
                    "author": None,
                    "guid": f"arts-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "opinion",
                    "item_type": "article",
                    "metadata": {"type": "culture"},
                })
    except Exception as e:
        print(f"  [Culture] Arts Council error: {e}")

    # ── Today in History ───────────────────────────────────────
    try:
        today = datetime.now()
        month_day = today.strftime("%B %d")
        # Wikipedia "On this day" for Namibia-related events
        wiki_url = f"https://en.wikipedia.org/wiki/{today.strftime('%B')}_{today.day}"
        resp = requests.get(wiki_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            # Look for Namibia-related events
            for li in soup.select("#Events ul li, #Births ul li, #Deaths ul li"):
                text = li.get_text(strip=True)
                if any(kw in text.lower() for kw in ["namibia", "south west africa", "windhoek", "swapo", "walvis"]):
                    results.append({
                        "name": f"Today in History: {month_day}",
                        "url": wiki_url,
                        "source": "Wikipedia",
                        "date_found": datetime.now(timezone.utc).date().isoformat(),
                        "content": f"Historical event on {month_day}: {text}",
                        "description": f"On this day: {text[:200]}",
                        "author": None,
                        "guid": f"history-{today.strftime('%m%d')}-{hash(text)}",
                        "pub_date": datetime.now(timezone.utc).isoformat(),
                        "section": "opinion",
                        "item_type": "article",
                        "metadata": {"type": "today_in_history", "date": month_day},
                    })
    except Exception as e:
        print(f"  [Culture] Today in History error: {e}")

    return results

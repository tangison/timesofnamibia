# ============================================================
# Times of Namibia — Legal Desk Source
# Scrapes Supreme Court judgments and legislation updates
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
    Scrape legal sources: Supreme Court judgments and legislation updates.
    Returns normalised legal items.
    """
    results = []

    # ── Supreme Court of Namibia ───────────────────────────────
    try:
        court_url = "https://www.supremecourt.na/judgments"
        resp = requests.get(court_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".judgment, .judgment-item, table tbody tr"):
                title_el = item.select_one("a")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"https://www.supremecourt.na{link}"

                # Try to extract date and case number
                date_text = ""
                case_no = ""
                for td in item.select("td"):
                    text = td.get_text(strip=True)
                    if any(kw in text.lower() for kw in ["2024", "2025", "2026"]):
                        date_text = text
                    if "v " in text.lower() or "case" in text.lower() or "no." in text.lower():
                        case_no = text

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": f"Judgment: {title}",
                    "url": link or court_url,
                    "source": "Supreme Court of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Supreme Court Judgment — {title}. Case: {case_no}. Date: {date_text}",
                    "description": f"Court judgment: {title[:200]}",
                    "author": None,
                    "guid": f"judgment-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "national",
                    "item_type": "article",
                    "metadata": {"type": "judgment", "case_no": case_no, "date": date_text},
                })
    except Exception as e:
        print(f"  [Legal] Supreme Court error: {e}")

    # ── High Court Judgments ───────────────────────────────────
    try:
        high_court_url = "https://www.superiorcourts.na/high-court/judgments"
        resp = requests.get(high_court_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".judgment, .judgment-item, table tbody tr"):
                title_el = item.select_one("a")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"https://www.superiorcourts.na{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": f"High Court: {title}",
                    "url": link or high_court_url,
                    "source": "High Court of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"High Court Judgment — {title}",
                    "description": f"High Court judgment: {title[:200]}",
                    "author": None,
                    "guid": f"highcourt-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "national",
                    "item_type": "article",
                    "metadata": {"type": "judgment"},
                })
    except Exception as e:
        print(f"  [Legal] High Court error: {e}")

    # ── Legislation Updates ────────────────────────────────────
    try:
        legislation_url = "https://legislation.gov.na"
        resp = requests.get(legislation_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".legislation-item, .act-item, table tbody tr"):
                title_el = item.select_one("a")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{legislation_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": f"Legislation: {title}",
                    "url": link or legislation_url,
                    "source": "legislation.gov.na",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Legislation update — {title}",
                    "description": f"New or amended legislation: {title[:200]}",
                    "author": None,
                    "guid": f"legislation-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "politics",
                    "item_type": "article",
                    "metadata": {"type": "legislation"},
                })
    except Exception as e:
        print(f"  [Legal] Legislation error: {e}")

    return results

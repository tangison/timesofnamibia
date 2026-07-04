# ============================================================
# Times of Namibia — Parliament Source
# Scrapes the Parliament of Namibia for bills, debates, Hansard
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}
BASE_URL = "https://www.parliament.na"


def fetch() -> list[dict]:
    """
    Scrape Parliament of Namibia for recent legislative activity.
    Covers: bills, questions, motions, committee reports.
    """
    results = []

    # ── Bills and Legislation ──────────────────────────────────
    try:
        bills_url = f"{BASE_URL}/legislation/bills/"
        resp = requests.get(bills_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for row in soup.select("table tbody tr, .bill-item, .legislation-item"):
                title_el = row.select_one("a")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{BASE_URL}{link}"

                # Try to get date and status
                date_text = ""
                status = "active"
                for td in row.select("td"):
                    text = td.get_text(strip=True)
                    if any(kw in text.lower() for kw in ["2024", "2025", "2026"]):
                        date_text = text
                    if any(kw in text.lower() for kw in ["passed", "assented", "withdrawn", "lapsed"]):
                        status = text.lower()

                if not is_relevant(title, extra_keywords=["parliament", "bill", "legislation", "act"]):
                    continue

                results.append({
                    "name": f"Parliament: {title}",
                    "url": link or bills_url,
                    "source": "Parliament of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Bill: {title}. Status: {status}. Date: {date_text}",
                    "description": f"Parliamentary bill — {title}. Status: {status}",
                    "author": None,
                    "guid": f"parliament-bill-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "politics",
                    "item_type": "article",
                    "metadata": {"type": "bill", "status": status, "date": date_text},
                })
    except Exception as e:
        print(f"  [Parliament] Bills error: {e}")

    # ── Hansard / Debates ──────────────────────────────────────
    try:
        hansard_url = f"{BASE_URL}/hansard/"
        resp = requests.get(hansard_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for link_el in soup.select("a[href*='hansard'], .hansard-item a"):
                title = link_el.get_text(strip=True)
                link = link_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{BASE_URL}{link}"

                if not title or len(title) < 10:
                    continue

                results.append({
                    "name": f"Hansard: {title}",
                    "url": link or hansard_url,
                    "source": "Parliament of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Parliamentary debate record — {title}",
                    "description": f"Hansard transcript: {title[:200]}",
                    "author": None,
                    "guid": f"hansard-{hash(title + link)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "politics",
                    "item_type": "article",
                    "metadata": {"type": "hansard"},
                })
    except Exception as e:
        print(f"  [Parliament] Hansard error: {e}")

    # ── Committee Reports ──────────────────────────────────────
    try:
        committee_url = f"{BASE_URL}/committees/"
        resp = requests.get(committee_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".committee-report, .report-item"):
                title_el = item.select_one("a")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = title_el.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{BASE_URL}{link}"

                results.append({
                    "name": f"Committee: {title}",
                    "url": link or committee_url,
                    "source": "Parliament of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Parliamentary committee report — {title}",
                    "description": f"Committee report: {title[:200]}",
                    "author": None,
                    "guid": f"committee-{hash(title + link)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "politics",
                    "item_type": "article",
                    "metadata": {"type": "committee_report"},
                })
    except Exception as e:
        print(f"  [Parliament] Committee error: {e}")

    return results

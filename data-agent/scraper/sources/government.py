# ============================================================
# Times of Namibia — Government Press Releases Source
# Scrapes official government portals for announcements
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
    Scrape government portals for press releases, announcements,
    and policy updates.
    """
    results = []

    # ── Government of Namibia Portal ───────────────────────────
    try:
        gov_url = "https://www.gov.na"
        resp = requests.get(gov_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")

            # News/press releases
            for item in soup.select(".news-item, .press-release, .announcement, article"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                if title_el.name == "a":
                    link = title_el.get("href", "")
                else:
                    a = title_el.find_parent("a") or title_el.find("a")
                    if a:
                        link = a.get("href", "")

                if link and not link.startswith("http"):
                    link = f"{gov_url}{link}"

                if not title or len(title) < 5:
                    continue

                section = classify_section(title)

                results.append({
                    "name": title,
                    "url": link or gov_url,
                    "source": "Government of Namibia",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Government press release — {title}",
                    "description": f"Official announcement: {title[:200]}",
                    "author": None,
                    "guid": f"gov-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": section,
                    "item_type": "article",
                    "metadata": {"type": "government_press"},
                })
    except Exception as e:
        print(f"  [Government] Portal error: {e}")

    # ── Ministry of Finance ────────────────────────────────────
    try:
        mof_url = "https://www.mof.gov.na"
        resp = requests.get(mof_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".news-item, .press-release, article, .announcement"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{mof_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or mof_url,
                    "source": "Ministry of Finance",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Ministry of Finance announcement — {title}",
                    "description": f"Fiscal/budget news: {title[:200]}",
                    "author": None,
                    "guid": f"mof-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "economy",
                    "item_type": "article",
                    "metadata": {"type": "government_press", "ministry": "finance"},
                })
    except Exception as e:
        print(f"  [Government] MoF error: {e}")

    # ── Ministry of Mines and Energy ───────────────────────────
    try:
        mme_url = "https://www.mme.gov.na"
        resp = requests.get(mme_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for item in soup.select(".news-item, .press-release, article"):
                title_el = item.select_one("a, h2, h3")
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                link = ""
                a = title_el if title_el.name == "a" else title_el.find("a")
                if a:
                    link = a.get("href", "")
                if link and not link.startswith("http"):
                    link = f"{mme_url}{link}"

                if not title or len(title) < 5:
                    continue

                results.append({
                    "name": title,
                    "url": link or mme_url,
                    "source": "Ministry of Mines & Energy",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Ministry of Mines & Energy announcement — {title}",
                    "description": f"Mining/energy news: {title[:200]}",
                    "author": None,
                    "guid": f"mme-{hash(title)}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "mining",
                    "item_type": "article",
                    "metadata": {"type": "government_press", "ministry": "mines_energy"},
                })
    except Exception as e:
        print(f"  [Government] MME error: {e}")

    return results

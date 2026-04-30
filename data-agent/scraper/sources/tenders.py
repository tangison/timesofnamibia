# ============================================================
# Times of Namibia — Tenders Source
# Scrapes government procurement portals for tender opportunities
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from scraper.filters import is_relevant

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}

# Government procurement portal and parastatal URLs
TENDER_SOURCES = [
    {
        "name": "Government Procurement Portal",
        "url": "https://www.eprocurement.gov.na",
        "selectors": {
            "listing": ".tender-item, .procurement-item, table tbody tr",
            "title": "a, .title, td:first-child",
            "link": "a",
            "deadline": ".deadline, .closing-date, td:nth-child(3)",
            "department": ".department, .org, td:nth-child(2)",
            "value": ".value, .amount, td:nth-child(4)",
        },
    },
    {
        "name": "NamPower Tenders",
        "url": "https://www.nampower.com.na/tenders.aspx",
        "selectors": {
            "listing": ".tender-listing, .tender-item",
            "title": "a, .tender-title",
            "link": "a",
            "deadline": ".closing-date, .deadline",
            "department": "span",
            "value": ".value",
        },
    },
    {
        "name": "TransNamib Tenders",
        "url": "https://www.transnamib.com.na/tenders",
        "selectors": {
            "listing": ".tender, .procurement",
            "title": "a, h3, h4",
            "link": "a",
            "deadline": ".date, .deadline",
            "department": "span",
            "value": ".amount",
        },
    },
    {
        "name": "NamPort Tenders",
        "url": "https://www.namport.com.na/tenders",
        "selectors": {
            "listing": ".tender-listing, .procurement-item",
            "title": "a, .title",
            "link": "a",
            "deadline": ".deadline, .date",
            "department": "span",
            "value": ".value",
        },
    },
]


def _parse_date(date_text: str) -> str | None:
    """Try to parse a date string into ISO format."""
    from dateutil import parser as date_parser
    if not date_text:
        return None
    try:
        dt = date_parser.parse(date_text, dayfirst=True)
        return dt.isoformat()
    except (ValueError, TypeError):
        return None


def _parse_value(value_text: str) -> dict:
    """Extract numeric value from tender value string."""
    import re
    result = {"estimatedValue": value_text, "valueMin": None, "valueMax": None}
    if not value_text:
        return result

    # Try to extract N$ amounts
    numbers = re.findall(r"N\$\s*([\d,]+(?:\.\d+)?)", value_text)
    if len(numbers) == 2:
        result["valueMin"] = float(numbers[0].replace(",", ""))
        result["valueMax"] = float(numbers[1].replace(",", ""))
    elif len(numbers) == 1:
        result["valueMin"] = float(numbers[0].replace(",", ""))

    # Handle range patterns like "N$ 85M — N$ 120M"
    range_match = re.search(r"N\$\s*([\d.]+)\s*([MK]?)\s*[—\-–]\s*N\$\s*([\d.]+)\s*([MK]?)", value_text)
    if range_match:
        mult = {"M": 1_000_000, "K": 1_000, "": 1}
        result["valueMin"] = float(range_match.group(1)) * mult.get(range_match.group(2), 1)
        result["valueMax"] = float(range_match.group(3)) * mult.get(range_match.group(4), 1)

    return result


def fetch() -> list[dict]:
    """
    Scrape tender portals for procurement opportunities.
    Returns normalised tender items.
    """
    results = []

    for source in TENDER_SOURCES:
        try:
            print(f"  [Tenders] Fetching {source['name']}...")
            resp = requests.get(source["url"], headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                print(f"  [Tenders] {source['name']} returned {resp.status_code}")
                continue

            soup = BeautifulSoup(resp.text, "lxml")
            selectors = source["selectors"]

            for item_el in soup.select(selectors["listing"]):
                # Title
                title_el = item_el.select_one(selectors["title"])
                title = title_el.get_text(strip=True) if title_el else ""
                if not title or len(title) < 5:
                    continue

                # Link
                link_el = item_el.select_one(selectors["link"])
                link = link_el.get("href", "") if link_el else ""
                if link and not link.startswith("http"):
                    link = f"{source['url'].rstrip('/')}/{link.lstrip('/')}"

                # Deadline
                deadline_el = item_el.select_one(selectors["deadline"])
                deadline_text = deadline_el.get_text(strip=True) if deadline_el else ""
                deadline = _parse_date(deadline_text)

                # Department
                dept_el = item_el.select_one(selectors["department"])
                department = dept_el.get_text(strip=True) if dept_el else source["name"]

                # Value
                value_el = item_el.select_one(selectors["value"])
                value_text = value_el.get_text(strip=True) if value_el else ""
                value_data = _parse_value(value_text)

                # Generate docId
                doc_id = f"GRN-{datetime.now().year}-{hash(title) % 10000:04d}"

                results.append({
                    "name": title,
                    "url": link or source["url"],
                    "source": source["name"],
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Tender: {title}. Department: {department}. Deadline: {deadline_text}. Value: {value_text}",
                    "description": f"Government tender — {title[:200]}",
                    "author": None,
                    "guid": f"tender-{doc_id}",
                    "pub_date": deadline or datetime.now(timezone.utc).isoformat(),
                    "section": "infrastructure",
                    "item_type": "tender",
                    "metadata": {
                        "type": "tender",
                        "docId": doc_id,
                        "department": department,
                        "deadline": deadline,
                        "estimatedValue": value_data["estimatedValue"],
                        "valueMin": value_data["valueMin"],
                        "valueMax": value_data["valueMax"],
                        "status": "open",
                    },
                })

            print(f"  [Tenders] {source['name']}: {len([r for r in results if r['source'] == source['name']])} tenders")

        except Exception as e:
            print(f"  [Tenders] {source['name']} error: {e}")

    return results

# ============================================================
# Times of Namibia — Job Scraper Source
# Aggregates job listings from Namibian job boards and portals
# ============================================================

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import re
from scraper.filters import is_relevant, extract_region

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}

# Namibian job board sources
JOB_SOURCES = [
    {
        "name": "NIEIS",
        "url": "https://nieis.namibiaatwork.gov.na/vacancies",
        "selectors": {
            "listing": ".vacancy, .job-item, table tbody tr",
            "title": "a, .job-title, td:first-child",
            "company": ".company, .employer, td:nth-child(2)",
            "location": ".location, td:nth-child(3)",
            "salary": ".salary, .remuneration",
            "link": "a",
            "closing": ".closing-date, .deadline, td:nth-child(4)",
        },
    },
    {
        "name": "NamibiaJobs",
        "url": "https://www.namibiajobs.com/jobs",
        "selectors": {
            "listing": ".job-listing, .job-card, .vacancy",
            "title": ".job-title a, h3 a, h2 a",
            "company": ".company-name, .employer",
            "location": ".location",
            "salary": ".salary",
            "link": ".job-title a, h3 a",
            "closing": ".closing-date, .deadline",
        },
    },
    {
        "name": "CareerPortal Namibia",
        "url": "https://www.careerportal.co.na/jobs",
        "selectors": {
            "listing": ".job, .vacancy-item, .listing",
            "title": "a, .title",
            "company": ".company, .employer",
            "location": ".location",
            "salary": ".salary",
            "link": "a",
            "closing": ".date, .closing",
        },
    },
]


def _parse_salary(text: str) -> dict:
    """Extract salary range from text."""
    result = {"salary": text, "salaryMin": None, "salaryMax": None, "type": "Full-time"}
    if not text:
        return result

    # Pattern: N$ 85,000 - 120,000/mo
    match = re.search(r"N\$\s*([\d,]+)\s*[—\-–]\s*([\d,]+)", text)
    if match:
        result["salaryMin"] = float(match.group(1).replace(",", ""))
        result["salaryMax"] = float(match.group(2).replace(",", ""))

    # Pattern: N$ 85,000
    elif "N$" in text:
        match = re.search(r"N\$\s*([\d,]+)", text)
        if match:
            result["salaryMin"] = float(match.group(1).replace(",", ""))

    # Job type
    if "contract" in text.lower():
        result["type"] = "Contract"
    elif "part-time" in text.lower() or "part time" in text.lower():
        result["type"] = "Part-time"
    elif "temporary" in text.lower():
        result["type"] = "Temporary"

    return result


def _parse_closing_date(text: str) -> str | None:
    """Parse a closing date string."""
    from dateutil import parser as date_parser
    if not text:
        return None
    try:
        dt = date_parser.parse(text, dayfirst=True)
        return dt.isoformat()
    except (ValueError, TypeError):
        return None


def fetch() -> list[dict]:
    """
    Scrape job boards for Namibian employment opportunities.
    Returns normalised job items.
    """
    results = []

    for source in JOB_SOURCES:
        try:
            print(f"  [Jobs] Fetching {source['name']}...")
            resp = requests.get(source["url"], headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                print(f"  [Jobs] {source['name']} returned {resp.status_code}")
                continue

            soup = BeautifulSoup(resp.text, "lxml")
            selectors = source["selectors"]

            for item_el in soup.select(selectors["listing"]):
                # Title
                title_el = item_el.select_one(selectors["title"])
                title = title_el.get_text(strip=True) if title_el else ""
                if not title or len(title) < 3:
                    continue

                # Link
                link_el = item_el.select_one(selectors["link"])
                link = link_el.get("href", "") if link_el else ""
                if link and not link.startswith("http"):
                    link = f"{source['url'].rstrip('/')}/{link.lstrip('/')}"

                # Company
                company_el = item_el.select_one(selectors["company"])
                company = company_el.get_text(strip=True) if company_el else "Not specified"

                # Location
                location_el = item_el.select_one(selectors["location"])
                location = location_el.get_text(strip=True) if location_el else "Namibia"
                region = extract_region(location)

                # Salary
                salary_el = item_el.select_one(selectors["salary"])
                salary_text = salary_el.get_text(strip=True) if salary_el else ""
                salary_data = _parse_salary(salary_text)

                # Closing date
                closing_el = item_el.select_one(selectors["closing"])
                closing_text = closing_el.get_text(strip=True) if closing_el else ""
                closing_date = _parse_closing_date(closing_text)

                # Dedup GUID
                guid = f"job-{source['name'].lower().replace(' ', '-')}-{hash(title + company)}"

                results.append({
                    "name": title,
                    "url": link or source["url"],
                    "source": source["name"],
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Job: {title} at {company}, {location}. Salary: {salary_text or 'Not disclosed'}. Closing: {closing_text or 'Open'}",
                    "description": f"{title} — {company}, {location}",
                    "author": None,
                    "guid": guid,
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "national",
                    "item_type": "job",
                    "metadata": {
                        "type": "job",
                        "company": company,
                        "location": location,
                        "region": region,
                        "salary": salary_data["salary"],
                        "salaryMin": salary_data["salaryMin"],
                        "salaryMax": salary_data["salaryMax"],
                        "jobType": salary_data["type"],
                        "closingDate": closing_date,
                        "postedAgo": "Just scraped",
                    },
                })

            print(f"  [Jobs] {source['name']}: {len([r for r in results if r['source'] == source['name']])} jobs")

        except Exception as e:
            print(f"  [Jobs] {source['name']} error: {e}")

    # ── LinkedIn Jobs (RSS approximation via search) ───────────
    try:
        linkedin_url = "https://www.linkedin.com/jobs/search?keywords=&location=Namibia"
        resp = requests.get(linkedin_url, headers={**HEADERS, "Accept": "text/html"}, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for card in soup.select(".base-card, .job-search-card"):
                title_el = card.select_one(".base-search-card__title, h3")
                title = title_el.get_text(strip=True) if title_el else ""
                company_el = card.select_one(".base-search-card__subtitle, h4 a")
                company = company_el.get_text(strip=True) if company_el else ""
                link_el = card.select_one("a.base-card__full-link, a")
                link = link_el.get("href", "") if link_el else ""
                location_el = card.select_one(".job-search-card__location, span")
                location = location_el.get_text(strip=True) if location_el else "Namibia"

                if not title:
                    continue

                region = extract_region(location)
                guid = f"job-linkedin-{hash(title + company)}"

                results.append({
                    "name": title,
                    "url": link,
                    "source": "LinkedIn",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Job: {title} at {company}, {location}",
                    "description": f"{title} — {company}, {location}",
                    "author": None,
                    "guid": guid,
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "national",
                    "item_type": "job",
                    "metadata": {
                        "type": "job",
                        "company": company,
                        "location": location,
                        "region": region,
                        "salary": None,
                        "salaryMin": None,
                        "salaryMax": None,
                        "jobType": "Full-time",
                        "closingDate": None,
                        "postedAgo": "Recently posted",
                    },
                })
    except Exception as e:
        print(f"  [Jobs] LinkedIn error: {e}")

    return results

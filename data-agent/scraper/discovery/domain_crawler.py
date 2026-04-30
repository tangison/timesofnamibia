# ============================================================
# Times of Namibia — Domain Crawler for .NA Expansion
# Respects robots.txt, rate limits, and Broadsheet Digital ethics
# ============================================================

import requests
import time
import re
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "TimesOfNamibia-Discovery/1.0 (Broadsheet Digital)"}


class NamibiaDomainCrawler:
    """
    Crawl .na domains to discover new content sources.
    Respects robots.txt, rate limits, and Broadsheet Digital ethics.
    """

    def __init__(self, rate_limit: float = 2.0):
        self.rate_limit = rate_limit
        self.last_request = 0.0
        self.robots_cache = {}

    def _respect_robots(self, url: str) -> bool:
        """Check robots.txt before crawling."""
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"

        if base not in self.robots_cache:
            rp = RobotFileParser()
            try:
                rp.set_url(f"{base}/robots.txt")
                rp.read()
                self.robots_cache[base] = rp
            except Exception:
                return True  # Allow if no robots.txt
        return self.robots_cache[base].can_fetch("*", url)

    def _rate_limit_wait(self):
        """Enforce request spacing."""
        elapsed = time.time() - self.last_request
        if elapsed < self.rate_limit:
            time.sleep(self.rate_limit - elapsed)
        self.last_request = time.time()

    def discover_content_pages(self, domain: str) -> list[str]:
        """Find pages likely to contain news/content on a domain."""
        base_url = f"https://{domain}" if not domain.startswith("http") else domain

        if not self._respect_robots(base_url):
            print(f"  [Crawler] {domain} blocked by robots.txt")
            return []

        self._rate_limit_wait()
        content_pages = []

        # Common content URL patterns for Namibian sites
        patterns = [
            f"{base_url}/news",
            f"{base_url}/blog",
            f"{base_url}/press",
            f"{base_url}/updates",
            f"{base_url}/articles",
            f"{base_url}/media",
            f"{base_url}/announcements",
            f"{base_url}/notices",
        ]

        for url in patterns:
            try:
                self._rate_limit_wait()
                resp = requests.get(url, headers=HEADERS, timeout=10)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "lxml")
                    # Check if page has article-like content
                    articles = soup.find_all(
                        ["article", "div"],
                        class_=re.compile(r"post|news|article|entry|content"),
                    )
                    if articles:
                        content_pages.append(url)
            except Exception:
                continue

        return content_pages

    def scan_domain(self, domain: str) -> dict:
        """
        Full scan of a Namibian domain: check robots.txt, find content pages,
        discover RSS feeds, and return a structured report.
        """
        from scraper.discovery.rss_finder import find_feeds, validate_feed

        base_url = f"https://{domain}" if not domain.startswith("http") else domain
        report = {
            "domain": domain,
            "robots_allowed": self._respect_robots(base_url),
            "content_pages": [],
            "feeds": [],
            "status": "unknown",
        }

        if not report["robots_allowed"]:
            report["status"] = "blocked"
            return report

        # Find content pages
        report["content_pages"] = self.discover_content_pages(domain)

        # Discover RSS feeds
        feed_urls = find_feeds(base_url)
        for feed_url in feed_urls:
            meta = validate_feed(feed_url)
            if meta:
                report["feeds"].append(meta)

        report["status"] = "scanned"
        return report


# ── NAMIBIAN DOMAINS TO SCAN (from sources.csv) ─────────────

PRIORITY_DOMAINS = [
    # Critical
    "gov.na", "parliament.na", "legislation.gov.na", "supremecourt.na",
    "bankofnamibia.org.na", "namibian.com.na", "newera.com.na", "nampa.org.na",
    # High
    "namibiansun.com", "namibiaeconomist.com", "allafrica.com",
    "republikein.com.na", "thebrief.com.na", "nfa.com.na",
    "nsx.com.na", "nampower.com.na", "unam.edu.na", "nust.na",
    # Medium
    "informante.web.na", "observer.com.na", "az.com.na",
    "ncci.org.na", "namchamber.com", "nocr.org.na", "namibiarugby.com",
    "met.gov.na", "meft.gov.na", "mohss.gov.na", "mof.gov.na",
    "windhoekcc.org.na", "nbc.na",
]

MUNICIPAL_DOMAINS = [
    "swakopmun.com", "walvisbaycc.org.na", "oshakati.org.na",
    "ongwediva.org.na", "rundu.org.na", "katimamulilo.org.na",
    "keetmanshoop.org.na", "gobabis.org", "okahandja.org.na",
    "tsumeb.org.na", "grootfontein.org.na", "opuwo.org.na",
    "luderitz.org.na", "arandis.org.na",
]

NGO_DOMAINS = [
    "action-namibia.org", "shackdwellers.org.na", "lac.org.na",
    "namibian-human-rights.org", "environmental-defence.org.na",
    "nid.org.na", "editorsforum.org.na", "redcross.org.na",
]


def scan_all_priority_domains() -> list[dict]:
    """Scan all priority domains for content and feeds."""
    crawler = NamibiaDomainCrawler(rate_limit=2.0)
    results = []

    for domain in PRIORITY_DOMAINS:
        print(f"  [Crawler] Scanning {domain}...")
        report = crawler.scan_domain(domain)
        results.append(report)

        feeds_found = len(report["feeds"])
        pages_found = len(report["content_pages"])
        print(f"  [Crawler] {domain}: {pages_found} content pages, {feeds_found} feeds")

    return results

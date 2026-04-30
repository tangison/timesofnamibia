# ============================================================
# Times of Namibia — RSS/Atom Feed Discovery
# Automated feed discovery for Namibian domains
# ============================================================

import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import feedparser

HEADERS = {"User-Agent": "TimesOfNamibia-Discovery/1.0 (Broadsheet Digital)"}

COMMON_FEED_PATHS = [
    "feed", "rss", "atom", "rss.xml", "feed.xml", "atom.xml",
    "index.xml", "news/rss", "blog/feed", "category/news/feed",
    "feed/atom", "feeds", "news-feed", "xml/feed",
]


def find_feeds(base_url: str) -> list[str]:
    """Discover RSS/Atom feeds on a domain using 3 strategies."""
    feeds = []

    # 1. Check common paths
    for path in COMMON_FEED_PATHS:
        test_url = urljoin(base_url + "/", path)
        try:
            resp = requests.get(test_url, headers=HEADERS, timeout=8)
            if resp.status_code == 200 and _is_feed(resp.text):
                feeds.append(test_url)
        except Exception:
            continue

    # 2. Parse HTML for <link rel="alternate" type="application/rss+xml">
    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "lxml")
            for link in soup.find_all("link", rel="alternate"):
                feed_type = link.get("type", "")
                if "rss" in feed_type or "atom" in feed_type:
                    href = link.get("href")
                    if href:
                        feeds.append(urljoin(base_url, href))
    except Exception:
        pass

    # 3. Check sitemap for feed hints
    sitemap_url = urljoin(base_url + "/", "sitemap.xml")
    try:
        resp = requests.get(sitemap_url, headers=HEADERS, timeout=8)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "xml")
            for loc in soup.find_all("loc"):
                if any(ext in loc.text for ext in ["/feed", "/rss", ".xml"]):
                    feeds.append(loc.text)
    except Exception:
        pass

    return list(set(feeds))


def _is_feed(content: str) -> bool:
    """Heuristic check if content is RSS/Atom feed XML."""
    content_lower = content[:500].lower()
    return any(tag in content_lower for tag in [
        "<rss", "<feed", "<rdf", "xmlns:atom", "type=\"application/rss",
    ])


def validate_feed(url: str) -> dict | None:
    """Validate feed and extract metadata."""
    try:
        parsed = feedparser.parse(url)
        if parsed.entries and len(parsed.entries) > 0:
            return {
                "url": url,
                "title": parsed.feed.get("title", "Unknown"),
                "entries_count": len(parsed.entries),
                "last_updated": parsed.entries[0].get("published", ""),
                "sample_title": parsed.entries[0].get("title", "")[:100],
            }
    except Exception:
        pass
    return None


def discover_namibian_feeds(domains: list[str]) -> list[dict]:
    """
    Given a list of Namibian domains, discover and validate RSS feeds.
    Returns a list of valid feed metadata dicts.
    """
    discovered = []
    for domain in domains:
        base_url = f"https://{domain}" if not domain.startswith("http") else domain
        feed_urls = find_feeds(base_url)
        for feed_url in feed_urls:
            meta = validate_feed(feed_url)
            if meta:
                meta["domain"] = domain
                discovered.append(meta)
                print(f"  [Discovery] Found feed: {feed_url} ({meta['entries_count']} entries)")
    return discovered

# ============================================================
# Times of Namibia — RSS Feed Source
# Generic RSS/Atom feed scraper for any feed URL
# ============================================================

import feedparser
from datetime import datetime, timezone
from typing import Optional
from scraper.filters import is_relevant, classify_section

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}


def fetch(feed_url: str, feed_name: str = "Unknown", feed_category: str = "national") -> list[dict]:
    """
    Fetch and parse an RSS/Atom feed.
    Returns a list of normalised items.
    """
    results = []
    try:
        parsed = feedparser.parse(feed_url, request_headers=HEADERS)

        if parsed.bozo and not parsed.entries:
            print(f"  [RSS] Feed parse error for {feed_url}: {parsed.bozo_exception}")
            return results

        for entry in parsed.entries:
            title = entry.get("title", "").strip()
            link = entry.get("link", "").strip()

            if not title or not link:
                continue

            # Get the best content available
            content = ""
            if hasattr(entry, "content") and entry.content:
                content = entry.content[0].get("value", "")
            elif hasattr(entry, "summary"):
                content = entry.summary
            elif hasattr(entry, "description"):
                content = entry.description

            # Get description/snippet
            description = entry.get("summary", "") or entry.get("description", "")
            if not description and content:
                # Strip HTML for a plain-text snippet
                import re
                description = re.sub(r"<[^>]+>", "", content)[:300]

            # Author
            author = ""
            if hasattr(entry, "author"):
                author = entry.author
            elif hasattr(entry, "dc_creator"):
                author = entry.dc_creator

            # Published date
            pub_date = None
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                try:
                    pub_date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                except (TypeError, ValueError):
                    pass
            elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
                try:
                    pub_date = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
                except (TypeError, ValueError):
                    pass

            # GUID for deduplication
            guid = entry.get("id", "") or entry.get("guid", "") or link

            # Pre-filter relevance (pass category for Africa/World broad acceptance)
            full_text = f"{title} {description}"
            if not is_relevant(full_text, extra_keywords=[feed_name], category=feed_category):
                continue

            # Classify section
            section = classify_section(title, description)
            # If the feed has a specific category, prefer it
            if feed_category and feed_category.lower() not in ["general", "news"]:
                section = feed_category.lower()

            results.append({
                "name": title,
                "url": link,
                "source": feed_name,
                "date_found": datetime.now(timezone.utc).date().isoformat(),
                "content": content,
                "description": description[:500],
                "author": author or None,
                "guid": guid,
                "pub_date": pub_date.isoformat() if pub_date else None,
                "section": section,
                "item_type": "article",
            })

    except Exception as e:
        print(f"  [RSS] Error fetching {feed_url}: {e}")

    return results


# ── TON's configured RSS feeds ────────────────────────────────

TON_FEEDS = [
    {
        "name": "The Namibian",
        "url": "https://www.namibian.com.na/rss/feed.xml",
        "category": "national",
    },
    {
        "name": "New Era Namibia",
        "url": "https://neweralive.com/feed/",
        "category": "national",
    },
    {
        "name": "BBC Africa",
        "url": "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
        "category": "africa",
    },
    {
        "name": "AllAfrica",
        "url": "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",
        "category": "africa",
    },
    {
        "name": "Mining Weekly",
        "url": "https://www.miningweekly.com/rss",
        "category": "mining",
    },
    {
        "name": "ESI Africa",
        "url": "https://www.esi-africa.com/feed/",
        "category": "energy",
    },
    {
        "name": "Namibia Economist",
        "url": "https://economist.com.na/feed/",
        "category": "economy",
    },
    {
        "name": "Informante Namibia",
        "url": "https://www.informante.web.na/feed",
        "category": "national",
    },
    {
        "name": "The Guardian Nigeria - Africa",
        "url": "https://guardian.ng/category/features/africa/feed/",
        "category": "africa",
    },
    {
        "name": "Reuters World",
        "url": "https://feeds.reuters.com/Reuters/worldNews",
        "category": "world",
    },
]


def fetch_all_ton_feeds() -> list[dict]:
    """Fetch all configured TON RSS feeds."""
    all_items = []
    for feed_config in TON_FEEDS:
        print(f"  [RSS] Fetching {feed_config['name']}...")
        items = fetch(
            feed_url=feed_config["url"],
            feed_name=feed_config["name"],
            feed_category=feed_config["category"],
        )
        print(f"  [RSS] {feed_config['name']}: {len(items)} relevant items")
        all_items.extend(items)
    return all_items

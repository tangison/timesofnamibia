# ============================================================
# Times of Namibia — SQLite Storage Sync
# Writes scraped data directly to the TON SQLite database
# Compatible with Prisma schema (28 models)
# ============================================================

import sqlite3
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Resolve DB path relative to data-agent/
DEFAULT_DB_PATH = Path(__file__).parent.parent.parent / "db" / "custom.db"


def get_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Get a connection to the TON SQLite database."""
    path = Path(db_path) if db_path else DEFAULT_DB_PATH
    if not path.exists():
        print(f"  [Storage] WARNING: Database not found at {path}")
        print(f"  [Storage] Creating new database...")
        path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


# ── HELPER FUNCTIONS ──────────────────────────────────────────

def _generate_cuid() -> str:
    """Generate a CUID-like ID compatible with Prisma."""
    import random
    import string
    timestamp = format(int(datetime.now().timestamp() * 1000), '036b')
    random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))
    return f"cl{timestamp[:8]}{random_part}"


def _generate_slug(title: str, date_hint: Optional[str] = None) -> str:
    """Generate a URL-safe slug from a title."""
    base = re.sub(r'[^a-z0-9\s-]', '', title.lower())
    base = re.sub(r'[\s]+', '-', base)
    base = re.sub(r'-+', '-', base)
    base = base[:80].rstrip('-')

    date_str = ""
    if date_hint:
        date_str = f"-{date_hint[:10].replace('-', '')}"
    else:
        date_str = f"-{datetime.now().strftime('%Y%m%d')}"

    return base + date_str


def _html_to_plain(html: str) -> str:
    """Convert HTML to plain text."""
    text = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</h[1-6]>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '- ', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&quot;', '"').replace('&#39;', "'").replace('&nbsp;', ' ')
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text


def _generate_excerpt(text: str, max_length: int = 250) -> str:
    """Generate an excerpt from plain text."""
    plain = re.sub(r'<[^>]+>', '', text).replace('\n', ' ').strip()
    if len(plain) <= max_length:
        return plain
    return plain[:max_length].rsplit(' ', 1)[0] + "..."


def _estimate_reading_time(text: str) -> int:
    """Estimate reading time at 230 WPM."""
    words = len(text.split())
    return max(1, round(words / 230))


def _get_or_create_category(conn: sqlite3.Connection, section: str) -> Optional[str]:
    """Get category ID by slug, or return None."""
    # Map section names to category slugs
    slug_map = {
        "national": "national",
        "economy": "economy",
        "mining": "mining",
        "energy": "energy",
        "politics": "politics",
        "africa": "africa",
        "world": "world",
        "sport": "sport",
        "infrastructure": "infrastructure",
        "environment": "environment",
        "technology": "technology",
        "opinion": "opinion",
    }
    slug = slug_map.get(section, section)
    row = conn.execute("SELECT id FROM Category WHERE slug = ?", (slug,)).fetchone()
    return row["id"] if row else None


# ── DEDUPLICATION ─────────────────────────────────────────────

def get_existing_article_urls(conn: sqlite3.Connection) -> set:
    """Fetch all existing article GUIDs/URLs for deduplication."""
    rows = conn.execute("SELECT rssGuid FROM Article WHERE rssGuid IS NOT NULL").fetchall()
    guids = {row["rssGuid"] for row in rows}
    rows2 = conn.execute("SELECT slug FROM Article").fetchall()
    slugs = {row["slug"] for row in rows2}
    return guids | slugs


def get_existing_tender_doc_ids(conn: sqlite3.Connection) -> set:
    """Fetch all existing tender doc IDs."""
    rows = conn.execute("SELECT docId FROM Tender").fetchall()
    return {row["docId"] for row in rows}


def get_existing_job_guids(conn: sqlite3.Connection) -> set:
    """Fetch all existing job GUIDs (derived from title+company hash)."""
    rows = conn.execute("SELECT title, company FROM Job WHERE active = 1").fetchall()
    return {f"{row['title']}|{row['company']}" for row in rows}


def get_existing_market_pairs(conn: sqlite3.Connection) -> set:
    """Fetch all existing market data pairs."""
    rows = conn.execute("SELECT pair FROM MarketDatum WHERE active = 1").fetchall()
    return {row["pair"] for row in rows}


# ── SYNC FUNCTIONS ────────────────────────────────────────────

def sync_articles(conn: sqlite3.Connection, items: list[dict]) -> tuple[int, int]:
    """
    Sync article items to the database.
    Returns (added, skipped) counts.
    """
    existing = get_existing_article_urls(conn)
    added = skipped = 0

    for item in items:
        if item.get("item_type") != "article":
            continue

        guid = item.get("guid", "")
        slug = _generate_slug(item["name"], item.get("date_found"))

        # Dedup check
        if guid in existing or slug in existing:
            skipped += 1
            continue

        content = item.get("content", "")
        plain_content = _html_to_plain(content) if '<' in content else content

        if len(plain_content) < 50:
            # Content too short, create with what we have
            plain_content = plain_content or item.get("description", "Content pending.")

        category_id = _get_or_create_category(conn, item.get("section", "national"))

        now = datetime.now(timezone.utc).isoformat()
        pub_date = item.get("pub_date", now)

        try:
            article_id = _generate_cuid()
            conn.execute("""
                INSERT INTO Article (
                    id, slug, headline, subheadline, content, excerpt,
                    source, categorySlug, section, readingTime,
                    authorLine, published, publishedAt,
                    categoryId, rssGuid, rssFetchedAt,
                    featured, views, commentCount, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                article_id,
                slug,
                item["name"],
                _generate_excerpt(item.get("description", ""), 180),
                plain_content,
                _generate_excerpt(item.get("description", ""), 250),
                "rss",
                item.get("section", "national"),
                item.get("section", "national"),
                _estimate_reading_time(plain_content),
                item.get("author") or item.get("source", "TON Editorial"),
                1,  # published = true
                pub_date,
                category_id,
                guid,
                now,
                0,  # featured
                0,  # views
                0,  # commentCount
                now,
                now,
            ))
            conn.commit()
            existing.add(guid)
            existing.add(slug)
            added += 1
        except sqlite3.IntegrityError as e:
            print(f"  [Storage] Article dedup: {e}")
            skipped += 1
        except Exception as e:
            print(f"  [Storage] Article insert error: {e}")
            skipped += 1

    return added, skipped


def sync_tenders(conn: sqlite3.Connection, items: list[dict]) -> tuple[int, int]:
    """
    Sync tender items to the database.
    Returns (added, skipped) counts.
    """
    existing_doc_ids = get_existing_tender_doc_ids(conn)
    added = skipped = 0

    for item in items:
        if item.get("item_type") != "tender":
            continue

        metadata = item.get("metadata", {})
        doc_id = metadata.get("docId", f"GRN-{datetime.now().year}-{hash(item['name']) % 10000:04d}")

        if doc_id in existing_doc_ids:
            skipped += 1
            continue

        now = datetime.now(timezone.utc).isoformat()
        deadline = metadata.get("deadline", item.get("pub_date", now))

        try:
            tender_id = _generate_cuid()
            conn.execute("""
                INSERT INTO Tender (
                    id, docId, title, department, deadline,
                    estimatedValue, valueMin, valueMax, status,
                    active, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                tender_id,
                doc_id,
                item["name"],
                metadata.get("department", item.get("source", "Unknown")),
                deadline,
                metadata.get("estimatedValue"),
                metadata.get("valueMin"),
                metadata.get("valueMax"),
                metadata.get("status", "open"),
                1,  # active
                now,
                now,
            ))
            conn.commit()
            existing_doc_ids.add(doc_id)
            added += 1
        except sqlite3.IntegrityError:
            skipped += 1
        except Exception as e:
            print(f"  [Storage] Tender insert error: {e}")
            skipped += 1

    return added, skipped


def sync_jobs(conn: sqlite3.Connection, items: list[dict]) -> tuple[int, int]:
    """
    Sync job items to the database.
    Returns (added, skipped) counts.
    """
    existing_jobs = get_existing_job_guids(conn)
    added = skipped = 0

    for item in items:
        if item.get("item_type") != "job":
            continue

        metadata = item.get("metadata", {})
        job_key = f"{item['name']}|{metadata.get('company', 'Unknown')}"

        if job_key in existing_jobs:
            skipped += 1
            continue

        now = datetime.now(timezone.utc).isoformat()

        try:
            job_id = _generate_cuid()
            conn.execute("""
                INSERT INTO Job (
                    id, title, company, location, region,
                    source, salary, salaryMin, salaryMax,
                    type, description, closingDate, url,
                    postedAgo, scrapedAt, active, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                job_id,
                item["name"],
                metadata.get("company", "Not specified"),
                metadata.get("location", "Namibia"),
                metadata.get("region"),
                item.get("source", "Data Agent"),
                metadata.get("salary"),
                metadata.get("salaryMin"),
                metadata.get("salaryMax"),
                metadata.get("jobType", "Full-time"),
                item.get("description"),
                metadata.get("closingDate"),
                item.get("url"),
                metadata.get("postedAgo", "Just scraped"),
                now,
                1,  # active
                now,
                now,
            ))
            conn.commit()
            existing_jobs.add(job_key)
            added += 1
        except sqlite3.IntegrityError:
            skipped += 1
        except Exception as e:
            print(f"  [Storage] Job insert error: {e}")
            skipped += 1

    return added, skipped


def sync_market_data(conn: sqlite3.Connection, items: list[dict]) -> tuple[int, int]:
    """
    Sync market data items (upsert by pair).
    Returns (updated, skipped) counts.
    """
    updated = skipped = 0

    for item in items:
        if item.get("item_type") != "market":
            continue

        metadata = item.get("metadata", {})
        pair = metadata.get("pair", item.get("name", ""))
        rate = metadata.get("rate", "")
        change = metadata.get("change", "+0.0%")
        direction = metadata.get("direction", "flat")
        source = metadata.get("source", "Data Agent")

        if not pair or not rate:
            skipped += 1
            continue

        now = datetime.now(timezone.utc).isoformat()

        try:
            # Check if pair exists
            existing = conn.execute("SELECT id FROM MarketDatum WHERE pair = ? AND active = 1", (pair,)).fetchone()

            if existing:
                conn.execute("""
                    UPDATE MarketDatum SET rate = ?, change = ?, direction = ?, source = ?, updatedAt = ?
                    WHERE pair = ? AND active = 1
                """, (rate, change, direction, source, now, pair))
            else:
                conn.execute("""
                    INSERT INTO MarketDatum (id, pair, rate, change, direction, source, active, updatedAt, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
                """, (_generate_cuid(), pair, rate, change, direction, source, now, now))

            conn.commit()
            updated += 1
        except Exception as e:
            print(f"  [Storage] Market data error: {e}")
            skipped += 1

    return updated, skipped


def sync(items: list[dict], db_path: Optional[str] = None) -> dict:
    """
    Main sync function: categorise items and sync to appropriate tables.
    Returns a summary of all operations.
    """
    summary = {
        "articles": {"added": 0, "skipped": 0},
        "tenders": {"added": 0, "skipped": 0},
        "jobs": {"added": 0, "skipped": 0},
        "markets": {"updated": 0, "skipped": 0},
    }

    # Partition items by type
    articles = [item for item in items if item.get("item_type") == "article"]
    tenders = [item for item in items if item.get("item_type") == "tender"]
    jobs = [item for item in items if item.get("item_type") == "job"]
    markets = [item for item in items if item.get("item_type") == "market"]

    conn = get_connection(db_path)
    try:
        if articles:
            added, skipped = sync_articles(conn, articles)
            summary["articles"] = {"added": added, "skipped": skipped}

        if tenders:
            added, skipped = sync_tenders(conn, tenders)
            summary["tenders"] = {"added": added, "skipped": skipped}

        if jobs:
            added, skipped = sync_jobs(conn, jobs)
            summary["jobs"] = {"added": added, "skipped": skipped}

        if markets:
            updated, skipped = sync_market_data(conn, markets)
            summary["markets"] = {"updated": updated, "skipped": skipped}

    finally:
        conn.close()

    return summary

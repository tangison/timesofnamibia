from urllib.parse import urlparse


NOISE_PATTERNS = (
    "archives",
    "archive",
    "category/",
    "tag/",
    "digital-subscription",
    "subscribe",
    "privacy",
    "terms",
    "contact",
    "author/",
    "advert",
    "login",
)

NOISE_TEXT = (
    "no posts found",
    "no pinned posts",
    "all rights reserved",
    "digital subscription",
    "copyright",
)


def same_domain(url: str, allowed_domains: tuple[str, ...]) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return any(host == d or host.endswith(f".{d}") for d in allowed_domains)


def is_noise_url(url: str) -> bool:
    u = url.lower()
    return any(p in u for p in NOISE_PATTERNS)


def is_quality_content(title: str, content: str, min_len: int = 180) -> bool:
    if not title or len(title.strip()) < 10:
        return False
    blob = f"{title} {content}".lower()
    if any(p in blob for p in NOISE_TEXT):
        return False
    if len((content or "").strip()) < min_len:
        return False
    return True

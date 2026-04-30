# ============================================================
# Times of Namibia — Rule-Based Pre-Filter
# Fast keyword filtering before AI enrichment
# ============================================================

import yaml
from pathlib import Path
from typing import Optional


def load_config() -> dict:
    """Load the main config.yaml."""
    config_path = Path(__file__).parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


def is_relevant(text: str, extra_keywords: Optional[list[str]] = None, category: Optional[str] = None) -> bool:
    """
    Check if a piece of text is relevant based on config filters.
    Must contain at least one required keyword (if any defined).
    Must not contain any blocked keyword.
    For Africa/World feeds, relevance is assumed (broader scope).
    """
    if not text:
        return False

    # Africa and World feeds are always relevant (broader editorial scope)
    if category and category.lower() in ("africa", "world"):
        config = load_config()
        blocked = config.get("filters", {}).get("blocked_keywords", [])
        text_lower = text.lower()
        for keyword in blocked:
            if keyword.lower() in text_lower:
                return False
        return True  # Accept all non-blocked Africa/World content

    config = load_config()
    filters = config.get("filters", {})

    required = filters.get("required_keywords", [])
    blocked = filters.get("blocked_keywords", [])

    if extra_keywords:
        required = required + extra_keywords

    text_lower = text.lower()

    # Check blocked keywords first (hard filter)
    for keyword in blocked:
        if keyword.lower() in text_lower:
            return False

    # Check required keywords (soft match — any one is enough)
    if required:
        return any(kw.lower() in text_lower for kw in required)

    return True  # No required keywords defined = accept all


def classify_section(title: str, description: str = "") -> str:
    """
    Classify an item into a TON editorial section based on keywords.
    Returns one of the 12 category slugs from the taxonomy.
    """
    text = f"{title} {description}".lower()

    section_keywords = {
        "national": ["namibia", "windhoek", "government", "parliament", "cabinet",
                      "president", "state house", "office of the prime minister",
                      " Swapo", "opposition", "ruling party"],
        "economy": ["economy", "gdp", "inflation", "repo rate", "bank of namibia",
                     "trade", "investment", "fiscal", "budget", "treasury",
                     "import", "export", "sanctions"],
        "mining": ["mining", "diamond", "uranium", "gold", "copper", "zinc",
                    "rossing", "namdeb", "debmarine", "mineral", "exploration license",
                    "epl", "ore", "quarry"],
        "energy": ["energy", "hydrogen", "solar", "wind farm", "nampower", "ecb",
                    "renewable", "oil", "gas", "kudu gas", "feed-in tariff",
                    "electricity", "power station", "desalination"],
        "politics": ["politic", "election", "swapo", "parliament", "mp ", "member of parliament",
                      "legislature", "bill ", "act of parliament", "vote", "campaign",
                      "party congress", "politicburo"],
        "africa": ["africa", "african union", "sadc", "continental", "pan-african",
                    "regional bloc"],
        "world": ["international", "global", "un security", "g7", "g20", "eu ",
                   "china", "us ", "uk ", "russia", "ukraine"],
        "sport": ["football", "soccer", "brave warriors", "npl", "rugby", "cricket",
                   "athletics", "netball", "welwitschias", "olympic", "cosafa",
                   "afcon", "world cup", "league", "championship"],
        "infrastructure": ["road", "highway", "port", "railway", "airport", "bridge",
                            "construction", "infrastructure", "trans-kalahari",
                            "walvis bay", "namport", "broadband", "fiber"],
        "environment": ["environment", "climate", "conservation", "drought", "desert",
                         "wildlife", "poaching", "rhino", "elephant", "etosha",
                         "water", "dam", "aquifer"],
        "technology": ["technology", "digital", "broadband", "internet", "5g",
                        "startup", "innovation", "mtec", "ict", "software", "ai "],
        "opinion": ["opinion", "editorial", "column", "commentary", "analysis",
                     "letter to the editor", "guest column", "viewpoint"],
    }

    for section, keywords in section_keywords.items():
        for kw in keywords:
            if kw.lower() in text:
                return section

    return "national"  # Default fallback


def extract_region(text: str) -> str | None:
    """Extract a Namibian region from text if mentioned."""
    regions = [
        "//Kharas", "Oshana", "Khomas", "Erongo", "Otjozondjupa",
        "Kavango East", "Kavango West", "Zambezi", "Ohangwena",
        "Omusati", "Oshikoto", "Kunene", "Hardap", "Omaheke",
    ]
    text_lower = text.lower()
    for region in regions:
        if region.lower() in text_lower:
            return region
    return None

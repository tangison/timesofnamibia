# ============================================================
# Times of Namibia — Gemini AI Client
# REST client with model fallback chain on quota exhaustion
# ============================================================

import os
import json
import time
import requests
from typing import Optional

_last_call = 0.0

MODEL_FALLBACK = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest",
]


def generate(prompt: str, model: str = "", rate_limit: float = 7.0) -> dict:
    """
    Call Gemini with auto-fallback on 429/404.
    Returns parsed JSON or empty dict on failure.
    """
    global _last_call

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return {}

    # Rate limiting
    elapsed = time.time() - _last_call
    if elapsed < rate_limit:
        time.sleep(rate_limit - elapsed)

    # Build model list: preferred model first, then fallbacks
    models = [model] + [m for m in MODEL_FALLBACK if m != model] if model else MODEL_FALLBACK
    _last_call = time.time()

    for m in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.3,
                "maxOutputTokens": 2048,
            },
        }
        try:
            resp = requests.post(url, json=payload, timeout=30)
            if resp.status_code == 200:
                return _parse(resp)
            if resp.status_code in (429, 404):
                print(f"  [AI] Model {m} returned {resp.status_code}, falling back...")
                time.sleep(1)
                continue
            print(f"  [AI] Model {m} returned {resp.status_code}: {resp.text[:200]}")
            return {}
        except requests.RequestException as e:
            print(f"  [AI] Request error with model {m}: {e}")
            return {}

    print("  [AI] All models exhausted")
    return {}


def _parse(resp) -> dict:
    """Parse Gemini API response into a Python dict."""
    try:
        text = (
            resp.json()
            .get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
            .strip()
        )
        if text.startswith("```"):
            text = text.split("\n", 1)[-1].rsplit("```", 1)[0]
        return json.loads(text)
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        print(f"  [AI] Parse error: {e}")
        return {}


def classify_item(title: str, description: str = "") -> dict:
    """
    Quick single-item classification using Gemini.
    Returns: {"section": str, "relevance": 0-100, "summary": str}
    """
    prompt = f"""Classify this news item for the Times of Namibia editorial taxonomy.

Title: {title}
Description: {description[:500]}

Return JSON:
{{
  "section": "one of: national, economy, mining, energy, politics, africa, world, sport, infrastructure, environment, technology, opinion",
  "relevance": <0-100 score for Namibian audience>,
  "summary": "<2-sentence summary>"
}}"""

    result = generate(prompt, model="gemini-2.0-flash-lite", rate_limit=5.0)
    if result:
        return result
    return {"section": "national", "relevance": 50, "summary": description[:200]}

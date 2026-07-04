#!/usr/bin/env python3
"""
fetch_place_images.py - Downloads Wikipedia lead images for Namibia places.
Uses proper User-Agent and gzip handling per Wikipedia API policy.
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request
import gzip

OUT_DIR = "downloaded_images"
API = "https://en.wikipedia.org/w/api.php"
HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app; admin@timesofnamibia.com)",
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
}

PLACES = [
    ("dorob-national-park", "Dorob National Park", "Dorob National Park"),
    ("waterberg-plateau-park", "Waterberg Plateau Park", "Waterberg Plateau Park"),
    ("fish-river-canyon", "Fish River Canyon", "Fish River Canyon"),
    ("mudumu-national-park", "Mudumu National Park", "Mudumu National Park"),
    ("bwabwata-national-park", "Bwabwata National Park", "Bwabwata National Park"),
    ("nkasa-rupara-national-park", "Nkasa Rupara National Park", "Nkasa Rupara National Park"),
    ("sossusvlei", "Sossusvlei", "Sossusvlei"),
    ("deadvlei", "Deadvlei", "Deadvlei"),
    ("ai-ais", "Ai-Ais Hot Springs Game Park", "Ai-Ais"),
    ("spitzkoppe", "Spitzkoppe", "Spitzkoppe"),
    ("dune-45", "Dune 45", "Dune 45"),
    ("brandberg-mountain", "Brandberg Mountain", "Brandberg Mountain"),
    ("twyfelfontein", "Twyfelfontein", "Twyfelfontein"),
    ("epupa-falls", "Epupa Falls", "Epupa Falls"),
    ("cape-cross", "Cape Cross", "Cape Cross"),
    ("kolmanskop", "Kolmanskop", "Kolmanskop"),
    ("sandwich-harbour", "Sandwich Harbour", "Sandwich Harbour"),
    ("windhoek", "Windhoek", "Windhoek"),
    ("swakopmund", "Swakopmund", "Swakopmund"),
    ("luderitz", "Lüderitz", "Luderitz"),
    ("walvis-bay", "Walvis Bay", "Walvis Bay"),
    ("tsumeb", "Tsumeb", "Tsumeb"),
    ("otjiwarongo", "Otjiwarongo", "Otjiwarongo"),
    ("gobabis", "Gobabis", "Gobabis"),
    ("desert-elephant", "Desert elephant", "Desert elephant"),
    ("black-rhinoceros", "Black rhinoceros", "Black rhinoceros"),
    ("leopard", "Leopard", "Leopard"),
    ("cheetah", "Cheetah", "Cheetah"),
    ("gemsbok", "Gemsbok", "Gemsbok"),
    ("burnt-mountain", "Burnt Mountain (Namibia)", "Burnt Mountain (Namibia)"),
    ("hartmanns-mountain-zebra", "Hartmann's mountain zebra", "Hartmann's mountain zebra"),
    ("welwitschia", "Welwitschia", "Welwitschia"),
    ("organ-pipes", "Organ Pipes (Namibia)", "Organ Pipes (Namibia)"),
    ("himba-people", "Himba people", "Himba people"),
    ("sesriem-canyon", "Sesriem", "Sesriem Canyon"),
    ("alte-feste", "Alte Feste", "Alte Feste"),
]

def api_get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read()
        if resp.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return json.loads(raw.decode("utf-8"))

def get_lead_image(title):
    data = api_get({
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "piprop": "original",
        "redirects": "1",
        "format": "json",
    })
    pages = data.get("query", {}).get("pages", {})
    for _, page in pages.items():
        original = page.get("original")
        if original:
            return original["source"], os.path.basename(original["source"])
    return None, None

def download(url, dest_path):
    req = urllib.request.Request(url, headers={
        "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app; admin@timesofnamibia.com)",
    })
    with urllib.request.urlopen(req, timeout=30) as resp, open(dest_path, "wb") as f:
        f.write(resp.read())

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    missing = []

    for slug, wiki_title, display_name in PLACES:
        try:
            img_url, file_title = get_lead_image(wiki_title)
            if not img_url:
                print(f"[MISS] {display_name} ({wiki_title}) - no lead image found")
                missing.append({"slug": slug, "title": wiki_title, "display_name": display_name})
                continue

            ext = os.path.splitext(img_url)[1].split("?")[0] or ".jpg"
            dest = os.path.join(OUT_DIR, f"{slug}{ext}")
            download(img_url, dest)

            commons_file_page = None
            if file_title:
                commons_file_page = "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(file_title)

            manifest[slug] = {
                "display_name": display_name,
                "wikipedia_title": wiki_title,
                "image_url": img_url,
                "commons_file_page": commons_file_page,
                "local_path": dest,
            }
            print(f"[OK]   {display_name} -> {dest}")
            time.sleep(0.3)
        except Exception as e:
            print(f"[ERROR] {display_name}: {e}")
            missing.append({"slug": slug, "title": wiki_title, "display_name": display_name, "error": str(e)})

    with open(os.path.join(OUT_DIR, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    with open(os.path.join(OUT_DIR, "missing.json"), "w") as f:
        json.dump(missing, f, indent=2)

    print(f"\nDone. {len(manifest)} images downloaded, {len(missing)} missing.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
optimize_images.py - Resize and convert all downloaded images to 1200x675 WebP.
"""
import os
import json
from PIL import Image

OUT_DIR = "downloaded_images"
OPT_DIR = "downloaded_images/optimized"

os.makedirs(OPT_DIR, exist_ok=True)

TARGET_W, TARGET_H = 1200, 675

manifest_path = os.path.join(OUT_DIR, "manifest.json")
with open(manifest_path) as f:
    manifest = json.load(f)

# Add ai-ais manually
manifest["ai-ais"] = {
    "display_name": "Ai-Ais",
    "wikipedia_title": "Ai-Ais Hot Springs Game Park",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Ai_Ais_SPA.jpg",
    "commons_file_page": "https://commons.wikimedia.org/wiki/File:Ai_Ais_SPA.jpg",
    "local_path": os.path.join(OUT_DIR, "ai-ais.jpg"),
}

optimized = {}
for slug, info in manifest.items():
    src = info["local_path"]
    if not os.path.exists(src):
        print(f"[SKIP] {slug} - file not found: {src}")
        continue

    dest = os.path.join(OPT_DIR, f"{slug}.webp")
    try:
        img = Image.open(src)
        # Convert RGBA to RGB for WebP
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        # Crop to target aspect ratio (16:9) then resize
        src_ratio = img.width / img.height
        target_ratio = TARGET_W / TARGET_H
        if src_ratio > target_ratio:
            # Too wide - crop sides
            new_w = int(img.height * target_ratio)
            left = (img.width - new_w) // 2
            img = img.crop((left, 0, left + new_w, img.height))
        elif src_ratio < target_ratio:
            # Too tall - crop top/bottom
            new_h = int(img.width / target_ratio)
            top = (img.height - new_h) // 2
            img = img.crop((0, top, img.width, top + new_h))

        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        img.save(dest, "WEBP", quality=80)
        print(f"[OK] {slug} -> {dest} ({os.path.getsize(dest) // 1024}KB)")
        optimized[slug] = {
            **info,
            "webp_path": dest,
            "webp_size": os.path.getsize(dest),
        }
    except Exception as e:
        print(f"[ERROR] {slug}: {e}")

# Save updated manifest
with open(os.path.join(OPT_DIR, "manifest.json"), "w") as f:
    json.dump(optimized, f, indent=2)

print(f"\nDone. {len(optimized)} images optimized to WebP.")

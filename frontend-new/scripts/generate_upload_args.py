#!/usr/bin/env python3
"""
generate_upload_args.py - Generates JSON args for the Convex upload action.
Reads the manifest and outputs a JSON array of {slug, imageUrl, displayName, commonsUrl}
that can be passed to: npx convex run actions/uploadPlaceImages:triggerUploadPlaceImages
"""

import json
import os

MANIFEST_PATH = "downloaded_images/optimized/manifest.json"

with open(MANIFEST_PATH) as f:
    manifest = json.load(f)

places = []
for slug, info in manifest.items():
    places.append({
        "slug": slug,
        "imageUrl": info.get("image_url", ""),
        "displayName": info.get("display_name", slug),
        "commonsUrl": info.get("commons_file_page", ""),
    })

# Output as JSON argument for convex run
args = {
    "adminToken": os.environ.get("CONVEX_ADMIN_TOKEN", "REPLACE_WITH_TOKEN"),
    "places": places,
}

print(json.dumps(args))

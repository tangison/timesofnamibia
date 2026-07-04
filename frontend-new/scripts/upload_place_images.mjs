#!/usr/bin/env node
/**
 * upload_place_images.js - Uploads optimized WebP images to Convex storage
 * and updates each directory_places record with the image URL + alt text.
 *
 * Reads the manifest from downloaded_images/optimized/manifest.json
 * For each place: uploads the WebP to Convex storage, gets the URL,
 * then patches the directory_places record.
 */

import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://exuberant-ladybug-733.convex.cloud";
const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("CONVEX_ADMIN_TOKEN env var required");
  process.exit(1);
}

const OPT_DIR = path.join(process.cwd(), "downloaded_images", "optimized");
const MANIFEST_PATH = path.join(OPT_DIR, "manifest.json");

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const client = new ConvexHttpClient(CONVEX_URL);

  let success = 0;
  let failed = 0;
  const errors = [];

  for (const [slug, info] of Object.entries(manifest)) {
    try {
      const webpPath = info.webp_path;
      if (!fs.existsSync(webpPath)) {
        console.warn(`[SKIP] ${slug} - WebP file not found: ${webpPath}`);
        failed++;
        continue;
      }

      // Read the WebP file as a Buffer
      const imageBuffer = fs.readFileSync(webpPath);
      const blob = new Blob([imageBuffer], { type: "image/webp" });

      console.log(`[UPLOAD] ${slug} (${(imageBuffer.length / 1024).toFixed(0)}KB)...`);

      // We can't directly upload to Convex storage from outside.
      // Instead, we'll use a mutation that accepts the image as a File argument.
      // Convex doesn't support file uploads from external clients directly.
      //
      // Alternative: use the Convex upload URL endpoint.
      // The Convex client has a method to upload files.
      //
      // Actually, ConvexHttpClient doesn't support file uploads.
      // We need to use the Convex upload endpoint directly.

      // Step 1: Get upload URL from Convex
      const uploadUrlResponse = await fetch(`${CONVEX_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "image/webp",
        },
        body: imageBuffer,
      });

      if (!uploadUrlResponse.ok) {
        throw new Error(`Upload failed: HTTP ${uploadUrlResponse.status}`);
      }

      const { storageId } = await uploadUrlResponse.json();

      // Step 2: Get the storage URL
      const storageUrl = await client.query(api.queries.getStorageUrl, { storageId });

      if (!storageUrl) {
        throw new Error("Could not get storage URL");
      }

      // Step 3: Build the image object
      const altText = `${info.display_name} - ${info.display_name}`;
      const imageObj = {
        url: info.image_url || storageUrl,
        webp_url: storageUrl,
        caption: info.display_name,
        source: "Wikimedia Commons",
        license: info.commons_file_page || "CC-BY-SA",
        alt_text: altText,
      };

      // Step 4: Update the directory place with the image
      // We need a mutation that adds images to an existing place
      await client.mutation(api.mutationsAdmin.updateDirectoryPlaceImages, {
        adminToken: ADMIN_TOKEN,
        slug,
        images: [imageObj],
      });

      console.log(`[OK] ${slug} -> ${storageUrl}`);
      success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] ${slug}: ${msg}`);
      errors.push(`${slug}: ${msg}`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} uploaded, ${failed} failed.`);
  if (errors.length > 0) {
    console.log("Errors:", errors.slice(0, 10));
  }
}

main().catch(console.error);

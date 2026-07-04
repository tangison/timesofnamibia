// ============================================================
// Times of Namibia - WebP Image Conversion (Phase 2, Iteration 14)
//
// Converts images to WebP format (quality 80) using sharp.
// Accepts a Blob, returns a WebP Blob.
// Used by RSS article ingestion and directory place seeding.
//
// NOTE: sharp requires platform-specific binaries. On Convex's
// serverless runtime, sharp may not load. If it fails, the
// function returns null and the caller stores the original blob.
// The frontend serves whatever format is stored - browsers
// handle JPEG/PNG natively.
// ============================================================

"use node";

let sharpModule: any = null;
try {
// eslint-disable-next-line @typescript-eslint/no-require-imports
  sharpModule = require("sharp");
} catch (err) {
  console.warn("[webp] sharp not available on this platform - images will be stored in original format");
}

/**
 * Convert an image Blob to WebP format (quality 80).
 * Returns the WebP Blob, or null if sharp is unavailable or conversion fails.
 */
export async function convertToWebp(blob: Blob): Promise<Blob | null> {
  if (!sharpModule) return null;
  try {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const webpBuffer = await sharpModule(buffer)
      .webp({ quality: 80 })
      .toBuffer();
    return new Blob([new Uint8Array(webpBuffer)], { type: "image/webp" });
  } catch (err) {
    console.warn("[webp] Conversion failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Generate descriptive alt text for an article image.
 * Format: "{headline} - {category}"
 */
export function generateArticleAltText(headline: string, category: string): string {
  const cleanHeadline = headline.replace(/["""]/g, "").trim();
  const cleanCategory = category.charAt(0).toUpperCase() + category.slice(1);
  return `${cleanHeadline} - ${cleanCategory}`.slice(0, 200);
}

/**
 * Generate descriptive alt text for a directory place image.
 * Format: "{caption} - {placeName}"
 */
export function generateDirectoryAltText(caption: string, placeName: string): string {
  const cleanCaption = caption.replace(/<[^>]*>/g, "").trim().slice(0, 120);
  const cleanName = placeName.trim();
  if (cleanCaption) {
    return `${cleanCaption} - ${cleanName}`.slice(0, 200);
  }
  return cleanName.slice(0, 200);
}

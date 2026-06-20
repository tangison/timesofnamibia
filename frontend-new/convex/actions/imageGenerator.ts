// ============================================================
// Times of Namibia — Article Image Generator (TANGISON)
//
// Generates a Harvard Business Review-style minimalist editorial
// illustration for each article using Pollinations.ai.
//
// Brand palette is enforced via the prompt itself (navy #0B1D3A,
// light gray #F2F2F2, muted tones) rather than post-processing
// with sharp, because Convex's runtime doesn't support native
// modules like sharp.
//
// Pipeline:
//   1. Build prompt from {title, category, summary} with brand colors
//   2. Fetch image from Pollinations.ai (no API key needed)
//   3. Return Blob for Convex storage
// ============================================================

"use node";

// ── TYPES ────────────────────────────────────────────────────

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
}

export interface ImageGenOptions {
  width?: number;
  height?: number;
  seed?: number;
}

// ── PROMPT BUILDER ───────────────────────────────────────────
// Enforces HBR minimalist editorial style + brand palette in the
// prompt itself. Pollinations/Flux will respect color hints.

function buildImagePrompt({ title, category, summary }: ArticleInput): string {
  return [
    `Minimalist editorial illustration representing a ${category} story: "${title}".`,
    "Flat vector style, one or two clear focal elements only, large negative space.",
    "No text, no numbers, no logos, no watermark, no human faces, no busy background.",
    "High-end business magazine cover aesthetic.",
    "Color palette: deep navy blue (#0B1D3A) for dark areas, light gray (#F2F2F2) for",
    "backgrounds, muted mid-gray (#6D6D6D) for secondary elements. Restrained, muted,",
    "desaturated tones — no bright saturated colors, no neon.",
    "Calm lighting, professional and sophisticated composition.",
  ].join(" ");
}

// ── POLLINATIONS.AI FETCH ────────────────────────────────────

async function fetchPollinationsImage(
  article: ArticleInput,
  opts?: ImageGenOptions
): Promise<Blob> {
  const prompt = buildImagePrompt(article);
  const encoded = encodeURIComponent(prompt);

  const params = new URLSearchParams({
    width: String(opts?.width ?? 1200),
    height: String(opts?.height ?? 675), // 16:9 for hero card
    nologo: "true",
    model: "flux",
    ...(opts?.seed ? { seed: String(opts.seed) } : {}),
  });

  const url = `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(30_000), // generation can be slow
    headers: {
      "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`Pollinations request failed: ${res.status} ${res.statusText}`);
  }

  return await res.blob();
}

// ── MAIN EXPORT ──────────────────────────────────────────────

export async function generateArticleImage(
  article: ArticleInput,
  opts?: ImageGenOptions
): Promise<Blob> {
  return fetchPollinationsImage(article, opts);
}

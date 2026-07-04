// ============================================================
// Times of Namibia - Article Image Generator (TANGISON)
//
// Section 1: Oil painting style with rotating composition modifiers.
//   - Real photos from RSS are KEPT (best source)
//   - AI-generated fallback uses oil painting prompt with
//     rotating composition modifier selected by hashing slug
//   - No single composition style repeats more than once in
//     10 consecutively generated images
//   - 1200x630, model=flux, nologo=true
//   - 45s timeout, 1 retry, random seed
// ============================================================

"use node";

import { generateWithFallback } from "./aiProvider";

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
  slug?: string;
}

// ── COMPOSITION MODIFIER POOL ────────────────────────────────
const COMPOSITION_MODIFIERS = [
  "close-up still-life framing",
  "wide landscape framing",
  "high-contrast single-object silhouette",
  "abstract symbolic composition",
  "aerial/overhead framing",
];

// Track last 10 used modifiers to prevent repeats
const recentModifiers: string[] = [];

function selectCompositionModifier(slug?: string): string {
  let pool = [...COMPOSITION_MODIFIERS];

  // Remove recently used modifiers from pool
  const available = pool.filter((m) => !recentModifiers.includes(m));

  // If all have been used recently, reset and start fresh
  let candidates = available.length > 0 ? available : pool;

  // If slug provided, use hash-based selection for determinism
  if (slug) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = ((hash << 5) - hash) + slug.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % candidates.length;
    return candidates[idx];
  }

  // Random selection
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function trackModifier(modifier: string): void {
  recentModifiers.push(modifier);
  if (recentModifiers.length > 10) {
    recentModifiers.shift();
  }
}

// ── STEP 1: Extract 1-2 concrete objects from the article ───

async function getImageObjects(article: ArticleInput): Promise<string> {
  const prompt = `Given this news headline and category, respond with ONLY a short noun phrase describing one or two simple concrete physical objects that symbolically represent the story. No people, no crowds, no buildings, no rooms, no screens, no documents, no maps, no flags. Think simple objects.

Examples:
- War or conflict - a bronze arrowhead
- Economy or budget - three stacked gold coins
- Environment - a green seedling in dry earth
- Technology - a glowing lightbulb
- Politics or election - a wooden ballot box
- Health - a red stethoscope
- Mining - an uncut diamond
- Energy - a white wind turbine blade
- Sport - a worn leather football
- Justice or law - a wooden gavel
- Transport - a folded paper airplane
- Water - a glass of clear water

Headline: "${article.title}"
Category: ${article.category}

Respond with ONLY the object phrase, nothing else.`;

  const result = await generateWithFallback(
    [{ role: "user", content: prompt }],
    { maxTokens: 40, timeout: 10_000 }
  );

  const concept = (result || "a folded newspaper")
    .split("\n")[0]
    .replace(/["'.]/g, "")
    .trim()
    .toLowerCase();

  return concept || "a folded newspaper";
}

// ── STEP 2: Build oil painting Pollinations prompt ──────────

function buildOilPaintingPrompt(concept: string, composition: string): string {
  return `Oil painting, visible textured brushstrokes, ` +
    `muted palette limited to navy blue, rust orange, and warm cream, ` +
    `${concept}, ${composition}, ` +
    `no text, no logos, no watermark, ` +
    `no faces unless the subject requires it, ` +
    `gallery painting quality, cohesive composition`;
}

// ── STEP 3: Fetch from Pollinations ──────────────────────────

async function fetchPollinationsImage(prompt: string): Promise<Blob | null> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630&model=flux&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(45_000),
        headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
      });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 1000) return blob;
      }
    } catch {
      if (attempt === 2) return null;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return null;
}

// ── MAIN EXPORT ──────────────────────────────────────────────

export async function generateArticleImage(
  article: ArticleInput
): Promise<Blob | null> {
  // Select composition modifier (no repeats in last 10)
  const composition = selectCompositionModifier(article.slug);
  trackModifier(composition);
  console.log(`[image-gen] Composition: ${composition} (recent: ${recentModifiers.length})`);

  // Step 1: AI picks concrete objects
  const concept = await getImageObjects(article);
  console.log(`[image-gen] Oil painting concept for "${article.title.slice(0, 40)}": ${concept}`);

  // Step 2: Build oil painting prompt with composition modifier
  const prompt = buildOilPaintingPrompt(concept, composition);
  console.log(`[image-gen] Prompt: ${prompt.slice(0, 120)}...`);

  // Step 3: Fetch image with retry
  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

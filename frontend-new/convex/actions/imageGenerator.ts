// ============================================================
// Times of Namibia - Article Image Generator (TANGISON)
//
// Issue 1 fix: Oil painting style with locked palette.
//   - Real photos from RSS are KEPT (best source)
//   - AI-generated fallback uses oil painting prompt:
//     "[1-2 concrete objects], realistic oil painting,
//      visible brushstrokes, navy blue and rust orange
//      and cream palette, no text, no people unless
//      factually required"
//   - 1200x630, model=flux, nologo=true
//   - 45s timeout, 1 retry, random seed
// ============================================================

"use node";

import { generateWithFallback } from "./aiProvider";

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
}

// ── STEP 1: Extract 1-2 concrete objects from the article ───
// The AI picks simple physical objects that symbolize the story.

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
// Exact template per spec, with [1-2 concrete objects] filled in.

function buildOilPaintingPrompt(concept: string): string {
  return `Oil painting, realistic representational style, visible textured brushstrokes, ` +
    `painterly light and shadow, muted palette limited to navy blue, rust orange, and warm cream, ` +
    `${concept}, single clear subject only, ` +
    `no text, no logos, no watermark, no people unless the subject requires it, ` +
    `gallery painting quality, cohesive composition`;
}

// ── STEP 3: Fetch from Pollinations ──────────────────────────
// 45s timeout, 1 retry, random seed, model=flux

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
  // Step 1: AI picks concrete objects
  const concept = await getImageObjects(article);
  console.log(`[image-gen] Oil painting concept for "${article.title.slice(0, 40)}": ${concept}`);

  // Step 2: Build oil painting prompt
  const prompt = buildOilPaintingPrompt(concept);
  console.log(`[image-gen] Prompt: ${prompt.slice(0, 120)}...`);

  // Step 3: Fetch image with retry
  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

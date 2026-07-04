// ============================================================
// Times of Namibia — Article Image Generator (TANGISON)
//
// Two-step approach:
//   1. AI picks ONE simple physical object (noun phrase) symbolizing the story
//   2. Pollinations generates a hyper-realistic studio photograph of that object
//
// No people, no scenes, no text, no buildings, no rooms.
// 45s timeout, 1 retry, random seed for uniqueness.
// ============================================================

"use node";

import { generateWithFallback } from "./aiProvider";

// ── TYPES ────────────────────────────────────────────────────

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
}

// ── STEP 1: Extract concept (single physical object) ─────────

async function getImageConcept(article: ArticleInput): Promise<string> {
  const prompt = `You are an art director for a world-class minimalist news magazine. Given this news headline and category, respond with ONLY a short noun phrase describing one or two simple physical objects that symbolically represent the story. Never suggest people, crowds, buildings, rooms, screens, documents, maps, flags, or text. Think elementary school objects given adult sophistication.

Examples:
- War or conflict → "a single bronze arrowhead"
- Economy or budget → "three stacked gold coins"
- Environment → "a single green seedling in dry cracked earth"
- Technology → "a single glowing filament lightbulb"
- Politics or election → "a single wooden ballot box"
- Health → "a single red stethoscope coiled"
- Mining → "a rough uncut diamond"
- Energy → "a single white wind turbine blade"
- Sport → "a worn leather football"
- Justice or law → "a single wooden gavel"
- Transport → "a folded paper airplane"
- Water → "a single glass of clear water"

Headline: "${article.title}"
Category: ${article.category}

Respond with ONLY the object phrase, nothing else.`;

  const result = await generateWithFallback(
    [{ role: "user", content: prompt }],
    { maxTokens: 30, timeout: 10_000 }
  );

  const concept = (result || "a folded newspaper")
    .split("\n")[0]
    .replace(/["'.]/g, "")
    .trim()
    .toLowerCase();

  return concept || "a folded newspaper";
}

// ── STEP 2: Build Pollinations prompt from the concept ───────

function buildPollinationsPrompt(concept: string): string {
  return `Hyper-realistic studio product photograph of ${concept}. ` +
    `Shot against a pure white background with soft even lighting. ` +
    `Single hero object centered with generous empty space around it. ` +
    `Shallow depth of field, subtle shadow beneath the object. ` +
    `No text, no words, no letters, no numbers, no watermark, no logo, no people, no hands, ` +
    `no faces, no background scenery, no pattern, no texture behind the object. ` +
    `Professional commercial photography. Extremely clean. Minimal. ` +
    `Color palette: muted navy, warm gray, and cream only.`;
}

// ── STEP 3: Fetch from Pollinations (45s timeout, 1 retry, random seed) ──

async function fetchPollinationsImage(prompt: string): Promise<Blob | null> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=675&model=flux&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(45_000),
        headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
      });
      if (res.ok) {
        return await res.blob();
      }
    } catch {
      if (attempt === 2) return null;
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s before retry
    }
  }
  return null;
}

// ── MAIN EXPORT ──────────────────────────────────────────────

export async function generateArticleImage(
  article: ArticleInput
): Promise<Blob | null> {
  // Step 1: AI picks a concept object
  const concept = await getImageConcept(article);
  console.log(`[image-gen] Concept for "${article.title.slice(0, 40)}": ${concept}`);

  // Step 2: Build prompt + fetch image (with retry + random seed)
  const prompt = buildPollinationsPrompt(concept);
  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

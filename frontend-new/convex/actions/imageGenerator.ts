// ============================================================
// Times of Namibia — Article Image Generator (TANGISON)
//
// Two-step approach:
//   1. AI picks ONE simple physical object symbolizing the story
//   2. Pollinations generates a hyper-realistic studio photograph
//      of that object — no people, no scenes, no text
//
// This eliminates garbled text hallucinations that scene-style
// prompts (meeting rooms, office portraits) were producing.
// ============================================================

"use node";

import { generateWithFallback } from "./aiProvider";

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

// ── STEP 1: Generate a concept (single physical object) ──────

async function generateImageConcept(article: ArticleInput): Promise<string> {
  const conceptText = await generateWithFallback(
    [
      {
        role: "system",
        content: `You pick ONE simple physical object that symbolizes a news story. Rules:
- Maximum 3 words
- Must be a concrete physical object (not abstract)
- No people, no scenes, no buildings, no text, no documents, no screens
- Examples: "a brass key" for secrets, "a folded paper airplane" for diplomacy, "a small potted plant" for growth, "a broken gavel" for legal dispute, "a crude oil barrel" for energy, "a gold coin" for economy
Respond with ONLY the object name, nothing else.`,
      },
      {
        role: "user",
        content: `Story title: ${article.title}\nCategory: ${article.category}\nSummary: ${(article.summary || "").slice(0, 200)}`,
      },
    ],
    { maxTokens: 20, timeout: 10_000 }
  );

  // Clean up the concept — take first line, strip quotes/periods
  const concept = (conceptText || "a folded newspaper")
    .split("\n")[0]
    .replace(/["'.]/g, "")
    .trim()
    .toLowerCase();

  return concept || "a folded newspaper";
}

// ── STEP 2: Build Pollinations prompt from the concept ───────

function buildPhotographPrompt(concept: string): string {
  return [
    `Hyper-realistic studio photograph of ${concept}.`,
    "Isolated on a clean light gray background (#F2F2F2).",
    "Soft diffused studio lighting from upper left.",
    "Shot from a 45-degree angle, shallow depth of field.",
    "NO people, NO scenes, NO signage, NO documents, NO screens, NO text, NO numbers, NO letters, NO logos, NO watermark.",
    "Muted, desaturated color palette with deep navy (#0B1D3A) shadows.",
    "Professional product photography aesthetic.",
    "Large negative space around the subject.",
  ].join(" ");
}

// ── POLLINATIONS.AI FETCH ────────────────────────────────────

async function fetchPollinationsImage(
  prompt: string,
  opts?: ImageGenOptions
): Promise<Blob> {
  const encoded = encodeURIComponent(prompt);

  const params = new URLSearchParams({
    width: String(opts?.width ?? 1200),
    height: String(opts?.height ?? 675),
    nologo: "true",
    model: "flux",
    ...(opts?.seed ? { seed: String(opts.seed) } : {}),
  });

  const url = `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
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
  // Step 1: AI picks a concept object
  const concept = await generateImageConcept(article);
  console.log(`[image-gen] Concept for "${article.title.slice(0, 40)}": ${concept}`);

  // Step 2: Build prompt + fetch image
  const prompt = buildPhotographPrompt(concept);
  return fetchPollinationsImage(prompt, opts);
}

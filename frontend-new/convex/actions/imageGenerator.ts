// ============================================================
// Times of Namibia - Article Image Generator (TANGISON)
//
// Minimalist flat vector icon illustration system.
//   - Real photos from RSS are KEPT (best source)
//   - AI-generated fallback uses the icon prompt template
//     with category-specific color palettes
//   - Subject deduplication: never repeat the same subject
//     in the last 30 generated images
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

// ── CATEGORY PALETTE ─────────────────────────────────────────
const CATEGORY_PALETTES: Record<string, string> = {
  politics: "navy and red",
  world: "blue and orange",
  economy: "dark green and gold",
  sport: "green and gold",
  technology: "teal and grey",
  tech: "teal and grey",
  energy: "amber and charcoal",
  mining: "amber and charcoal",
  health: "red and white",
  environment: "green and brown",
  national: "navy and cream",
  africa: "orange and green",
  opinion: "navy and grey",
  infrastructure: "grey and amber",
  legal: "navy and gold",
  cultural: "rust and cream",
};

function getPalette(category: string): string {
  const cat = (category || "").toLowerCase().trim();
  return CATEGORY_PALETTES[cat] || "navy and cream";
}

// ── ABSTRACT CATEGORY ICONS (fallback when no clear subject) ──
const CATEGORY_ICONS: Record<string, string> = {
  politics: "a ballot box icon",
  world: "a compass icon",
  economy: "an upward graph line icon",
  sport: "a trophy icon",
  technology: "a circuit board icon",
  tech: "a circuit board icon",
  energy: "a lightning bolt icon",
  mining: "a pickaxe icon",
  health: "a medical cross icon",
  environment: "a leaf icon",
  national: "a map of Namibia silhouette icon",
  africa: "a map of Africa silhouette icon",
  opinion: "a speech bubble icon",
  infrastructure: "a bridge icon",
  legal: "a scales of justice icon",
  cultural: "a drum icon",
};

// ── SUBJECT HISTORY (deduplication) ──────────────────────────
interface HistoryEntry {
  subject: string;
  category: string;
  slug: string;
  timestamp: number;
}

const subjectHistory: HistoryEntry[] = [];
const MAX_HISTORY = 30;

function isSubjectUsed(subject: string, category: string): boolean {
  // Check if exact subject was used in last 30
  const recentSubjects = subjectHistory.slice(-MAX_HISTORY);
  return recentSubjects.some(
    (h) => h.subject.toLowerCase() === subject.toLowerCase()
  );
}

function isSubjectCategoryUsed(subject: string, category: string): boolean {
  // Check if subject+category combo was used in last 15
  const recent = subjectHistory.slice(-15);
  return recent.some(
    (h) =>
      h.subject.toLowerCase() === subject.toLowerCase() &&
      h.category.toLowerCase() === category.toLowerCase()
  );
}

function logSubject(subject: string, category: string, slug: string): void {
  subjectHistory.push({ subject, category, slug, timestamp: Date.now() });
  if (subjectHistory.length > MAX_HISTORY) {
    subjectHistory.shift();
  }
}

// ── ALTERNATE SUBJECTS (for collision resolution) ────────────
const SUBJECT_ALTERNATIVES: Record<string, string[]> = {
  "flame": ["warning triangle", "fire extinguisher", "heat shimmer"],
  "soccer ball": ["trophy", "whistle", "goal net"],
  "flag": ["banner", "shield", "crest"],
  "coin": ["banknote", "ledger", "abacus"],
  "gavel": ["scales of justice", "law book", "key"],
  "lightbulb": ["gear", "circuit", "antenna"],
  "arrow": ["rocket", "compass needle", "upward staircase"],
  "handshake": ["clasped hands silhouette", "bridge", "knot"],
  "microphone": ["podium", "megaphone", "speech bubble"],
  "newspaper": ["printing press", "inkwell", "quill pen"],
};

function getAlternate(original: string): string {
  const key = original.toLowerCase().trim();
  const alts = SUBJECT_ALTERNATIVES[key];
  if (alts && alts.length > 0) {
    return alts[Math.floor(Math.random() * alts.length)];
  }
  // Generic alternation: add "abstract" prefix
  return `abstract ${original}`;
}

// ── STEP 1: Extract ONE concrete subject from the article ───

async function getImageSubject(article: ArticleInput): Promise<string> {
  const prompt = `Read this news headline and category. Respond with ONLY a short noun phrase (max 6 words) describing ONE concrete physical object or symbol that represents the story. Maximum TWO objects if they relate directly (e.g. "flag and shield"). Never suggest people, crowds, buildings, rooms, screens, documents, maps, newspapers, or generic scenes. Think simple iconic objects.

Examples:
- War or conflict - a bronze arrowhead
- Economy or budget - stacked gold coins
- Environment - a green seedling
- Technology - a glowing lightbulb
- Politics or election - a wooden ballot box
- Health - a red stethoscope
- Mining - an uncut diamond
- Energy - a wind turbine blade
- Sport - a leather football
- Justice or law - a wooden gavel
- Transport - a paper airplane
- Diplomacy - a handshake silhouette
- Election - a ballot box
- Climate - a thermometer
- Trade - a cargo ship silhouette

Headline: "${article.title}"
Category: ${article.category}

Respond with ONLY the object phrase, nothing else. No explanation.`;

  const result = await generateWithFallback(
    [{ role: "user", content: prompt }],
    { maxTokens: 40, timeout: 10_000 }
  );

  let subject = (result || "")
    .split("\n")[0]
    .replace(/["'.]/g, "")
    .trim()
    .toLowerCase();

  // BANNED: never use "newspaper" or "stack of papers" as fallback
  if (!subject || subject.includes("newspaper") || subject.includes("stack of paper") || subject.includes("generic press")) {
    // Use category-specific abstract icon instead
    const cat = (article.category || "").toLowerCase().trim();
    subject = CATEGORY_ICONS[cat] || "a compass icon";
  }

  // STEP 2: Check against recent history
  let attempts = 0;
  while (attempts < 3) {
    if (!isSubjectUsed(subject, article.category)) {
      break; // No collision, use this subject
    }
    // Collision found - try alternate
    console.log(`[image-gen] Subject collision: "${subject}" already used. Trying alternate...`);
    subject = getAlternate(subject);
    attempts++;
  }

  // Log the subject
  logSubject(subject, article.category, article.slug || "");

  return subject;
}

// ── STEP 3: Build the final Pollinations prompt ──────────────
// Uses the exact template from the spec, filling [SUBJECT] and [PALETTE]

function buildIconPrompt(subject: string, category: string): string {
  const palette = getPalette(category);
  return `${subject}, minimalist flat vector icon illustration, single central symbol, simple geometric shapes, ${palette} color palette only, solid flat background, no text, no letters, no words, no human faces, no photorealism, no photo, no 3d render, clean line art, editorial icon style, generous negative space, centered composition`;
}

// ── STEP 4: Fetch from Pollinations ──────────────────────────

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
  console.log(`[image-gen] Processing: "${article.title.slice(0, 50)}" (${article.category})`);

  // Step 1: Extract subject (with dedup check)
  const subject = await getImageSubject(article);
  console.log(`[image-gen] Subject: ${subject}`);

  // Step 3: Build prompt using exact template
  const prompt = buildIconPrompt(subject, article.category);
  console.log(`[image-gen] Prompt: ${prompt.slice(0, 150)}...`);

  // Step 4: Fetch image with retry
  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

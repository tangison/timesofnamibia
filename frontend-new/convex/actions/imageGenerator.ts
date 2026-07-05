// ============================================================
// Times of Namibia - Article Image Generator
//
// Phase 3: Oil painting illustration system.
//   - Real photos from RSS are KEPT (best source)
//   - AI fallback: oil painting with category palettes
//   - Subject deduplication: no repeats in last 30
//   - BANNED: newspaper, stack of papers, human faces, text
// ============================================================

"use node";

import { generateWithFallback } from "./aiProvider";

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
  slug?: string;
}

// ── CATEGORY PALETTES ────────────────────────────────────────
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

// ── ABSTRACT CATEGORY FALLBACKS ──────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  politics: "a ballot box",
  world: "a compass",
  economy: "an upward graph line",
  sport: "a trophy",
  technology: "a circuit board",
  tech: "a circuit board",
  energy: "a lightning bolt",
  mining: "a pickaxe",
  health: "a medical cross",
  environment: "a leaf",
  national: "a map of Namibia silhouette",
  africa: "a map of Africa silhouette",
  opinion: "a speech bubble",
  infrastructure: "a bridge",
  legal: "scales of justice",
  cultural: "a drum",
};

// ── SUBJECT HISTORY ──────────────────────────────────────────
interface HistoryEntry {
  subject: string;
  category: string;
  slug: string;
  timestamp: number;
}

const subjectHistory: HistoryEntry[] = [];
const MAX_HISTORY = 30;

function isSubjectUsed(subject: string): boolean {
  return subjectHistory.slice(-MAX_HISTORY).some(
    (h) => h.subject.toLowerCase() === subject.toLowerCase()
  );
}

function isSubjectCategoryUsed(subject: string, category: string): boolean {
  return subjectHistory.slice(-15).some(
    (h) => h.subject.toLowerCase() === subject.toLowerCase() &&
           h.category.toLowerCase() === category.toLowerCase()
  );
}

function logSubject(subject: string, category: string, slug: string): void {
  subjectHistory.push({ subject, category, slug, timestamp: Date.now() });
  if (subjectHistory.length > MAX_HISTORY) subjectHistory.shift();
}

// ── ALTERNATES TABLE ─────────────────────────────────────────
const SUBJECT_ALTERNATIVES: Record<string, string[]> = {
  "flame": ["warning triangle", "fire extinguisher"],
  "soccer ball": ["trophy", "whistle"],
  "football": ["trophy", "whistle"],
  "flag": ["banner", "shield"],
  "coin": ["banknote", "ledger"],
  "gavel": ["scales of justice", "law book"],
  "lightbulb": ["gear", "circuit"],
  "arrow": ["rocket", "compass needle"],
  "handshake": ["bridge", "knot"],
  "microphone": ["podium", "megaphone"],
  "newspaper": ["printing press", "inkwell"],
};

function getAlternate(original: string): string {
  const key = original.toLowerCase().trim();
  const alts = SUBJECT_ALTERNATIVES[key];
  if (alts && alts.length > 0) return alts[Math.floor(Math.random() * alts.length)];
  return `abstract ${original}`;
}

// ── STEP 1: Extract ONE subject ──────────────────────────────

async function getImageSubject(article: ArticleInput): Promise<string> {
  const prompt = `Read this news headline and category. Respond with ONLY a short noun phrase (max 6 words) describing ONE concrete physical object or symbol that represents the story. Maximum TWO objects if they relate directly. Never suggest people, crowds, buildings, rooms, screens, documents, maps, newspapers, or generic scenes.

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

Headline: "${article.title}"
Category: ${article.category}

Respond with ONLY the object phrase, nothing else.`;

  const result = await generateWithFallback(
    [{ role: "user", content: prompt }],
    { maxTokens: 40, timeout: 10_000 }
  );

  let subject = (result || "")
    .split("\n")[0]
    .replace(/["'.]/g, "")
    .trim()
    .toLowerCase();

  // BANNED subjects
  if (!subject || subject.includes("newspaper") || subject.includes("stack of paper") || subject.includes("generic press")) {
    const cat = (article.category || "").toLowerCase().trim();
    subject = CATEGORY_ICONS[cat] || "a compass";
  }

  // Dedup check
  let attempts = 0;
  while (attempts < 3) {
    if (!isSubjectUsed(subject) && !isSubjectCategoryUsed(subject, article.category)) break;
    console.log(`[image-gen] Collision: "${subject}". Trying alternate...`);
    subject = getAlternate(subject);
    attempts++;
  }

  logSubject(subject, article.category, article.slug || "");
  return subject;
}

// ── STEP 2: Build oil painting prompt ────────────────────────

function buildPrompt(subject: string, category: string): string {
  const palette = getPalette(category);
  return `${subject}, oil painting illustration, visible brush strokes, painterly texture, ${palette}, single central subject, simple background, no text, no letters, no human faces, no photorealism, generous negative space`;
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

export async function generateArticleImage(article: ArticleInput): Promise<Blob | null> {
  console.log(`[image-gen] Processing: "${article.title.slice(0, 50)}" (${article.category})`);

  const subject = await getImageSubject(article);
  console.log(`[image-gen] Subject: ${subject}`);

  const prompt = buildPrompt(subject, article.category);
  console.log(`[image-gen] Prompt: ${prompt.slice(0, 150)}...`);

  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

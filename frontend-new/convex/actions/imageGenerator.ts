// ============================================================
// Times of Namibia - Article Image Generator (TANGISON)
//
// Phase 3 spec: HBR Minimalist Flat Vector Illustrations
//   - Minimalist flat vector editorial illustration
//   - Inspired by Harvard Business Review
//   - Clean geometric shapes, muted navy/gray/cream palette
//   - No text, no people, no 3D, no gradients
//   - No hyper-realism or photography
//   - 1200x630, model=flux, nologo=true
//   - 45s timeout, 1 retry, random seed
//   - Fallback: clean navy (#0B1D3A) div block (handled in UI)
// ============================================================

"use node";

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
}

// ── BUILD PROMPT ─────────────────────────────────────────────
// Phase 3 spec template:
//   "Minimalist flat vector editorial illustration of [concept].
//    Inspired by Harvard Business Review. Clean geometric shapes,
//    muted navy/gray/cream palette. No text, no people, no 3D,
//    no gradients."

function buildPollinationsPrompt(article: ArticleInput): string {
  // Extract a concept from the headline - use the raw title
  // but strip quotes and limit length
  const concept = article.title
    .replace(/["""]/g, "")
    .replace(/[^a-zA-Z0-9\s,-]/g, "")
    .slice(0, 120);

  return `Minimalist flat vector editorial illustration of ${concept}. ` +
    `Inspired by Harvard Business Review. ` +
    `Clean geometric shapes, muted navy/gray/cream palette. ` +
    `No text, no people, no 3D, no gradients, no photography, no photorealism. ` +
    `Simple abstract symbolic composition. Professional editorial style.`;
}

// ── FETCH FROM POLLINATIONS ──────────────────────────────────
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
  const prompt = buildPollinationsPrompt(article);
  console.log(`[image-gen] HBR prompt for "${article.title.slice(0, 40)}": ${prompt.slice(0, 120)}...`);

  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

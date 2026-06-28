// ============================================================
// Times of Namibia — Article Image Generator (TANGISON)
//
// Task 2 spec implementation:
//   - If article has a real publisher image URL from RSS, use it.
//   - Otherwise generate via Pollinations with editorial photojournalism prompt.
//   - 1200x630 (OG image ratio), model=flux, nologo=true, enhance=true
//   - 45s timeout, 1 retry, random seed for uniqueness.
//   - No text, no watermarks, photojournalism aesthetic.
// ============================================================

"use node";

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
}

// ── BUILD PROMPT ─────────────────────────────────────────────
// Per Task 2 spec:
//   "{headline}, Namibia, Southern Africa, editorial news photo style,
//    clean minimalist composition, no text, no watermarks,
//    photojournalism aesthetic, natural lighting"

function buildPollinationsPrompt(article: ArticleInput): string {
  const headline = article.title.replace(/[""]/g, "").slice(0, 120);
  return `${headline}, Namibia, Southern Africa, editorial news photo style, clean minimalist composition, no text, no watermarks, photojournalism aesthetic, natural lighting`;
}

// ── FETCH FROM POLLINATIONS ──────────────────────────────────
// 45s timeout, 1 retry, random seed, model=flux, enhance=true

async function fetchPollinationsImage(prompt: string): Promise<Blob | null> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630&model=flux&nologo=true&enhance=true&seed=${seed}`;

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
  console.log(`[image-gen] Prompt for "${article.title.slice(0, 40)}": ${prompt.slice(0, 100)}...`);

  const blob = await fetchPollinationsImage(prompt);

  if (!blob) {
    console.warn(`[image-gen] Pollinations failed after 2 attempts for "${article.title.slice(0, 40)}"`);
  }

  return blob;
}

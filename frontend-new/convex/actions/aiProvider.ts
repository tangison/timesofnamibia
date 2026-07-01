// ============================================================
// Times of Namibia - AI Provider with Fallback (TANGISON)
//
// Primary: OpenRouter (free tier) - meta-llama/llama-3.3-70b-instruct
// Fallback 1: OpenRouter mistralai/mistral-7b-instruct (free)
// Fallback 2: Groq llama-3.3-70b-versatile
//
// Usage: replace all direct OpenRouter calls with generateWithFallback()
// ============================================================

"use node";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateOptions {
  model?: string;
  fallbackModel?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

// ── EDITORIAL VOICE ──────────────────────────────────────────
// Prepended to every system prompt. Enforces the Times of Namibia
// editorial voice: authoritative but accessible, like a senior
// correspondent at a quality African broadsheet.

export const EDITORIAL_VOICE = `You are the editorial AI for Times of Namibia, an African news outlet. Rewrite articles to be factual, clear, and locally relevant to Namibian and Southern African readers. Tone: professional but accessible. No fluff. No AI-sounding phrases. Active voice only. Max 400 words. Never use: "In conclusion", "It is worth noting", "Importantly", "Furthermore", "This article explores", "Delving into". First sentence must contain who, what, and where. Namibian proper nouns are always spelled correctly: Windhoek, Swakopmund, Oshakati, Rundu, Otjiwarongo, Luderitz, Walvis Bay, Kavango, Khomas. Numbers: spell out one through nine, numerals for 10 and above, always include currency context (NAD/USD). Attribution: "said", "told reporters", "confirmed" - never "claimed" unless genuinely disputed.`;

/**
 * Generate text with automatic fallback.
 * Tries OpenRouter (llama-3.3-70b-instruct) → OpenRouter (mistral-7b) → Groq.
 * Prepends editorial voice to system messages.
 */
export async function generateWithFallback(
  messages: ChatMessage[],
  opts?: GenerateOptions
): Promise<string | null> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const timeout = opts?.timeout ?? 30_000;

  // Prepend editorial voice to the first system message
  const augmentedMessages: ChatMessage[] = [...messages];
  const sysIdx = augmentedMessages.findIndex((m) => m.role === "system");
  if (sysIdx >= 0) {
    augmentedMessages[sysIdx] = {
      ...augmentedMessages[sysIdx],
      content: `${EDITORIAL_VOICE}\n\n${augmentedMessages[sysIdx].content}`,
    };
  } else {
    augmentedMessages.unshift({ role: "system", content: EDITORIAL_VOICE });
  }

  // ── Primary: OpenRouter llama-3.3-70b-instruct ──
  if (openRouterKey) {
    const primaryModel = opts?.model ?? "meta-llama/llama-3.3-70b-instruct";
    const fallbackOpenRouterModel = opts?.fallbackModel ?? "mistralai/mistral-7b-instruct";

    for (const model of [primaryModel, fallbackOpenRouterModel]) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://timesofnamibia.com",
            "X-Title": "Times of Namibia",
          },
          body: JSON.stringify({
            model,
            messages: augmentedMessages,
            temperature: opts?.temperature ?? 0.4,
            max_tokens: opts?.maxTokens ?? 800,
          }),
          signal: AbortSignal.timeout(timeout),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content || "";
          if (text.length > 10) return text;
        }
      } catch (err) {
        console.warn(`[AI] OpenRouter ${model} failed:`, err instanceof Error ? err.message : err);
      }
    }
  }

  // ── Final fallback: Groq ──
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: augmentedMessages,
          temperature: opts?.temperature ?? 0.4,
          max_tokens: opts?.maxTokens ?? 800,
        }),
        signal: AbortSignal.timeout(timeout),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text.length > 10) return text;
      }
    } catch (err) {
      console.error("[AI] Groq also failed:", err instanceof Error ? err.message : err);
    }
  }

  return null;
}

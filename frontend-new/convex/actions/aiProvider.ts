// ============================================================
// Times of Namibia — AI Provider with Fallback (TANGISON)
//
// Primary: OpenRouter (free tier)
// Fallback: Groq (free tier, OpenAI-SDK compatible)
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

// ── EDITORIAL VOICE (Part 5) ─────────────────────────────────
// This prefix is prepended to every system prompt across the platform.
// It enforces the Times of Namibia editorial voice: authoritative but
// accessible, like a senior correspondent at a quality African broadsheet.

export const EDITORIAL_VOICE = `You are writing for Times of Namibia, a quality African broadsheet. Authoritative but accessible. Write like a senior correspondent, not a wire-service robot. Sentences are varied in length. No bullet points in article bodies. Paragraphs are 2-4 sentences. Never use: "In conclusion", "It is worth noting", "Importantly", "Furthermore", "This article explores", "Delving into". Always use the active voice for news leads. First sentence must contain who, what, and where. Namibian proper nouns are always spelled correctly: Windhoek, Swakopmund, Oshakati, Rundu, Otjiwarongo, Lüderitz, Walvis Bay, Kavango, Khomas. Numbers: spell out one through nine, numerals for 10 and above, always include currency context (NAD/USD). Attribution: "said", "told reporters", "confirmed" — never "claimed" unless genuinely disputed.`;

/**
 * Generate text with automatic fallback from OpenRouter to Groq.
 * If OpenRouter fails (rate limit, timeout, error), automatically
 * retries with Groq. Prepends the editorial voice to system messages.
 */
export async function generateWithFallback(
  messages: ChatMessage[],
  opts?: GenerateOptions
): Promise<string | null> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const timeout = opts?.timeout ?? 20_000;

  // Prepend editorial voice to the first system message
  const augmentedMessages: ChatMessage[] = [...messages];
  const sysIdx = augmentedMessages.findIndex((m) => m.role === "system");
  if (sysIdx >= 0) {
    augmentedMessages[sysIdx] = {
      ...augmentedMessages[sysIdx],
      content: `${EDITORIAL_VOICE}\n\n${augmentedMessages[sysIdx].content}`,
    };
  } else {
    // If no system message, prepend one
    augmentedMessages.unshift({ role: "system", content: EDITORIAL_VOICE });
  }

  // Try OpenRouter first
  if (openRouterKey) {
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
          model: opts?.model ?? "meta-llama/llama-3.2-3b-instruct:free",
          messages: augmentedMessages,
          temperature: opts?.temperature ?? 0.4,
          max_tokens: opts?.maxTokens ?? 600,
        }),
        signal: AbortSignal.timeout(timeout),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text.length > 10) return text;
      }
    } catch (err) {
      console.warn("[AI] OpenRouter failed, falling back to Groq:", err instanceof Error ? err.message : err);
    }
  }

  // Fallback to Groq
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: opts?.fallbackModel ?? "llama-3.3-70b-versatile",
          messages: augmentedMessages,
          temperature: opts?.temperature ?? 0.4,
          max_tokens: opts?.maxTokens ?? 600,
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

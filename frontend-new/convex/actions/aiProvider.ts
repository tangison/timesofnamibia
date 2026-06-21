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

/**
 * Generate text with automatic fallback from OpenRouter to Groq.
 * If OpenRouter fails (rate limit, timeout, error), automatically
 * retries with Groq.
 */
export async function generateWithFallback(
  messages: ChatMessage[],
  opts?: GenerateOptions
): Promise<string | null> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const timeout = opts?.timeout ?? 20_000;

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
          messages,
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
          messages,
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

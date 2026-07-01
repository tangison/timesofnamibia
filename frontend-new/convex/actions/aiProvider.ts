// ============================================================
// Times of Namibia - AI Provider with Load-Balancing Router
//
// Phase 1 (Iteration 12): Traffic-free load balancing across ALL
// free OpenRouter models. Round-robin cycling with 429/503 retry.
// Falls back to Groq only if every free model fails.
//
// Models (all free tier):
//   - meta-llama/llama-3.1-8b-instruct:free
//   - google/gemma-2-9b-it:free
//   - mistralai/mistral-7b-instruct:free
//   - mistralai/mistral-nemo:free
//   - qwen/qwen-2-7b-instruct:free
//   - microsoft/phi-3-mini-4k-instruct:free
//
// Strategy: round-robin starting index, on 429/503 immediately
// retry with next model. No pauses. Structured JSON output forced
// via response_format when supported.
// ============================================================

"use node";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  forceJson?: boolean;
}

// ── EDITORIAL VOICE ──────────────────────────────────────────
// Prepended to every system prompt. Enforces the Times of Namibia
// editorial voice and bans all AI slop words per spec.

export const EDITORIAL_VOICE = `You are the editorial AI for Times of Namibia, a premium African news publication inspired by Harvard Business Review. Rewrite articles to be factual, clear, and locally relevant. Tone: authoritative but accessible, like a senior correspondent. Active voice only. No fluff. No em dashes - use standard hyphens or periods only. Never use these banned phrases: delve, tapestry, moreover, crucial, landscape, realm, it is worth noting, importantly, furthermore, in conclusion, this article explores. Namibian proper nouns are always spelled correctly: Windhoek, Swakopmund, Oshakati, Rundu, Otjiwarongo, Luderitz, Walvis Bay, Kavango, Khomas. Numbers: spell out one through nine, numerals for 10 and above, always include currency context (NAD/USD). Attribution: said, told reporters, confirmed - never claimed unless genuinely disputed.`;

// ── FREE MODELS ARRAY ────────────────────────────────────────
// All free-tier OpenRouter models. Round-robin cycled on every call.

const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mistral-nemo:free",
  "qwen/qwen-2-7b-instruct:free",
  "microsoft/phi-3-mini-4k-instruct:free",
];

// Round-robin state - persists across calls within the same Convex
// action invocation. Starts at a random index to distribute load
// evenly across concurrent invocations.
let modelIndex = Math.floor(Math.random() * FREE_MODELS.length);

function getNextModel(): string {
  const model = FREE_MODELS[modelIndex % FREE_MODELS.length];
  modelIndex = (modelIndex + 1) % FREE_MODELS.length;
  return model;
}

// ── SINGLE MODEL CALL ────────────────────────────────────────

async function callOpenRouterModel(
  model: string,
  messages: ChatMessage[],
  openRouterKey: string,
  opts?: GenerateOptions
): Promise<{ text: string; status: number; error?: string }> {
  const timeout = opts?.timeout ?? 30_000;

  try {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: opts?.temperature ?? 0.4,
      max_tokens: opts?.maxTokens ?? 1000,
    };

    // Force structured JSON output when requested
    if (opts?.forceJson) {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://timesofnamibia.com",
        "X-Title": "Times of Namibia",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      return { text: "", status: response.status, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    return { text, status: 200 };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { text: "", status: 0, error: msg };
  }
}

// ── MAIN EXPORT ──────────────────────────────────────────────

export async function generateWithFallback(
  messages: ChatMessage[],
  opts?: GenerateOptions
): Promise<string | null> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

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

  // ── Phase 1: Round-robin through ALL free OpenRouter models ──
  if (openRouterKey) {
    // Try every free model. On 429 (rate limit) or 503 (service
    // unavailable), immediately retry with the next model. No pauses.
    for (let i = 0; i < FREE_MODELS.length; i++) {
      const model = getNextModel();
      const result = await callOpenRouterModel(model, augmentedMessages, openRouterKey, opts);

      if (result.status === 200 && result.text.length > 10) {
        console.log(`[AI] Success with ${model}`);
        return result.text;
      }

      // 429 = rate limited, 503 = service unavailable -> try next model
      if (result.status === 429 || result.status === 503) {
        console.warn(`[AI] ${model} returned ${result.status} - cycling to next free model`);
        continue;
      }

      // Other errors (400, 401, timeout) - also try next model
      console.warn(`[AI] ${model} failed: ${result.error} - trying next free model`);
      continue;
    }

    console.warn("[AI] All free OpenRouter models exhausted");
  }

  // ── Final fallback: Groq (only if all free models fail) ──
  if (groqKey) {
    try {
      const body: Record<string, unknown> = {
        model: "llama-3.3-70b-versatile",
        messages: augmentedMessages,
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 1000,
      };

      if (opts?.forceJson) {
        body.response_format = { type: "json_object" };
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(opts?.timeout ?? 30_000),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text.length > 10) {
          console.log("[AI] Success with Groq fallback");
          return text;
        }
      }
    } catch (err) {
      console.error("[AI] Groq also failed:", err instanceof Error ? err.message : err);
    }
  }

  return null;
}

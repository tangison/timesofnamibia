// ============================================================
// Times of Namibia - AI Provider with OpenRouter Free Router
//
// Uses openrouter/free auto-selecting router that picks from
// currently-available free models. Self-adjusts as specific
// free models get deprecated or rate-limited.
//
// Free tier: ~20 req/min, ~200 req/day (shared across all free models)
// Built-in exponential backoff + request logging.
// Groq as secondary fallback (if key is fixed).
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
export const EDITORIAL_VOICE = `You are the editorial AI for Times of Namibia, a premium African news publication inspired by Harvard Business Review. Rewrite articles to be factual, clear, and locally relevant. Tone: authoritative but accessible, like a senior correspondent. Active voice only. No fluff. No em dashes - use standard hyphens or periods only. Never use these banned phrases: delve, tapestry, moreover, crucial, landscape, realm, it is worth noting, importantly, furthermore, in conclusion, this article explores, in today's world, this underscores, plays a crucial role, stands as a testament, in the ever-evolving landscape of. Namibian proper nouns are always spelled correctly: Windhoek, Swakopmund, Oshakati, Rundu, Otjiwarongo, Luderitz, Walvis Bay, Kavango, Khomas. Numbers: spell out one through nine, numerals for 10 and above, always include currency context (NAD/USD). Attribution: said, told reporters, confirmed - never claimed unless genuinely disputed.`;

// ── RATE LIMIT TRACKING ──────────────────────────────────────
// Track requests to stay within free tier limits
let requestCount = 0;
let lastRequestTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 18; // leave buffer below 20
const MAX_REQUESTS_PER_DAY = 180; // leave buffer below 200
let dailyRequestCount = 0;
let dailyResetTime = Date.now() + 24 * 60 * 60 * 1000;

function canMakeRequest(): boolean {
  const now = Date.now();
  // Reset daily counter
  if (now > dailyResetTime) {
    dailyRequestCount = 0;
    dailyResetTime = now + 24 * 60 * 60 * 1000;
  }
  // Reset per-minute window
  if (now - lastRequestTime > 60_000) {
    requestCount = 0;
    lastRequestTime = now;
  }
  return requestCount < MAX_REQUESTS_PER_MINUTE && dailyRequestCount < MAX_REQUESTS_PER_DAY;
}

function recordRequest(): void {
  requestCount++;
  dailyRequestCount++;
  lastRequestTime = Date.now();
}

async function waitForRateLimit(): Promise<void> {
  // Exponential backoff if we hit rate limit
  let attempts = 0;
  while (!canMakeRequest() && attempts < 5) {
    const delay = Math.min(2000 * Math.pow(2, attempts), 30000);
    console.log(`[AI] Rate limit reached, waiting ${delay}ms (attempt ${attempts + 1})`);
    await new Promise((r) => setTimeout(r, delay));
    attempts++;
  }
}

// ── SINGLE MODEL CALL ────────────────────────────────────────

async function callOpenRouterFree(
  messages: ChatMessage[],
  openRouterKey: string,
  opts?: GenerateOptions
): Promise<{ text: string; status: number; error?: string; errorBody?: string }> {
  const timeout = opts?.timeout ?? 30_000;

  // Wait for rate limit if needed
  await waitForRateLimit();
  recordRequest();

  try {
    const body: Record<string, unknown> = {
      model: "openrouter/free",
      messages,
      temperature: opts?.temperature ?? 0.4,
      max_tokens: opts?.maxTokens ?? 1000,
    };

    // Note: openrouter/free does not support response_format json_object.
    // JSON is enforced via the system prompt instead.
    // The response is parsed with regex fallback in the caller.

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
      const errorBody = await response.text().catch(() => "unknown");
      return { text: "", status: response.status, error: `HTTP ${response.status}`, errorBody };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const modelUsed = data.model || "unknown";
    console.log(`[AI] Success with ${modelUsed}`);
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

  // ── Primary: OpenRouter free router ──
  if (openRouterKey) {
    // Try with exponential backoff on rate limit errors
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await callOpenRouterFree(augmentedMessages, openRouterKey, opts);

      if (result.status === 200 && result.text.length > 10) {
        return result.text;
      }

      // 429 = rate limited, 503 = service unavailable -> backoff and retry
      if (result.status === 429 || result.status === 503) {
        const backoff = Math.min(3000 * Math.pow(2, attempt), 30000);
        console.warn(`[AI] OpenRouter free returned ${result.status} - backing off ${backoff}ms (attempt ${attempt + 1}/3). Error: ${result.errorBody?.slice(0, 200)}`);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }

      // Other errors (400, 401, timeout) - log and try Groq
      console.warn(`[AI] OpenRouter free failed: ${result.error}. Error body: ${result.errorBody?.slice(0, 200)}`);
      break;
    }
  }

  // ── Secondary fallback: Groq (only if key is fixed) ──
  if (groqKey) {
    try {
      const body: Record<string, unknown> = {
        model: "llama-3.3-70b-versatile",
        messages: augmentedMessages,
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 1000,
      };

      // Note: response_format not used - JSON enforced via prompt.

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
      } else {
        const errorBody = await response.text().catch(() => "unknown");
        console.warn(`[AI] Groq failed: HTTP ${response.status}. Body: ${errorBody.slice(0, 200)}`);
      }
    } catch (err) {
      console.error("[AI] Groq also failed:", err instanceof Error ? err.message : err);
    }
  }

  console.error("[AI] All AI providers failed");
  return null;
}

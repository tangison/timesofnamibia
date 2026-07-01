// ============================================================
// Times of Namibia - Web-Search Story Synthesis (Part 3)
//
// Uses Tavily API to search for a topic, then synthesizes an
// original multi-source-cited article via AI.
//
// Budget: 3-5 stories/day, NOT per-article like RSS.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateWithFallback } from "./aiProvider";

// ── TAVILY SEARCH ────────────────────────────────────────────

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function tavilySearch(query: string, maxResults = 6): Promise<SearchResult[]> {
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!tavilyKey) {
    console.warn("[Synthesis] TAVILY_API_KEY not configured");
    return [];
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        include_snippets: true,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      console.warn(`[Synthesis] Tavily returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.content || r.snippet || "",
    }));
  } catch (err) {
    console.warn("[Synthesis] Tavily search failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ── STORY SYNTHESIS ──────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

export const synthesizeStory = internalAction({
  args: { topic: v.string() },
  handler: async (ctx, args) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    // 1. Search for the topic
    const searchResults = await tavilySearch(args.topic);
    if (searchResults.length < 2) {
      return { error: "Insufficient search results", topic: args.topic };
    }

    // 2. Synthesize original article
    const sourcesText = searchResults
      .map((r, i) => `Source ${i + 1}: ${r.title} (${r.url}): ${truncate(r.snippet, 300)}`)
      .join("\n");

    const body = await generateWithFallback(
      [
        {
          role: "system",
          content: `You are a news editor for Times of Namibia. Write an original news article based on the source snippets below.
Rules:
- Synthesize across ALL sources - do not closely follow the structure or wording of any single one.
- Do not invent facts not present in the source material.
- At the end, list every source used as "Sources: [Name](url), [Name](url)".
- 4-5 paragraphs, written in a professional news style.
- Separate paragraphs with \n\n.`,
        },
        {
          role: "user",
          content: `Topic: ${args.topic}\n\nSources:\n${sourcesText}`,
        },
      ],
      { maxTokens: 800, timeout: 25_000 }
    );

    if (!body || body.length < 100) {
      return { error: "AI synthesis failed", topic: args.topic };
    }

    // 3. Generate a headline + summary
    const metadata = await generateWithFallback(
      [
        {
          role: "system",
          content: 'Generate a headline and 2-sentence summary for this article. Respond as JSON: {"headline": "...", "summary": "...", "section": "..."}. Section must be one of: politics, economy, mining, energy, africa, world, sport, environment, technology, health, education, infrastructure, legal, culture, opinion, national.',
        },
        {
          role: "user",
          content: body.slice(0, 1500),
        },
      ],
      { maxTokens: 200, timeout: 15_000 }
    );

    let headline = args.topic;
    let summary = truncate(body, 200);
    let section = "national";

    if (metadata) {
      try {
        const jsonMatch = metadata.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          headline = parsed.headline || headline;
          summary = parsed.summary || summary;
          section = parsed.section || section;
        }
      } catch {}
    }

    // 4. Insert as article with sourceType synthesis
    const slug = slugify(headline);
    const sources = searchResults.map((r) => `${r.title} (${r.url})`).join(", ");

    try {
      const result = await ctx.runMutation(api.mutationsAdmin.ingestArticle, {
        adminToken,
        slug,
        headline,
        content: body,
        excerpt: summary,
        source: "Times of Namibia (Synthesized)",
        section,
        categorySlug: section,
        authorLine: "Times of Namibia AI",
        publishedAt: Date.now(),
        rssGuid: `synthesis-${slug}`,
        readingTime: Math.max(2, Math.ceil(body.split(/\s+/).length / 220)),
      });

      return {
        success: true,
        headline,
        slug,
        sourcesCount: searchResults.length,
        articleId: result.id,
        deduped: result.deduped,
      };
    } catch (err) {
      return { error: `Insert failed: ${err instanceof Error ? err.message : err}` };
    }
  },
});

export const triggerStorySynthesis = action({
  args: { topic: v.string(), adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized");
    }
    return await ctx.runAction(internal.actions.synthesizeStory.synthesizeStory, {
      topic: args.topic,
    });
  },
});

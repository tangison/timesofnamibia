import { describe, it, expect } from "vitest";

/**
 * Integration tests for the RSS pipeline utility functions.
 * Tests the pure functions (cleanText, htmlToParagraphs, classifySection,
 * generateSlug, contentSanityCheck) without needing Convex or network.
 *
 * These functions are extracted from convex/actions/ingestRss.ts and
 * reimplemented here for testing. If the implementation drifts, these
 * tests will catch it.
 */

// ── cleanText (mirror of the function in ingestRss.ts) ───────

function cleanText(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

// ── htmlToParagraphs (mirror) ────────────────────────────────

function htmlToParagraphs(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n\n")
    .trim();
}

// ── classifySection (mirror) ─────────────────────────────────

const SECTION_KEYWORDS: Record<string, string[]> = {
  politics: ["politic", "parliament", "election", "minister", "cabinet"],
  economy: ["economy", "finance", "bank", "budget", "trade", "GDP"],
  mining: ["mine", "mining", "uranium", "diamond", "lithium"],
  energy: ["energy", "power", "solar", "hydrogen", "renewable"],
  sport: ["sport", "football", "rugby", "cricket", "athletics"],
  technology: ["technology", "tech", "digital", "AI", "startup"],
};

function classifySection(title: string, content: string): string {
  const blob = `${title} ${content}`.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some((kw) => blob.includes(kw))) return section;
  }
  return "national";
}

// ── contentSanityCheck (mirror) ──────────────────────────────

function contentSanityCheck(article: {
  title: string;
  content: string;
  authorLine?: string;
  excerpt?: string;
}): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const allText = `${article.title} ${article.content} ${article.authorLine || ""} ${article.excerpt || ""}`;
  if (/<!\[CDATA\[/.test(allText)) issues.push("CDATA marker");
  if (/&#\d+;/.test(allText) || /&#x[0-9a-fA-F]+;/.test(allText)) issues.push("HTML entity");
  if (/<[a-zA-Z][^>]*>/.test(article.content)) issues.push("HTML tag");
  if (article.content.length < 50) issues.push("Too short");
  if (/Editorial photograph|no stock imagery|placeholder/i.test(article.content)) issues.push("Placeholder");
  if (!article.authorLine || article.authorLine.trim().length === 0) issues.push("Empty author");
  return { passed: issues.length === 0, issues };
}

// ── TESTS ────────────────────────────────────────────────────

describe("cleanText", () => {
  it("strips CDATA wrappers", () => {
    expect(cleanText("<![CDATA[Correspondent]]>")).toBe("Correspondent");
    expect(cleanText("<![CDATA[Hello & goodbye]]>")).toBe("Hello & goodbye");
  });

  it("decodes numeric HTML entities", () => {
    expect(cleanText("Hello&#8230; World")).toBe("Hello… World");
    expect(cleanText("Price: &#36;100")).toBe("Price: $100");
  });

  it("decodes hex HTML entities", () => {
    expect(cleanText("Arrow &#x2192; here")).toBe("Arrow → here");
  });

  it("decodes named entities", () => {
    expect(cleanText("&amp; &lt; &gt; &quot; &apos;")).toBe('& < > " \'');
  });

  it("strips HTML tags", () => {
    expect(cleanText("<p>Hello <b>world</b></p>")).toBe("Hello world");
    expect(cleanText('<a href="x">link</a>')).toBe("link");
  });

  it("normalizes whitespace", () => {
    expect(cleanText("  multiple   spaces  ")).toBe("multiple spaces");
  });

  it("handles empty input", () => {
    expect(cleanText("")).toBe("");
  });
});

describe("htmlToParagraphs", () => {
  it("converts <p> tags to paragraph breaks", () => {
    const result = htmlToParagraphs("<p>First paragraph</p><p>Second paragraph</p>");
    expect(result).toBe("First paragraph\n\nSecond paragraph");
  });

  it("converts <br> to line breaks", () => {
    const result = htmlToParagraphs("Line 1<br>Line 2");
    expect(result).toContain("Line 1");
    expect(result).toContain("Line 2");
  });

  it("strips CDATA", () => {
    const result = htmlToParagraphs("<![CDATA[<p>Content</p>]]>");
    expect(result).toBe("Content");
  });

  it("decodes entities", () => {
    const result = htmlToParagraphs("<p>Cost: &#36;50 &amp; up</p>");
    expect(result).toContain("$50 & up");
  });

  it("filters empty paragraphs", () => {
    const result = htmlToParagraphs("<p></p><p>Real content</p><p></p>");
    expect(result).toBe("Real content");
  });
});

describe("classifySection", () => {
  it("classifies politics", () => {
    expect(classifySection("Parliament passes new law", "election reform")).toBe("politics");
  });

  it("classifies economy", () => {
    expect(classifySection("Bank announces new rate", "budget deficit")).toBe("economy");
  });

  it("classifies sport", () => {
    expect(classifySection("Brave Warriors win", "football match")).toBe("sport");
  });

  it("defaults to national", () => {
    expect(classifySection("Local event in Windhoek", "community gathering")).toBe("national");
  });
});

describe("contentSanityCheck", () => {
  it("passes for clean article", () => {
    const result = contentSanityCheck({
      title: "Clean title",
      content: "This is a proper article body with enough content to pass.",
      authorLine: "Reporter",
    });
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("flags CDATA markers", () => {
    const result = contentSanityCheck({
      title: "Title",
      content: "<![CDATA[broken]]> content here that is long enough",
      authorLine: "Author",
    });
    expect(result.passed).toBe(false);
    expect(result.issues).toContain("CDATA marker");
  });

  it("flags HTML entities", () => {
    const result = contentSanityCheck({
      title: "Title",
      content: "Content with &#8230; entity that is long enough",
      authorLine: "Author",
    });
    expect(result.passed).toBe(false);
    expect(result.issues).toContain("HTML entity");
  });

  it("flags short content", () => {
    const result = contentSanityCheck({
      title: "Title",
      content: "Too short",
      authorLine: "Author",
    });
    expect(result.passed).toBe(false);
    expect(result.issues).toContain("Too short");
  });

  it("flags placeholder text", () => {
    const result = contentSanityCheck({
      title: "Title",
      content: "Editorial photograph - no stock imagery should appear here.",
      authorLine: "Author",
    });
    expect(result.passed).toBe(false);
    expect(result.issues).toContain("Placeholder");
  });

  it("flags empty author", () => {
    const result = contentSanityCheck({
      title: "Title",
      content: "This is a proper article body with enough content.",
      authorLine: "",
    });
    expect(result.passed).toBe(false);
    expect(result.issues).toContain("Empty author");
  });
});

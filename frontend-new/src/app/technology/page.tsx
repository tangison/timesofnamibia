import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";

export const metadata: Metadata = {
  title: "Technology - Times of Namibia",
  description:
    "The complete technology stack powering Times of Namibia - frontend, hosting, database, AI providers, image generation, scraping tools, and market data sources.",
  alternates: { canonical: "/technology" },
  openGraph: {
    title: "Technology - Times of Namibia",
    description: "The complete technology stack powering Times of Namibia.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export const revalidate = 3600;

interface TechCategory {
  title: string;
  items: TechItem[];
}

interface TechItem {
  name: string;
  purpose: string;
  details: string;
}

const TECH_STACK: TechCategory[] = [
  {
    title: "Frontend Framework",
    items: [
      {
        name: "Next.js 16",
        purpose: "React framework for the entire frontend",
        details: "App Router with Server Components, ISR (Incremental Static Regeneration) for article pages, dynamic rendering for the interactive map. Uses Turbopack for builds.",
      },
      {
        name: "React 19",
        purpose: "UI component library",
        details: "Server Components for data-heavy pages, Client Components for interactive elements (ShareToolbar, map, category filters).",
      },
      {
        name: "TypeScript",
        purpose: "Type-safe development",
        details: "Strict mode enabled across the entire codebase. Zero type errors enforced via tsc --noEmit in CI.",
      },
      {
        name: "Tailwind CSS 4",
        purpose: "Styling and design system",
        details: "Custom TANGISON brand colors (ton-navy, ton-cream, ton-red, ton-black). Utility-first with custom component classes for editorial layout.",
      },
    ],
  },
  {
    title: "Typography",
    items: [
      { name: "UnifrakturMaguntia", purpose: "Wordmark font", details: "Used for the 'Times of Namibia' masthead in blackletter style." },
      { name: "Merriweather", purpose: "Headlines and article body", details: "Serif font for editorial authority. Loaded via next/font/google." },
      { name: "Lato", purpose: "Body text and UI labels", details: "Clean sans-serif for readability across all devices." },
      { name: "JetBrains Mono", purpose: "Metadata, timestamps, technical labels", details: "Monospace for data presentation (market data, coordinates, timestamps)." },
    ],
  },
  {
    title: "Hosting and Deployment",
    items: [
      {
        name: "Vercel",
        purpose: "Frontend hosting and deployment",
        details: "Hobby plan. Automatic deployments from GitHub main branch. Serverless API routes for Playwright scraping. ISR with 5-minute revalidation for articles, 1-hour for directory pages.",
      },
      {
        name: "GitHub",
        purpose: "Version control and CI/CD",
        details: "Repository at github.com/tangison/timesofnamibia. All changes pushed to main branch trigger Vercel deployments.",
      },
    ],
  },
  {
    title: "Database",
    items: [
      {
        name: "Convex",
        purpose: "Real-time reactive database",
        details: "Deployment: exuberant-ladybug-733.convex.cloud. 29 tables including articles, directory_places, jobs, tenders, marketDatum, socialQueue, advertisements. Real-time queries with automatic caching. HTTP endpoints for external cron triggers.",
      },
      {
        name: "Convex File Storage",
        purpose: "Image and media storage",
        details: "All article images, directory place images, and generated illustrations stored as blobs in Convex file storage. Served via /api/storage/ URLs.",
      },
    ],
  },
  {
    title: "AI Providers",
    items: [
      {
        name: "OpenRouter (openrouter/free)",
        purpose: "Article rewriting and editorial AI",
        details: "Uses the openrouter/free auto-selecting router which picks from currently-available free models (Gemma, Llama, Qwen, etc.). Rate-limited to 18 req/min, 180 req/day. Generates structured JSON with headline, SEO meta description, key takeaways, body with H2 subheadings, and category classification.",
      },
      {
        name: "Groq (llama-3.3-70b-versatile)",
        purpose: "Secondary AI fallback",
        details: "Used only when OpenRouter free tier is exhausted or rate-limited. Currently experiencing 403 authentication issues.",
      },
      {
        name: "Pollinations.ai (Flux model)",
        purpose: "Article image generation",
        details: "Generates oil painting style illustrations with rotating composition modifiers (close-up, wide landscape, silhouette, abstract, aerial). Navy/rust/cream palette enforced. 1200x630, model=flux, 45s timeout with retry. Only used when no real publisher photo is available from RSS.",
      },
    ],
  },
  {
    title: "Content Pipeline",
    items: [
      {
        name: "RSS Aggregation",
        purpose: "News source ingestion",
        details: "13 RSS feeds from 3 regions: 6 Namibian sources (The Namibian, New Era, Namibian Sun, Confidente, Windhoek Observer, AllAfrica Namibia), 5 African sources (AllAfrica, M&G, Daily Maverick, The East African, BBC Africa), 2 Global sources (Reuters World, Reuters Business). Per-region cron: Namibia every 15 min, Africa every 30 min, World every 60 min.",
      },
      {
        name: "Newsworthiness Scoring",
        purpose: "Quality gate for article processing",
        details: "Each RSS item is scored by source region, content length, Namibian keyword presence, recency, and publisher image availability. Only items scoring above 30 are processed. No daily quota - if fewer items clear the bar, fewer articles are published.",
      },
      {
        name: "Tavily Search API",
        purpose: "Web search for story synthesis and scraper fallback",
        details: "Used as last-resort fallback for tender and job scraping when direct portal scraping fails. Also used for the story synthesis pipeline. API key required.",
      },
    ],
  },
  {
    title: "Scraping Tools",
    items: [
      {
        name: "Playwright + @sparticuz/chromium",
        purpose: "JavaScript-rendered portal scraping",
        details: "Vercel serverless API routes (/api/scrape-tenders, /api/scrape-jobs) use @sparticuz/chromium (serverless-optimized Chromium build) with playwright-core to render government procurement portals and job boards. Blocks images/fonts/CSS to stay under memory limits. Targets: eprocurement.gov.na, opm.gov.na, mfpe.gov.na, op.gov.na for tenders; nieis.namibiaatwork.gov.na, namijob.com, jobsnamibia.net for jobs.",
      },
      {
        name: "Wikimedia APIs",
        purpose: "Namibia directory data sourcing",
        details: "Wikipedia REST API (page summaries, thumbnails, coordinates), Wikimedia Commons API (5 images per place with license info), Wikidata SPARQL (elevation, area, established date). Used to seed 45 Namibian places in the Know Namibia directory.",
      },
    ],
  },
  {
    title: "Market Data",
    items: [
      {
        name: "open.er-api.com",
        purpose: "Foreign exchange rates",
        details: "Free API (no key required). Fetches USD/NAD, ZAR/NAD, EUR/NAD, GBP/NAD cross rates. Updated every 30 minutes via Convex cron.",
      },
      {
        name: "CoinGecko API",
        purpose: "Cryptocurrency prices",
        details: "Free API (no key required). Fetches BTC/USD and ETH/USD with 24-hour change percentages. Updated every 30 minutes.",
      },
    ],
  },
  {
    title: "Interactive Features",
    items: [
      {
        name: "Leaflet + OpenStreetMap",
        purpose: "Interactive Namibia map",
        details: "Real geography with OpenStreetMap tiles. CircleMarkers at actual lat/lng coordinates for each directory place. Color-coded by type (parks, landmarks, towns, wildlife, geological, cultural). Client-side only (force-dynamic rendering).",
      },
      {
        name: "Web Speech API",
        purpose: "Text-to-speech for articles",
        details: "Browser-native TTS via SpeechSynthesisUtterance. Reads full article body with chunking for long texts. Play/stop controls in the ShareToolbar.",
      },
      {
        name: "react-markdown",
        purpose: "Article body rendering",
        details: "Renders Markdown H2/H3 subheadings, paragraphs, lists, and blockquotes as styled HTML. Ensures no raw Markdown syntax is visible to readers.",
      },
      {
        name: "Framer Motion",
        purpose: "UI animations",
        details: "Spring physics for article cards, hero carousel, off-canvas menu, and staggered page load animations.",
      },
    ],
  },
  {
    title: "Image Processing",
    items: [
      {
        name: "Sharp",
        purpose: "WebP image conversion",
        details: "Server-side image processing. Converts all images (RSS publisher photos and AI-generated illustrations) to WebP format at quality 80 before storing in Convex. 1200x675 target dimensions. Falls back to original format if sharp is unavailable on the runtime.",
      },
      {
        name: "Pillow (Python)",
        purpose: "Static asset generation",
        details: "Used locally to generate the Skeleton Coast background image, brand-og.png, and other static visual assets in the locked navy/rust/cream palette.",
      },
    ],
  },
  {
    title: "Database Maintenance",
    items: [
      {
        name: "Automated Cleanup Cron",
        purpose: "Storage optimization",
        details: "Daily Convex cron prunes: market data older than 7 days, orphaned tender/job records from fallback noise, social queue entries older than 30 days, ticker items older than 7 days. Prevents unbounded storage growth.",
      },
    ],
  },
];

export default function TechnologyPage() {
  return (
    <TonLayout activePage="technology">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ton-black tracking-tight mb-4">
          Technology Stack
        </h1>
        <p className="font-sans text-ton-black/50 mb-12 max-w-2xl">
          Every technology that powers Times of Namibia, documented in plain language. This page is generated from the actual codebase and updated whenever the stack changes.
        </p>

        {TECH_STACK.map((category) => (
          <section key={category.title} className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-ton-black mb-6 border-l-4 border-ton-red pl-4">
              {category.title}
            </h2>
            <div className="space-y-6">
              {category.items.map((item) => (
                <div key={item.name} className="border border-ton-black/8 p-5 hover:border-ton-red/20 transition-colors">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-serif text-lg font-bold text-ton-black">{item.name}</h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ton-red">
                      {item.purpose}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-ton-black/60 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-16 pt-8 border-t border-ton-black/10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/45 text-center">
            This page is maintained in the same repository as the code it documents.
            <br />
            If a technology is added, removed, or replaced, this page is updated in the same commit.
          </p>
        </div>
      </div>
    </TonLayout>
  );
}

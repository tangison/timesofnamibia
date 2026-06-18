// Server-side: use BACKEND_URL directly (env var only available server-side)
// Client-side: always use the Next.js proxy (/api/proxy) to avoid CORS issues —
//   BACKEND_URL is NOT prefixed with NEXT_PUBLIC_ so it's undefined in the browser.
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";
const PROXY_BASE = "/api/proxy";

const isClient = typeof window !== "undefined";
// On the client, always go through the proxy. On the server, hit the backend directly.
const API_BASE = isClient ? PROXY_BASE : BACKEND_URL;

// --- TANGISON: Convex is preferred when configured ---
// If NEXT_PUBLIC_CONVEX_URL is set, all data-layer calls route to Convex.
// Otherwise, fall back to the FastAPI backend.
import { dataConvex } from "@/lib/dataConvex";
const useConvex = dataConvex.isAvailable();

type BackendItem = {
  id: number;
  item_type: "news" | "job" | "tender" | "internship";
  title: string;
  source_name: string;
  source_url: string;
  region: string | null;
  organization: string | null;
  summary: string | null;
  category: string | null;
  tags: string | null;
  relevance_score: number;
  published_at: string | null;
  closing_date: string | null;
  amount_text: string | null;
  section: string;
  created_at: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function api<T>(path: string): Promise<T> {
  const proxyPath = path.replace(/^\/api/, "");
  const url = API_BASE === PROXY_BASE ? `${PROXY_BASE}${proxyPath}` : `${API_BASE}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Backend request failed: ${path}`);
  return res.json();
}

function mapArticle(item: BackendItem) {
  const slug = `${slugify(item.title || "article")}-${item.id}`;
  const content = item.summary || item.title;
  return {
    id: String(item.id),
    slug,
    headline: item.title,
    subheadline: null,
    content,
    excerpt: item.summary,
    source: "rss",
    categorySlug: item.category || item.section,
    section: item.section || "national",
    readingTime: Math.max(2, Math.ceil(content.split(/\s+/).length / 220)),
    imageAlt: null,
    imageGps: null,
    imageUrl: null,
    authorLine: item.source_name,
    featured: false,
    published: true,
    publishedAt: item.published_at ? new Date(item.published_at) : new Date(item.created_at),
    views: Math.round((item.relevance_score || 0) * 1000),
    commentCount: 0,
    category: item.category
      ? { id: `cat-${item.category}`, name: item.category, slug: slugify(item.category), color: null as string | null }
      : null,
    rssFeed: { id: `src-${item.id}`, name: item.source_name, url: item.source_url },
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.created_at),
  };
}

function mapJob(item: BackendItem) {
  return {
    id: String(item.id),
    title: item.title,
    company: item.organization || item.source_name,
    location: item.region || "Namibia",
    region: item.region,
    source: item.source_name,
    salary: item.amount_text,
    type: "Full-time",
    url: item.source_url,
    postedAgo: null,
    scrapedAt: new Date(item.created_at),
    active: true,
  };
}

function mapTender(item: BackendItem) {
  const closing = item.closing_date ? new Date(item.closing_date) : new Date(item.created_at);
  return {
    id: String(item.id),
    docId: `TN-${item.id}`,
    title: item.title,
    department: item.organization || item.source_name,
    deadline: closing,
    estimatedValue: item.amount_text,
    status: "open",
    summaries: [{ id: `sum-${item.id}`, text: item.summary || item.title, order: 0 }],
    keyDates: [{ id: `kd-${item.id}`, text: closing.toISOString().slice(0, 10), order: 0 }],
    compliances: [],
  };
}

export async function getFeaturedArticle() {
  if (useConvex) return dataConvex.getFeaturedArticle();
  const rows = await api<BackendItem[]>("/api/v1/articles?limit=1");
  return rows.length ? mapArticle(rows[0]) : null;
}

export async function getArticles(options?: {
  section?: string;
  category?: string;
  source?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  if (useConvex) return dataConvex.getArticles(options);
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit || 20));
  if (options?.section) params.set("section", options.section);
  if (options?.offset) params.set("offset", String(options.offset));
  const rows = await api<BackendItem[]>(`/api/v1/articles?${params.toString()}`);
  let articles = rows.map(mapArticle);
  if (options?.category) {
    const wanted = options.category.toLowerCase();
    articles = articles.filter((a) => (a.categorySlug || "").toLowerCase().includes(wanted));
  }
  if (options?.source) {
    const s = options.source.toLowerCase();
    articles = articles.filter((a) => a.authorLine.toLowerCase().includes(s));
  }
  return articles;
}

export async function getArticleBySlug(slug: string) {
  if (useConvex) return dataConvex.getArticleBySlug(slug);
  try {
    const row = await api<BackendItem>(`/api/v1/articles/${encodeURIComponent(slug)}`);
    return row ? mapArticle(row) : null;
  } catch {
    const rows = await api<BackendItem[]>("/api/v1/articles?limit=200");
    return rows.map(mapArticle).find((a) => a.slug === slug) || null;
  }
}

export async function getJobs(options?: { region?: string; source?: string; type?: string; limit?: number }) {
  if (useConvex) return dataConvex.getJobs(options);
  const rows = await api<BackendItem[]>(`/api/v1/jobs?limit=${options?.limit || 50}`);
  let jobs = rows.map(mapJob);
  if (options?.region) jobs = jobs.filter((j) => (j.region || "").toLowerCase() === options.region!.toLowerCase());
  if (options?.source) jobs = jobs.filter((j) => j.source.toLowerCase().includes(options.source!.toLowerCase()));
  return jobs;
}

export async function getTenders(options?: { status?: string; department?: string; limit?: number }) {
  if (useConvex) return dataConvex.getTenders(options);
  const rows = await api<BackendItem[]>(`/api/v1/tenders?limit=${options?.limit || 50}`);
  let tenders = rows.map(mapTender);
  if (options?.department) {
    const d = options.department.toLowerCase();
    tenders = tenders.filter((t) => t.department.toLowerCase().includes(d));
  }
  return tenders;
}

export async function getMarketData() {
  if (useConvex) return dataConvex.getMarketData();
  try {
    return await api<
      Array<{
        id: string;
        pair: string;
        rate: string;
        change: string;
        direction: string;
        source: string;
        active: boolean;
        updatedAt: string;
      }>
    >("/api/v1/market/live");
  } catch {
    return [];
  }
}

export async function getTickerItems() {
  if (useConvex) {
    // Use Convex tickerItem table when available — for now, return []
    return [];
  }
  const rows = await api<BackendItem[]>("/api/v1/articles?limit=8");
  return rows.map((r, i) => ({ id: String(i + 1), text: `${r.title} ▸`, order: i, active: true }));
}

export async function searchArticles(query: string, options?: { limit?: number; section?: string }) {
  if (useConvex) return dataConvex.searchArticles(query, options);
  const rows = await api<BackendItem[]>(`/api/v1/articles?limit=${Math.max(options?.limit || 20, 100)}`);
  const q = query.toLowerCase();
  return rows
    .map(mapArticle)
    .filter((a) => (a.headline + " " + a.content).toLowerCase().includes(q))
    .filter((a) => (options?.section ? a.section === options.section : true))
    .slice(0, options?.limit || 20);
}

export async function getPlatformStats() {
  if (useConvex) {
    const stats = await dataConvex.getStats();
    if (stats) {
      return {
        news: stats.articles,
        jobs: stats.jobs,
        tenders: stats.tenders,
        internships: 0,
        total: stats.total,
      };
    }
  }
  return api<{ news: number; jobs: number; tenders: number; internships: number; total: number }>("/api/v1/stats");
}

export async function getCategoryBySlug(slug: string) {
  const pretty = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { id: `cat-${slug}`, name: pretty, slug, description: `${pretty} section`, color: null, icon: null, order: 0, active: true, children: [], _count: { articles: 0 } };
}

export async function getRssFeeds() {
  return [];
}

export async function subscribeNewsletter(email: string, name?: string) {
  if (useConvex) {
    // Use Convex mutation directly — bypass the proxy
    const { convexClient } = await import("@/lib/convex");
    const { api } = await import("@convex/_generated/api");
    if (convexClient) {
      const result = await convexClient.mutation(api.mutations.subscribeNewsletter, { email, name });
      return { email, name, active: true, id: (result as any)?.id };
    }
  }
  return { email, name, active: true };
}

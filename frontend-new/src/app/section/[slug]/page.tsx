// ============================================================
// Times of Namibia — Section Page (dynamic category pages)
// Covers: national, economy, mining, energy, politics, sport,
//         infrastructure, environment, technology, opinion
// ============================================================

import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import Breadcrumbs from "@/components/ton/Breadcrumbs";
import EmptyState from "@/components/ton/EmptyState";
import ScrapedTimestamp from "@/components/ton/ScrapedTimestamp";
import ShareButtons from "@/components/ton/ShareButtons";
import { getArticles, getCategoryBySlug } from "@/lib/data";
import { Newspaper, ArrowRight, Clock } from "lucide-react";

interface SectionPageProps {
  params: Promise<{ slug: string }>;
}

const SECTION_META: Record<string, { title: string; description: string }> = {
  national: { title: "National News", description: "Namibia's top stories — governance, policy, and civic life." },
  economy: { title: "Economy & Business", description: "Financial news, trade data, corporate reporting, and economic policy." },
  mining: { title: "Mining & Minerals", description: "Diamonds, uranium, gold, and the extractive industries driving Namibia." },
  energy: { title: "Energy & Power", description: "Green hydrogen, solar, oil, gas, and Namibia's energy future." },
  politics: { title: "Politics & Governance", description: "Election coverage, legislative tracking, and political analysis." },
  africa: { title: "Africa Desk", description: "Continental news and analysis from across five regions." },
  world: { title: "World News", description: "International affairs from verified wire services and correspondents." },
  sport: { title: "Sports", description: "Brave Warriors, NPL, athletics, rugby, and netball coverage." },
  infrastructure: { title: "Infrastructure", description: "Roads, ports, broadband, and national development projects." },
  environment: { title: "Environment & Climate", description: "Conservation, drought, desert ecology, and water resources." },
  technology: { title: "Technology & Innovation", description: "Digital transformation, broadband, startups, and ICT policy." },
  opinion: { title: "Opinion & Analysis", description: "Editorials, columns, letters to the editor, and guest commentary." },
};

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = SECTION_META[slug] || SECTION_META.national;

  // TANGISON Iteration 4 Fix #7: Don't manually append " — Times of Namibia"
  // — the layout.tsx title template already does that. Otherwise the title
  // becomes "Title — Times of Namibia — Times of Namibia" (double suffix).
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/section/${slug}` },
    openGraph: {
      title: `${meta.title} — Times of Namibia`,
      description: meta.description,
      type: "website",
      locale: "en_NA",
      siteName: "Times of Namibia",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} — Times of Namibia`,
      description: meta.description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const meta = SECTION_META[slug] || SECTION_META.national;
  const category = await getCategoryBySlug(slug);
  const articles = await getArticles({ section: slug, limit: 20 });

  return (
    <TonLayout activePage={slug === "national" ? "national" : undefined}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Newspaper className="w-5 h-5 text-ton-red" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold border border-ton-red/20 px-2 py-0.5">
              {slug}
            </span>
            {category && (
              <span className="font-mono text-[9px] text-ton-black/20">
                {category._count.articles} articles
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
            {meta.title}
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            {meta.description}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Breadcrumbs items={[{ label: meta.title }]} />
            <span className="font-mono text-[9px] text-ton-black/20">TANGISON</span>
          </div>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <EmptyState
            type="articles"
            title={`${meta.title} — Coming Soon`}
            description={`The data scraper agent is collecting ${meta.title.toLowerCase()} content from Namibian sources. Articles will appear here automatically.`}
            action={{ label: "Return to Front Page", href: "/" }}
          />
        ) : (
          <>
            {/* Featured Article */}
            {articles[0] && (
              <div className="pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-ton-black/10">
                <div className="flex items-center gap-2 mb-3">
                  {articles[0].category && (
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 border font-semibold uppercase tracking-wider"
                      style={{ color: articles[0].category.color || "#CB102E", borderColor: articles[0].category.color || "#CB102E" }}
                    >
                      {articles[0].category.name}
                    </span>
                  )}
                  <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-wider">{articles[0].source}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black leading-tight">
                  <a href={`/article/${articles[0].slug}`} className="hover:text-ton-red transition-colors">
                    {articles[0].headline}
                  </a>
                </h2>
                {articles[0].subheadline && (
                  <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 leading-relaxed">
                    {articles[0].subheadline}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-ton-black/40">
                  <span className="font-sans text-xs">{articles[0].authorLine}</span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Clock className="w-3 h-3" />
                    {articles[0].readingTime} min
                  </span>
                  <ScrapedTimestamp label="Published" date={articles[0].publishedAt} />
                </div>
                <div className="mt-3">
                  <ShareButtons title={articles[0].headline} />
                </div>
              </div>
            )}

            {/* Article List */}
            <div className="divide-y divide-ton-black/5">
              {articles.slice(1).map((article) => (
                <div key={article.id} className="py-4 sm:py-5 group hover:bg-white/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {article.category && (
                          <span
                            className="font-mono text-[9px] px-1.5 py-0.5 border font-semibold uppercase tracking-wider"
                            style={{ color: article.category.color || "#CB102E", borderColor: article.category.color || "#CB102E" }}
                          >
                            {article.category.name}
                          </span>
                        )}
                        <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-wider">{article.source}</span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-semibold text-ton-black leading-snug group-hover:text-ton-red transition-colors">
                        <a href={`/article/${article.slug}`}>
                          {article.headline}
                        </a>
                      </h3>
                      {article.excerpt && (
                        <p className="font-sans text-xs text-ton-black/50 mt-1.5 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-ton-black/30">
                        <span className="font-sans text-[11px]">{article.authorLine}</span>
                        <span className="font-mono text-[10px]">
                          {article.readingTime} min
                        </span>
                        <ScrapedTimestamp label="" date={article.publishedAt} />
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ton-black/15 group-hover:text-ton-red transition-colors mt-2 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {articles.length >= 20 && (
              <div className="mt-8 pt-6 border-t border-ton-black/10 text-center">
                <a
                  href={`/api/articles?section=${slug}&limit=20&offset=20`}
                  className="inline-flex items-center gap-2 border border-ton-black/20 text-ton-black font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/5 transition-colors"
                >
                  Load More Articles
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </>
        )}

        {/* Data Agent Status */}
        <div className="mt-8 pt-6 border-t border-ton-black/8 text-center">
          <p className="font-mono text-[9px] text-ton-black/20 uppercase tracking-wider">
            Sources: RSS Feeds | Parliament | Government Portals | Data Scraper Agent
          </p>
        </div>
      </div>
    </TonLayout>
  );
}

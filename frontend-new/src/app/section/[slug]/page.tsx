import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import Breadcrumbs from "@/components/ton/Breadcrumbs";
import EmptyState from "@/components/ton/EmptyState";
import { getArticles, getCategoryBySlug } from "@/lib/data";
import { Newspaper, Clock, ChevronRight } from "lucide-react";
import ArticleCard from "@/components/ton/ArticleCard";

interface SectionPageProps {
  params: Promise<{ slug: string }>;
}

const SECTION_META: Record<string, { title: string; description: string }> = {
  national: { title: "National News", description: "Namibia's top stories - governance, policy, and civic life." },
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

  const canonicalOverride: Record<string, string> = {
    africa: "/africa",
    world: "/world",
  };
  const canonical = canonicalOverride[slug] ?? `/section/${slug}`;
  const robots = canonicalOverride[slug]
    ? { index: false, follow: true }
    : { index: true, follow: true };

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: `${meta.title} - Times of Namibia`,
      description: meta.description,
      type: "website",
      locale: "en_NA",
      siteName: "Times of Namibia",
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const meta = SECTION_META[slug] || SECTION_META.national;
  const category = await getCategoryBySlug(slug);
  const articles = await getArticles({ section: slug, limit: 20 });

  const featuredArticle = articles[0] || null;
  const gridArticles = articles.slice(1, 9);
  const sidebarArticles = articles.slice(9, 15);

  return (
    <TonLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Newspaper className="w-5 h-5 text-ton-red" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold border border-ton-red/20 px-2 py-0.5">
              {slug}
            </span>
            {articles.length > 0 && (
              <span className="font-mono text-[9px] text-ton-black/20">
                {articles.length} {articles.length === 1 ? "article" : "articles"}
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
          </div>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            type="articles"
            title={`${meta.title} - Coming Soon`}
            description={`The data scraper agent is collecting ${meta.title.toLowerCase()} content from Namibian sources. Articles will appear here automatically.`}
            action={{ label: "Return to Front Page", href: "/" }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content - 8 cols */}
            <div className="lg:col-span-8">
              {/* Featured article */}
              {featuredArticle && (
                <a
                  href={`/article/${featuredArticle.slug}`}
                  className="group block mb-8 pb-8 border-b border-ton-black/10"
                >
                  {featuredArticle.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden mb-4 bg-ton-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <span className="inline-block bg-ton-red text-white font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
                    {featuredArticle.section}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-ton-black leading-tight group-hover:text-ton-red transition-colors">
                    {featuredArticle.headline}
                  </h2>
                  {featuredArticle.excerpt && (
                    <p className="font-sans text-ton-black/50 text-sm md:text-base mt-2 leading-relaxed line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-ton-black/30 uppercase tracking-wider">
                    <span>{featuredArticle.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredArticle.readingTime} min
                    </span>
                  </div>
                </a>
              )}

              {/* Article grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </div>

            {/* Sidebar - 4 cols */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-ton-black">
                <h3 className="font-serif font-bold text-lg text-ton-black">More in {meta.title}</h3>
              </div>
              <div>
                {sidebarArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} variant="compact" />
                ))}
              </div>

              {articles.length >= 20 && (
                <div className="mt-6 text-center">
                  <a
                    href={`/?section=${slug}`}
                    className="inline-flex items-center gap-2 border border-ton-black/15 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ton-black/60 hover:bg-ton-black hover:text-white transition-all"
                  >
                    View All {meta.title}
                    <ChevronRight size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TonLayout>
  );
}

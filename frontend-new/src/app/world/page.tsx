import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import ArticleCard from "@/components/ton/ArticleCard";
import { getArticles } from "@/lib/data";
import { Globe2 } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "World News — International Affairs",
  description:
    "International affairs from verified wire services and correspondents. Global coverage with a Namibian perspective.",
  alternates: { canonical: "/world" },
  openGraph: {
    title: "World News — Times of Namibia",
    description: "International affairs from verified wire services and correspondents.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export default async function WorldPage() {
  const articles = await getArticles({ section: "world", limit: 20 });
  const featured = articles[0] || null;
  const grid = articles.slice(1, 9);
  const sidebar = articles.slice(9, 15);

  return (
    <TonLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="w-5 h-5 text-ton-red" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold border border-ton-red/20 px-2 py-0.5">
              World
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
            World News
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            International affairs from verified wire services and correspondents. Global coverage with a Namibian perspective.
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-ton-black/40 text-lg">Articles will appear here as new content is ingested.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main — 8 cols */}
            <div className="lg:col-span-8">
              {featured && (
                <a href={`/article/${featured.slug}`} className="group block mb-8 pb-8 border-b border-ton-black/10">
                  {featured.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden mb-4 bg-ton-black/5">
                      <img src={featured.imageUrl} alt={featured.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <span className="inline-block bg-ton-red text-white font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
                    {featured.section}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-ton-black leading-tight group-hover:text-ton-red transition-colors">
                    {featured.headline}
                  </h2>
                  {featured.excerpt && (
                    <p className="font-sans text-ton-black/50 text-sm md:text-base mt-2 leading-relaxed line-clamp-2">{featured.excerpt}</p>
                  )}
                </a>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {grid.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
              </div>
            </div>
            {/* Sidebar — 4 cols */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-ton-black">
                <h3 className="font-serif font-bold text-lg text-ton-black">More World News</h3>
              </div>
              {sidebar.map((a, i) => <ArticleCard key={a.id} article={a} index={i} variant="compact" />)}
            </div>
          </div>
        )}
      </div>
    </TonLayout>
  );
}

import TonLayout from "@/components/ton/TonLayout";
import HomeView from "@/components/ton/HomeView";
import {
  getFeaturedArticle,
  getArticles,
  getJobs,
  getTenders,
  getMarketData,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredArticle, recentArticles, jobs, tenders, marketData] =
    await Promise.all([
      getFeaturedArticle(),
      getArticles({ limit: 10 }),
      getJobs({ limit: 14 }),
      getTenders({ limit: 5 }),
      getMarketData(),
    ]);

  return (
    <TonLayout activePage="national">
      <HomeView
        featuredArticle={featuredArticle}
        recentArticles={recentArticles}
        jobs={jobs}
        tenders={tenders}
        marketData={marketData}
      />
    </TonLayout>
  );
}

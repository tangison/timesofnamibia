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

export const metadata = {
  title: "National News — Latest Headlines",
  description:
    "Real-time verified news, tender alerts, job market data, and financial updates from Namibia — sourced and timestamped by Times OS.",
  alternates: { canonical: "/" },
};

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

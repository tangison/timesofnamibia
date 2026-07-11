import TonLayout from "@/components/ton/TonLayout";
import HomeView from "@/components/ton/HomeView";
import {
  getFeaturedArticle,
  getArticles,
  getJobs,
  getTenders,
  getMarketData,
} from "@/lib/data";
import { triggerAutoIngestion } from "@/lib/rss-scheduler";

// TANGISON: ISR with 5-min revalidate instead of force-dynamic.
export const revalidate = 300;

export const metadata = {
  title: "Times of Namibia | Latest Namibian News, Business and Politics",
  description:
    "Times of Namibia — Namibia's digital broadsheet. Breaking news, business, mining, energy, politics, sport, tenders, and jobs from Windhoek and across all 14 regions.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  try {
    triggerAutoIngestion().catch(() => {
      // Silently fail — don't block page render
    });
  } catch {
    // Non-critical
  }

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
        marketData={marketData as any}
      />
    </TonLayout>
  );
}

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
  // TANGISON Iteration 4 Fix #16: Use the brand default homepage title
  // (was "National News — Latest Headlines" which made the homepage look
  // like a section page in SERPs). The title template appends " — Times
  // of Namibia" automatically.
  title: "Namibia's Digital Broadsheet — Applied AI. Built in Africa.",
  description:
    "Times of Namibia — a TANGISON news outlet. Real-time verified news, tender alerts, job market data, and financial updates for Namibia. Applied AI. Built in Africa.",
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

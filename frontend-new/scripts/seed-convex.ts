// ============================================================
// Times of Namibia — Convex seed script (TANGISON)
// ============================================================

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://exuberant-ladybug-733.convex.cloud";
const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("CONVEX_ADMIN_TOKEN env var required");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const now = Date.now();
const oneDayAgo = now - 24 * 60 * 60 * 1000;
const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;

const articles = [
  {
    slug: "namibia-budget-2026-infrastructure-boost",
    headline: "Namibia's 2026 Budget Boosts Infrastructure Spending by 18%",
    subheadline: "Finance minister unveils record allocation for roads, ports, and broadband expansion",
    content: "WINDHOEK — Namibia's finance minister presented the 2026 national budget to Parliament on Thursday, unveiling an 18% increase in infrastructure spending that prioritises road connectivity, port expansion at Walvis Bay, and rural broadband rollout. The budget, totalling NAD 78.4 billion, represents the largest capital allocation in the country's history and signals a renewed commitment to positioning Namibia as a logistics hub for Southern Africa. Key projects include the dualisation of the B1 corridor between Windhoek and Okahandja, expansion of the Port of Walvis Bay's container terminal, and a NAD 2.1 billion broadband initiative targeting 340 rural schools. The opposition raised concerns about debt sustainability, with public debt projected to reach 72% of GDP by year-end.",
    excerpt: "Finance minister unveils record NAD 78.4 billion budget with major allocations for roads, ports, and rural broadband.",
    source: "manual",
    section: "economy",
    categorySlug: "economy",
    authorLine: "TANGISON Editorial",
    publishedAt: now,
    featured: true,
    readingTime: 4,
  },
  {
    slug: "green-hydrogen-namibia-first-export",
    headline: "Namibia's Green Hydrogen Industry Ships First Export Cargo",
    subheadline: "HyIron facility near Lüderitz marks milestone in the country's energy transition",
    content: "LÜDERITZ — Namibia's fledgling green hydrogen industry reached a historic milestone this week as the HyIron facility near Lüderitz shipped its first export cargo of green iron to Germany. The 25,000-tonne shipment, produced using wind-powered electrolysis, represents the commercial debut of a sector the government hopes will generate NAD 30 billion in annual revenue by 2030. The facility, a joint venture between Namibian and German investors, currently employs 340 people and plans to triple capacity by 2027.",
    excerpt: "HyIron facility ships 25,000 tonnes of green iron to Germany, marking Namibia's entry into the global energy transition market.",
    source: "manual",
    section: "energy",
    categorySlug: "energy",
    authorLine: "TANGISON Editorial",
    publishedAt: oneDayAgo,
    featured: false,
    readingTime: 3,
  },
  {
    slug: "brave-warriors-afcon-qualifier-victory",
    headline: "Brave Warriors Secure AFCON Qualifier Victory Against Zimbabwe",
    subheadline: "Late goal from Shalulile seals 2-1 win in Windhoek",
    content: "WINDHOEK — The Brave Warriors kept their Africa Cup of Nations qualification hopes alive with a dramatic 2-1 victory over Zimbabwe at the Independence Stadium on Saturday. Peter Shalulile scored the winner in the 89th minute, sending the 18,000-strong crowd into delirium. The win moves Namibia to second place in Group C, two points behind leaders Morocco with three matches remaining.",
    excerpt: "Peter Shalulile's 89th-minute winner seals a crucial 2-1 victory for Namibia in AFCON qualifying.",
    source: "manual",
    section: "sport",
    categorySlug: "sport",
    authorLine: "TANGISON Sports Desk",
    publishedAt: twoDaysAgo,
    featured: false,
    readingTime: 2,
  },
  {
    slug: "tangison-series-a-funding",
    headline: "TANGISON Raises Series A to Expand Applied AI Across Africa",
    subheadline: "Windhoek-based AI laboratory secures funding to scale operations",
    content: "WINDHOEK — TANGISON, the Windhoek-based applied AI laboratory, announced this week that it has closed a Series A funding round to scale its operations across the African continent. The company builds AI systems for African operating conditions. The investment will expand the engineering team, accelerate research in localised language models, and deploy infrastructure in three new markets.",
    excerpt: "Windhoek-based TANGISON secures Series A funding to scale applied AI across Africa.",
    source: "manual",
    section: "technology",
    categorySlug: "technology",
    authorLine: "TANGISON Editorial",
    publishedAt: threeDaysAgo,
    featured: false,
    readingTime: 3,
  },
  {
    slug: "sadc-summit-climate-resolution",
    headline: "SADC Summit Adopts Resolution on Climate Adaptation",
    subheadline: "Regional leaders commit to coordinated drought response and renewable energy targets",
    content: "WINDHOEK — The Southern African Development Community (SADC) concluded its annual summit in Windhoek on Friday with a landmark resolution on climate adaptation. The 16-member bloc committed to a coordinated drought response mechanism, a regional renewable energy target of 40% by 2030, and the establishment of a joint climate finance facility.",
    excerpt: "Regional leaders adopt resolution on climate adaptation at Windhoek summit.",
    source: "manual",
    section: "africa",
    categorySlug: "africa",
    authorLine: "TANGISON Africa Desk",
    publishedAt: threeDaysAgo,
    featured: false,
    readingTime: 4,
  },
];

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    company: "TANGISON",
    location: "Windhoek",
    region: "Khomas",
    source: "LinkedIn",
    salary: "NAD 85,000 - 120,000/month",
    type: "Full-time",
    description: "Join our AI laboratory building systems for African operating conditions. Next.js, TypeScript, Convex.",
    url: "https://tangison.com/careers",
    postedAgo: "2 days ago",
  },
  {
    title: "Data Journalist",
    company: "Times of Namibia",
    location: "Windhoek",
    region: "Khomas",
    source: "NIEIS",
    salary: "NAD 45,000 - 60,000/month",
    type: "Full-time",
    description: "Investigate and visualise data-driven stories for Namibia's digital broadsheet.",
    url: "https://timesofnamibia.com/careers",
    postedAgo: "5 days ago",
  },
  {
    title: "Renewable Energy Project Manager",
    company: "HyIron",
    location: "Lüderitz",
    region: "Karas",
    source: "NamibiaJobs",
    salary: "NAD 70,000 - 95,000/month",
    type: "Full-time",
    description: "Lead the expansion of Namibia's green hydrogen production facility.",
    url: "https://hyiron.com/careers",
    postedAgo: "1 week ago",
  },
];

const tenders = [
  {
    docId: "TN-MW-2026-001",
    title: "Supply and Installation of Broadband Infrastructure for Rural Schools",
    department: "Ministry of Information and Communication Technology",
    deadline: now + 30 * 24 * 60 * 60 * 1000,
    estimatedValue: "NAD 2.1 billion",
    status: "open",
    contactEmail: "tenders@mict.gov.na",
    documentUrl: "https://etender.gov.na/TN-MW-2026-001",
  },
  {
    docId: "TN-RFA-2026-014",
    title: "Construction of B1 Corridor Dual Carriageway — Phase 2",
    department: "Roads Authority of Namibia",
    deadline: now + 45 * 24 * 60 * 60 * 1000,
    estimatedValue: "NAD 1.8 billion",
    status: "open",
    contactEmail: "procurement@rain.org.na",
    documentUrl: "https://etender.gov.na/TN-RFA-2026-014",
  },
];

const marketData = [
  { pair: "USD/NAD", rate: "18.42", change: "+0.08", direction: "up", source: "BoN" },
  { pair: "EUR/NAD", rate: "19.87", change: "-0.12", direction: "down", source: "BoN" },
  { pair: "ZAR/NAD", rate: "1.00", change: "0.00", direction: "flat", source: "BoN" },
  { pair: "GBP/NAD", rate: "23.34", change: "+0.21", direction: "up", source: "BoN" },
  { pair: "Gold (oz)", rate: "USD 2,041", change: "+12", direction: "up", source: "Kitco" },
  { pair: "Bitcoin", rate: "USD 67,234", change: "-890", direction: "down", source: "CoinGecko" },
];

const tickerItems = [
  "USD/NAD at 18.42 ↑",
  "Brave Warriors beat Zimbabwe 2-1 in AFCON qualifier",
  "Namibia's 2026 budget boosts infrastructure by 18%",
  "HyIron ships first green hydrogen export",
  "SADC summit adopts climate resolution",
];

async function seed() {
  console.log("Seeding Convex deployment:", CONVEX_URL);
  console.log("");

  console.log(`Inserting ${articles.length} articles...`);
  for (const a of articles) {
    try {
      const result = await client.mutation(api.mutationsAdmin.ingestArticle, {
        adminToken: ADMIN_TOKEN,
        ...a,
      });
      console.log(`  ✓ ${a.headline.slice(0, 60)}... → ${result.id} (deduped: ${result.deduped})`);
    } catch (err) {
      console.error(`  ✗ ${a.headline.slice(0, 60)}... → ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nInserting ${jobs.length} jobs...`);
  for (const j of jobs) {
    try {
      const result = await client.mutation(api.mutationsAdmin.ingestJob, {
        adminToken: ADMIN_TOKEN,
        ...j,
      });
      console.log(`  ✓ ${j.title} at ${j.company} → ${result.id}`);
    } catch (err) {
      console.error(`  ✗ ${j.title} → ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nInserting ${tenders.length} tenders...`);
  for (const t of tenders) {
    try {
      const result = await client.mutation(api.mutationsAdmin.ingestTender, {
        adminToken: ADMIN_TOKEN,
        ...t,
      });
      console.log(`  ✓ ${t.docId} → ${result.id}`);
    } catch (err) {
      console.error(`  ✗ ${t.docId} → ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nUpserting ${marketData.length} market data entries...`);
  for (const m of marketData) {
    try {
      const result = await client.mutation(api.mutationsAdmin.upsertMarketDatum, {
        adminToken: ADMIN_TOKEN,
        ...m,
      });
      console.log(`  ✓ ${m.pair} → ${result.id}`);
    } catch (err) {
      console.error(`  ✗ ${m.pair} → ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nInserting ${tickerItems.length} ticker items...`);
  for (let i = 0; i < tickerItems.length; i++) {
    const text = tickerItems[i];
    try {
      const result = await client.mutation(api.mutationsAdmin.upsertTickerItem, {
        adminToken: ADMIN_TOKEN,
        text,
        order: i,
      });
      console.log(`  ✓ "${text.slice(0, 50)}..." → ${result.id}`);
    } catch (err) {
      console.error(`  ✗ "${text.slice(0, 50)}..." → ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log("\n✅ Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

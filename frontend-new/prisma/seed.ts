// ============================================================
// Times of Namibia — Database Seed
// Real RSS feeds + initial content
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── CATEGORIES ───────────────────────────────────────────
  const categories = [
    { name: "National", slug: "national", description: "Namibia's top stories", color: "#CB102E", order: 1 },
    { name: "Economy", slug: "economy", description: "Business, markets, and finance", color: "#1a7a4c", order: 2 },
    { name: "Mining", slug: "mining", description: "Diamonds, uranium, and minerals", color: "#8B6914", order: 3 },
    { name: "Energy", slug: "energy", description: "Green hydrogen, solar, oil and gas", color: "#2E86AB", order: 4 },
    { name: "Politics", slug: "politics", description: "Government, parliament, and policy", color: "#7B2D8E", order: 5 },
    { name: "Africa", slug: "africa", description: "Continental news and analysis", color: "#E85D04", order: 6 },
    { name: "World", slug: "world", description: "International affairs", color: "#457B9D", order: 7 },
    { name: "Sport", slug: "sport", description: "Football, rugby, cricket and more", color: "#2D6A4F", order: 8 },
    { name: "Infrastructure", slug: "infrastructure", description: "Roads, ports, and development", color: "#6D6875", order: 9 },
    { name: "Environment", slug: "environment", description: "Conservation, climate, wildlife", color: "#40916C", order: 10 },
    { name: "Technology", slug: "technology", description: "Digital, innovation, broadband", color: "#3A86FF", order: 11 },
    { name: "Opinion", slug: "opinion", description: "Editorials, columns, analysis", color: "#9D4EDD", order: 12 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`  ✅ ${categories.length} categories`);

  // ── RSS FEEDS (Real Namibian/African sources) ────────────
  const rssFeeds = [
    // ── NAMIBIAN SOURCES ─────────────────────────────────────
    {
      name: "Namibia Economist",
      url: "https://economist.com.na/feed/",
      category: "Economy",
      siteUrl: "https://economist.com.na",
      description: "Namibia's business and economic analysis",
    },
    // Note: Many .na domains block automated RSS fetching or have
    // discontinued their RSS feeds. The Python data-agent scrapes
    // these sites directly (not via RSS) for Namibian-specific content.

    // ── AFRICA DESK ────────────────────────────────────────
    {
      name: "BBC Africa",
      url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
      category: "Africa",
      siteUrl: "https://bbc.com/news/world/africa",
      description: "BBC World Service Africa desk",
    },
    {
      name: "AllAfrica",
      url: "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",
      category: "Africa",
      siteUrl: "https://allafrica.com",
      description: "Pan-African news aggregator",
    },
    {
      name: "Al Jazeera",
      url: "https://www.aljazeera.com/xml/rss/all.xml",
      category: "Africa",
      siteUrl: "https://www.aljazeera.com",
      description: "Al Jazeera global coverage including Africa",
    },
    {
      name: "Mail & Guardian",
      url: "https://mg.co.za/feed/",
      category: "Africa",
      siteUrl: "https://mg.co.za",
      description: "Southern African investigative journalism",
    },
    {
      name: "The Guardian — Africa",
      url: "https://www.theguardian.com/world/africa/rss",
      category: "Africa",
      siteUrl: "https://www.theguardian.com/world/africa",
      description: "The Guardian Africa coverage",
    },

    // ── WORLD DESK ──────────────────────────────────────────
    {
      name: "Reuters World",
      url: "https://feeds.feedburner.com/Reuters/worldNews",
      category: "World",
      siteUrl: "https://reuters.com",
      description: "Reuters global news wire",
    },
    {
      name: "BBC World",
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      category: "World",
      siteUrl: "https://bbc.com/news/world",
      description: "BBC World News",
    },
    {
      name: "The Guardian — World",
      url: "https://www.theguardian.com/world/rss",
      category: "World",
      siteUrl: "https://www.theguardian.com/world",
      description: "The Guardian world news coverage",
    },
    {
      name: "NYT Africa",
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml",
      category: "Africa",
      siteUrl: "https://nytimes.com",
      description: "New York Times Africa coverage",
    },

    // ── ECONOMY & BUSINESS ──────────────────────────────────
    {
      name: "BBC Business",
      url: "https://feeds.bbci.co.uk/news/business/rss.xml",
      category: "Economy",
      siteUrl: "https://bbc.com/news/business",
      description: "BBC Business and finance news",
    },

    // ── ENERGY & ENVIRONMENT ────────────────────────────────
    {
      name: "BBC Science & Environment",
      url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      category: "Environment",
      siteUrl: "https://bbc.com/news/science_and_environment",
      description: "BBC science, climate, and environment",
    },
    {
      name: "The Guardian — Environment",
      url: "https://www.theguardian.com/environment/rss",
      category: "Environment",
      siteUrl: "https://www.theguardian.com/environment",
      description: "The Guardian environment and climate coverage",
    },

    // ── SPORT ───────────────────────────────────────────────
    {
      name: "BBC Sport",
      url: "https://feeds.bbci.co.uk/sport/rss.xml",
      category: "Sport",
      siteUrl: "https://bbc.com/sport",
      description: "BBC Sport coverage including African football",
    },

    // ── TECHNOLOGY ──────────────────────────────────────────
    {
      name: "BBC Technology",
      url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
      category: "Technology",
      siteUrl: "https://bbc.com/news/technology",
      description: "BBC technology news",
    },
    {
      name: "TechCabal",
      url: "https://techcabal.com/feed/",
      category: "Technology",
      siteUrl: "https://techcabal.com",
      description: "African technology and startup coverage",
    },
  ];

  for (const feed of rssFeeds) {
    await prisma.rssFeed.upsert({
      where: { url: feed.url },
      update: { name: feed.name, category: feed.category, description: feed.description },
      create: feed,
    });
  }
  console.log(`  ✅ ${rssFeeds.length} RSS feeds`);

  // ── USERS ────────────────────────────────────────────────
  const users = [
    { email: "editor@ton.na", name: "T. Shimwetha", role: "editor" },
    { email: "reporter@ton.na", name: "M. Amupanda", role: "journalist" },
    { email: "wire@ton.na", name: "K. Gowaseb", role: "journalist" },
    { email: "admin@ton.na", name: "TON Admin", role: "admin" },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`  ✅ ${users.length} users`);

  // ── FEATURED ARTICLE ─────────────────────────────────────
  await prisma.article.upsert({
    where: { slug: "namibias-green-hydrogen-dream-20260426" },
    update: {},
    create: {
      slug: "namibias-green-hydrogen-dream-20260426",
      headline: "Namibia's Green Hydrogen Dream: Can the Desert Fuel the World?",
      subheadline:
        "As global energy giants pour billions into the Tsau //Khaeb project, questions emerge about local benefit and environmental trade-offs",
      content: `Namibia stands at the threshold of an energy revolution. The Tsau //Khaeb (Sperrgebiet) National Park, once accessible only to diamond miners, is now the epicenter of what could become the world's largest green hydrogen production facility. Three consortiums — Hyphen Hydrogen Energy, HDF Energy, and the Daures Green Hydrogen Village — are racing to convert the desert's abundant sun and wind into the fuel of the future.

The numbers are staggering. The Hyphen project alone promises N$ 120 billion in investment over two phases, with first production targeted for 2027. At full capacity, the facility would produce 350,000 tonnes of green hydrogen annually — enough to replace significant fossil fuel consumption in European and Asian markets.

But beneath the gleaming projections lies a more complex reality. Local communities in the //Kharas region have raised concerns about water usage in one of the world's driest countries. The desalination plant required for the project will consume an estimated 25MW of power before a single kilogram of hydrogen is produced.

"We cannot drink hydrogen," says Anna Fredericks, a community leader from Lüderitz. "What good is a green revolution if our people still live without clean water and reliable electricity?"

The Ministry of Mines and Energy maintains that community benefit agreements are being negotiated in good faith. A local content requirement of 30% Namibian employment and procurement has been written into all project licenses.

Meanwhile, environmental groups have questioned the wisdom of industrializing a national park. The Sperrgebiet is home to unique biodiversity, including endemic succulent plants found nowhere else on Earth.

The debate encapsulates Namibia's broader challenge: how to harness its extraordinary natural resources — from uranium to diamonds to now sunlight and wind — in a way that truly benefits its 2.6 million citizens. The green hydrogen dream may yet prove transformative, but only if the promises etched in project proposals become reality on the ground.`,
      excerpt: "As global energy giants pour billions into the Tsau //Khaeb green hydrogen project, questions emerge about local benefit and environmental trade-offs in one of the world's driest nations.",
      source: "manual",
      categorySlug: "economy",
      section: "economy",
      readingTime: 6,
      imageAlt: "Aerial view of solar panels and wind turbines in the Namib desert with hydrogen processing facility",
      imageGps: "//KHARAS // 27.76 S, 18.49 E",
      authorLine: "T. Shimwetha & M. Amupanda",
      featured: true,
      published: true,
      publishedAt: new Date("2026-04-26T08:00:00Z"),
      categoryId: (await prisma.category.findUnique({ where: { slug: "economy" } }))!.id,
      authorId: (await prisma.user.findUnique({ where: { email: "editor@ton.na" } }))!.id,
    },
  });

  // ── CLEANUP (idempotent re-seed) ───────────────────────────
  await prisma.tickerItem.deleteMany();
  await prisma.marketDatum.deleteMany();
  await prisma.wireSubmission.deleteMany();
  await prisma.tenderSummary.deleteMany();
  await prisma.tenderKeyDate.deleteMany();
  await prisma.tenderCompliance.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.job.deleteMany();

  // ── JOBS ─────────────────────────────────────────────────
  const jobs = [
    { title: "Senior Mining Engineer", company: "Namdeb Diamond Corporation", location: "Windhoek", region: "Khomas", source: "LinkedIn", salary: "N$ 85,000 - 120,000/mo", type: "Full-time", salaryMin: 85000, salaryMax: 120000, postedAgo: "2h ago" },
    { title: "Financial Analyst", company: "Bank of Namibia", location: "Windhoek", region: "Khomas", source: "NIEIS", salary: "N$ 55,000 - 72,000/mo", type: "Full-time", salaryMin: 55000, salaryMax: 72000, postedAgo: "5h ago" },
    { title: "Marine Logistics Coordinator", company: "Walvis Bay Corridor Group", location: "Walvis Bay", region: "Erongo", source: "NamibiaJobs", salary: "N$ 42,000 - 58,000/mo", type: "Full-time", salaryMin: 42000, salaryMax: 58000, postedAgo: "8h ago" },
    { title: "Environmental Impact Assessor", company: "Ministry of Environment", location: "Windhoek", region: "Khomas", source: "CareerPortal", salary: "N$ 48,000 - 65,000/mo", type: "Contract", salaryMin: 48000, salaryMax: 65000, postedAgo: "12h ago" },
    { title: "Tourism Operations Manager", company: "Namibia Wildlife Resorts", location: "Swakopmund", region: "Erongo", source: "LinkedIn", salary: "N$ 38,000 - 52,000/mo", type: "Full-time", salaryMin: 38000, salaryMax: 52000, postedAgo: "1d ago" },
    { title: "Electrical Engineer — Solar Division", company: "NamPower", location: "Windhoek", region: "Khomas", source: "NIEIS", salary: "N$ 70,000 - 95,000/mo", type: "Full-time", salaryMin: 70000, salaryMax: 95000, postedAgo: "1d ago" },
    { title: "Legal Counsel — Mining Rights", company: "LorentzAngula Inc.", location: "Windhoek", region: "Khomas", source: "NamibiaJobs", salary: "N$ 60,000 - 88,000/mo", type: "Full-time", salaryMin: 60000, salaryMax: 88000, postedAgo: "2d ago" },
    { title: "Agricultural Extension Officer", company: "Ministry of Agriculture", location: "Otjiwarongo", region: "Otjozondjupa", source: "CareerPortal", salary: "N$ 32,000 - 45,000/mo", type: "Full-time", salaryMin: 32000, salaryMax: 45000, postedAgo: "2d ago" },
    { title: "IT Systems Administrator", company: "MTC Namibia", location: "Oshakati", region: "Oshana", source: "LinkedIn", salary: "N$ 45,000 - 62,000/mo", type: "Full-time", salaryMin: 45000, salaryMax: 62000, postedAgo: "3d ago" },
    { title: "Port Operations Supervisor", company: "Namport", location: "Walvis Bay", region: "Erongo", source: "NIEIS", salary: "N$ 50,000 - 68,000/mo", type: "Full-time", salaryMin: 50000, salaryMax: 68000, postedAgo: "3d ago" },
    { title: "Geological Survey Technician", company: "Geological Survey of Namibia", location: "Windhoek", region: "Khomas", source: "NamibiaJobs", salary: "N$ 35,000 - 48,000/mo", type: "Contract", salaryMin: 35000, salaryMax: 48000, postedAgo: "4d ago" },
    { title: "Community Health Nurse", company: "Ministry of Health", location: "Rundu", region: "Kavango East", source: "CareerPortal", salary: "N$ 28,000 - 38,000/mo", type: "Full-time", salaryMin: 28000, salaryMax: 38000, postedAgo: "4d ago" },
    { title: "Education District Officer", company: "Ministry of Education", location: "Katima Mulilo", region: "Zambezi", source: "NIEIS", salary: "N$ 30,000 - 42,000/mo", type: "Full-time", salaryMin: 30000, salaryMax: 42000, postedAgo: "5d ago" },
    { title: "Uranium Processing Plant Operator", company: "Rossing Uranium", location: "Arandis", region: "Erongo", source: "LinkedIn", salary: "N$ 55,000 - 75,000/mo", type: "Full-time", salaryMin: 55000, salaryMax: 75000, postedAgo: "5d ago" },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
  console.log(`  ✅ ${jobs.length} jobs`);

  // ── TENDERS ──────────────────────────────────────────────
  const tenders = [
    {
      docId: "GRN-2026-0451", title: "Supply of Medical Equipment to Regional Hospitals",
      department: "Ministry of Health and Social Services", deadline: new Date("2026-05-15"),
      estimatedValue: "N$ 12.5M — N$ 18M", status: "open",
      summaries: [
        { text: "Procurement of ICU ventilators and patient monitoring systems for 8 regional hospitals", order: 1 },
        { text: "Includes installation, training, and 3-year maintenance warranty", order: 2 },
        { text: "Bidders must be registered with the Pharmacy Council of Namibia", order: 3 },
      ],
      keyDates: [
        { text: "Briefing: 2026-04-28", order: 1 },
        { text: "Clarification deadline: 2026-05-05", order: 2 },
        { text: "Submission: 2026-05-15 10:00 CAT", order: 3 },
      ],
      compliances: [
        { requirement: "B-BBEE Level 1-4 certification", order: 1 },
        { requirement: "ISO 13485 Medical Devices certification", order: 2 },
        { requirement: "Local content minimum 30%", order: 3 },
        { requirement: "Valid tax clearance certificate", order: 4 },
      ],
    },
    {
      docId: "GRN-2026-0387", title: "Construction of Windhoek-Klein Windhoek Road Upgrade",
      department: "Roads Authority of Namibia", deadline: new Date("2026-05-08"),
      estimatedValue: "N$ 85M — N$ 120M", status: "closing",
      summaries: [
        { text: "Dual carriageway upgrade of 6.2km stretch including stormwater drainage", order: 1 },
        { text: "Phase 2 of the Windhoek Urban Transport Master Plan", order: 2 },
        { text: "24-month construction timeline with penalties for delays", order: 3 },
      ],
      keyDates: [
        { text: "Site visit: 2026-04-22", order: 1 },
        { text: "Submission: 2026-05-08 14:00 CAT", order: 2 },
        { text: "Award notification: 2026-06-15", order: 3 },
      ],
      compliances: [
        { requirement: "Registered with Construction Industries Federation", order: 1 },
        { requirement: "Minimum Grade 5CE contractor rating", order: 2 },
        { requirement: "Environmental Clearance Certificate", order: 3 },
        { requirement: "Performance guarantee of 10% of tender price", order: 4 },
      ],
    },
    {
      docId: "GRN-2026-0512", title: "National Broadband Fiber Optic Rollout — Phase 3",
      department: "Ministry of ICT", deadline: new Date("2026-06-01"),
      estimatedValue: "N$ 200M — N$ 280M", status: "open",
      summaries: [
        { text: "Fiber-to-the-home deployment across 14 towns in northern Namibia", order: 1 },
        { text: "Includes last-mile connectivity for 45,000 households", order: 2 },
        { text: "Public-private partnership model with 15-year concession period", order: 3 },
      ],
      keyDates: [
        { text: "RFI responses: 2026-04-30", order: 1 },
        { text: "Briefing: 2026-05-12", order: 2 },
        { text: "Submission: 2026-06-01 11:00 CAT", order: 3 },
      ],
      compliances: [
        { requirement: "CRAN telecommunications license", order: 1 },
        { requirement: "Minimum 5 years fiber deployment experience", order: 2 },
        { requirement: "Local employment plan (minimum 60% Namibian workforce)", order: 3 },
        { requirement: "Financial capacity: audited turnover > N$ 100M for past 3 years", order: 4 },
      ],
    },
  ];

  for (const tender of tenders) {
    const { summaries, keyDates, compliances, ...tenderData } = tender;
    const created = await prisma.tender.create({ data: tenderData });
    for (const s of summaries) await prisma.tenderSummary.create({ data: { ...s, tenderId: created.id } });
    for (const k of keyDates) await prisma.tenderKeyDate.create({ data: { ...k, tenderId: created.id } });
    for (const c of compliances) await prisma.tenderCompliance.create({ data: { ...c, tenderId: created.id } });
  }
  console.log(`  ✅ ${tenders.length} tenders`);

  // ── WIRE SUBMISSIONS ─────────────────────────────────────
  const wires = [
    { title: "Gold Road Mining Announces New Exploration License in Erongo", category: "Mining", priority: "urgent", source: "Mining Chamber of Namibia", content: "Gold Road Mining Ltd. has been granted an exclusive exploration license (EPL-7892) covering 45,000 hectares in the Erongo Region.", verified: true, timestamp: new Date("2026-04-26T08:30:00Z") },
    { title: "Bank of Namibia Holds Repo Rate Steady at 7.75%", category: "Economy", priority: "routine", source: "BoN Press Release", content: "The Monetary Policy Committee of the Bank of Namibia has decided to keep the repo rate unchanged at 7.75%.", verified: true, timestamp: new Date("2026-04-26T07:15:00Z") },
    { title: "BREAKING: Wildfire Threatens Brandberg Heritage Site", category: "National", priority: "breaking", source: "Erongo Regional Council", content: "A fast-moving wildfire is approaching the Brandberg Mountain heritage site. Emergency services have been deployed.", verified: true, timestamp: new Date("2026-04-26T09:45:00Z") },
    { title: "New Renewable Energy Feed-in Tariff Policy Draft Released", category: "Energy", priority: "routine", source: "Electricity Control Board", content: "The ECB has published draft regulations for a revised renewable energy feed-in tariff structure.", verified: false, timestamp: new Date("2026-04-25T16:20:00Z") },
    { title: "Trans-Kalahari Corridor Upgrade Funding Secured", category: "Infrastructure", priority: "urgent", source: "Road Fund Administration", content: "The RFA has confirmed N$ 340M in funding from the African Development Bank for the Trans-Kalahari Corridor upgrade.", verified: true, timestamp: new Date("2026-04-25T14:00:00Z") },
  ];

  for (const wire of wires) {
    await prisma.wireSubmission.create({ data: wire });
  }
  console.log(`  ✅ ${wires.length} wire submissions`);

  // ── MARKET DATA ──────────────────────────────────────────
  const markets = [
    { pair: "USD/NAD", rate: "18.42", change: "+0.3%", direction: "up", source: "BoN" },
    { pair: "EUR/NAD", rate: "20.15", change: "+0.1%", direction: "up", source: "BoN" },
    { pair: "ZAR/NAD", rate: "1.00", change: "0.0%", direction: "flat", source: "BoN" },
    { pair: "JSE All", rate: "89,234", change: "-0.1%", direction: "down", source: "JSE" },
    { pair: "BTC/USD", rate: "$94,210", change: "+1.2%", direction: "up", source: "CoinGecko" },
    { pair: "Gold/oz", rate: "$3,312", change: "+0.5%", direction: "up", source: "LBMA" },
  ];

  for (const market of markets) {
    await prisma.marketDatum.create({ data: market });
  }
  console.log(`  ✅ ${markets.length} market data entries`);

  // ── TICKER ITEMS ─────────────────────────────────────────
  const tickerItems = [
    "BREAKING: Brandberg wildfire — evacuation underway ▸",
    "BoN holds repo rate at 7.75% ▸",
    "Gold Road Mining secures EPL-7892 in Erongo ▸",
    "NIEIS: 847 new job listings this week ▸",
    "Trans-Kalahari Corridor: N$340M AfDB funding confirmed ▸",
    "NamPort: Lüderitz deep-water port feasibility tender open ▸",
    "Rossing Uranium processing plant hiring — 14 positions ▸",
    "Windhoek-Klein Windhoek road upgrade tender closing May 8 ▸",
    "National broadband fiber rollout Phase 3 — N$280M ▸",
    "Solar panels for 120 off-grid schools — tender closes April 30 ▸",
    "USD/NAD: 18.42 ▲ 0.3% ▸",
    "JSE All Share: 89,234 ▼ 0.1% ▸",
    "BTC/USD: $94,210 ▲ 1.2% ▸",
  ];

  for (let i = 0; i < tickerItems.length; i++) {
    await prisma.tickerItem.create({ data: { text: tickerItems[i], order: i + 1 } });
  }
  console.log(`  ✅ ${tickerItems.length} ticker items`);

  // ── FAQ ITEMS ────────────────────────────────────────────
  const faqItems = [
    { question: "What is Times of Namibia?", answer: "Times of Namibia (TON) is a digital-first news portal that combines the editorial authority of a broadsheet newspaper with real-time data intelligence. We aggregate news from RSS feeds, wire services, and original journalism to provide comprehensive coverage of Namibia.", category: "general", order: 1 },
    { question: "Where does your news come from?", answer: "Our news is sourced from a combination of RSS feeds from established Namibian and international media, wire submissions from verified contributors, and original reporting by our editorial team. All sources are clearly labeled.", category: "general", order: 2 },
    { question: "How often is content updated?", answer: "RSS feeds are ingested automatically throughout the day. Breaking news and wire submissions are published in real-time. Market data is updated every 15 minutes during trading hours.", category: "general", order: 3 },
    { question: "How can I submit a news tip?", answer: "You can submit news tips through our Contact page or via the Contributor Dashboard. Tips are reviewed by our editorial team before publication.", category: "contributing", order: 1 },
    { question: "Is there a newsletter?", answer: "Yes. You can subscribe to our daily briefing newsletter on the homepage. It delivers the top stories and market data every morning at 06:00 CAT.", category: "general", order: 4 },
  ];

  for (const faq of faqItems) {
    await prisma.faqItem.create({ data: faq });
  }
  console.log(`  ✅ ${faqItems.length} FAQ items`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

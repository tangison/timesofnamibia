import { MetadataRoute } from "next";
import { getArticles } from "@/lib/data";
import { getDirectoryPlaces } from "@/lib/directoryData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    // Section pages (data-scraper-agent taxonomy)
    { url: `${baseUrl}/section/national`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/section/politics`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/section/economy`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/section/mining`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/section/energy`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/africa`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/world`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/section/sport`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/section/infrastructure`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/section/environment`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/section/technology`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/section/opinion`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    // Transactional pages
    { url: `${baseUrl}/tender`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    // Static pages
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/brand`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/tangison`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/contributor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/plan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/editorial-standards`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/business-plan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/documents`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic article pages
  try {
    const articles = await getArticles({ limit: 500 });
    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

    // Directory place pages
    const places = await getDirectoryPlaces({ limit: 200 });
    const placePages: MetadataRoute.Sitemap = places.map((place) => ({
      url: `${baseUrl}/know-namibia/${place.slug}`,
      lastModified: new Date(place.updated_at || place.created_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Know Namibia section pages
    const knowNamibiaPages: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/know-namibia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
      { url: `${baseUrl}/know-namibia/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
      { url: `${baseUrl}/know-namibia/big-five`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/know-namibia/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];

    // Games pages
    const gamesPages: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
      { url: `${baseUrl}/games/sudoku`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
      { url: `${baseUrl}/games/wordle`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ];

    return [...staticPages, ...articlePages, ...placePages, ...knowNamibiaPages, ...gamesPages];
  } catch {
    return staticPages;
  }
}

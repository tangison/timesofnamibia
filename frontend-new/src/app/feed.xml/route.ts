import { getArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await getArticles({ limit: 50 });
  const baseUrl = "https://timesofnamibia.com";

  const rssItems = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.headline}]]></title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || article.subheadline || ""}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <dc:creator><![CDATA[${article.authorLine}]]></dc:creator>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <category>${article.category?.name || article.section || "News"}</category>
      <source>${article.rssFeed?.name || "Times of Namibia"}</source>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Times of Namibia — RSS Feed</title>
    <link>${baseUrl}</link>
    <description>Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data.</description>
    <language>en-na</language>
    <copyright>2026 Times of Namibia. All rights reserved.</copyright>
    <managingEditor>editorial@timesofnamibia.com (TON Editorial)</managingEditor>
    <webMaster>timesos@timesofnamibia.com (Times OS)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Times of Namibia — A TANGISON Publication</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

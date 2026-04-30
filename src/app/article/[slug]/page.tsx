import { notFound } from "next/navigation";
import TonLayout from "@/components/ton/TonLayout";
import ArticleView from "@/components/ton/ArticleView";
import { getArticleBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: article.headline,
    description:
      article.excerpt ||
      article.subheadline ||
      `Read "${article.headline}" on Times of Namibia. Verified, timestamped, sourced.`,
    alternates: { canonical: `/article/${slug}` },
    openGraph: {
      title: article.headline,
      description: article.excerpt || article.subheadline || undefined,
      type: "article",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      authors: [article.authorLine],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.imageAlt || article.headline }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.excerpt || article.subheadline || undefined,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // JSON-LD structured data for article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.excerpt || article.subheadline || undefined,
    author: {
      "@type": "Person",
      name: article.authorLine,
    },
    publisher: {
      "@type": "Organization",
      name: "Times of Namibia",
      url: "https://timesofnamibia.com",
      logo: {
        "@type": "ImageObject",
        url: "https://timesofnamibia.com/logo.svg",
      },
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://timesofnamibia.com/article/${slug}`,
    },
    image: article.imageUrl || undefined,
    articleSection: article.section || "News",
    wordCount: article.content.split(/\s+/).length,
    ...(article.source === "rss" && article.rssFeed
      ? { sourceOrganization: { "@type": "Organization", name: article.rssFeed.name } }
      : {}),
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://timesofnamibia.com",
      },
      ...(article.section
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: article.section.charAt(0).toUpperCase() + article.section.slice(1),
              item: `https://timesofnamibia.com/${article.section === "national" ? "" : article.section}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: article.section ? 3 : 2,
        name: article.headline,
        item: `https://timesofnamibia.com/article/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TonLayout activePage={article.section || "national"}>
        <ArticleView article={article} />
      </TonLayout>
    </>
  );
}

import { notFound } from "next/navigation";
import TonLayout from "@/components/ton/TonLayout";
import ArticleView from "@/components/ton/ArticleView";
import { getArticleBySlug } from "@/lib/data";

// TANGISON Iteration 4 Fix #2: Restore ISR (was force-dynamic).
// Articles don't change minute-by-minute; 5-min revalidate is plenty.
export const revalidate = 300;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    // TANGISON Iteration 4 Fix #3: explicit noindex on missing articles
    return {
      title: "Article Not Found",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: article.headline,
    description:
      (article as any).seo_meta_description ||
      (article as any).summary ||
      article.excerpt ||
      article.subheadline ||
      `Read "${article.headline}" on Times of Namibia. Verified, timestamped, sourced.`,
    alternates: { canonical: `/article/${slug}` },
    openGraph: {
      title: article.headline,
      // Phase 1: use seo_meta_description (max 160 chars) as og:description
      description: (article as any).seo_meta_description || (article as any).summary || article.excerpt || article.subheadline || undefined,
      type: "article",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      authors: [article.authorLine],
      // Task 6: use coverImage as og:image
      images: ((article as any).coverImage || article.imageUrl)
        ? [{ url: (article as any).coverImage || article.imageUrl, alt: article.imageAlt || article.headline }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: (article as any).seo_meta_description || (article as any).summary || article.excerpt || article.subheadline || undefined,
      images: ((article as any).coverImage || article.imageUrl)
        ? [(article as any).coverImage || article.imageUrl]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // TANGISON Iteration 4 Fix #3: wrap data fetch in try/catch so that
  // when the backend is unreachable, we return a real 404 instead of an
  // RSC error boundary (which was rendering an empty 200-OK page).
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  // Phase 1: Enhanced NewsArticle JSON-LD for rich Google snippets
  const articleImage = (article as any).coverImage || article.imageUrl;
  const seoDesc = (article as any).seo_meta_description || article.excerpt || article.subheadline;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: seoDesc,
    author: {
      "@type": "Person",
      name: article.authorLine,
    },
    publisher: {
      "@type": "Organization",
      name: "TANGISON",
      url: "https://tangison.com",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"}/logo-mark.png`,
        width: 286,
        height: 286,
      },
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"}/article/${slug}`,
    },
    // Phase 1: image as ImageObject for rich snippets
    image: articleImage
      ? {
          "@type": "ImageObject",
          url: articleImage,
          alt: article.imageAlt || article.headline,
        }
      : undefined,
    articleSection: article.section || "News",
    wordCount: article.content.split(/\s+/).length,
    // Phase 1: key takeaways as alternative headline for SEO
    ...((article as any).key_takeaways?.length
      ? { alternativeHeadline: (article as any).key_takeaways.join(". ") }
      : {}),
    ...(article.source === "rss" && article.rssFeed
      ? { sourceOrganization: { "@type": "Organization", name: article.rssFeed.name } }
      : {}),
  };

  // BreadcrumbList JSON-LD
  // TANGISON Iteration 4 Fix #8: Use /section/SECTION for non-national sections
  // (was /SECTION which 404s - politics, economy, mining, etc.)
  const sectionUrl = article.section === "national"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"}/section/${article.section}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app",
      },
      ...(article.section
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: article.section.charAt(0).toUpperCase() + article.section.slice(1),
              item: sectionUrl,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: article.section ? 3 : 2,
        name: article.headline,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"}/article/${slug}`,
      },
    ],
  };

  // TANGISON Iteration 4 Fix #4: escape < in JSON-LD to prevent stored XSS
  // via RSS-supplied headlines. Same pattern as layout.tsx safeJsonLd().
  const safeJsonLd = (obj: unknown) =>
    JSON.stringify(obj).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <TonLayout activePage={article.section || "national"}>
        <ArticleView article={article} />
      </TonLayout>
    </>
  );
}

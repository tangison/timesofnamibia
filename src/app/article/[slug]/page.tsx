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
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.excerpt || article.subheadline || undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <TonLayout activePage={article.section || "national"}>
      <ArticleView article={article} />
    </TonLayout>
  );
}

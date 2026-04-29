import { notFound } from "next/navigation";
import TonLayout from "@/components/ton/TonLayout";
import ArticleView from "@/components/ton/ArticleView";
import { getArticleBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
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

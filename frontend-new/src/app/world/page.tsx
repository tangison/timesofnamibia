import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import WorldView from "@/components/ton/WorldView";
import { getArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "World News — International Affairs",
  description:
    "International news and analysis from verified wire services. Global affairs through a Namibian lens.",
  alternates: { canonical: "/world" },
  openGraph: {
    title: "World News — Times of Namibia",
    description: "International news and analysis from verified wire services.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export default async function WorldPage() {
  const articles = await getArticles({ section: "world", limit: 20 });

  return (
    <TonLayout activePage="world">
      <WorldView articles={articles} />
    </TonLayout>
  );
}

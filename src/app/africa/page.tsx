import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import AfricaView from "@/components/ton/AfricaView";
import { getArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Africa News — Continental Coverage",
  description:
    "Continental news from Windhoek. Verified reports from five African regions — sourced, timestamped, and badged by the Africa Desk.",
  alternates: { canonical: "/africa" },
  openGraph: {
    title: "Africa News — Times of Namibia",
    description: "Continental news from Windhoek. Verified reports from five African regions.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export default async function AfricaPage() {
  const articles = await getArticles({ section: "africa", limit: 20 });

  return (
    <TonLayout activePage="africa">
      <AfricaView articles={articles} />
    </TonLayout>
  );
}

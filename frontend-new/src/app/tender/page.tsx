import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import TenderAnalysisView from "@/components/ton/TenderAnalysisView";

export const metadata: Metadata = {
  title: "Tenders - Government Procurement Namibia",
  description:
    "Active government tenders, procurement opportunities, and contract analysis. Real-time scraped from Namibian government portals.",
  alternates: { canonical: "/tender" },
  openGraph: {
    title: "Tenders - Times of Namibia",
    description: "Active government tenders and procurement opportunities in Namibia.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export const revalidate = 600;

export default function TenderPage() {
  return (
    <TonLayout>
      <h1 className="sr-only">Tenders — Government Procurement Namibia</h1>
      <TenderAnalysisView />
    </TonLayout>
  );
}

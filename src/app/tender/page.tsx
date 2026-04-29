import TonLayout from "@/components/ton/TonLayout";
import TenderAnalysisView from "@/components/ton/TenderAnalysisView";

export const metadata = {
  title: "Tender Analysis — The Tender Edge",
  description:
    "Times OS processes RFP documents and extracts critical intelligence in 6 seconds. Active Namibian tenders with deadline tracking, estimated values, and compliance requirements.",
  alternates: { canonical: "/tender" },
};

export default function TenderPage() {
  return (
    <TonLayout activePage="tender">
      <TenderAnalysisView />
    </TonLayout>
  );
}

import TonLayout from "@/components/ton/TonLayout";
import BusinessPlanView from "@/components/ton/BusinessPlanView";

export const metadata = {
  robots: { index: false, follow: true }, // internal page - not for public indexing
  title: "Business Plan",
  description:
    "Times of Namibia business plan - revenue model, market analysis, operational structure, and financial projections for Namibia's digital broadsheet.",
  alternates: { canonical: "/business-plan" },
};

export default function BusinessPlanPage() {
  return (
    <TonLayout activePage="business-plan">
      <BusinessPlanView />
    </TonLayout>
  );
}

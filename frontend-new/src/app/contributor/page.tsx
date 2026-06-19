import TonLayout from "@/components/ton/TonLayout";
import ContributorDashboard from "@/components/ton/ContributorDashboard";

export const metadata = {
  robots: { index: false, follow: true }, // internal page — not for public indexing
  title: "Contributor Programme",
  description:
    "Join the Times of Namibia contributor programme. Submit verified reports from your region. 3-point source validation, editorial standards, and byline attribution.",
  alternates: { canonical: "/contributor" },
};

export default function ContributorPage() {
  return (
    <TonLayout activePage="contributor">
      <ContributorDashboard />
    </TonLayout>
  );
}

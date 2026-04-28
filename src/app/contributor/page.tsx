import TonLayout from "@/components/ton/TonLayout";
import ContributorDashboard from "@/components/ton/ContributorDashboard";

export default function ContributorPage() {
  return (
    <TonLayout activePage="contributor">
      <ContributorDashboard />
    </TonLayout>
  );
}

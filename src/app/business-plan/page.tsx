import TonLayout from "@/components/ton/TonLayout";
import BusinessPlanView from "@/components/ton/BusinessPlanView";

export default function BusinessPlanPage() {
  return (
    <TonLayout activePage="business-plan">
      <BusinessPlanView />
    </TonLayout>
  );
}

import TonLayout from "@/components/ton/TonLayout";
import ThePlanView from "@/components/ton/ThePlanView";

export default function PlanPage() {
  return (
    <TonLayout activePage="plan">
      <ThePlanView />
    </TonLayout>
  );
}

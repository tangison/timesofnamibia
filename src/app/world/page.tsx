import TonLayout from "@/components/ton/TonLayout";
import WorldView from "@/components/ton/WorldView";

export default function WorldPage() {
  return (
    <TonLayout activePage="world">
      <WorldView />
    </TonLayout>
  );
}

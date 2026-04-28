import TonLayout from "@/components/ton/TonLayout";
import HomeView from "@/components/ton/HomeView";

export default function HomePage() {
  return (
    <TonLayout activePage="national">
      <HomeView />
    </TonLayout>
  );
}

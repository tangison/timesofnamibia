import TonLayout from "@/components/ton/TonLayout";
import WorldView from "@/components/ton/WorldView";

export const metadata = {
  title: "World News — International Desk",
  description:
    "Verified international coverage from wire services, government agencies, and confirmed correspondents across five continents. Every source carries its proof.",
  alternates: { canonical: "/world" },
};

export default function WorldPage() {
  return (
    <TonLayout activePage="world">
      <WorldView />
    </TonLayout>
  );
}

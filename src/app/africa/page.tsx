import TonLayout from "@/components/ton/TonLayout";
import AfricaView from "@/components/ton/AfricaView";

export const metadata = {
  title: "Africa News — Continental Coverage",
  description:
    "Continental news from Windhoek. Verified reports from five African regions — sourced, timestamped, and badged by the Africa Desk.",
  alternates: { canonical: "/africa" },
};

export default function AfricaPage() {
  return (
    <TonLayout activePage="africa">
      <AfricaView />
    </TonLayout>
  );
}

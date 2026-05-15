import TonLayout from "@/components/ton/TonLayout";
import BrandSystemView from "@/components/ton/BrandSystemView";

export const metadata = {
  title: "Brand System",
  description:
    "The Times of Namibia brand system — Broadsheet Digital design language, 3-colour palette, typography standards, and editorial voice. The visual vocabulary of authority.",
  alternates: { canonical: "/brand" },
};

export default function BrandPage() {
  return (
    <TonLayout activePage="brand">
      <BrandSystemView />
    </TonLayout>
  );
}

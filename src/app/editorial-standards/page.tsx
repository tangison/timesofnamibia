import TonLayout from "@/components/ton/TonLayout";
import EditorialStandardsView from "@/components/ton/EditorialStandardsView";

export const metadata = {
  title: "Editorial Standards",
  description:
    "Times of Namibia editorial standards and verification protocols. 3-point source validation, correction policy, and the Broadsheet Digital code of practice.",
  alternates: { canonical: "/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <TonLayout activePage="editorial-standards">
      <EditorialStandardsView />
    </TonLayout>
  );
}

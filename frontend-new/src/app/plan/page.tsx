import TonLayout from "@/components/ton/TonLayout";
import ThePlanView from "@/components/ton/ThePlanView";

export const metadata = {
  robots: { index: false, follow: true }, // internal page — not for public indexing
  title: "The Plan",
  description:
    "The strategic roadmap for Times of Namibia — from digital broadsheet to continental news infrastructure. Phased development, technology stack, and growth milestones.",
  alternates: { canonical: "/plan" },
};

export default function PlanPage() {
  return (
    <TonLayout activePage="plan">
      <ThePlanView />
    </TonLayout>
  );
}

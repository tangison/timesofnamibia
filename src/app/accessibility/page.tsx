import TonLayout from "@/components/ton/TonLayout";
import AccessibilityView from "@/components/ton/AccessibilityView";

export const metadata = {
  title: "Accessibility Statement",
  description:
    "Times of Namibia accessibility commitment. WCAG compliance, keyboard navigation, screen reader support, and continuous improvement of the reading experience.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <TonLayout activePage="accessibility">
      <AccessibilityView />
    </TonLayout>
  );
}

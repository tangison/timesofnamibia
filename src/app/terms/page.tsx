import TonLayout from "@/components/ton/TonLayout";
import TermsView from "@/components/ton/TermsView";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Times of Namibia. Usage conditions, intellectual property, contributor agreements, and editorial liability limitations.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <TonLayout activePage="terms">
      <TermsView />
    </TonLayout>
  );
}

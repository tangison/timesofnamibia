import TonLayout from "@/components/ton/TonLayout";
import PrivacyView from "@/components/ton/PrivacyView";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Times of Namibia privacy policy. How we collect, process, and protect reader data. No tracking, no third-party analytics, no engagement metrics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <TonLayout activePage="privacy">
      <PrivacyView />
    </TonLayout>
  );
}

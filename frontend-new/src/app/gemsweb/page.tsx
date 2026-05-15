import TonLayout from "@/components/ton/TonLayout";
import GemsWebView from "@/components/ton/GemsWebView";

export const metadata = {
  title: "GemsWeb Digital",
  description:
    "GemsWeb Digital — the publishing and technology company behind Times of Namibia. Enterprise data pipelines, automated verification, and information architecture.",
  alternates: { canonical: "/gemsweb" },
};

export default function GemsWebPage() {
  return (
    <TonLayout activePage="gemsweb">
      <GemsWebView />
    </TonLayout>
  );
}

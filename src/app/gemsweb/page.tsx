import TonLayout from "@/components/ton/TonLayout";
import GemsWebView from "@/components/ton/GemsWebView";

export default function GemsWebPage() {
  return (
    <TonLayout activePage="gemsweb">
      <GemsWebView />
    </TonLayout>
  );
}

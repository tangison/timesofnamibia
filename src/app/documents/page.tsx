import TonLayout from "@/components/ton/TonLayout";
import DocumentsView from "@/components/ton/DocumentsView";

export default function DocumentsPage() {
  return (
    <TonLayout activePage="documents">
      <DocumentsView />
    </TonLayout>
  );
}

import TonLayout from "@/components/ton/TonLayout";
import DocumentsView from "@/components/ton/DocumentsView";

export const metadata = {
  robots: { index: false, follow: true }, // internal page - not for public indexing
  title: "Documents",
  description:
    "Official documents and publications from Times of Namibia and TANGISON. Corporate filings, editorial policies, and public records.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  return (
    <TonLayout activePage="documents">
      <DocumentsView />
    </TonLayout>
  );
}

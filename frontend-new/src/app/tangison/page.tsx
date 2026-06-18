import TonLayout from "@/components/ton/TonLayout";
import TANGISONView from "@/components/ton/TANGISONView";

export const metadata = {
  title: "TANGISON",
  description:
    "TANGISON — the publishing and technology company behind Times of Namibia. Enterprise data pipelines, automated verification, and information architecture.",
  alternates: { canonical: "/tangison" },
};

export default function TANGISONPage() {
  return (
    <TonLayout activePage="tangison">
      <TANGISONView />
    </TonLayout>
  );
}

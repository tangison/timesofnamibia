import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import BigFiveClient from "@/components/ton/BigFiveClient";
import { getDirectoryPlaces } from "@/lib/directoryData";

export const metadata: Metadata = {
  title: "Big Five and Beyond - Know Namibia",
  description: "Discover Namibia's Big Five and endemic wildlife - desert elephant, black rhino, lion, leopard, buffalo, cheetah, gemsbok, and Hartmann's mountain zebra.",
  alternates: { canonical: "/know-namibia/big-five" },
};

export const revalidate = 3600;

export default async function BigFivePage() {
  const places = await getDirectoryPlaces({ limit: 100, type: "wildlife" });
  return (
    <TonLayout activePage="know-namibia">
      <BigFiveClient places={places} />
    </TonLayout>
  );
}

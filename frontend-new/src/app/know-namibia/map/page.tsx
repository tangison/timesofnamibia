import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import MapClient from "@/components/ton/MapClient";
import { getDirectoryPlaces } from "@/lib/directoryData";

export const metadata: Metadata = {
  title: "Interactive Map - Know Namibia",
  description: "Explore all of Namibia's parks, landmarks, towns, and wildlife on an interactive map.",
  alternates: { canonical: "/know-namibia/map" },
};

export const revalidate = 3600;

export default async function MapPage() {
  const places = await getDirectoryPlaces({ limit: 100 });
  return (
    <TonLayout activePage="know-namibia">
      <MapClient places={places} />
    </TonLayout>
  );
}

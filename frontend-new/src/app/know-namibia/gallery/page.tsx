import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import GalleryClient from "@/components/ton/GalleryClient";
import { getDirectoryPlaces } from "@/lib/directoryData";

export const metadata: Metadata = {
  title: "Namibia Gallery - Know Namibia",
  description: "Browse stunning WebP images of Namibia's parks, landmarks, wildlife, and cultural heritage.",
  alternates: { canonical: "/know-namibia/gallery" },
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const places = await getDirectoryPlaces({ limit: 100 });
  return (
    <TonLayout activePage="know-namibia">
      <GalleryClient places={places} />
    </TonLayout>
  );
}

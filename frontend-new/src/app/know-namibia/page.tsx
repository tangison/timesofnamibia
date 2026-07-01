import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import DirectoryListClient from "@/components/ton/DirectoryListClient";
import { getDirectoryPlaces } from "@/lib/directoryData";

export const metadata: Metadata = {
  title: "Know Namibia - National Directory",
  description:
    "Discover Namibia's national parks, landmarks, towns, wildlife, geological wonders, and cultural heritage. 48+ places with WebP images, interactive maps, and detailed guides.",
  alternates: { canonical: "/know-namibia" },
  openGraph: {
    title: "Know Namibia - Times of Namibia",
    description: "Discover Namibia's parks, landmarks, towns, wildlife, and cultural heritage.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export const revalidate = 3600;

export default async function KnowNamibiaPage() {
  const places = await getDirectoryPlaces({ limit: 100 });

  return (
    <TonLayout activePage="know-namibia">
      <DirectoryListClient places={places} />
    </TonLayout>
  );
}

import { notFound } from "next/navigation";
import TonLayout from "@/components/ton/TonLayout";
import PlaceDetailClient from "@/components/ton/PlaceDetailClient";
import { getDirectoryPlaceBySlug, getDirectoryPlaces } from "@/lib/directoryData";

export const revalidate = 3600;

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = await getDirectoryPlaceBySlug(slug);
  if (!place) {
    return { title: "Place Not Found", robots: { index: false, follow: true } };
  }
  const heroImage = place.images[0]?.webp_url || place.images[0]?.url;
  return {
    title: `${place.name} - Know Namibia`,
    description: place.seo_meta_description || place.short_description.slice(0, 160),
    alternates: { canonical: `/know-namibia/${slug}` },
    openGraph: {
      title: place.name,
      description: place.seo_meta_description || place.short_description.slice(0, 160),
      type: "article",
      images: heroImage ? [{ url: heroImage, alt: place.images[0]?.alt_text || place.name }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const places = await getDirectoryPlaces({ limit: 100 });
  return places.map((p) => ({ slug: p.slug }));
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = await getDirectoryPlaceBySlug(slug);
  if (!place) notFound();

  // Fetch related places
  const allPlaces = await getDirectoryPlaces({ limit: 100 });
  const relatedSlugs = place.related_places || [];
  const relatedByRegion = allPlaces.filter(
    (p) => p.slug !== slug && (relatedSlugs.includes(p.slug) || p.region === place.region || p.type === place.type)
  ).slice(0, 3);

  // JSON-LD TouristDestination
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: place.name,
    description: place.seo_meta_description || place.short_description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.coordinates.lat,
      longitude: place.coordinates.lng,
    },
    image: place.images.map((img) => img.webp_url || img.url),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app"}/know-namibia/${slug}`,
    sameAs: place.official_url,
  };

  const safeJsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <TonLayout activePage="know-namibia">
        <PlaceDetailClient place={place} relatedPlaces={relatedByRegion} />
      </TonLayout>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandedImageFallback } from "./BrandedImageFallback";

const WILDLIFE_INFO: Record<string, { habitat: string; whereToSpot: string; conservation: string }> = {
  "desert-elephant": { habitat: "Dry riverbeds of Kunene and Erongo regions", whereToSpot: "Skeleton Coast, Damaraland", conservation: "Vulnerable" },
  "desert-lion": { habitat: "Arid plains of Kunene region", whereToSpot: "Skeleton Coast, Palmwag Concession", conservation: "Endangered" },
  "black-rhinoceros": { habitat: "Etosha National Park, Damaraland", whereToSpot: "Etosha - Okaukuejo waterhole", conservation: "Critically Endangered" },
  "leopard": { habitat: "Rocky outcrops and savanna across Namibia", whereToSpot: "Etosha, Waterberg Plateau", conservation: "Vulnerable" },
  "african-buffalo": { habitat: "Rivers and floodplains of Zambezi region", whereToSpot: "Mudumu and Nkasa Rupara parks", conservation: "Near Threatened" },
  "cheetah": { habitat: "Open savanna and farmlands of central Namibia", whereToSpot: "Otjiwarongo area, Etosha", conservation: "Vulnerable" },
  "gemsbok": { habitat: "Desert and arid savanna across Namibia", whereToSpot: "Namib-Naukluft, Etosha, Kalahari", conservation: "Least Concern" },
  "hartmanns-mountain-zebra": { habitat: "Mountainous terrain of Kunene and Erongo", whereToSpot: "Etosha, Damaraland, Namib-Naukluft", conservation: "Vulnerable" },
};

export default function BigFiveClient({ places }: { places: any[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ton-black tracking-tight">
          Namibia&apos;s Big Five and Beyond
        </h1>
        <p className="font-sans text-ton-black/50 mt-3 max-w-2xl mx-auto">
          From the iconic Big Five to Namibia&apos;s unique desert-adapted species, discover the wildlife that makes this country extraordinary.
        </p>
      </div>

      {/* Wildlife cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {places.map((place, i) => {
          const info = WILDLIFE_INFO[place.slug] || {
            habitat: place.region,
            whereToSpot: "Various locations",
            conservation: "Varies",
          };
          const heroImage = place.images[0];
          return (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 4) * 0.1 }}
            >
              <Link
                href={`/know-namibia/${place.slug}`}
                className="group block bg-ton-cream/50 border-t-4 border-transparent hover:border-ton-red transition-all duration-300 h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ton-navy">
                  {heroImage?.webp_url ? (
                    <img
                      src={heroImage.webp_url}
                      alt={heroImage.alt_text || place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <BrandedImageFallback contextText={place.name} />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-lg text-ton-black group-hover:text-ton-red transition-colors mb-2">
                    {place.name}
                  </h3>
                  <dl className="space-y-1.5 text-xs">
                    <div>
                      <dt className="font-mono text-[8px] uppercase tracking-widest text-ton-black/40">Habitat</dt>
                      <dd className="font-sans text-ton-black/60">{info.habitat}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[8px] uppercase tracking-widest text-ton-black/40">Where to Spot</dt>
                      <dd className="font-sans text-ton-black/60">{info.whereToSpot}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[8px] uppercase tracking-widest text-ton-black/40">Conservation Status</dt>
                      <dd className="font-sans text-ton-red font-medium">{info.conservation}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {places.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ton-black/30">
            Wildlife data loading. Please check back shortly.
          </p>
        </div>
      )}
    </div>
  );
}

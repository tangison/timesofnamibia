import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cultural Groups of Namibia - Times of Namibia",
  description: "The diverse cultural groups of Namibia: Ovambo, Herero, Himba, Nama, Damara, Kavango, Lozi, Baster, San, and more.",
  alternates: { canonical: "/cultural-groups" },
};

export const revalidate = 86400;

const GROUPS = [
  { slug: "ovambo", name: "Ovambo", region: "Northern Namibia (Oshana, Ohangwena, Omusati, Oshikoto)", population: "~1.1 million (largest group)" },
  { slug: "herero", name: "Herero", region: "Central and Eastern Namibia (Otjozondjupa, Omaheke)", population: "~250,000" },
  { slug: "himba", name: "Himba", region: "Kunene Region (northwest)", population: "~50,000" },
  { slug: "nama", name: "Nama", region: "Southern Namibia (Karas, Hardap)", population: "~100,000" },
  { slug: "damara", name: "Damara", region: "Central and Northwestern Namibia", population: "~120,000" },
  { slug: "kavango-peoples", name: "Kavango Peoples", region: "Kavango East and West", population: "~220,000" },
  { slug: "caprivian-lozi", name: "Caprivian / Lozi", region: "Zambezi Region (former Caprivi Strip)", population: "~100,000" },
  { slug: "baster-rehoboth", name: "Baster (Rehoboth)", region: "Rehoboth area, Khomas Region", population: "~35,000" },
  { slug: "san", name: "San", region: "Eastern Namibia (Tsumkwe, Nyae Nyae)", population: "~38,000" },
  { slug: "coloured-namibian", name: "Coloured Namibian Community", region: "Windhoek, coastal towns", population: "~50,000" },
  { slug: "german-namibian", name: "German-Namibian Community", region: "Windhoek, Swakopmund, Luderitz", population: "~30,000" },
];

export default function CulturalGroupsPage() {
  return (
    <TonLayout activePage="cultural-groups">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-serif text-4xl font-bold text-ton-black tracking-tight mb-4">
          Cultural Groups of Namibia
        </h1>
        <p className="font-sans text-ton-black/50 mb-12 max-w-2xl">
          Namibia is home to 13 major ethnic and cultural groups, each with distinct languages, traditions, and histories. Explore each group below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {GROUPS.map((group) => (
            <Link
              key={group.slug}
              href={`/cultural-groups/${group.slug}`}
              className="group block border border-ton-black/10 p-6 hover:border-ton-red/30 transition-colors"
            >
              <h2 className="font-serif text-xl font-bold text-ton-black group-hover:text-ton-red transition-colors mb-2">
                {group.name}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 mb-1">
                {group.region}
              </p>
              <p className="font-sans text-sm text-ton-black/50">
                {group.population}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </TonLayout>
  );
}

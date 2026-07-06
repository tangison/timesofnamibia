import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "About Namibia - Constitution, Government, and Regions",
  description: "Namibia's constitution, government structure, 14 regions, national symbols, and path to independence.",
  alternates: { canonical: "/about-namibia" },
};

export const revalidate = 86400;

const REGIONS = [
  { name: "Zambezi", capital: "Katima Mulilo", description: "Northeastern panhandle, tropical climate, Caprivi Strip" },
  { name: "Erongo", capital: "Swakopmund", description: "Central coast, uranium mining, Walvis Bay port" },
  { name: "Hardap", capital: "Mariental", description: "South-central, Hardap Dam, sheep farming" },
  { name: "Karas", capital: "Keetmanshoop", description: "Deep south, Fish River Canyon, diamond coast" },
  { name: "Kavango East", capital: "Rundu", description: "Northeast, Okavango River, agriculture" },
  { name: "Kavango West", capital: "Nkurenkuru", description: "Northwest of Kavango, rural communities" },
  { name: "Khomas", capital: "Windhoek", description: "Central highlands, national capital region" },
  { name: "Kunene", capital: "Opuwo", description: "Northwest, Himba people, desert landscape" },
  { name: "Ohangwena", capital: "Eenhana", description: "North, densely populated Ovambo region" },
  { name: "Omaheke", capital: "Gobabis", description: "East, cattle country, Botswana border" },
  { name: "Omusati", capital: "Outapi", description: "North, Owambo communities, floodplain agriculture" },
  { name: "Oshana", capital: "Oshakati", description: "North, major urban center of northern Namibia" },
  { name: "Oshikoto", capital: "Omuthiya", description: "North, Etosha's eastern gate, mining heritage" },
  { name: "Otjozondjupa", capital: "Otjiwarongo", description: "Central, Waterberg Plateau, cattle ranching" },
];

const CONTENT = `# About Namibia

## Country Overview

**Capital:** Windhoek  
**Population:** Approximately 2.5 million (2023 census)  
**Official Language:** English  
**National Currency:** Namibian Dollar (NAD), pegged 1:1 to the South African Rand  
**Independence:** 21 March 1990  
**Area:** 825,615 square kilometers  

## Constitution and Government

Namibia's constitution was adopted on 9 February 1990 and took effect at independence on 21 March 1990. It is widely regarded as one of the most liberal constitutions in Africa, incorporating strong protections for fundamental human rights, press freedom, and property rights.

### Executive Branch

The President is both head of state and head of government, elected by popular vote for a term of five years (previously two terms maximum, amended in 2014 to allow three terms for the first president only). The President appoints the Prime Minister, who serves as head of government operations and leader of the cabinet.

### Legislative Branch

Parliament is bicameral:
- **National Assembly:** 104 members (96 elected, 8 appointed by the President), serving five-year terms via proportional representation.
- **National Council:** 42 members (3 from each of the 14 regions), serving six-year terms, representing regional interests.

### Judicial Branch

The judiciary is independent. The Supreme Court is the highest court of appeal, headed by the Chief Justice. The High Court handles constitutional matters and serious criminal cases. Lower courts include magistrate's courts and community courts, which apply customary law in certain civil matters.

## The 14 Regions

Namibia is divided into 14 administrative regions, each with its own Regional Council and local authority. The regions were established by the Regional Councils Act and were most recently reorganized in 2013 when Kavango was split into Kavango East and Kavango West.

## National Symbols

### Flag
Adopted at independence in 1990. The design features:
- **Blue** (top): The Atlantic Ocean, sky, and rain
- **White** (middle band): Peace and unity
- **Red** (diagonal): The people, their heroism, and determination to build a future of equal opportunity
- **Green** (triangle): Agriculture and vegetation
- **Gold sun** (12 rays): Life and energy

### Coat of Arms
Features an oryx (gemsbok) and a kudu as supporters, a fish eagle above, and the national motto "Unity, Liberty, Justice" on a ribbon below. The shield bears the flag colors.

### National Anthem
"Namibia, Land of the Brave" - adopted in 1997, replacing "Die Stem van Suid-Afrika" which was used during the transition period.

### National Animal
The oryx (gemsbok) - a large antelope adapted to desert conditions, appearing on the national coat of arms.

## Path to Independence

Namibia's journey to independence was long and costly. For a full account of the colonial period, the 1904-08 genocide, South African mandate rule, and the liberation struggle, see the [History of Namibia](/history-of-namibia) page.

The key milestone was UN Security Council Resolution 435 (1978), which set the framework for independence. After years of negotiation, the resolution was implemented in 1989 with elections supervised by the UN Transitional Assistance Group. SWAPO won 57 percent of the vote, and independence was achieved on 21 March 1990.
`;

const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ton-black mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="font-serif text-lg font-bold text-ton-black mt-6 mb-3" {...props} />,
  p: ({ node, ...props }: any) => <p className="font-serif text-base sm:text-lg text-ton-black/70 leading-[1.8] mb-5" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-bold text-ton-black" {...props} />,
  a: ({ node, ...props }: any) => <a className="text-ton-red hover:underline" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-5 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="font-serif text-base text-ton-black/70 leading-[1.8]" {...props} />,
};

export default function AboutNamibiaPage() {
  return (
    <TonLayout activePage="about-namibia">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ReactMarkdown components={markdownComponents}>{CONTENT}</ReactMarkdown>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight">
          The 14 Regions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {REGIONS.map((region) => (
            <div key={region.name} className="border border-ton-black/8 p-4">
              <h3 className="font-serif font-bold text-ton-black">{region.name}</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ton-red mb-1">
                Capital: {region.capital}
              </p>
              <p className="font-sans text-sm text-ton-black/50">{region.description}</p>
            </div>
          ))}
        </div>

        <Link href="/history-of-namibia" className="inline-flex items-center gap-2 bg-ton-navy text-white px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-ton-navy/80 transition-colors">
          Read the Full History of Namibia
        </Link>
      </div>
    </TonLayout>
  );
}

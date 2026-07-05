import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "History of Namibia - Times of Namibia",
  description:
    "The complete history of Namibia: pre-colonial societies, German colonization, the 1904-08 genocide, South African mandate, liberation war, and 1990 independence.",
  alternates: { canonical: "/history-of-namibia" },
  openGraph: {
    title: "History of Namibia",
    description: "From pre-colonial societies to independence in 1990.",
    type: "article",
  },
};

export const revalidate = 86400;

const HISTORY = `# History of Namibia

Namibia's history spans millennia of indigenous settlement, a brutal colonial period under German and South African rule, a protracted liberation struggle, and the hard-won independence of 1990. This page traces that arc through six major periods.

## Pre-Colonial Societies

The territory now known as Namibia has been inhabited for at least 25,000 years. The San people were among the earliest inhabitants, followed by Khoekhoe pastoralists and, from around the 16th century, Bantu-speaking agriculturalists including the Ovambo, Kavango, and Herero peoples.

The Ovambo established settled agricultural communities in the north, around the Cuvelai floodplain, cultivating sorghum and millet and maintaining trade networks reaching the Atlantic coast. The Herero migrated into central Namibia around the 17th century, establishing a cattle-based economy. The Nama, Khoekhoe-speaking pastoralists, occupied the south and central regions.

Coastal communities included the Topnaar along the Kuiseb River and the Damara in the central highlands. The Himba, an offshoot of the Herero, established themselves in the remote northwest, maintaining a semi-nomadic pastoral life that continues today.

Sources: *The Namibian* archives; Namibia Tourism Board historical overview; UNESCO World Heritage Centre (Twyfelfontein).

## German Colonization (1884-1915)

Germany declared the territory a protectorate in 1884, naming it German South-West Africa. The colonial administration under Theodor Leutwein initially pursued a policy of negotiated coexistence with indigenous rulers, but escalating land and cattle disputes led to armed conflict.

The Herero and Nama uprising of 1904-1908 was met with systematic extermination orders from General Lothar von Trotha. The Herero population was driven into the Omaheke Desert, where tens of thousands perished. Survivors were placed in concentration camps and forced into labor. An estimated 65,000 Herero (approximately 80 percent of the population) and 10,000 Nama were killed in what historians now recognize as the first genocide of the 20th century.

The German period also saw the establishment of settler farms, the founding of Windhoek as the colonial capital, and the construction of railways and infrastructure designed primarily to serve colonial extraction.

Sources: *The Namibian* archives; United Nations Whitaker Report (1985); academic works by Jan-Bart Gewald and Helmut Bley.

## South African Rule and Apartheid (1915-1990)

During World War I, South African forces occupied the territory in 1915. The League of Nations granted South Africa a mandate over the territory in 1920. After World War II, the United Nations sought to place all mandate territories under trusteeship, but South Africa refused, effectively annexing South-West Africa.

South Africa extended its apartheid system to the territory in the 1960s, establishing the Odendaal Plan which created bantustans (homelands) designed to segregate the population along ethnic lines. The South West Africa People's Organisation (SWAPO), founded in 1960, launched an armed struggle for independence in 1966.

The liberation war lasted over two decades. The Battle of Cassinga in 1978, a South African military raid on a SWAPO base in Angola, became a defining moment. International pressure mounted through the 1980s, with the UN Security Council demanding withdrawal.

Sources: *The Namibian* archives; UN Security Council Resolution 435 (1978); academic works by Colin Leys and Susan Brown.

## The Transition to Independence

The 1988 Brazzaville Protocol, brokered by the United States, Soviet Union, and Cuba, set the terms for Namibian independence. South Africa agreed to implement UN Resolution 435, which provided for a ceasefire, the withdrawal of South African troops, and elections under UN supervision.

The Constituent Assembly elections in November 1989 were certified as free and fair by the UN Transitional Assistance Group. SWAPO won 57 percent of the vote, short of the two-thirds majority needed to unilaterally draft the constitution, forcing a consensus-based drafting process that produced one of Africa's most liberal constitutions.

Sources: United Nations Transitional Assistance Group records; *The Namibian* election archives.

## Independence (1990-Present)

Namibia became independent on 21 March 1990. Sam Nujoma, SWAPO's leader, became the country's first president. The new nation inherited a deeply unequal economy, with most arable land owned by a small white minority.

The land reform question has defined much of post-independence politics. Namibia's constitution initially prohibited land expropriation without compensation, though a 2020 constitutional amendment allowed for expropriation in the public interest. The government has pursued a willing-seller, willing-buyer approach, though progress has been slow.

Namibia has maintained a stable multi-party democracy since independence, with peaceful transfers of power. Hage Geingob became president in 2015, and Netumbo Nandi-Ndaitwah in 2025, continuing SWAPO's electoral dominance while facing growing opposition.

The discovery of significant offshore oil and gas reserves, along with green hydrogen potential, has positioned Namibia as an emerging energy player. The country has also been a leader in conservation, with community conservancies covering over 20 percent of its land area.

Sources: *The Namibian* archives; Namibia Statistics Agency; International Monetary Fund country reports.

## Key Dates

- **1884:** German protectorate declared
- **1904-1908:** Herero and Nama genocide
- **1915:** South African occupation
- **1960:** SWAPO founded
- **1966:** Armed struggle begins
- **1989:** Independence elections
- **21 March 1990:** Independence achieved
- **2025:** Netumbo Nandi-Ndaitwah becomes president
`;

const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ton-black mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />,
  p: ({ node, ...props }: any) => <p className="font-serif text-base sm:text-lg text-ton-black/70 leading-[1.8] mb-5" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-bold text-ton-black" {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-5 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="font-serif text-base text-ton-black/70 leading-[1.8]" {...props} />,
};

export default function HistoryPage() {
  return (
    <TonLayout activePage="history">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ReactMarkdown components={markdownComponents}>{HISTORY}</ReactMarkdown>
      </div>
    </TonLayout>
  );
}

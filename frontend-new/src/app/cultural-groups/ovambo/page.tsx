import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Ovambo (Aawambo) - Cultural Groups of Namibia",
  description: "The Ovambo people: 8 sub-groups, language, history, and culture of Namibia's largest ethnic group.",
  alternates: { canonical: "/cultural-groups/ovambo" },
};

export const revalidate = 86400;

const CONTENT = `# Ovambo (Aawambo)

The Ovambo, who call themselves Aawambo, are the largest ethnic group in Namibia, comprising roughly 50 percent of the national population. They inhabit the fertile northern regions of Namibia, primarily the four "O-regions": Oshana, Ohangwena, Omusati, and Oshikoto.

## Origin and Migration

The Ovambo people migrated from the Great Lakes region of Central Africa, arriving in the Cuvelai floodplain of northern Namibia between the 14th and 16th centuries. They established settled agricultural communities based on sorghum and millet cultivation, supplemented by cattle and small livestock. The Cuvelai seasonal floodplain, fed by rains in Angola, provided reliable water in an otherwise arid country, enabling dense settlement.

## Language

The Ovambo speak Oshiwambo, a Bantu language with several dialects corresponding to the traditional sub-groups. The two most widely spoken dialects are Oshindonga and Oshikwanyama, both of which are used in education and media. The language shares roots with other Bantu languages across Southern Africa.

## The Eight Traditional Sub-Groups

The Ovambo are traditionally divided into eight sub-groups, each with its own historical kingdom, dialect variant, and territory within the Cuvelai region:

### Kwanyama (Oshikwanyama speakers)
The largest sub-group, straddling the Namibia-Angola border. The Kwanyama maintained a powerful kingdom that resisted Portuguese colonial expansion from Angola. Their territory centers on Ohangwena region. Oshikwanyama is one of the two written standards of Oshiwambo.

### Ndonga (Oshindonga speakers)
The second-largest sub-group, centered in the Oshikoto and Oshana regions. The Ndonga kingdom had a well-developed political structure with hereditary kings. Oshindonga is the other written standard of the language and was the first Oshiwambo dialect to be written down by missionaries.

### Kwambi
Located in the Omusati region, the Kwambi are a smaller sub-group with their own dialect. Their traditional leadership was based in the area around Okalongo.

### Ngandjera
Situated in the northern Omusati region, the Ngandjera had a distinct kingdom. Their territory lies near the Angolan border.

### Mbalantu
A smaller sub-group in the Omusati region, historically known for their elaborate hairstyles and distinctive cultural practices. The Mbalantu were among the last Ovambo groups to adopt Christianity.

### Kwaluudhi
Located in the Omusati region, the Kwaluudhi had their own traditional authority. Their territory borders that of the Ndonga.

### Nkolonkathi (also spelled Kolonkadhi)
A smaller sub-group in the Omusati region. Some sources list them separately from the Eunda, while others consider them closely related.

### Eunda
The smallest of the traditional sub-groups, located in the Omusati region. The Eunda have historically been closely associated with the Nkolonkathi.

## Traditional Social Structure

Each sub-group was historically governed by a hereditary king (oshilongo) assisted by senior headmen. The Kwanyama and Ndonga kingdoms were the most politically significant. Traditional authority structures persist alongside modern local government, with community courts applying customary law in matters of marriage, inheritance, and land disputes.

## Present-Day Population and Regions

The Ovambo population is estimated at approximately 1.1 million, making them the demographic majority in Namibia. They are concentrated in the four northern regions (Oshana, Ohangwena, Omusati, Oshikoto) with significant urban populations in Windhoek and other towns. The northern regions are among the most densely populated in Namibia.

## Sources

- Namibia Statistics Agency, 2023 Census preliminary results
- Tönjes, H. (1911). *Ovamboland: Country, People, Mission*
- Williams, F.N. (1991). *Precolonial Communities of Southwestern Africa*
- *The Namibian* newspaper archives`;
;

const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ton-black mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="font-serif text-lg font-bold text-ton-black mt-6 mb-3" {...props} />,
  p: ({ node, ...props }: any) => <p className="font-serif text-base sm:text-lg text-ton-black/70 leading-[1.8] mb-5" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-bold text-ton-black" {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
  a: ({ node, ...props }: any) => <a className="text-ton-red hover:underline" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-5 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="font-serif text-base text-ton-black/70 leading-[1.8]" {...props} />,
};

export default function OvamboPage() {
  return (
    <TonLayout activePage="cultural-groups">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ReactMarkdown components={markdownComponents}>{CONTENT}</ReactMarkdown>
      </div>
    </TonLayout>
  );
}

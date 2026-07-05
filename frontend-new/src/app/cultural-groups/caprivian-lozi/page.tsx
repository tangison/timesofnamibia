import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "caprivian-lozi - Cultural Groups of Namibia",
  description: "History, language, and cultural practices of the caprivian-lozi people of Namibia.",
  alternates: { canonical: "/cultural-groups/caprivian-lozi" },
};

export const revalidate = 86400;

const CONTENT = `# caprivian-lozi

Content for this cultural group page is being prepared. Please check back soon.

For more information about Namibia's cultural groups, visit the [cultural groups overview](/cultural-groups) or explore the [Know Namibia directory](/know-namibia).`;

const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="font-serif text-3xl font-bold text-ton-black mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="font-serif text-xl font-bold text-ton-black mt-8 mb-4" {...props} />,
  p: ({ node, ...props }: any) => <p className="font-serif text-base text-ton-black/70 leading-[1.8] mb-5" {...props} />,
  a: ({ node, ...props }: any) => <a className="text-ton-red hover:underline" {...props} />,
};

export default function GroupPage() {
  return (
    <TonLayout activePage="cultural-groups">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ReactMarkdown components={markdownComponents}>{CONTENT}</ReactMarkdown>
      </div>
    </TonLayout>
  );
}

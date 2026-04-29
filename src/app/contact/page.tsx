import TonLayout from "@/components/ton/TonLayout";
import ContactView from "@/components/ton/ContactView";

export const metadata = {
  title: "Contact the Desk",
  description:
    "Contact Times of Namibia — editorial tips, Times OS support, business partnerships, and contributor programme enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <TonLayout activePage="contact">
      <ContactView />
    </TonLayout>
  );
}

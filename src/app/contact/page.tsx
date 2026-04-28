import TonLayout from "@/components/ton/TonLayout";
import ContactView from "@/components/ton/ContactView";

export default function ContactPage() {
  return (
    <TonLayout activePage="contact">
      <ContactView />
    </TonLayout>
  );
}

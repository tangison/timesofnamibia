import TonLayout from "@/components/ton/TonLayout";
import AboutView from "@/components/ton/AboutView";

export default function AboutPage() {
  return (
    <TonLayout activePage="about">
      <AboutView />
    </TonLayout>
  );
}

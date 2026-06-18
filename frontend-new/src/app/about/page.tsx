import TonLayout from "@/components/ton/TonLayout";
import AboutView from "@/components/ton/AboutView";

export const metadata = {
  title: "About",
  description:
    "About Times of Namibia — a TANGISON publication. Broadsheet Digital philosophy, Times OS verification, and 14-region coverage.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <TonLayout activePage="about">
      <AboutView />
    </TonLayout>
  );
}

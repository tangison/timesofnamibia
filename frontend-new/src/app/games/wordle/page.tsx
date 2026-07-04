import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import WordleGame from "@/components/ton/WordleGame";

export const metadata: Metadata = {
  title: "Daily Word - Times of Namibia",
  description: "Daily word-guessing game for Times of Namibia readers. Same word for everyone each day.",
  alternates: { canonical: "/games/wordle" },
};

export default function WordlePage() {
  return (
    <TonLayout activePage="games">
      <WordleGame />
    </TonLayout>
  );
}

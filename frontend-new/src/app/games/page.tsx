import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Games - Times of Namibia",
  description: "Daily puzzle games for Times of Namibia readers.",
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return (
    <TonLayout activePage="games">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-serif text-4xl font-bold text-ton-black tracking-tight mb-8">
          Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/games/sudoku"
            className="group block border border-ton-black/10 p-8 hover:border-ton-red/30 transition-colors"
          >
            <h2 className="font-serif text-2xl font-bold text-ton-black group-hover:text-ton-red transition-colors mb-2">
              Daily Sudoku
            </h2>
            <p className="font-sans text-sm text-ton-black/50 leading-relaxed">
              A new 9x9 Sudoku puzzle every day. Same puzzle for everyone, with three difficulty levels.
            </p>
          </Link>
          <Link
            href="/games/wordle"
            className="group block border border-ton-black/10 p-8 hover:border-ton-red/30 transition-colors"
          >
            <h2 className="font-serif text-2xl font-bold text-ton-black group-hover:text-ton-red transition-colors mb-2">
              Daily Word
            </h2>
            <p className="font-sans text-sm text-ton-black/50 leading-relaxed">
              Guess the five-letter word in six tries. Same word for everyone each day.
            </p>
          </Link>
        </div>
      </div>
    </TonLayout>
  );
}

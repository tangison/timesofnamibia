import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import SudokuGame from "@/components/ton/SudokuGame";

export const metadata: Metadata = {
  title: "Daily Sudoku - Times of Namibia",
  description: "Daily Sudoku puzzle for Times of Namibia readers. Same puzzle for everyone each day, 9x9 grid with difficulty toggle.",
  alternates: { canonical: "/games/sudoku" },
};

export default function SudokuPage() {
  return (
    <TonLayout activePage="games">
      <SudokuGame />
    </TonLayout>
  );
}

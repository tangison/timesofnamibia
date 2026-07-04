"use client";

import { useState, useEffect, useCallback } from "react";
import * as sudoku from "sudoku";

// ============================================================
// Section 6: Sudoku using 'sudoku' npm package for puzzle logic
// Custom UI built on Tailwind - no library CSS imported
// ============================================================

type Grid = (number | null)[][];
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Convert flat array (0-8) to 2D grid (1-9 or null)
function toGrid(puzzle: number[]): Grid {
  const grid: Grid = [];
  for (let r = 0; r < 9; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < 9; c++) {
      const val = puzzle[r * 9 + c];
      row.push(val >= 0 ? val + 1 : null);
    }
    grid.push(row);
  }
  return grid;
}

// Get today's seed
function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Seeded PRNG for selecting which puzzle to generate
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzle, setPuzzle] = useState<Grid>([]);
  const [userGrid, setUserGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Generate puzzle using the 'sudoku' library
        const rng = mulberry32(getDailySeed());

    // Generate multiple puzzles and pick based on difficulty
    // ratepuzzle returns 0-4, where 0=easy, 4=hard
    let bestPuzzle: number[] | null = null;
    let bestScore = -1;
    const targetScore = difficulty === "easy" ? 0 : difficulty === "medium" ? 2 : 4;
    const attempts = 5;

    for (let i = 0; i < attempts; i++) {
      const p = sudoku.makepuzzle() as number[];
      const rating = (sudoku as any).ratepuzzle(p, true) as number;
      const diff = Math.abs(rating - targetScore);
      if (bestScore === -1 || diff < bestScore) {
        bestScore = diff;
        bestPuzzle = p;
      }
    }

    if (!bestPuzzle) {
      bestPuzzle = sudoku.makepuzzle() as number[];
    }

    const grid = toGrid(bestPuzzle);
    setPuzzle(grid);
    setUserGrid(grid.map(row => [...row]));
    setErrors(new Set());
    setCompleted(false);
  }, [difficulty]);

  const isGiven = (r: number, c: number) => puzzle[r]?.[c] !== null && puzzle[r]?.[c] !== undefined;

  const handleCellClick = (r: number, c: number) => {
    if (isGiven(r, c)) return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (isGiven(r, c)) return;

    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = num;
    setUserGrid(newGrid);

    // Check validity using the sudoku library's solvepuzzle
        const flatGrid: number[] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = newGrid[i][j];
        flatGrid.push(val !== null ? val - 1 : -1);
      }
    }

    // Simple validation: check row, column, box
    const newErrors = new Set(errors);
    const key = `${r},${c}`;
    let hasError = false;

    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== c && newGrid[r][j] === num) hasError = true;
    }
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== r && newGrid[i][c] === num) hasError = true;
    }
    // Check box
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    for (let i = boxR; i < boxR + 3; i++) {
      for (let j = boxC; j < boxC + 3; j++) {
        if ((i !== r || j !== c) && newGrid[i][j] === num) hasError = true;
      }
    }

    if (hasError) {
      newErrors.add(key);
    } else {
      newErrors.delete(key);
    }
    setErrors(newErrors);

    // Check completion
    let isComplete = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newGrid[i][j] === null) {
          isComplete = false;
          break;
        }
      }
    }
    if (isComplete && newErrors.size === 0) {
      setCompleted(true);
    }
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (isGiven(r, c)) return;
    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = null;
    setUserGrid(newGrid);
    const newErrors = new Set(errors);
    newErrors.delete(`${r},${c}`);
    setErrors(newErrors);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (puzzle.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="w-full aspect-square bg-ton-navy/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-bold text-ton-black tracking-tight mb-2">
          Daily Sudoku
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">
          {today}
        </p>
      </div>

      {/* Difficulty selector */}
      <div className="flex justify-center gap-2 mb-8">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
              difficulty === d
                ? "bg-ton-black text-white"
                : "text-ton-black/50 hover:text-ton-black border border-ton-black/10 hover:border-ton-black/30"
            }`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Sudoku grid - clean borders, no stray marks */}
      <div className="relative flex justify-center">
        <div
          className="inline-grid border-2 border-ton-black bg-white"
          style={{
            gridTemplateColumns: "repeat(9, 1fr)",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          {userGrid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              const isErr = errors.has(`${r},${c}`);
              const given = isGiven(r, c);
              // Clean box borders - only show 3x3 separators
              const rightBorder = c % 3 === 2 && c < 8 ? "border-r-2 border-r-ton-black" : "border-r border-r-ton-black/10";
              const bottomBorder = r % 3 === 2 && r < 8 ? "border-b-2 border-b-ton-black" : "border-b border-b-ton-black/10";
              const leftBorder = c === 0 ? "border-l-0" : "";
              const topBorder = r === 0 ? "border-t-0" : "";

              return (
                <button
                  key={`${r},${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square flex items-center justify-center font-serif text-lg font-bold transition-colors ${rightBorder} ${bottomBorder} ${leftBorder} ${topBorder} ${
                    isSelected ? "bg-ton-red/15" : "bg-white"
                  } ${
                    isErr ? "text-ton-red" : given ? "text-ton-black" : "text-ton-navy"
                  } ${!given ? "hover:bg-ton-navy/5 cursor-pointer" : "cursor-default"}`}
                >
                  {cell !== null ? cell : ""}
                </button>
              );
            })
          )}
        </div>

        {/* Completion overlay */}
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-ton-black mb-2">Solved!</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 mb-4">
                Come back tomorrow for a new puzzle
              </p>
              <button
                onClick={() => {
                  setUserGrid(puzzle.map(row => [...row]));
                  setCompleted(false);
                  setErrors(new Set());
                }}
                className="font-mono text-[10px] uppercase tracking-widest bg-ton-black text-white px-4 py-2 hover:bg-ton-red transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Number pad */}
      <div className="mt-8 flex justify-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
            className="w-12 h-12 font-serif text-lg font-bold text-ton-black border border-ton-black/15 hover:bg-ton-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleErase}
          disabled={!selectedCell}
          className="w-12 h-12 font-mono text-[10px] uppercase tracking-widest text-ton-black border border-ton-black/15 hover:bg-ton-red hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Del
        </button>
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-ton-black/45">
        Click a cell, then tap a number. Same puzzle for everyone each day.
      </p>
    </div>
  );
}

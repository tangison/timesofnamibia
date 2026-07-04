"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// Section 5: Daily Sudoku - deterministic by date
// All visitors get the same puzzle each day.
// Pure algorithmic generation, no AI/external API.
// ============================================================

type Grid = (number | null)[][];
type Difficulty = "easy" | "medium" | "hard";

// Seeded PRNG (mulberry32) for deterministic generation
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Get today's seed from the date
function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Shuffle array with seeded RNG
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Check if placement is valid
function isValid(grid: (number | null)[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
}

// Fill a 9x9 grid with a valid Sudoku solution (backtracking)
function fillGrid(grid: (number | null)[][], rng: () => number): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid, rng)) return true;
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generate a puzzle by removing cells from a solved grid
function generatePuzzle(seed: number, difficulty: Difficulty): { puzzle: Grid; solution: Grid } {
  const rng = mulberry32(seed);
  const solution: Grid = Array(9).fill(null).map(() => Array(9).fill(null));
  fillGrid(solution, rng);

  const puzzle: Grid = solution.map(row => [...row]);

  // Number of cells to remove
  const removeCount = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;

  // Remove cells randomly
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  const shuffled = shuffle(positions, rng);
  for (let i = 0; i < removeCount && i < shuffled.length; i++) {
    const [r, c] = shuffled[i];
    puzzle[r][c] = null;
  }

  return { puzzle, solution };
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzle, setPuzzle] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [userGrid, setUserGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  // Generate puzzle on mount and when difficulty changes
  useEffect(() => {
    const seed = getDailySeed();
    const { puzzle: p, solution: s } = generatePuzzle(seed, difficulty);
    setPuzzle(p);
    setSolution(s);
    setUserGrid(p.map(row => [...row]));
    setErrors(new Set());
    setCompleted(false);
  }, [difficulty]);

  const isGiven = (r: number, c: number) => puzzle[r]?.[c] !== null;

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

    // Check for errors
    const newErrors = new Set(errors);
    const key = `${r},${c}`;
    if (solution[r][c] !== num) {
      newErrors.add(key);
    } else {
      newErrors.delete(key);
    }
    setErrors(newErrors);

    // Check completion
    let isComplete = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newGrid[i][j] !== solution[i][j]) {
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

      {/* Sudoku grid */}
      <div className="relative">
        <div className="inline-grid grid-cols-9 gap-0 border-2 border-ton-black mx-auto" style={{ width: "100%", maxWidth: "450px" }}>
          {userGrid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              const isErr = errors.has(`${r},${c}`);
              const given = isGiven(r, c);
              const boxBorder = (c % 3 === 2 && c < 8) ? "border-r-2 border-r-ton-black" : "";
              const bottomBorder = (r % 3 === 2 && r < 8) ? "border-b-2 border-b-ton-black" : "";

              return (
                <button
                  key={`${r},${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square flex items-center justify-center font-serif text-lg font-bold transition-colors ${boxBorder} ${bottomBorder} ${
                    isSelected ? "bg-ton-red/20" : "bg-white"
                  } ${
                    isErr ? "text-ton-red" : given ? "text-ton-black" : "text-ton-navy"
                  } ${
                    !given ? "hover:bg-ton-navy/5 cursor-pointer" : "cursor-default"
                  }`}
                  style={{ width: "11.11%" }}
                >
                  {cell || ""}
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

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-ton-black/30">
        Click a cell, then tap a number. Same puzzle for everyone each day.
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// Section 7: Daily Wordle-style word game
// Deterministic daily word seeded by date
// Namibia-relevant word list
// ============================================================

// Namibia-relevant 5-letter words
const NAMIBIA_WORDS = [
  "NAMIB", "DUNES", "Etosh", "herer", "oshak", "rundu", "gobab", "tsumeb",
  "luder", "oshik", "omaha", "ohang", "kavng", "kunen", "zambe", "angol",
  "kalah", "deser", "savnn", "acaci", "eleph", "rhino", "zebra", "hyena",
  "eland", "kudus", "oryx", "pelin", "ostrl", "korha", "hammer",
  "windh", "swakp", "walvs", "keetm", "otjiw", "groot",
  "oranje", "okava", "caprv", " Kunene",
  "minin", "urani", "diamo", "copper", "lithm",
  "fishriver", "sossu", "deadv", "dune45",
  "spitz", "brand", "twyfe", "epupa", "capec",
  "kolma", "sandw",
];

// Standard English 5-letter words as fallback
const ENGLISH_WORDS = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE",
  "ALLOW", "ALONE", "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE",
  "APPLY", "ARENA", "ARGUE", "ARISE", "ARRAY", "ARROW", "ASIDE", "ASSET", "AUDIO", "AUDIT",
  "AVOID", "AWARD", "AWARE", "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN",
  "BEGIN", "BEGUN", "BEING", "BELOW", "BENCH", "BIBLE", "BIRTH", "BLACK", "BLAME", "BLIND",
  "BLOCK", "BLOOD", "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BRAVE", "BREAD",
  "BREAK", "BREED", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BUILD", "BUILT", "BUYER",
  "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHART", "CHASE", "CHEAP",
  "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN",
  "CLEAR", "CLICK", "CLOCK", "CLOSE", "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER",
  "CRAFT", "CRASH", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CURVE", "CYCLE", "DAILY",
  "DANCE", "DATED", "DEALT", "DEATH", "DEBUT", "DELAY", "DEPTH", "DOING", "DOUBT", "DOZEN",
  "DRAFT", "DRAMA", "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING",
  "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY",
  "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT",
  "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET",
  "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK",
  "FRAUD", "FRESH", "FRONT", "FROST", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS",
  "GLOBE", "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GREAT", "GREEN", "GROSS",
  "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HARRY", "HEART", "HEAVY",
  "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE",
  "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER",
  "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEVEL", "LEWIS", "LIGHT",
  "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY", "LUNCH", "LYING",
  "MAGIC", "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDIA",
  "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR",
  "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NOISE",
  "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER",
  "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO",
  "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND",
  "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD",
  "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO",
  "REACH", "READY", "REFER", "RIGHT", "RIVAL", "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH",
  "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE",
  "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHIRT",
  "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL",
  "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SOLID", "SOLVE", "SORRY",
  "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE",
  "SPORT", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL", "STICK",
  "STILL", "STOCK", "STONE", "STOOD", "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY",
  "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES",
  "TEACH", "TEAMS", "TEETH", "TERry", "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE",
  "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT",
  "TIMES", "TIRED", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK",
  "TRADE", "TRAIN", "TREAT", "TREND", "TRIAL", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUST",
  "TRUTH", "TWICE", "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN",
  "USAGE", "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOICE", "WASTE",
  "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN",
  "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WRITE", "WRONG",
  "WROTE", "YIELD", "YOUNG", "YOUTH",
];

const ALL_WORDS = [...NAMIBIA_WORDS.map(w => w.toUpperCase()), ...ENGLISH_WORDS]
  .filter(w => w.length === 5)
  .filter(w => /^[A-Z]+$/.test(w));

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Seeded PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDailyWord(): string {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rng = mulberry32(seed);
  const idx = Math.floor(rng() * ALL_WORDS.length);
  return ALL_WORDS[idx];
}

type LetterState = "correct" | "present" | "absent" | "empty";

function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = new Array(WORD_LENGTH).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  // First pass: mark correct
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      targetChars[i] = "";
    }
  }

  // Second pass: mark present
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = targetChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = "present";
      targetChars[idx] = "";
    }
  }

  return result;
}

const STATE_COLORS: Record<LetterState, string> = {
  correct: "bg-ton-navy text-white border-ton-navy",
  present: "bg-ton-red text-white border-ton-red",
  absent: "bg-ton-black/10 text-ton-black/30 border-ton-black/10",
  empty: "bg-white text-ton-black border-ton-black/20",
};

const KEY_COLORS: Record<LetterState, string> = {
  correct: "bg-ton-navy text-white",
  present: "bg-ton-red text-white",
  absent: "bg-ton-black/10 text-ton-black/30",
  empty: "bg-ton-black/5 text-ton-black",
};

export default function WordleGame() {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [evaluations, setEvaluations] = useState<LetterState[][]>([]);

  useEffect(() => {
    setTarget(getDailyWord());
  }, []);

  const handleKeyClick = useCallback((key: string) => {
    if (gameState !== "playing") return;
    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) return;
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      const eval_ = evaluateGuess(currentGuess, target);
      setEvaluations([...evaluations, eval_]);
      if (currentGuess === target) {
        setGameState("won");
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameState("lost");
      }
      setCurrentGuess("");
    } else if (key === "DEL") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameState, currentGuess, guesses, target, evaluations]);

  // Keyboard input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "Enter") handleKeyClick("ENTER");
      else if (e.key === "Backspace") handleKeyClick("DEL");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyClick(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyClick, gameState]);

  // Get key state for keyboard coloring
  const getKeyState = (letter: string): LetterState => {
    let best: LetterState = "empty";
    for (let g = 0; g < guesses.length; g++) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guesses[g][i] === letter) {
          const state = evaluations[g]?.[i] || "empty";
          if (state === "correct") return "correct";
          if (state === "present") best = best === "correct" ? "correct" : "present";
          if (state === "absent" && best === "empty") best = "absent";
        }
      }
    }
    return best;
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-6">
        <h1 className="font-serif text-4xl font-bold text-ton-black tracking-tight mb-2">
          Daily Word
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">
          {today}
        </p>
      </div>

      {/* Guess grid */}
      <div className="flex flex-col gap-1.5 mb-6 items-center">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
          const guess = rowIdx < guesses.length
            ? guesses[rowIdx]
            : rowIdx === guesses.length
              ? currentGuess
              : "";
          const eval_ = evaluations[rowIdx];

          return (
            <div key={rowIdx} className="flex gap-1.5">
              {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                const letter = guess[colIdx] || "";
                const state: LetterState = eval_
                  ? eval_[colIdx]
                  : letter
                    ? "empty"
                    : "empty";

                return (
                  <div
                    key={colIdx}
                    className={`w-14 h-14 flex items-center justify-center font-serif text-2xl font-bold border-2 transition-all ${STATE_COLORS[state]} ${letter ? "scale-100" : ""}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Game over message */}
      {gameState !== "playing" && (
        <div className="text-center mb-6">
          <p className="font-serif text-xl font-bold text-ton-black mb-1">
            {gameState === "won" ? "You got it!" : "Better luck tomorrow!"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">
            The word was: {target}
          </p>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 items-center">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {rowIdx === 2 && (
              <button
                onClick={() => handleKeyClick("ENTER")}
                className="px-2 py-3 font-mono text-[9px] font-bold uppercase bg-ton-black/5 hover:bg-ton-black/10 rounded transition-colors"
              >
                Enter
              </button>
            )}
            {row.split("").map(letter => {
              const state = getKeyState(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleKeyClick(letter)}
                  disabled={gameState !== "playing"}
                  className={`w-8 h-12 font-mono text-xs font-bold rounded transition-colors ${KEY_COLORS[state]} disabled:opacity-50`}
                >
                  {letter}
                </button>
              );
            })}
            {rowIdx === 2 && (
              <button
                onClick={() => handleKeyClick("DEL")}
                className="px-2 py-3 font-mono text-[9px] font-bold uppercase bg-ton-black/5 hover:bg-ton-black/10 rounded transition-colors"
              >
                Del
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-ton-black/30">
        Same word for everyone each day. Type or tap letters.
      </p>
    </div>
  );
}

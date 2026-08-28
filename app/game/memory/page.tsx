"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ScoreSubmit from "@/components/ScoreSubmit";

const SYMBOLS = ["◆", "▲", "●", "■", "★", "♦", "✦", "⬟"];
const ALL_CARDS = [...SYMBOLS, ...SYMBOLS];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { id: number; symbol: string; flipped: boolean; matched: boolean };

function makeCards(): Card[] {
  return shuffle(ALL_CARDS).map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
}

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>(makeCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (!startTime || won) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(t);
  }, [startTime, won]);

  const handleFlip = useCallback((id: number) => {
    if (locked) return;
    const card = cards[id];
    if (card.flipped || card.matched || selected.includes(id)) return;
    if (!startTime) setStartTime(Date.now());

    const newSelected = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected;
      setTimeout(() => {
        setCards(prev => {
          const match = prev[a].symbol === prev[b].symbol;
          const updated = prev.map(c =>
            c.id === a || c.id === b
              ? { ...c, matched: match, flipped: match ? true : false }
              : c
          );
          if (updated.every(c => c.matched)) setWon(true);
          return updated;
        });
        setSelected([]);
        setLocked(false);
      }, 700);
      setSelected([]);
    } else {
      setSelected(newSelected);
    }
  }, [cards, selected, locked, startTime]);

  const restart = () => {
    setCards(makeCards());
    setSelected([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setStartTime(null);
    setElapsed(0);
  };

  const matched = cards.filter(c => c.matched).length / 2;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>MEMORY.EXE</span>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6" style={{ fontFamily: "monospace" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          MOVES: <span style={{ color: "white", fontWeight: 700 }}>{moves}</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          PAIR: <span style={{ color: "white", fontWeight: 700 }}>{matched}/{SYMBOLS.length}</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          TIME: <span style={{ color: "white", fontWeight: 700 }}>{elapsed}s</span>
        </div>
      </div>

      {/* Grid */}
      <div className="relative" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 72px)", gap: 10 }}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                width: 72, height: 72,
                borderRadius: 12,
                border: card.matched
                  ? "1px solid rgba(255,255,255,0.4)"
                  : card.flipped
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid rgba(255,255,255,0.1)",
                background: card.matched
                  ? "rgba(255,255,255,0.1)"
                  : card.flipped
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.03)",
                color: card.flipped || card.matched ? "rgba(255,255,255,0.9)" : "transparent",
                fontSize: 24,
                cursor: card.matched ? "default" : "pointer",
                transition: "all 0.2s ease",
                fontFamily: "monospace",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {card.flipped || card.matched ? card.symbol : ""}
            </button>
          ))}
        </div>

        {/* Win overlay */}
        {won && (() => {
          const finalScore = Math.max(10, 1000 - (elapsed * 5) - (moves * 2));
          return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl z-10 pointer-events-auto" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
              <p style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>CLEAR!</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 13 }}>{moves} moves · {elapsed}s</p>
              
              <ScoreSubmit game="memory" score={finalScore} onSubmitted={() => {}} />

              <button onClick={restart} className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full text-sm hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "monospace", background: "transparent" }}>
                <RotateCcw size={14} /> main lagi
              </button>
            </div>
          );
        })()}
      </div>

      <button onClick={restart} className="mt-5 flex items-center gap-2 text-xs hover:opacity-60 transition-opacity" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", background: "none", border: "none", cursor: "pointer" }}>
        <RotateCcw size={12} /> reset
      </button>
    </main>
  );
}

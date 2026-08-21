"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = CELL * COLS;
const H = CELL * ROWS;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };

function rnd(max: number) { return Math.floor(Math.random() * max); }
function newFood(snake: Pt[]): Pt {
  let f: Pt;
  do { f = { x: rnd(COLS), y: rnd(ROWS) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Pt[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 15, y: 10 } as Pt,
    score: 0,
    status: "idle" as "idle" | "playing" | "dead",
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [display, setDisplay] = useState({ score: 0, status: "idle" as "idle" | "playing" | "dead" });

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    // Snake
    s.snake.forEach((seg, i) => {
      const isHead = i === 0;
      const alpha = isHead ? 1 : 0.5 + (0.5 * (s.snake.length - i) / s.snake.length);
      ctx.fillStyle = isHead ? "rgba(255,255,255,0.95)" : `rgba(255,255,255,${alpha * 0.6})`;
      const pad = isHead ? 1 : 3;
      const r = isHead ? 6 : 4;
      const x = seg.x * CELL + pad, y = seg.y * CELL + pad;
      const sz = CELL - pad * 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + sz - r, y);
      ctx.arcTo(x + sz, y, x + sz, y + r, r);
      ctx.lineTo(x + sz, y + sz - r);
      ctx.arcTo(x + sz, y + sz, x + sz - r, y + sz, r);
      ctx.lineTo(x + r, y + sz);
      ctx.arcTo(x, y + sz, x, y + sz - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
      if (isHead) {
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      }
    });

    // Food — pulsing dot
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    const pulse = 3 + Math.sin(Date.now() / 300) * 1.5;
    ctx.beginPath();
    ctx.arc(fx, fy, pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx, fy, pulse + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Score overlay
    if (s.status !== "idle") {
      ctx.font = "bold 18px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText(`${s.score}`, 10, 24);
    }

    // Idle hint
    if (s.status === "idle") {
      ctx.font = "13px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "center";
      ctx.fillText("tekan WASD / ← ↑ → ↓ untuk mulai", W / 2, H / 2 + 40);
    }
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Pt = {
      x: (head.x + (s.dir === "RIGHT" ? 1 : s.dir === "LEFT" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (s.dir === "DOWN" ? 1 : s.dir === "UP" ? -1 : 0) + ROWS) % ROWS,
    };
    // Self collision
    if (s.snake.some(seg => seg.x === next.x && seg.y === next.y)) {
      s.status = "dead";
      setDisplay({ score: s.score, status: "dead" });
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    s.snake = [next, ...s.snake];
    if (next.x === s.food.x && next.y === s.food.y) {
      s.score++;
      s.food = newFood(s.snake);
      setDisplay(d => ({ ...d, score: s.score }));
    } else {
      s.snake.pop();
    }
  }, []);

  useEffect(() => {
    const loop = () => { tick(); draw(); };
    intervalRef.current = setInterval(loop, 120);
    draw();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tick, draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const dirMap: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const newDir = dirMap[e.key];
      if (!newDir) return;
      e.preventDefault();
      const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
      if (newDir !== opposite[s.dir]) s.nextDir = newDir;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const restart = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }],
      dir: "RIGHT",
      nextDir: "RIGHT",
      food: { x: 15, y: 10 },
      score: 0,
      status: "idle",
    };
    setDisplay({ score: 0, status: "idle" });
    if (intervalRef.current) clearInterval(intervalRef.current);
    const loop = () => { tick(); draw(); };
    intervalRef.current = setInterval(loop, 120);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="w-full mb-6 flex items-center justify-between" style={{ maxWidth: W }}>
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>SNAKE.EXE</span>
      </div>

      <div className="mb-4" style={{ width: W, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 13 }}>
          SCORE: <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{display.score}</span>
        </span>
      </div>

      <div className="relative w-full mx-auto" style={{ maxWidth: W, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", touchAction: "none" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", width: "100%", height: "auto" }} />
        {display.status === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <p style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>GAME OVER</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 14 }}>Skor kamu: {display.score}</p>
            <button onClick={restart} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "monospace", background: "transparent" }}>
              <RotateCcw size={14} /> main lagi
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 grid grid-cols-3 gap-2 w-full max-w-[180px] mx-auto md:hidden">
        <div />
        <button
          onClick={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            if (s.dir !== "DOWN") s.nextDir = "UP";
          }}
          className="bg-white/10 active:bg-white/20 p-4 rounded-lg flex items-center justify-center text-white"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            if (s.dir !== "RIGHT") s.nextDir = "LEFT";
          }}
          className="bg-white/10 active:bg-white/20 p-4 rounded-lg flex items-center justify-center text-white"
        >
          ←
        </button>
        <button
          onClick={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            if (s.dir !== "UP") s.nextDir = "DOWN";
          }}
          className="bg-white/10 active:bg-white/20 p-4 rounded-lg flex items-center justify-center text-white"
        >
          ↓
        </button>
        <button
          onClick={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            if (s.dir !== "LEFT") s.nextDir = "RIGHT";
          }}
          className="bg-white/10 active:bg-white/20 p-4 rounded-lg flex items-center justify-center text-white"
        >
          →
        </button>
      </div>

      <p className="hidden md:block" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace", marginTop: 16 }}>WASD / ← ↑ → ↓ untuk gerak</p>
    </main>
  );
}

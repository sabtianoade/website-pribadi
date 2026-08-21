"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

const COLS = 10, ROWS = 20, CELL = 28;
const W = COLS * CELL, H = ROWS * CELL;

const PIECES = [
  { shape: [[1,1,1,1]], color: "rgba(255,255,255,0.8)" },           // I
  { shape: [[1,1],[1,1]], color: "rgba(255,255,255,0.7)" },          // O
  { shape: [[0,1,0],[1,1,1]], color: "rgba(255,255,255,0.65)" },     // T
  { shape: [[1,0,0],[1,1,1]], color: "rgba(255,255,255,0.6)" },      // L
  { shape: [[0,0,1],[1,1,1]], color: "rgba(255,255,255,0.55)" },     // J
  { shape: [[0,1,1],[1,1,0]], color: "rgba(255,255,255,0.5)" },      // S
  { shape: [[1,1,0],[0,1,1]], color: "rgba(255,255,255,0.45)" },     // Z
];

type Board = (string | null)[][];
type Piece = { shape: number[][]; color: string; x: number; y: number };

function emptyBoard(): Board { return Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }
function randPiece(): Piece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { ...p, x: Math.floor((COLS - p.shape[0].length) / 2), y: 0 };
}
function fits(board: Board, piece: Piece, dx = 0, dy = 0): boolean {
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++)
      if (piece.shape[r][c]) {
        const nx = piece.x + c + dx, ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
  return true;
}
function rotate(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}
function lock(board: Board, piece: Piece): Board {
  const b = board.map(r => [...r]);
  piece.shape.forEach((row, r) => row.forEach((v, c) => {
    if (v) b[piece.y + r][piece.x + c] = piece.color;
  }));
  return b;
}
function clearLines(board: Board): [Board, number] {
  const kept = board.filter(row => row.some(c => !c));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return [[...empty, ...kept], cleared];
}

export default function TetrisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    board: emptyBoard(),
    piece: randPiece(),
    status: "idle" as "idle" | "playing" | "dead",
    score: 0,
    lines: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [display, setDisplay] = useState({ score: 0, lines: 0, status: "idle" as "idle" | "playing" | "dead" });

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    // Board
    s.board.forEach((row, r) => row.forEach((col, c) => {
      if (col) {
        ctx.fillStyle = col; ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.5;
        ctx.strokeRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    }));

    // Ghost piece
    if (s.status === "playing") {
      let ghostY = 0;
      while (fits(s.board, s.piece, 0, ghostY + 1)) ghostY++;
      s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v && ghostY > 0) {
          ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
          ctx.strokeRect((s.piece.x + c) * CELL + 1, (s.piece.y + r + ghostY) * CELL + 1, CELL - 2, CELL - 2);
        }
      }));
    }

    // Active piece
    s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v) {
        ctx.fillStyle = s.piece.color;
        ctx.fillRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 0.5;
        ctx.strokeRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
      }
    }));

    if (s.status === "idle") {
      ctx.font = "13px monospace"; ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.textAlign = "center";
      ctx.fillText("tekan ← → ↑ ↓ untuk mulai", W / 2, H / 2 + 20);
    }
  }, []);

  const dropPiece = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    if (fits(s.board, s.piece, 0, 1)) {
      s.piece = { ...s.piece, y: s.piece.y + 1 };
    } else {
      s.board = lock(s.board, s.piece);
      const [newBoard, cleared] = clearLines(s.board);
      s.board = newBoard;
      s.lines += cleared;
      s.score += [0, 100, 300, 500, 800][cleared] ?? 0;
      setDisplay(d => ({ ...d, score: s.score, lines: s.lines }));
      const next = randPiece();
      if (!fits(s.board, next)) {
        s.status = "dead";
        setDisplay({ score: s.score, lines: s.lines, status: "dead" });
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      s.piece = next;
    }
    draw();
  }, [draw]);

  useEffect(() => {
    draw();
    intervalRef.current = setInterval(dropPiece, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [dropPiece, draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault();
      if (s.status === "dead") return;
      if (s.status === "idle" && ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
        s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" }));
      }
      if (s.status !== "playing") return;
      if (e.key === "ArrowLeft" && fits(s.board, s.piece, -1)) s.piece = { ...s.piece, x: s.piece.x - 1 };
      if (e.key === "ArrowRight" && fits(s.board, s.piece, 1)) s.piece = { ...s.piece, x: s.piece.x + 1 };
      if (e.key === "ArrowDown") dropPiece();
      if (e.key === "ArrowUp") {
        const rotated = { ...s.piece, shape: rotate(s.piece.shape) };
        if (fits(s.board, rotated)) s.piece = rotated;
      }
      if (e.key === " ") {
        while (fits(s.board, s.piece, 0, 1)) s.piece = { ...s.piece, y: s.piece.y + 1 };
        dropPiece();
      }
      draw();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dropPiece, draw]);

  const restart = () => {
    stateRef.current = { board: emptyBoard(), piece: randPiece(), status: "idle", score: 0, lines: 0 };
    setDisplay({ score: 0, lines: 0, status: "idle" });
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(dropPiece, 500);
    draw();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="mb-6 flex items-center justify-between" style={{ width: W }}>
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>TETRIS.EXE</span>
      </div>
      <div className="flex gap-8 mb-4" style={{ width: W, fontFamily: "monospace" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>SCORE: <span style={{ color: "white", fontWeight: 700 }}>{display.score}</span></div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>LINES: <span style={{ color: "white", fontWeight: 700 }}>{display.lines}</span></div>
      </div>
      <div className="relative" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block" }} />
        {display.status === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
            <p style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>GAME OVER</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 14 }}>Score: {display.score} · Lines: {display.lines}</p>
            <button onClick={restart} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "monospace", background: "transparent" }}>
              <RotateCcw size={14} /> main lagi
            </button>
          </div>
        )}
      </div>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace", marginTop: 16 }}>← → gerak · ↑ putar · ↓ turun · SPASI drop</p>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

const GRAVITY = 0.35;
const JUMP = -7;
const PIPE_WIDTH = 52;
const PIPE_GAP = 160;
const PIPE_SPEED = 2.8;
const BIRD_X = 90;
const BIRD_SIZE = 22;

type Pipe = { x: number; topH: number };

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    birdY: 250,
    birdVY: 0,
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
    status: "idle" as "idle" | "playing" | "dead",
  });
  const animRef = useRef<number>(0);
  const [display, setDisplay] = useState({ score: 0, status: "idle" as "idle" | "playing" | "dead" });

  const getCanvas = () => canvasRef.current;
  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const resetState = useCallback(() => {
    const h = getCanvas()?.height ?? 500;
    stateRef.current = {
      birdY: h / 2,
      birdVY: 0,
      pipes: [],
      score: 0,
      frame: 0,
      status: "idle",
    };
    setDisplay({ score: 0, status: "idle" });
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "dead") return;
    if (s.status === "idle") s.status = "playing";
    s.birdVY = JUMP;
    setDisplay(d => ({ ...d, status: "playing" }));
  }, []);

  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };

  const draw = useCallback(() => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 24); ctx.lineTo(W, H - 24); ctx.stroke();

    s.pipes.forEach(pipe => {
      const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      grad.addColorStop(0, "rgba(200,200,200,0.15)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.2)");
      grad.addColorStop(1, "rgba(180,180,180,0.1)");
      ctx.fillStyle = grad;
      drawRoundRect(ctx, pipe.x, 0, PIPE_WIDTH, pipe.topH, 6); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      const bY = pipe.topH + PIPE_GAP, bH = H - 24 - bY;
      ctx.fillStyle = grad;
      drawRoundRect(ctx, pipe.x, bY, PIPE_WIDTH, bH, 6); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.stroke();
    });

    const bx = BIRD_X, by = s.birdY;
    const angle = Math.min(Math.max(s.birdVY * 3, -40), 70);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE * 0.7, BIRD_SIZE * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(8, -4, 4, 0, Math.PI * 2); ctx.fillStyle = "#050505"; ctx.fill();
    ctx.beginPath(); ctx.arc(9, -5, 1.5, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-4, 3, 9, 5, -0.3, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fill();
    ctx.restore();

    if (s.status !== "idle") {
      ctx.font = "bold 28px monospace"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.textAlign = "center";
      ctx.fillText(String(s.score), W / 2, 48);
    }
    if (s.status === "idle") {
      ctx.font = "14px monospace"; ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.textAlign = "center";
      ctx.fillText("tekan SPASI atau klik untuk mulai", W / 2, H / 2 + 60);
    }
  }, []);

  const tick = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;
    const H = canvas.height, W = canvas.width;
    const s = stateRef.current;
    if (s.status === "playing") {
      s.birdVY += GRAVITY; s.birdY += s.birdVY; s.frame++;
      if (s.frame % 90 === 0) {
        const topH = 60 + Math.floor(Math.random() * (H - 24 - PIPE_GAP - 120));
        s.pipes.push({ x: W, topH });
      }
      s.pipes = s.pipes.map(p => ({ ...p, x: p.x - PIPE_SPEED })).filter(p => p.x > -PIPE_WIDTH - 10);
      s.pipes.forEach(p => { if (Math.round(p.x + PIPE_SPEED) === BIRD_X) { s.score++; setDisplay(d => ({ ...d, score: s.score })); } });
      const bTop = s.birdY - BIRD_SIZE * 0.55, bBot = s.birdY + BIRD_SIZE * 0.55;
      const bLeft = BIRD_X - BIRD_SIZE * 0.7, bRight = BIRD_X + BIRD_SIZE * 0.7;
      let hit = bBot > H - 24 || bTop < 0;
      s.pipes.forEach(p => { if (bRight > p.x + 4 && bLeft < p.x + PIPE_WIDTH - 4) { if (bTop < p.topH || bBot > p.topH + PIPE_GAP) hit = true; } });
      if (hit) { s.status = "dead"; setDisplay({ score: s.score, status: "dead" }); }
    }
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    resetState();
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick, resetState]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); jump(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>FLAPPY.EXE</span>
      </div>
      <div className="mb-4">
        <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 14 }}>
          SCORE: <span style={{ color: "white", fontSize: 20, fontWeight: 700 }}>{display.score}</span>
        </div>
      </div>
      <div className="relative" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden" }} onClick={jump}>
        <canvas ref={canvasRef} width={420} height={520} style={{ display: "block", cursor: "pointer" }} />
        {display.status === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <p style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>GAME OVER</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 14 }}>Skor kamu: {display.score}</p>
            <button onClick={(e) => { e.stopPropagation(); resetState(); }} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "monospace", background: "transparent" }}>
              <RotateCcw size={14} /> main lagi
            </button>
          </div>
        )}
      </div>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace", marginTop: 16 }}>SPASI / KLIK untuk terbang</p>
    </main>
  );
}

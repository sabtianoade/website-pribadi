"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ScoreSubmit from "@/components/ScoreSubmit";

const W = 480, H = 320;
const PAD_H = 70, PAD_W = 10, PAD_SPEED = 5;
const BALL_SIZE = 8, BALL_SPEED_INIT = 4;
const AI_SPEED = 3.2;

export default function PongPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ball: { x: W / 2, y: H / 2, vx: BALL_SPEED_INIT, vy: BALL_SPEED_INIT * 0.6 },
    playerY: H / 2 - PAD_H / 2,
    aiY: H / 2 - PAD_H / 2,
    scorePlayer: 0,
    scoreAi: 0,
    status: "idle" as "idle" | "playing" | "dead",
    keys: { up: false, down: false },
    speed: BALL_SPEED_INIT,
  });
  const animRef = useRef<number>(0);
  const [display, setDisplay] = useState({ scorePlayer: 0, scoreAi: 0, status: "idle" as "idle" | "playing" | "dead" });

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);
    // Center dashed line
    ctx.setLineDash([6, 8]); ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.setLineDash([]);
    // Paddles
    const drawPad = (x: number, y: number) => {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.roundRect(x, y, PAD_W, PAD_H, 4);
      ctx.fill();
    };
    drawPad(12, s.playerY);
    drawPad(W - 12 - PAD_W, s.aiY);
    // Ball
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.fill();
    // Score
    ctx.font = "bold 32px monospace"; ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillText(String(s.scorePlayer), W / 4, 44);
    ctx.fillText(String(s.scoreAi), (W * 3) / 4, 44);
    if (s.status === "idle") {
      ctx.font = "13px monospace"; ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.textAlign = "center";
      ctx.fillText("tekan W/S atau ↑/↓ untuk mulai", W / 2, H / 2 + 40);
    }
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "playing") {
      // Player movement
      if (s.keys.up && s.playerY > 0) s.playerY -= PAD_SPEED;
      if (s.keys.down && s.playerY + PAD_H < H) s.playerY += PAD_SPEED;
      // AI follows ball
      const aiCenter = s.aiY + PAD_H / 2;
      if (aiCenter < s.ball.y - 5 && s.aiY + PAD_H < H) s.aiY += AI_SPEED;
      if (aiCenter > s.ball.y + 5 && s.aiY > 0) s.aiY -= AI_SPEED;
      // Ball movement
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;
      // Top/bottom bounce
      if (s.ball.y - BALL_SIZE <= 0) { s.ball.y = BALL_SIZE; s.ball.vy *= -1; }
      if (s.ball.y + BALL_SIZE >= H) { s.ball.y = H - BALL_SIZE; s.ball.vy *= -1; }
      // Player paddle collision
      if (s.ball.x - BALL_SIZE <= 12 + PAD_W && s.ball.x - BALL_SIZE >= 10 && s.ball.y >= s.playerY && s.ball.y <= s.playerY + PAD_H) {
        s.ball.x = 12 + PAD_W + BALL_SIZE;
        s.speed = Math.min(s.speed + 0.3, 10);
        const hit = (s.ball.y - (s.playerY + PAD_H / 2)) / (PAD_H / 2);
        s.ball.vy = hit * 4;
        s.ball.vx = s.speed;
      }
      // AI paddle collision
      if (s.ball.x + BALL_SIZE >= W - 12 - PAD_W && s.ball.x + BALL_SIZE <= W - 10 && s.ball.y >= s.aiY && s.ball.y <= s.aiY + PAD_H) {
        s.ball.x = W - 12 - PAD_W - BALL_SIZE;
        s.speed = Math.min(s.speed + 0.2, 10);
        const hit = (s.ball.y - (s.aiY + PAD_H / 2)) / (PAD_H / 2);
        s.ball.vy = hit * 4;
        s.ball.vx = -s.speed;
      }
      // Score
      if (s.ball.x < 0) {
        s.scoreAi++;
        setDisplay(d => ({ ...d, scoreAi: s.scoreAi }));
        s.ball = { x: W / 2, y: H / 2, vx: BALL_SPEED_INIT, vy: (Math.random() - 0.5) * 4 };
        s.speed = BALL_SPEED_INIT;
        if (s.scoreAi >= 5) { s.status = "dead"; setDisplay({ scorePlayer: s.scorePlayer, scoreAi: s.scoreAi, status: "dead" }); }
      }
      if (s.ball.x > W) {
        s.scorePlayer++;
        setDisplay(d => ({ ...d, scorePlayer: s.scorePlayer }));
        s.ball = { x: W / 2, y: H / 2, vx: -BALL_SPEED_INIT, vy: (Math.random() - 0.5) * 4 };
        s.speed = BALL_SPEED_INIT;
        if (s.scorePlayer >= 5) { s.status = "dead"; setDisplay({ scorePlayer: s.scorePlayer, scoreAi: s.scoreAi, status: "dead" }); }
      }
    }
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (["ArrowUp","ArrowDown","w","s","W","S"].includes(e.key)) e.preventDefault();
      if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") s.keys.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") s.keys.down = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") s.keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") s.keys.down = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  const restart = () => {
    stateRef.current = {
      ball: { x: W / 2, y: H / 2, vx: BALL_SPEED_INIT, vy: BALL_SPEED_INIT * 0.6 },
      playerY: H / 2 - PAD_H / 2, aiY: H / 2 - PAD_H / 2,
      scorePlayer: 0, scoreAi: 0, status: "idle", keys: { up: false, down: false }, speed: BALL_SPEED_INIT,
    };
    setDisplay({ scorePlayer: 0, scoreAi: 0, status: "idle" });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="mb-6 flex items-center justify-between w-full mx-auto" style={{ maxWidth: W }}>
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>PONG.EXE</span>
      </div>
      <div className="mb-3 flex gap-8 w-full mx-auto" style={{ maxWidth: W, fontFamily: "monospace" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>KAMU: <span style={{ color: "white", fontWeight: 700 }}>{display.scorePlayer}</span></span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>vs</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>AI: <span style={{ color: "white", fontWeight: 700 }}>{display.scoreAi}</span></span>
      </div>
      <div className="relative w-full mx-auto" style={{ maxWidth: W, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", touchAction: "none" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", width: "100%", height: "auto" }} />
        {display.status === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-auto" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
            <p style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>
              {display.scorePlayer >= 5 ? "MENANG! 🏆" : "KALAH 😅"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 14 }}>{display.scorePlayer} – {display.scoreAi}</p>
            
            {display.scorePlayer > 0 && (
              <ScoreSubmit game="pong" score={display.scorePlayer * 100 - display.scoreAi * 50} onSubmitted={() => {}} />
            )}

            <button onClick={restart} className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full text-sm hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "monospace", background: "transparent" }}>
              <RotateCcw size={14} /> main lagi
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 flex gap-4 w-full max-w-[200px] mx-auto md:hidden">
        <button
          onPointerDown={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            s.keys.up = true;
          }}
          onPointerUp={() => stateRef.current.keys.up = false}
          onPointerLeave={() => stateRef.current.keys.up = false}
          className="bg-white/10 active:bg-white/20 p-6 rounded-lg flex-1 flex items-center justify-center text-white select-none"
        >
          ↑
        </button>
        <button
          onPointerDown={() => {
            const s = stateRef.current;
            if (s.status === "idle") { s.status = "playing"; setDisplay(d => ({ ...d, status: "playing" })); }
            s.keys.down = true;
          }}
          onPointerUp={() => stateRef.current.keys.down = false}
          onPointerLeave={() => stateRef.current.keys.down = false}
          className="bg-white/10 active:bg-white/20 p-6 rounded-lg flex-1 flex items-center justify-center text-white select-none"
        >
          ↓
        </button>
      </div>

      <p className="hidden md:block" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace", marginTop: 16 }}>W/↑ naik · S/↓ turun · Menang pertama ke 5 poin</p>
    </main>
  );
}

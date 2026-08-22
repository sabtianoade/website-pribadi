"use client";

import { useState, useCallback } from "react";

const FRUITS = [
  { emoji: "🍎", color: "#ef4444" },
  { emoji: "🍊", color: "#f97316" },
  { emoji: "🍋", color: "#eab308" },
  { emoji: "🍇", color: "#a855f7" },
  { emoji: "🍓", color: "#ec4899" },
  { emoji: "🍑", color: "#fb923c" },
  { emoji: "🍉", color: "#22c55e" },
  { emoji: "🫐", color: "#6366f1" },
  { emoji: "🍌", color: "#facc15" },
  { emoji: "🍒", color: "#dc2626" },
];

interface FruitProjectile {
  id: number;
  fruit: typeof FRUITS[number];
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  duration: number; // ms to travel
}

interface SplatParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
  emoji: string;
}

let counter = 0;

export default function ConfettiButton() {
  const [projectiles, setProjectiles] = useState<FruitProjectile[]>([]);
  const [splats, setSplats] = useState<SplatParticle[]>([]);

  // When a fruit "arrives" at target, create splat
  const createSplat = useCallback((p: FruitProjectile) => {
    const splatParticles: SplatParticle[] = Array.from({ length: 14 }, (_, i) => {
      counter++;
      return {
        id: counter,
        x: p.targetX,
        y: p.targetY,
        color: p.fruit.color,
        angle: (360 / 14) * i + Math.random() * 20,
        distance: 40 + Math.random() * 80,
        size: 6 + Math.random() * 14,
        emoji: p.fruit.emoji,
      };
    });

    setSplats((prev) => [...prev, ...splatParticles]);

    // Remove splat particles after animation
    setTimeout(() => {
      const ids = new Set(splatParticles.map((s) => s.id));
      setSplats((prev) => prev.filter((s) => !ids.has(s.id)));
    }, 1200);
  }, []);

  const throwFruits = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Shoot 6 fruits from random screen edges toward random visible areas
    const newProjectiles: FruitProjectile[] = Array.from({ length: 6 }, () => {
      counter++;
      const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

      // Random edge: 0=top, 1=right, 2=bottom, 3=left
      const edge = Math.floor(Math.random() * 4);
      let startX = 0, startY = 0;
      if (edge === 0) { startX = Math.random() * W; startY = -60; }
      else if (edge === 1) { startX = W + 60; startY = Math.random() * H; }
      else if (edge === 2) { startX = Math.random() * W; startY = H + 60; }
      else { startX = -60; startY = Math.random() * H; }

      // Target: somewhere visible on screen
      const targetX = W * 0.1 + Math.random() * W * 0.8;
      const targetY = H * 0.1 + Math.random() * H * 0.8;

      return {
        id: counter,
        fruit,
        startX,
        startY,
        targetX,
        targetY,
        size: 32 + Math.random() * 24,
        duration: 600 + Math.random() * 500,
      };
    });

    setProjectiles((prev) => [...prev, ...newProjectiles]);

    // Schedule splat for each projectile when it arrives
    newProjectiles.forEach((p) => {
      setTimeout(() => {
        createSplat(p);
        setProjectiles((prev) => prev.filter((proj) => proj.id !== p.id));
      }, p.duration);
    });
  }, [createSplat]);

  return (
    <>
      {/* Flying fruit projectiles */}
      {projectiles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none z-[9998]"
          style={{
            left: p.startX,
            top: p.startY,
            fontSize: p.size,
            lineHeight: 1,
            animation: `fruitFly ${p.duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            ["--tx" as string]: `${p.targetX - p.startX}px`,
            ["--ty" as string]: `${p.targetY - p.startY}px`,
            filter: "drop-shadow(0 0 8px " + p.fruit.color + "99)",
          }}
        >
          {p.fruit.emoji}
        </div>
      ))}

      {/* Splat juice particles */}
      {splats.map((s) => (
        <div
          key={s.id}
          className="fixed pointer-events-none select-none z-[9997]"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.color,
            animation: `splatFly 1s ease-out forwards`,
            ["--sx" as string]: `${Math.cos((s.angle * Math.PI) / 180) * s.distance}px`,
            ["--sy" as string]: `${Math.sin((s.angle * Math.PI) / 180) * s.distance}px`,
            boxShadow: `0 0 8px ${s.color}`,
          }}
        />
      ))}

      <style>{`
        @keyframes fruitFly {
          0%   { transform: translate(0, 0) rotate(0deg) scale(1.2); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(720deg) scale(0.8); opacity: 0.9; }
        }
        @keyframes splatFly {
          0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
          60%  { opacity: 0.9; }
          100% { transform: translate(var(--sx), var(--sy)) scale(0.2); opacity: 0; }
        }
      `}</style>

      {/* Button - colorful gradient */}
      <button
        id="fruit-throw-btn"
        onClick={throwFruits}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-transform"
        style={{
          background: "transparent",
          border: "2px solid white",
          boxShadow: "none",
        }}
        aria-label="Lempar buah ke layar!"
        title="Lempar buah ke layar! 🍎"
      >
        <span style={{ filter: "grayscale(1) brightness(10)" }}>🍎</span>
      </button>

      <style>{`
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 25px rgba(168,85,247,0.6), 0 0 40px rgba(249,115,22,0.3); }
          50%       { box-shadow: 0 4px 40px rgba(168,85,247,0.9), 0 0 60px rgba(249,115,22,0.6); }
        }
      `}</style>
    </>
  );
}

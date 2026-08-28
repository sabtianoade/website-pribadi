"use client";

import { useEffect, useRef, useState } from "react";
import ScoreSubmit from "@/components/ScoreSubmit";

// Types
type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
  color?: string;
  markedForDeletion?: boolean;
};

type Particle = GameObject & {
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Game state stored in refs to avoid re-renders
  const stateRef = useRef({
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 80, width: 40, height: 40, targetX: CANVAS_WIDTH / 2, targetY: CANVAS_HEIGHT - 80 },
    bullets: [] as GameObject[],
    enemies: [] as GameObject[],
    particles: [] as Particle[],
    stars: [] as GameObject[],
    lastShotTime: 0,
    lastEnemyTime: 0,
    lastStarTime: 0,
    score: 0,
  });

  const frameRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("spaceScore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setHasSubmitted(false);
    setScore(0);
    
    stateRef.current = {
      player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 80, width: 40, height: 40, targetX: CANVAS_WIDTH / 2, targetY: CANVAS_HEIGHT - 80 },
      bullets: [],
      enemies: [],
      particles: [],
      stars: [], // The "stuck/items" to collect
      lastShotTime: 0,
      lastEnemyTime: 0,
      lastStarTime: 0,
      score: 0,
    };

    frameRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    cancelAnimationFrame(frameRef.current);
    
    if (stateRef.current.score > highScore) {
      setHighScore(stateRef.current.score);
      localStorage.setItem("spaceScore", stateRef.current.score.toString());
    }
  };

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      stateRef.current.particles.push({
        x, y, width: 4, height: 4,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 0, maxLife: Math.random() * 20 + 10,
        color
      });
    }
  };

  const checkCollision = (rect1: GameObject, rect2: GameObject) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const gameLoop = (timestamp: number) => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Canvas
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // --- PLAYER MOVEMENT ---
    // Smooth follow cursor
    state.player.x += (state.player.targetX - state.player.x - state.player.width / 2) * 0.15;
    state.player.y += (state.player.targetY - state.player.y - state.player.height / 2) * 0.15;

    // Boundaries
    state.player.x = Math.max(0, Math.min(CANVAS_WIDTH - state.player.width, state.player.x));
    state.player.y = Math.max(0, Math.min(CANVAS_HEIGHT - state.player.height, state.player.y));

    // --- AUTO SHOOT ---
    if (timestamp - state.lastShotTime > 200) { // Shoot every 200ms
      state.bullets.push({
        x: state.player.x + state.player.width / 2 - 2,
        y: state.player.y,
        width: 4, height: 15, speed: 12
      });
      state.lastShotTime = timestamp;
    }

    // --- SPAWN ENEMIES ---
    const enemySpawnRate = Math.max(400, 1500 - state.score * 5); // Gets faster
    if (timestamp - state.lastEnemyTime > enemySpawnRate) {
      state.enemies.push({
        x: Math.random() * (CANVAS_WIDTH - 40),
        y: -40,
        width: 40, height: 40, speed: Math.random() * 2 + 2 + (state.score * 0.01)
      });
      state.lastEnemyTime = timestamp;
    }

    // --- SPAWN STARS (ITEMS) ---
    if (timestamp - state.lastStarTime > 2500) {
      state.stars.push({
        x: Math.random() * (CANVAS_WIDTH - 20),
        y: -20,
        width: 20, height: 20, speed: 3
      });
      state.lastStarTime = timestamp;
    }

    // --- UPDATE & DRAW BULLETS ---
    ctx.fillStyle = "#00f2fe"; // Bullet color
    state.bullets.forEach(b => {
      b.y -= b.speed!;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      if (b.y < -20) b.markedForDeletion = true;
    });

    // --- UPDATE & DRAW ENEMIES ---
    state.enemies.forEach(e => {
      e.y += e.speed!;
      // Draw enemy (red triangle ship)
      ctx.fillStyle = "#ff4757";
      ctx.beginPath();
      ctx.moveTo(e.x + e.width / 2, e.y + e.height);
      ctx.lineTo(e.x, e.y);
      ctx.lineTo(e.x + e.width, e.y);
      ctx.fill();

      if (e.y > CANVAS_HEIGHT) e.markedForDeletion = true;

      // Check collision with player
      if (checkCollision(e, state.player)) {
        spawnParticles(state.player.x + 20, state.player.y + 20, "#fff", 30);
        endGame();
      }

      // Check collision with bullets
      state.bullets.forEach(b => {
        if (!b.markedForDeletion && !e.markedForDeletion && checkCollision(b, e)) {
          b.markedForDeletion = true;
          e.markedForDeletion = true;
          spawnParticles(e.x + 20, e.y + 20, "#ff4757", 10);
          state.score += 10;
        }
      });
    });

    // --- UPDATE & DRAW STARS (ITEMS) ---
    state.stars.forEach(s => {
      s.y += s.speed!;
      // Draw star/item (yellow diamond)
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath();
      ctx.moveTo(s.x + s.width / 2, s.y);
      ctx.lineTo(s.x + s.width, s.y + s.height / 2);
      ctx.lineTo(s.x + s.width / 2, s.y + s.height);
      ctx.lineTo(s.x, s.y + s.height / 2);
      ctx.fill();

      if (s.y > CANVAS_HEIGHT) s.markedForDeletion = true;

      // Collect item
      if (!s.markedForDeletion && checkCollision(s, state.player)) {
        s.markedForDeletion = true;
        spawnParticles(s.x + 10, s.y + 10, "#ffeb3b", 15);
        state.score += 50;
      }
    });

    // --- UPDATE & DRAW PARTICLES ---
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) p.markedForDeletion = true;
      
      ctx.globalAlpha = 1 - (p.life / p.maxLife);
      ctx.fillStyle = p.color!;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.globalAlpha = 1.0;
    });

    // Clean up arrays
    state.bullets = state.bullets.filter(b => !b.markedForDeletion);
    state.enemies = state.enemies.filter(e => !e.markedForDeletion);
    state.stars = state.stars.filter(s => !s.markedForDeletion);
    state.particles = state.particles.filter(p => !p.markedForDeletion);

    // --- DRAW PLAYER ---
    // Player Ship (Blue Triangle)
    ctx.fillStyle = "#4facfe";
    ctx.beginPath();
    ctx.moveTo(state.player.x + state.player.width / 2, state.player.y);
    ctx.lineTo(state.player.x + state.player.width, state.player.y + state.player.height);
    ctx.lineTo(state.player.x, state.player.y + state.player.height);
    ctx.fill();

    // Draw engine flame
    ctx.fillStyle = "#ff7f50";
    ctx.fillRect(state.player.x + 15, state.player.y + state.player.height, 10, Math.random() * 10 + 5);

    // Update React score occasionally (not every frame)
    if (frameRef.current % 10 === 0) setScore(state.score);

    frameRef.current = requestAnimationFrame(gameLoop);
  };

  // Input Handling
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    // Scale coordinates based on canvas rendering size vs actual CSS size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    stateRef.current.player.targetX = (e.clientX - rect.left) * scaleX;
    stateRef.current.player.targetY = (e.clientY - rect.top) * scaleY;
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] max-h-[70vh] bg-[#050510] border-4 border-[#333] rounded-3xl overflow-hidden shadow-2xl touch-none">
        
        {/* Score Overlay */}
        <div className="absolute top-4 left-6 right-6 flex justify-between z-20 text-white font-mono text-xl font-bold pointer-events-none">
          <div>SCORE: {score.toString().padStart(5, '0')}</div>
          <div className="text-white/50">HI: {highScore.toString().padStart(5, '0')}</div>
        </div>

        {/* The Game Canvas */}
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove} // update target on touch start too
        />

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest text-center px-4">
              Space Shooter
            </h2>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
            >
              Mulai Game
            </button>
            <p className="text-white/70 mt-6 text-sm">Sentuh/Geser kursor untuk mengendalikan pesawat.</p>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 backdrop-blur-md z-30 pointer-events-auto cursor-default">
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-lg">Hancur!</h2>
            
            {!hasSubmitted ? (
              <ScoreSubmit 
                game="space" 
                score={score} 
                onSubmitted={() => setHasSubmitted(true)} 
              />
            ) : (
              <button 
                onClick={startGame}
                className="mt-4 px-6 py-3 bg-white text-black font-bold uppercase rounded-lg hover:scale-105 transition-transform"
              >
                Coba Lagi
              </button>
            )}
            {!hasSubmitted && (
              <button 
                onClick={startGame}
                className="mt-4 text-xs text-white/50 hover:text-white underline"
              >
                Lewati & Coba Lagi
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-[var(--muted)] font-medium uppercase tracking-widest text-center">
        Pesawat <span className="text-cyan-400 font-bold">menembak otomatis</span>. Hindari musuh dan kumpulkan item kuning!
      </div>
    </div>
  );
}

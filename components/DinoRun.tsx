"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

// The Pixel Art Dino (from our loading screen / decoration)
const DinoSvg = ({ isDead }: { isDead?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full ${isDead ? 'text-red-500' : 'text-primary'}`}>
    <path d="M14 2h6v2h2v6h-2v2h-2v2h-2v-2h-2v-2h-2V8h-2V6h2V4h2V2zm4 4h-2v2h2V6zm-8 6h2v2h2v4h-2v2h-2v2H8v-2h2v-4H8v-2H6v-4H4v-2h4v2h2v4h2v-2zm-6 0H2v2h2v-2zm0-2H2v2h2v-2zm2-2H4v2h2v-2zm0-2H6v2h2v-2zm8 10h-2v2h-2v2h4v-4z" />
    {isDead && (
      <path d="M16 4l2 2m0-2l-2 2" stroke="white" strokeWidth="1.5" />
    )}
  </svg>
);

// The Pixel Art Gorilla
const GorillaSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
    <rect x="8" y="2" width="8" height="6" />
    <rect x="4" y="8" width="16" height="10" />
    <rect x="2" y="8" width="4" height="12" />
    <rect x="18" y="8" width="4" height="12" />
    <rect x="6" y="18" width="4" height="4" />
    <rect x="14" y="18" width="4" height="4" />
    <rect x="10" y="4" width="2" height="2" fill="black" />
    <rect x="14" y="4" width="2" height="2" fill="black" />
  </svg>
);

const GRAVITY = 0.6;
const JUMP_POWER = -10;
const GAME_SPEED = 5;
const GROUND_Y = 200;

export default function DinoRun() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game State Refs (to avoid re-renders during 60fps loop)
  const isPlayingRef = useRef(false);
  const dinoRef = useRef({ y: GROUND_Y, velocityY: 0, isJumping: false });
  const obstacleRef = useRef({ x: 600, active: false });
  const scoreRef = useRef(0);
  const frameRef = useRef<number>(0);

  // DOM Refs for positioning
  const dinoDivRef = useRef<HTMLDivElement>(null);
  const obstacleDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dinoScore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const jump = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (!dinoRef.current.isJumping) {
      dinoRef.current.velocityY = JUMP_POWER;
      dinoRef.current.isJumping = true;
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    isPlayingRef.current = true;
    setScore(0);
    scoreRef.current = 0;
    
    // Reset state
    dinoRef.current = { y: GROUND_Y, velocityY: 0, isJumping: false };
    obstacleRef.current = { x: 800, active: true };
    
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    isPlayingRef.current = false;
    cancelAnimationFrame(frameRef.current);
    
    if (scoreRef.current > highScore) {
      setHighScore(Math.floor(scoreRef.current));
      localStorage.setItem("dinoScore", Math.floor(scoreRef.current).toString());
    }
  };

  const gameLoop = () => {
    if (!isPlayingRef.current) return;

    // 1. Update Dino Physics
    dinoRef.current.velocityY += GRAVITY;
    dinoRef.current.y += dinoRef.current.velocityY;

    if (dinoRef.current.y >= GROUND_Y) {
      dinoRef.current.y = GROUND_Y;
      dinoRef.current.isJumping = false;
      dinoRef.current.velocityY = 0;
    }

    // 2. Update Obstacle
    obstacleRef.current.x -= GAME_SPEED + (scoreRef.current * 0.005); // speeds up over time

    if (obstacleRef.current.x < -50) {
      obstacleRef.current.x = 800 + Math.random() * 400; // spawn new obstacle
    }

    // 3. Update Score
    scoreRef.current += 0.1;
    if (Math.floor(scoreRef.current) % 10 === 0) {
      setScore(Math.floor(scoreRef.current)); // update React state occasionally
    }

    // 4. Update DOM
    if (dinoDivRef.current) {
      dinoDivRef.current.style.transform = `translateY(${dinoRef.current.y}px)`;
    }
    if (obstacleDivRef.current) {
      obstacleDivRef.current.style.transform = `translateX(${obstacleRef.current.x}px)`;
    }

    // 5. Collision Detection
    // Dino is roughly 48x48, at x=50, y=dinoRef.current.y
    // Obstacle is roughly 48x48, at x=obstacleRef.current.x, y=GROUND_Y
    const dinoHitbox = { x: 50, y: dinoRef.current.y, width: 40, height: 40 };
    const obsHitbox = { x: obstacleRef.current.x, y: GROUND_Y, width: 40, height: 40 };

    if (
      dinoHitbox.x < obsHitbox.x + obsHitbox.width &&
      dinoHitbox.x + dinoHitbox.width > obsHitbox.x &&
      dinoHitbox.y < obsHitbox.y + obsHitbox.height &&
      dinoHitbox.height + dinoHitbox.y > obsHitbox.y
    ) {
      // Collision!
      endGame();
      return;
    }

    frameRef.current = requestAnimationFrame(gameLoop);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      
      {/* Game Screen */}
      <div 
        className="relative w-full h-[300px] bg-[#111] border-4 border-[#333] rounded-3xl overflow-hidden cursor-pointer shadow-2xl select-none"
        onPointerDown={jump}
      >
        {/* Score Board */}
        <div className="absolute top-4 right-6 flex gap-8 z-20 text-white/50 font-mono text-xl font-bold">
          <div>HI {highScore.toString().padStart(5, '0')}</div>
          <div className="text-white">{Math.floor(scoreRef.current).toString().padStart(5, '0')}</div>
        </div>

        {/* Sky / Clouds Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           {/* Simple static clouds could go here */}
        </div>

        {/* The Ground */}
        <div className="absolute bottom-0 w-full h-[50px] border-t-2 border-[#333] bg-[#0a0a0a]" />

        {/* The Dino */}
        <div 
          ref={dinoDivRef}
          className="absolute left-[50px] w-12 h-12 z-10"
          style={{ transform: `translateY(${GROUND_Y}px)` }}
        >
          <DinoSvg isDead={isGameOver} />
        </div>

        {/* The Obstacle (Gorilla) */}
        <div 
          ref={obstacleDivRef}
          className="absolute w-12 h-12 z-10"
          style={{ transform: `translateX(800px) translateY(${GROUND_Y}px)` }}
        >
          <div className="w-full h-full scale-x-[-1]">
             <GorillaSvg />
          </div>
        </div>

        {/* Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-8 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
            >
              Mulai Game
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm z-30">
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-lg">Game Over</h2>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="mt-4 px-6 py-2 bg-white text-black font-bold uppercase rounded-lg hover:scale-105 transition-transform"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-[var(--muted)] font-medium uppercase tracking-widest text-center">
        Tekan <kbd className="px-2 py-1 bg-[#222] rounded mx-1 text-white border border-[#444]">SPASI</kbd> atau <kbd className="px-2 py-1 bg-[#222] rounded mx-1 text-white border border-[#444]">TAP</kbd> layar untuk melompat
      </div>
    </div>
  );
}

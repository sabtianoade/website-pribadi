"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// --- SVGs ---
const DinoSvg = ({ isHurt }: { isHurt?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full transition-colors ${isHurt ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 'text-primary'}`}>
    <path d="M14 2h6v2h2v6h-2v2h-2v2h-2v-2h-2v-2h-2V8h-2V6h2V4h2V2zm4 4h-2v2h2V6zm-8 6h2v2h2v4h-2v2h-2v2H8v-2h2v-4H8v-2H6v-4H4v-2h4v2h2v4h2v-2zm-6 0H2v2h2v-2zm0-2H2v2h2v-2zm2-2H4v2h2v-2zm0-2H6v2h2v-2zm8 10h-2v2h-2v2h4v-4z" />
    {isHurt ? (
      <path d="M16 4l2 2m0-2l-2 2" stroke="white" strokeWidth="1.5" />
    ) : (
      <>
        <rect x="16" y="4" width="2" height="2" fill="white" />
        <rect x="18" y="4" width="2" height="2" fill="black" />
      </>
    )}
  </svg>
);

const GorillaSvg = ({ isHurt, isPunching }: { isHurt?: boolean, isPunching?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full transition-colors ${isHurt ? 'text-red-500' : 'text-white'}`}>
    <rect x="8" y="2" width="8" height="6" />
    <rect x="4" y="8" width="16" height="10" />
    <rect x="2" y="8" width="4" height="12" />
    <rect x="18" y="8" width="4" height="12" />
    <rect x="6" y="18" width="4" height="4" />
    <rect x="14" y="18" width="4" height="4" />
    {isHurt ? (
      <>
        <rect x="10" y="4" width="2" height="2" fill="white" />
        <rect x="14" y="4" width="2" height="2" fill="white" />
      </>
    ) : (
      <>
        <rect x="10" y="4" width="2" height="2" fill="black" />
        <rect x="14" y="4" width="2" height="2" fill="black" />
      </>
    )}
    {isPunching && (
      <rect x="22" y="10" width="8" height="4" fill="white" /> // Extended fist
    )}
  </svg>
);

// --- Cinematic Component ---
function CinematicCutscene({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Intro Text
      setScene(1);
      await new Promise(r => setTimeout(r, 3000));
      // Gorilla walks in
      setScene(2);
      await new Promise(r => setTimeout(r, 2000));
      // Dino drops in & roars
      setScene(3);
      await new Promise(r => setTimeout(r, 2500));
      // Clash zoom
      setScene(4);
      await new Promise(r => setTimeout(r, 1500));
      // FIGHT text
      setScene(5);
      await new Promise(r => setTimeout(r, 1500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.p key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white font-mono text-xl text-center px-4">
            "Setelah insiden pengejaran yang memalukan itu..."
          </motion.p>
        )}
        
        {scene >= 2 && scene <= 4 && (
          <motion.div key="s2" className="absolute inset-0 flex items-end pb-20 justify-center">
            {/* Background */}
            <div className="absolute bottom-0 w-full h-[30vh] bg-[#111] border-t-4 border-[#333]" />
            
            {/* Gorilla */}
            <motion.div 
              initial={{ x: -300 }} 
              animate={{ x: scene >= 4 ? -50 : -100 }} 
              transition={{ duration: scene === 4 ? 0.2 : 2, ease: "easeOut" }}
              className="absolute bottom-[30vh] w-32 h-32 z-10"
            >
              <GorillaSvg />
            </motion.div>

            {/* Dino */}
            {scene >= 3 && (
              <motion.div 
                initial={{ y: -500, x: 200 }} 
                animate={{ y: 0, x: scene >= 4 ? 50 : 100 }} 
                transition={{ duration: scene === 4 ? 0.2 : 0.8, type: "spring", bounce: 0.5 }}
                className="absolute bottom-[30vh] w-32 h-32 z-10"
                style={{ transform: "scaleX(-1)" }} // face left
              >
                {scene === 3 && (
                  <motion.div className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-black text-red-500 bg-black border-2 border-red-500 rounded-full px-4 py-1" style={{ transform: "scaleX(-1)" }}>
                    RAWWR!!
                  </motion.div>
                )}
                <DinoSvg />
              </motion.div>
            )}
            
            {/* Clash Effect */}
            {scene === 4 && (
              <motion.div 
                initial={{ scale: 0, opacity: 1 }} 
                animate={{ scale: 10, opacity: 0 }} 
                transition={{ duration: 0.5 }}
                className="absolute bottom-[30vh] w-10 h-10 bg-white rounded-full z-20"
              />
            )}
          </motion.div>
        )}

        {scene === 5 && (
          <motion.h1 
            key="s5" 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1.5, opacity: 1 }} 
            exit={{ opacity: 0, scale: 3 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-red-500 font-black text-7xl italic tracking-widest drop-shadow-[0_0_20px_red]"
          >
            FIGHT!
          </motion.h1>
        )}
      </AnimatePresence>
      
      {/* Skip button */}
      <button onClick={onComplete} className="absolute top-6 right-6 text-white/50 text-xs font-mono uppercase tracking-widest hover:text-white">
        Lewati &gt;&gt;
      </button>
    </div>
  );
}


// --- Main Game Component ---
export default function SecretFightGame({ isActive, onClose }: { isActive: boolean, onClose: () => void }) {
  const [phase, setPhase] = useState<"cinematic" | "fight" | "gameover">("cinematic");
  const phaseRef = useRef<"cinematic" | "fight" | "gameover">("cinematic");
  
  // Game State Refs
  const p1Ref = useRef({ x: 50, hp: 100, state: 'idle' as 'idle'|'punch'|'hurt', facing: 1 });
  const p2Ref = useRef({ x: 300, hp: 100, state: 'idle' as 'idle'|'bite'|'hurt', facing: -1 });
  const keysRef = useRef({ left: false, right: false, punch: false });
  const frameRef = useRef(0);
  
  // DOM Refs
  const p1DivRef = useRef<HTMLDivElement>(null);
  const p2DivRef = useRef<HTMLDivElement>(null);
  const p1HpRef = useRef<HTMLDivElement>(null);
  const p2HpRef = useRef<HTMLDivElement>(null);

  // Restart
  const handleStartFight = useCallback(() => {
    setPhase("fight");
    phaseRef.current = "fight";
    p1Ref.current = { x: window.innerWidth * 0.2, hp: 100, state: 'idle', facing: 1 };
    p2Ref.current = { x: window.innerWidth * 0.8 - 100, hp: 100, state: 'idle', facing: -1 };
    
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (phaseRef.current !== "fight") return;

    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const keys = keysRef.current;
    
    // --- P1 (Gorilla) LOGIC ---
    if (p1.state !== 'hurt' && p1.state !== 'punch') {
      if (keys.left) { p1.x -= 6; p1.facing = -1; }
      if (keys.right) { p1.x += 6; p1.facing = 1; }
    }
    // Boundaries
    p1.x = Math.max(0, Math.min(window.innerWidth - 80, p1.x));

    // --- P2 (Dino / AI) LOGIC ---
    if (p2.state !== 'hurt' && p2.state !== 'bite') {
      const dist = p1.x - p2.x;
      if (Math.abs(dist) > 90) {
        // Move towards P1
        p2.x += Math.sign(dist) * 4;
        p2.facing = Math.sign(dist);
      } else {
        // In range, random attack
        if (Math.random() < 0.05) {
          p2.state = 'bite';
          p2.facing = Math.sign(dist) || -1;
          setTimeout(() => { p2.state = 'idle'; }, 400);
          
          // Check hit
          if (p1.state !== 'hurt') {
            p1.state = 'hurt';
            p1.hp -= 15;
            p1.x -= p2.facing * 30; // knockback
            setTimeout(() => { p1.state = 'idle'; }, 300);
          }
        }
      }
    }
    p2.x = Math.max(0, Math.min(window.innerWidth - 80, p2.x));

    // Check Win/Loss
    if (p1.hp <= 0 || p2.hp <= 0) {
      setPhase("gameover");
      phaseRef.current = "gameover";
      return;
    }

    // Update DOM
    if (p1DivRef.current) {
      p1DivRef.current.style.transform = `translateX(${p1.x}px) scaleX(${p1.facing})`;
      p1DivRef.current.className = `absolute bottom-[10vh] w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-75 ${p1.state === 'hurt' ? 'opacity-50 blur-[2px]' : ''}`;
    }
    if (p2DivRef.current) {
      p2DivRef.current.style.transform = `translateX(${p2.x}px) scaleX(${p2.facing})`;
      p2DivRef.current.className = `absolute bottom-[10vh] w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-75 ${p2.state === 'hurt' ? 'opacity-50 blur-[2px]' : ''}`;
    }
    if (p1HpRef.current) p1HpRef.current.style.width = `${Math.max(0, p1.hp)}%`;
    if (p2HpRef.current) p2HpRef.current.style.width = `${Math.max(0, p2.hp)}%`;

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [phase]);

  // Handle Player Attack
  const punch = () => {
    if (phase !== "fight") return;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    
    if (p1.state !== 'idle') return;
    
    p1.state = 'punch';
    setTimeout(() => { p1.state = 'idle'; }, 300);

    // Hitbox check
    const dist = Math.abs(p1.x - p2.x);
    // Are they facing each other and close?
    if (dist < 120 && p2.state !== 'hurt') {
      // Check facing direction
      if ((p1.facing === 1 && p1.x < p2.x) || (p1.facing === -1 && p1.x > p2.x)) {
        // Hit!
        p2.state = 'hurt';
        p2.hp -= 10;
        p2.x += p1.facing * 40; // knockback
        setTimeout(() => { p2.state = 'idle'; }, 300);
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (phase !== "fight") return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'j' || e.key === 'J' || e.key === ' ') {
        e.preventDefault();
        punch();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [phase]);

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#111] overflow-hidden select-none touch-none">
      
      {phase === "cinematic" && (
        <CinematicCutscene onComplete={handleStartFight} />
      )}

      {phase !== "cinematic" && (
        <>
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a10] to-[#111]" />
          
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-[10vh] bg-black border-t-4 border-[#333]" />

          {/* HUD (Health Bars) */}
          <div className="absolute top-10 left-4 right-4 flex justify-between gap-4 sm:gap-10 z-50">
            {/* Player HP */}
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-white font-black italic tracking-widest text-sm sm:text-lg">GORILLA (YOU)</span>
              <div className="h-6 w-full bg-red-900 border-2 border-white rounded overflow-hidden flex justify-end">
                <div ref={p1HpRef} className="h-full bg-yellow-400 w-full transition-all duration-200" style={{ transformOrigin: "right" }} />
              </div>
            </div>
            
            {/* VS */}
            <div className="flex-shrink-0 text-white font-black text-2xl sm:text-4xl italic mt-6 px-4">
              VS
            </div>

            {/* AI HP */}
            <div className="flex-1 flex flex-col gap-1 items-end">
              <span className="text-white font-black italic tracking-widest text-sm sm:text-lg text-right">DINO (AI)</span>
              <div className="h-6 w-full bg-red-900 border-2 border-white rounded overflow-hidden">
                <div ref={p2HpRef} className="h-full bg-red-500 w-full transition-all duration-200" />
              </div>
            </div>
          </div>

          {/* Fighters */}
          <div ref={p1DivRef} className="absolute bottom-[10vh] w-24 h-24 sm:w-32 sm:h-32 z-20" style={{ transform: `translateX(${p1Ref.current.x}px)` }}>
            <GorillaSvg />
          </div>
          <div ref={p2DivRef} className="absolute bottom-[10vh] w-24 h-24 sm:w-32 sm:h-32 z-20" style={{ transform: `translateX(${p2Ref.current.x}px) scaleX(-1)` }}>
            <DinoSvg />
          </div>

          {/* Mobile On-Screen Controls */}
          <div className="absolute bottom-10 left-4 right-4 flex justify-between z-50 lg:hidden pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
              <button 
                onPointerDown={() => keysRef.current.left = true}
                onPointerUp={() => keysRef.current.left = false}
                onPointerLeave={() => keysRef.current.left = false}
                className="w-16 h-16 bg-white/20 active:bg-white/40 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-md"
              >
                ←
              </button>
              <button 
                onPointerDown={() => keysRef.current.right = true}
                onPointerUp={() => keysRef.current.right = false}
                onPointerLeave={() => keysRef.current.right = false}
                className="w-16 h-16 bg-white/20 active:bg-white/40 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-md"
              >
                →
              </button>
            </div>
            <div className="pointer-events-auto">
              <button 
                onPointerDown={(e) => { e.preventDefault(); punch(); }}
                className="w-20 h-20 bg-red-500/50 active:bg-red-500/80 rounded-full flex items-center justify-center text-white font-black uppercase tracking-widest backdrop-blur-md border-4 border-white/30"
              >
                Pukul
              </button>
            </div>
          </div>

          {/* Desktop Control Hints */}
          <div className="absolute bottom-4 w-full text-center text-white/30 font-mono text-sm hidden lg:block">
            Tekan A / D untuk bergerak, J atau SPASI untuk memukul.
          </div>

          {/* Game Over Screen */}
          {phase === "gameover" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center">
              <motion.h2 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl font-black italic tracking-widest drop-shadow-[0_0_20px_white] ${p1Ref.current.hp <= 0 ? 'text-red-500' : 'text-yellow-400'}`}
              >
                {p1Ref.current.hp <= 0 ? "DEFEATED" : "VICTORY!"}
              </motion.h2>
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={handleStartFight}
                  className="px-6 py-3 bg-white text-black font-bold uppercase rounded-lg hover:scale-105"
                >
                  Main Lagi
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold uppercase rounded-lg hover:bg-white/10"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
          
          {/* Close Button during fight */}
          <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white z-50 backdrop-blur-md border border-white/20">
            <X size={20} />
          </button>
        </>
      )}
    </div>
  );
}

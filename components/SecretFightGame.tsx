"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// --- SVGs ---
const DinoSvg = ({ isHurt }: { isHurt?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full transition-colors ${isHurt ? 'text-red-500 drop-shadow-[0_0_15px_red]' : 'text-primary'}`}>
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
    
    {/* Banana Sword */}
    <g style={{ transform: isPunching ? "rotate(45deg) translate(8px, -4px)" : "rotate(0deg)", transition: "transform 0.1s" }}>
      <rect x="20" y="4" width="2" height="14" fill="#FFD700" className="drop-shadow-[0_0_5px_yellow]" />
      <rect x="22" y="4" width="2" height="2" fill="#FFA500" />
    </g>
  </svg>
);

const ProjectileSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-yellow-400 drop-shadow-[0_0_10px_yellow]">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>
);

// --- Constants ---
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GROUND_Y = 0;
const MAX_MANA = 100;

// --- Cinematic Component ---
function CinematicCutscene({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Scene 1: Intro Text
      setScene(1); await new Promise(r => setTimeout(r, 2500));
      
      // Scene 2: Humiliation - Gorilla eating, Dino steals it
      setScene(2); await new Promise(r => setTimeout(r, 4500));
      
      // Scene 3: Training Montage
      setScene(3); await new Promise(r => setTimeout(r, 4000));
      
      // Scene 4: Revenge Text
      setScene(4); await new Promise(r => setTimeout(r, 2000));
      
      // Scene 5: Faceoff & Clash
      setScene(5); await new Promise(r => setTimeout(r, 3000));
      
      // Scene 6: FIGHT
      setScene(6); await new Promise(r => setTimeout(r, 1500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      <AnimatePresence mode="wait">
        
        {/* SCENE 1: Intro Text */}
        {scene === 1 && (
          <motion.p key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white font-mono text-xl text-center px-4">
            "Semuanya bermula dari sebuah pisang..."
          </motion.p>
        )}
        
        {/* SCENE 2: Humiliation */}
        {scene === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-[#111]">
            <div className="absolute bottom-[20vh] w-full h-1 bg-[#333]" />
            {/* Gorilla sitting happily */}
            <motion.div className="absolute bottom-[20vh] w-24 h-24 flex flex-col items-center">
              <span className="text-2xl absolute -top-10">🍌</span>
              <GorillaSvg />
            </motion.div>
            
            {/* Evil Dino running in */}
            <motion.div 
              initial={{ x: 500 }}
              animate={{ x: -500 }}
              transition={{ duration: 2, delay: 1, ease: "linear" }}
              className="absolute bottom-[20vh] w-24 h-24"
              style={{ transform: "scaleX(-1)" }}
            >
              <DinoSvg />
            </motion.div>

            {/* Banana stolen effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0], x: [0, 0, -200, -500, -500], y: [0, 0, -50, -50, -50] }}
              transition={{ duration: 4, times: [0, 0.25, 0.3, 0.75, 1] }}
              className="absolute bottom-[30vh] text-2xl z-20"
            >
              🍌
            </motion.div>

            {/* Gorilla Crying */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="absolute bottom-[30vh] left-1/2 -translate-x-1/2 -ml-16 text-3xl font-black bg-white rounded-full px-4 text-black"
            >
              T_T
            </motion.div>
          </motion.div>
        )}
        
        {/* SCENE 3: Training Montage */}
        {scene === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="absolute inset-0 flex flex-col items-center justify-center bg-red-900">
            <h2 className="text-white text-3xl font-black italic tracking-widest mb-10 drop-shadow-lg uppercase text-center">
              Berlatih siang dan malam...
            </h2>
            <div className="flex items-end gap-10">
              {/* Punching Bag */}
              <motion.div animate={{ rotate: [0, 15, -5, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-16 h-32 bg-red-700 rounded-xl border-4 border-black origin-top" />
              
              {/* Gorilla Punching */}
              <motion.div animate={{ x: [0, -20, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-32 h-32">
                <GorillaSvg isPunching={true} />
              </motion.div>
            </div>
            
            {/* Dramatic Action Lines */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-radial-gradient(circle at center, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)" }} />
          </motion.div>
        )}
        
        {/* SCENE 4: Revenge Text */}
        {scene === 4 && (
          <motion.p key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white font-mono text-xl text-center px-4">
            "Kini saatnya balas dendam."
          </motion.p>
        )}
        
        {/* SCENE 5: Faceoff & Clash */}
        {scene === 5 && (
          <motion.div key="s5" className="absolute inset-0 flex items-end pb-[20vh] justify-center bg-black">
            <div className="absolute bottom-[20vh] w-full h-1 bg-[#333]" />
            
            <motion.div initial={{ x: -400 }} animate={{ x: -100 }} transition={{ duration: 2, ease: "easeOut" }} className="absolute bottom-[20vh] w-32 h-32 z-10">
              <GorillaSvg />
            </motion.div>
            
            <motion.div initial={{ x: 400 }} animate={{ x: 100 }} transition={{ duration: 2, ease: "easeOut" }} className="absolute bottom-[20vh] w-32 h-32 z-10" style={{ transform: "scaleX(-1)" }}>
              <DinoSvg />
            </motion.div>

            {/* Clash zoom at the end */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} 
              animate={{ scale: [0, 0, 10], opacity: [0, 0, 1] }} 
              transition={{ duration: 3, times: [0, 0.8, 1] }}
              className="absolute bottom-[30vh] w-10 h-10 bg-white rounded-full z-20"
            />
          </motion.div>
        )}

        {/* SCENE 6: FIGHT Text */}
        {scene === 6 && (
          <motion.h1 key="s6" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ opacity: 0, scale: 3 }} transition={{ type: "spring", bounce: 0.6 }} className="text-red-500 font-black text-7xl italic tracking-widest drop-shadow-[0_0_20px_red]">
            FIGHT!
          </motion.h1>
        )}
      </AnimatePresence>
      <button onClick={onComplete} className="absolute top-6 right-6 text-white/50 text-xs font-mono uppercase tracking-widest hover:text-white z-50 px-4 py-2 bg-black/50 rounded-full border border-white/20">
        Lewati &gt;&gt;
      </button>
    </div>
  );
}


// --- Main Game Component ---
export default function SecretFightGame({ isActive, onClose }: { isActive: boolean, onClose: () => void }) {
  const [phase, setPhase] = useState<"cinematic" | "fight" | "finisher" | "gameover">("cinematic");
  const phaseRef = useRef<"cinematic" | "fight" | "finisher" | "gameover">("cinematic");
  const [winner, setWinner] = useState<"gorilla" | "dino" | null>(null);
  
  // Game State Refs
  const p1Ref = useRef({ x: 50, y: GROUND_Y, vy: 0, hp: 100, mana: 0, state: 'idle' as 'idle'|'punch'|'skill'|'hurt', facing: 1 });
  const p2Ref = useRef({ x: 300, y: GROUND_Y, vy: 0, hp: 100, state: 'idle' as 'idle'|'bite'|'hurt', facing: -1 });
  const projectileRef = useRef({ active: false, x: 0, y: 0, facing: 1 });
  
  const keysRef = useRef({ left: false, right: false, up: false, punch: false, skill: false });
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const slowdownRef = useRef(1); // 1 = normal speed, < 1 = slow mo
  
  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const p1DivRef = useRef<HTMLDivElement>(null);
  const p2DivRef = useRef<HTMLDivElement>(null);
  const projDivRef = useRef<HTMLDivElement>(null);
  const p1HpRef = useRef<HTMLDivElement>(null);
  const p1ManaRef = useRef<HTMLDivElement>(null);
  const p2HpRef = useRef<HTMLDivElement>(null);
  const screenFlashRef = useRef<HTMLDivElement>(null);

  // Restart
  const handleStartFight = useCallback(() => {
    setPhase("fight");
    phaseRef.current = "fight";
    setWinner(null);
    slowdownRef.current = 1;
    p1Ref.current = { x: window.innerWidth * 0.2, y: GROUND_Y, vy: 0, hp: 100, mana: 0, state: 'idle', facing: 1 };
    p2Ref.current = { x: window.innerWidth * 0.8 - 100, y: GROUND_Y, vy: 0, hp: 100, state: 'idle', facing: -1 };
    projectileRef.current = { active: false, x: 0, y: 0, facing: 1 };
    
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    timeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const triggerFinisher = (winnerKey: "gorilla" | "dino") => {
    setPhase("finisher");
    phaseRef.current = "finisher";
    setWinner(winnerKey);
    slowdownRef.current = 0.1; // extreme slow motion
    
    if (screenFlashRef.current) {
      screenFlashRef.current.style.opacity = "1";
      setTimeout(() => {
        if (screenFlashRef.current) screenFlashRef.current.style.opacity = "0";
      }, 500);
    }

    if (containerRef.current) {
      containerRef.current.style.transform = "scale(1.2)";
      containerRef.current.style.filter = "contrast(1.2) saturate(1.5)";
    }

    setTimeout(() => {
      setPhase("gameover");
      phaseRef.current = "gameover";
      if (containerRef.current) {
        containerRef.current.style.transform = "scale(1)";
        containerRef.current.style.filter = "none";
      }
    }, 3000); // 3 seconds of slow-mo fatality
  };

  const gameLoop = useCallback((timestamp: number) => {
    if (phaseRef.current === "gameover" || phaseRef.current === "cinematic") return;

    // Delta time calculation for slow-mo
    const dt = Math.min((timestamp - timeRef.current) / 16.66, 3) * slowdownRef.current;
    timeRef.current = timestamp;

    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const proj = projectileRef.current;
    const keys = keysRef.current;
    
    // --- P1 (Gorilla) LOGIC ---
    if (p1.state !== 'hurt' && p1.state !== 'punch' && p1.state !== 'skill') {
      if (keys.left) { p1.x -= 6 * dt; p1.facing = -1; }
      if (keys.right) { p1.x += 6 * dt; p1.facing = 1; }
      if (keys.up && p1.y === GROUND_Y) {
        p1.vy = JUMP_FORCE;
        keys.up = false; // consume jump
      }
    }
    
    // Physics
    p1.vy += GRAVITY * dt;
    p1.y += p1.vy * dt;
    if (p1.y > GROUND_Y) { p1.y = GROUND_Y; p1.vy = 0; }
    p1.x = Math.max(0, Math.min(window.innerWidth - 80, p1.x));

    // Passive Mana Regen
    if (phaseRef.current === "fight") p1.mana = Math.min(MAX_MANA, p1.mana + 0.1 * dt);

    // --- P2 (Dino / AI) LOGIC ---
    if (p2.state !== 'hurt' && p2.state !== 'bite') {
      const distX = p1.x - p2.x;
      const distY = p1.y - p2.y;
      
      // Move towards P1 X
      if (Math.abs(distX) > 90) {
        p2.x += Math.sign(distX) * 4 * dt;
        p2.facing = Math.sign(distX);
      } else if (phaseRef.current === "fight") {
        // In range attack
        if (Math.random() < 0.05 * dt) {
          p2.state = 'bite';
          p2.facing = Math.sign(distX) || -1;
          setTimeout(() => { p2.state = 'idle'; }, 400);
          
          // Check hit
          if (p1.state !== 'hurt' && Math.abs(p1.y - p2.y) < 60) {
            p1.state = 'hurt';
            p1.hp -= 15;
            p1.x -= p2.facing * 30; 
            p1.vy = -5; // knock up
            p1.mana = Math.min(MAX_MANA, p1.mana + 15); // get mana from taking dmg
            setTimeout(() => { p1.state = 'idle'; }, 300);
          }
        }
      }

      // Jump if player is high up
      if (distY < -100 && p2.y === GROUND_Y && Math.abs(distX) < 150) {
        if (Math.random() < 0.1 * dt) {
          p2.vy = JUMP_FORCE;
        }
      }
    }
    
    // Physics
    p2.vy += GRAVITY * dt;
    p2.y += p2.vy * dt;
    if (p2.y > GROUND_Y) { p2.y = GROUND_Y; p2.vy = 0; }
    p2.x = Math.max(0, Math.min(window.innerWidth - 80, p2.x));

    // --- Projectile Logic ---
    if (proj.active) {
      proj.x += proj.facing * 15 * dt;
      // Hit Dino
      if (proj.x > p2.x && proj.x < p2.x + 80 && Math.abs(proj.y - p2.y) < 60 && p2.state !== 'hurt') {
        proj.active = false;
        p2.state = 'hurt';
        p2.hp -= 30; // Huge damage
        p2.x += proj.facing * 60;
        p2.vy = -10;
        setTimeout(() => { p2.state = 'idle'; }, 500);
      }
      // Out of bounds
      if (proj.x < -100 || proj.x > window.innerWidth + 100) proj.active = false;
    }

    // Check Win/Loss (Only trigger once)
    if (phaseRef.current === "fight") {
      if (p1.hp <= 0) { p1.hp = 0; triggerFinisher("dino"); }
      else if (p2.hp <= 0) { p2.hp = 0; triggerFinisher("gorilla"); }
    }

    // --- Update DOM ---
    if (p1DivRef.current) {
      p1DivRef.current.style.transform = `translate(${p1.x}px, ${p1.y}px) scaleX(${p1.facing})`;
      if (p1.state === 'hurt') p1DivRef.current.style.filter = "brightness(2) contrast(1.5) blur(2px)";
      else p1DivRef.current.style.filter = "none";
    }
    if (p2DivRef.current) {
      p2DivRef.current.style.transform = `translate(${p2.x}px, ${p2.y}px) scaleX(${p2.facing})`;
      if (p2.state === 'hurt') p2DivRef.current.style.filter = "brightness(2) contrast(1.5) blur(2px)";
      else p2DivRef.current.style.filter = "none";
    }
    if (projDivRef.current) {
      projDivRef.current.style.transform = `translate(${proj.x}px, ${proj.y}px) scaleX(${proj.facing})`;
      projDivRef.current.style.display = proj.active ? "block" : "none";
    }

    if (p1HpRef.current) p1HpRef.current.style.width = `${Math.max(0, p1.hp)}%`;
    if (p1ManaRef.current) p1ManaRef.current.style.width = `${p1.mana}%`;
    if (p2HpRef.current) p2HpRef.current.style.width = `${Math.max(0, p2.hp)}%`;

    frameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Handle Player Attack
  const punch = () => {
    if (phaseRef.current !== "fight") return;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    
    if (p1.state !== 'idle') return;
    
    p1.state = 'punch';
    setTimeout(() => { p1.state = 'idle'; }, 300);

    // Hitbox check
    const distX = Math.abs(p1.x - p2.x);
    const distY = Math.abs(p1.y - p2.y);
    if (distX < 120 && distY < 60 && p2.state !== 'hurt') {
      if ((p1.facing === 1 && p1.x < p2.x) || (p1.facing === -1 && p1.x > p2.x)) {
        p2.state = 'hurt';
        p2.hp -= 10;
        p2.x += p1.facing * 40; 
        p2.vy = -3;
        p1.mana = Math.min(MAX_MANA, p1.mana + 10);
        setTimeout(() => { p2.state = 'idle'; }, 300);
      }
    }
  };

  const useSkill = () => {
    if (phaseRef.current !== "fight") return;
    const p1 = p1Ref.current;
    if (p1.state !== 'idle' || p1.mana < MAX_MANA) return;
    
    p1.state = 'skill';
    p1.mana = 0;
    
    // Screen shake/flash
    if (screenFlashRef.current) {
      screenFlashRef.current.style.background = "rgba(255, 255, 0, 0.3)";
      screenFlashRef.current.style.opacity = "1";
      setTimeout(() => {
        if (screenFlashRef.current) {
          screenFlashRef.current.style.opacity = "0";
          screenFlashRef.current.style.background = "white"; // reset to fatality color
        }
      }, 200);
    }

    setTimeout(() => { 
      p1.state = 'idle'; 
      // Fire projectile
      projectileRef.current = {
        active: true,
        x: p1.x + p1.facing * 50,
        y: p1.y + 30, // roughly chest height
        facing: p1.facing
      };
    }, 200); // delay before firing
  };

  const jump = () => {
    if (phaseRef.current !== "fight") return;
    keysRef.current.up = true;
  };

  // Keyboard controls
  useEffect(() => {
    if (phase !== "fight" && phase !== "finisher") return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'w' || e.key === 'W') jump();
      if (e.key === 'j' || e.key === 'J' || e.key === ' ') {
        e.preventDefault();
        punch();
      }
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        useSkill();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'w' || e.key === 'W') keysRef.current.up = false;
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
        <div ref={containerRef} className="absolute inset-0 transition-transform duration-1000 ease-out origin-center">
          
          {/* Flash Overlay for damage/skills/fatalities */}
          <div ref={screenFlashRef} className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-300 z-[90]" />

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a10] to-[#111]" />
          
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-[10vh] bg-black border-t-4 border-[#333] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" />

          {/* HUD (Health Bars) */}
          <div className="absolute top-10 left-4 right-4 flex justify-between gap-4 sm:gap-10 z-50">
            {/* Player HP & Mana */}
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-white font-black italic tracking-widest text-sm sm:text-lg drop-shadow">GORILLA (YOU)</span>
              <div className="h-6 w-full bg-red-900 border-2 border-white rounded overflow-hidden flex justify-end shadow-lg">
                <div ref={p1HpRef} className="h-full bg-yellow-400 w-full transition-all duration-200" style={{ transformOrigin: "right" }} />
              </div>
              <div className="h-2 w-full bg-black border border-white/50 rounded overflow-hidden flex justify-end mt-1">
                <div ref={p1ManaRef} className="h-full bg-blue-400 w-0 transition-all duration-200" style={{ transformOrigin: "right" }} />
              </div>
            </div>
            
            {/* VS */}
            <div className="flex-shrink-0 text-white font-black text-2xl sm:text-4xl italic mt-6 px-4 drop-shadow-lg">
              VS
            </div>

            {/* AI HP */}
            <div className="flex-1 flex flex-col gap-1 items-end">
              <span className="text-white font-black italic tracking-widest text-sm sm:text-lg text-right drop-shadow">DINO (AI)</span>
              <div className="h-6 w-full bg-red-900 border-2 border-white rounded overflow-hidden shadow-lg">
                <div ref={p2HpRef} className="h-full bg-red-500 w-full transition-all duration-200" />
              </div>
            </div>
          </div>

          {/* Dramatic Finisher Text */}
          <AnimatePresence>
            {phase === "finisher" && (
              <motion.div 
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              >
                <h1 className="text-[10vw] font-black italic tracking-widest text-red-600 drop-shadow-[0_0_30px_red]">
                  FATALITY
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Layer (origin is bottom of container minus ground height) */}
          <div className="absolute bottom-[10vh] left-0 w-full h-full pointer-events-none z-20">
            {/* Projectile */}
            <div ref={projDivRef} className="absolute bottom-0 w-12 h-12 hidden">
              <ProjectileSvg />
            </div>

            {/* Fighters */}
            <div ref={p1DivRef} className="absolute bottom-0 w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-75">
              <GorillaSvg isPunching={p1Ref.current.state === 'punch' || p1Ref.current.state === 'skill'} />
            </div>
            <div ref={p2DivRef} className="absolute bottom-0 w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-75">
              <DinoSvg />
            </div>
          </div>

          {/* Mobile On-Screen Controls */}
          <div className="absolute bottom-10 left-4 right-4 flex justify-between z-50 lg:hidden pointer-events-none">
            {/* D-Pad */}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 pointer-events-auto">
              <div />
              <button 
                onPointerDown={jump}
                className="w-14 h-14 bg-white/20 active:bg-white/40 rounded-t-xl flex items-center justify-center text-white text-xl backdrop-blur-md border border-white/10"
              >
                ↑
              </button>
              <div />
              <button 
                onPointerDown={() => keysRef.current.left = true}
                onPointerUp={() => keysRef.current.left = false}
                onPointerLeave={() => keysRef.current.left = false}
                className="w-14 h-14 bg-white/20 active:bg-white/40 rounded-l-xl flex items-center justify-center text-white text-xl backdrop-blur-md border border-white/10"
              >
                ←
              </button>
              <div />
              <button 
                onPointerDown={() => keysRef.current.right = true}
                onPointerUp={() => keysRef.current.right = false}
                onPointerLeave={() => keysRef.current.right = false}
                className="w-14 h-14 bg-white/20 active:bg-white/40 rounded-r-xl flex items-center justify-center text-white text-xl backdrop-blur-md border border-white/10"
              >
                →
              </button>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-4 justify-end pointer-events-auto">
              <button 
                onPointerDown={(e) => { e.preventDefault(); useSkill(); }}
                className="w-16 h-16 bg-blue-500/50 active:bg-blue-500/80 rounded-full flex items-center justify-center text-white font-black text-xs uppercase tracking-widest backdrop-blur-md border-2 border-blue-200 self-end"
              >
                Jurus
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); punch(); }}
                className="w-20 h-20 bg-red-500/50 active:bg-red-500/80 rounded-full flex items-center justify-center text-white font-black uppercase tracking-widest backdrop-blur-md border-4 border-white/30"
              >
                Pukul
              </button>
            </div>
          </div>

          {/* Desktop Control Hints */}
          <div className="absolute bottom-4 w-full text-center text-white/30 font-mono text-xs sm:text-sm hidden lg:block z-50">
            Tekan W/A/D untuk bergerak. J untuk memukul. K untuk JURUS.
          </div>
          
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white z-[100] backdrop-blur-md border border-white/20">
            <X size={20} />
          </button>
        </div>
      )}
      
      {/* Game Over Screen */}
      <AnimatePresence>
        {phase === "gameover" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
          >
            <motion.h2 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }}
              className={`text-5xl sm:text-7xl font-black italic tracking-widest drop-shadow-[0_0_20px_white] ${winner === 'gorilla' ? 'text-yellow-400' : 'text-red-500'}`}
            >
              {winner === 'gorilla' ? "VICTORY!" : "DEFEATED"}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="mt-10 flex gap-4"
            >
              <button 
                onClick={handleStartFight}
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-transform"
              >
                Main Lagi
              </button>
              <button 
                onClick={onClose}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

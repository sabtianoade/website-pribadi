"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ScoreSubmit from "@/components/ScoreSubmit";

const HOLE_COUNT = 9;
const GAME_DURATION = 30; // 30 seconds

// The Pixel Art Gorilla!
const GorillaSvg = ({ isWhacked }: { isWhacked: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-foreground drop-shadow-xl">
    <rect x="8" y="2" width="8" height="6" />
    <rect x="4" y="8" width="16" height="10" />
    <rect x="2" y="8" width="4" height="12" />
    <rect x="18" y="8" width="4" height="12" />
    <rect x="6" y="18" width="4" height="4" />
    <rect x="14" y="18" width="4" height="4" />
    
    {isWhacked ? (
      <>
        {/* X_X eyes when whacked */}
        <path d="M9 3l2 2m0-2l-2 2M13 3l2 2m0-2l-2 2" stroke="white" strokeWidth="1.5" />
        {/* Dizzy star */}
        <path d="M12 1L13 2.5L14.5 1.5L13.5 3L15 4L13 4.5L12 6L11 4.5L9 4L10.5 3L9.5 1.5L11 2.5Z" fill="#ffeb3b" className="animate-spin" style={{ transformOrigin: '12px 3px' }}/>
      </>
    ) : (
      <>
        {/* Normal black eyes */}
        <rect x="9" y="4" width="2" height="2" fill="white" />
        <rect x="13" y="4" width="2" height="2" fill="white" />
      </>
    )}
  </svg>
);

export default function WhackAGorilla() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [whackedHole, setWhackedHole] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize High Score
  useEffect(() => {
    const saved = localStorage.getItem("whackScore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setWhackedHole(null);
    setHasSubmitted(false);
    popRandomGorilla();

    // Main game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setIsPlaying(false);
    setActiveHole(null);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    
    // Save high score
    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem("whackScore", currentScore.toString());
      }
      return currentScore;
    });
  };

  const popRandomGorilla = () => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    
    // Pick random hole not equal to previous
    setActiveHole((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * HOLE_COUNT);
      } while (next === prev);
      return next;
    });
    setWhackedHole(null);

    // Randomize stay duration between 600ms and 1200ms
    const stayTime = Math.random() * 600 + 600;
    
    popTimerRef.current = setTimeout(() => {
      setActiveHole(null);
      // Wait a bit before popping next
      popTimerRef.current = setTimeout(popRandomGorilla, Math.random() * 300 + 200);
    }, stayTime);
  };

  const whackGorilla = (holeIndex: number) => {
    if (!isPlaying || activeHole !== holeIndex || whackedHole === holeIndex) return;

    setScore((s) => s + 1);
    setWhackedHole(holeIndex);
    
    // Play sound if possible? Just visual for now.
    
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    
    // Show whacked animation for a brief moment then pop next
    popTimerRef.current = setTimeout(() => {
      setActiveHole(null);
      popTimerRef.current = setTimeout(popRandomGorilla, 200);
    }, 300);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card)] shadow-2xl">
      
      {/* Header */}
      <div className="bg-[var(--primary)] text-white p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest">Pukul Gorila</h2>
          <p className="text-sm font-medium opacity-80">Jangan biarkan dia kabur!</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold opacity-80 uppercase tracking-widest">High Score</div>
          <div className="text-2xl font-black">{highScore}</div>
        </div>
      </div>

      {/* Game Stats & Board */}
      <div className="p-8 pb-12 flex flex-col items-center">
        
        {/* Stats */}
        <div className="w-full flex justify-between items-center mb-8 px-4">
          <div className="bg-[var(--background)] px-6 py-3 rounded-2xl border border-[var(--card-border)] shadow-inner text-center">
            <span className="text-xs uppercase font-bold text-[var(--muted)]">Waktu</span>
            <div className={`text-3xl font-black tabular-nums ${timeLeft <= 5 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-[var(--foreground)]'}`}>
              {timeLeft}s
            </div>
          </div>
          
          <div className="bg-[var(--background)] px-6 py-3 rounded-2xl border border-[var(--card-border)] shadow-inner text-center">
            <span className="text-xs uppercase font-bold text-[var(--muted)]">Skor</span>
            <div className="text-3xl font-black tabular-nums text-[var(--foreground)]">
              {score}
            </div>
          </div>
        </div>

        {/* The Board (3x3 Grid) */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[400px]">
          {Array.from({ length: HOLE_COUNT }).map((_, i) => (
            <div 
              key={i} 
              className="relative w-full aspect-square bg-[#1a1a1a] dark:bg-black rounded-[40%] overflow-hidden border-[6px] border-[#333] shadow-[inset_0_15px_30px_rgba(0,0,0,0.8)] cursor-crosshair group"
              onClick={() => whackGorilla(i)}
            >
              {/* Dirt overlay at bottom */}
              <div className="absolute bottom-0 w-full h-1/4 bg-[#3a2318] z-20 rounded-b-[40%] border-t-4 border-[#25150f]" />
              
              <AnimatePresence>
                {activeHole === i && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: whackedHole === i ? "30%" : "10%" }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex justify-center z-10 p-2 sm:p-4 origin-bottom"
                  >
                    <div className={`w-full h-full transition-transform ${whackedHole === i ? 'scale-90 opacity-80' : 'group-hover:scale-110'}`}>
                      <GorillaSvg isWhacked={whackedHole === i} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Overlay when not playing */}
        {!isPlaying && (
          <div className="mt-10 flex flex-col items-center">
            {timeLeft === 0 && score > 0 && !hasSubmitted && (
              <div className="mb-6 w-full">
                <ScoreSubmit game="whack" score={score} onSubmitted={() => setHasSubmitted(true)} />
              </div>
            )}
            
            {(timeLeft > 0 || score === 0 || hasSubmitted) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-black text-xl rounded-2xl shadow-xl uppercase tracking-widest border-2 border-white/20"
              >
                {timeLeft === 0 ? "Main Lagi" : "Mulai Game"}
              </motion.button>
            )}

            {timeLeft === 0 && score > 0 && !hasSubmitted && (
              <button 
                onClick={startGame}
                className="mt-4 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors underline"
              >
                Lewati & Main Lagi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

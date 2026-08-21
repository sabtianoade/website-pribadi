"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

export default function DinoDecoration() {
  const [mounted, setMounted] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = async () => {
    if (isJumping) {
      setJumpCount((c) => c + 1);
    } else {
      setJumpCount(1);
    }
  };

  useEffect(() => {
    if (jumpCount === 0) return;
    const jumpHeight = Math.min(30 + jumpCount * 30, 300);
    const jumpDuration = 0.35 + jumpCount * 0.05;
    setIsJumping(true);
    const scrollAmount = jumpHeight * 3;
    window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
    controls
      .start({ y: -jumpHeight, transition: { duration: jumpDuration * 0.45, ease: "easeOut" } })
      .then(() => controls.start({ y: 0, transition: { duration: jumpDuration * 0.55, ease: [0.215, 0.61, 0.355, 1] } }))
      .then(() => { setIsJumping(false); setJumpCount(0); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpCount]);

  if (!mounted) return null;

  // Animation timeline (30 seconds total loop, 9 keyframes)
  // 0 - 0.30 (0-9s): Walk to center
  // 0.35 (10.5s): Fight scene ends, Gorilla appears! Shock!
  // 0.45 (13.5s): 3-second chase right (Gorilla chases Dinos)
  // 0.46 (13.8s): IMMEDIATE REVENGE! (Giant Dino chases Gorilla left)
  // 0.66 (19.8s): Revenge chase ends off-screen left
  // 1.0 (30s): Reset
  const T = [0, 0.30, 0.35, 0.45, 0.46, 0.56, 0.66, 0.67, 1];

  const DinoSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{ color: "var(--foreground)" }}>
      <path d="M14 2h6v2h2v6h-2v2h-2v2h-2v-2h-2v-2h-2V8h-2V6h2V4h2V2zm4 4h-2v2h2V6zm-8 6h2v2h2v4h-2v2h-2v2H8v-2h2v-4H8v-2H6v-4H4v-2h4v2h2v4h2v-2zm-6 0H2v2h2v-2zm0-2H2v2h2v-2zm2-2H4v2h2v-2zm0-2H6v2h2v-2zm8 10h-2v2h-2v2h4v-4z" />
    </svg>
  );

  const GorillaSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{ color: "var(--foreground)" }}>
      <rect x="8" y="2" width="8" height="6" />
      <rect x="4" y="8" width="16" height="10" />
      <motion.rect animate={{ y: [0, -3, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="2" y="8" width="4" height="12" />
      <motion.rect animate={{ y: [-3, 0, -3] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="18" y="8" width="4" height="12" />
      <motion.rect animate={{ y: [0, -4, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="6" y="18" width="4" height="4" />
      <motion.rect animate={{ y: [-4, 0, -4] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="14" y="18" width="4" height="4" />
      <rect x="10" y="4" width="2" height="2" fill="var(--background)" />
      <rect x="14" y="4" width="2" height="2" fill="var(--background)" />
    </svg>
  );

  return (
    <div className="fixed bottom-4 z-50 opacity-80 select-none w-full" style={{ left: 0, pointerEvents: "none" }}>
      
      {/* GIANT DINO (The Parent) */}
      <motion.div
        animate={{ 
          x: ["150vw", "150vw", "150vw", "150vw", "130vw", "70vw", "-20vw", "150vw", "150vw"],
        }}
        transition={{ duration: 30, repeat: Infinity, times: T, ease: "linear" }}
        className="absolute bottom-0 w-64 h-64 pointer-events-none"
      >
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full relative">
          <motion.div
            animate={{ opacity: [0, 0, 0, 0, 1, 1, 1, 0, 0] }}
            transition={{ duration: 30, repeat: Infinity, times: T }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl font-black text-red-500 bg-background border-4 border-border rounded-full px-6 py-2 shadow-lg"
            style={{ transform: "scaleX(-1)" }}
          >
            RAWWR!!!
          </motion.div>
          <motion.div animate={{ rotateY: 180 }} className="w-full h-full">
            <DinoSvg />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* GORILLA */}
      <motion.div
        animate={{ 
          x: ["-30vw", "-30vw", "30vw", "100vw", "100vw", "20vw", "-60vw", "-60vw", "-60vw"],
          scaleX: [1, 1, 1, 1, -1, -1, -1, 1, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, times: T, ease: "linear" }}
        className="absolute bottom-0 w-24 h-24 pointer-events-none"
      >
        <motion.div animate={{ y: [0, -2, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} className="w-full h-full relative">
          <motion.div className="absolute -top-10 left-1/2 -translate-x-1/2 text-lg font-black bg-background border-2 border-border rounded-full px-3 py-1 shadow-md text-foreground flex items-center justify-center">
            <motion.span animate={{ opacity: [0, 0, 1, 1, 0, 0, 0, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">RAWWR</motion.span>
            <motion.span animate={{ opacity: [0, 0, 0, 0, 1, 1, 1, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">T_T</motion.span>
          </motion.div>
          <GorillaSvg />
        </motion.div>
      </motion.div>

      {/* DINOS CONTAINER */}
      <motion.div
        animate={{ 
          x: ["-10vw", "45vw", "45vw", "115vw", "115vw", "45vw", "-40vw", "-40vw", "-40vw"],
          rotateY: [0, 0, 0, 0, 180, 180, 180, 0, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, times: T, ease: "linear" }}
        className="absolute bottom-0 flex items-end gap-2 pointer-events-auto"
      >
        {/* Baby 3 (Back) */}
        <motion.div
          animate={{ x: [0, 0, -10, 0, 0, 0, 0, 0, 0] }}
          transition={{ duration: 30, repeat: Infinity, times: T, ease: "easeInOut" }}
          className="w-5 h-5 relative"
        >
          <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black bg-background border border-border rounded-full px-2 py-0.5 shadow-sm text-foreground flex items-center justify-center min-w-[32px] min-h-[20px]">
            <motion.span animate={{ opacity: [0, 1, 0, 0, 0, 0, 0, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">T_T</motion.span>
            <motion.span animate={{ opacity: [0, 0, 1, 1, 0, 0, 0, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">O_O</motion.span>
            <motion.span animate={{ opacity: [0, 0, 0, 0, 1, 1, 1, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">&gt;_&lt;</motion.span>
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="w-full h-full">
            <DinoSvg />
          </motion.div>
        </motion.div>

        {/* Baby 2 (Middle) */}
        <motion.div
          animate={{
            x: [0, 10, 0, 0, 0, 0, 0, 0, 0],
            rotate: [0, 15, 0, 0, 0, 0, 0, 0, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, times: T, ease: "easeInOut" }}
          className="w-5 h-5 relative z-10"
        >
          <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black bg-background border border-border rounded-full px-2 py-0.5 shadow-sm text-foreground flex items-center justify-center min-w-[32px] min-h-[20px]">
            <motion.span animate={{ opacity: [0, 1, 0, 0, 1, 1, 1, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">&gt;_&lt;</motion.span>
            <motion.span animate={{ opacity: [0, 0, 1, 1, 0, 0, 0, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">O_O</motion.span>
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-full h-full">
            <DinoSvg />
          </motion.div>
        </motion.div>

        {/* Baby 1 (Front) */}
        <motion.div
          animate={{
            x: [0, -10, 0, 0, 0, 0, 0, 0, 0],
            rotate: [0, -15, 0, 0, 0, 0, 0, 0, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, times: T, ease: "easeInOut" }}
          className="w-5 h-5 relative"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-full h-full">
            <DinoSvg />
          </motion.div>
        </motion.div>

        {/* Big Dino (Mom/Dad) */}
        <motion.div
          animate={controls}
          onClick={handleClick}
          title="Klik aku untuk loncat!"
          className="w-10 h-10 ml-2 relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            animate={{ rotateY: [0, 180, 0, 0, 0, 0, 0, 0, 0] }}
            transition={{ duration: 30, repeat: Infinity, times: T, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {jumpCount > 1 && (
              <motion.span
                key={jumpCount}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -24, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-black"
                style={{ color: "var(--accent)", whiteSpace: "nowrap" }}
              >
                ×{jumpCount} 🔥
              </motion.span>
            )}
            
            <motion.div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-black bg-background border border-border rounded-full px-2 py-1 shadow-sm text-foreground flex items-center justify-center min-w-[36px] min-h-[24px]">
              <motion.span animate={{ opacity: [0, 1, 0, 0, 1, 1, 1, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">-_-</motion.span>
              <motion.span animate={{ opacity: [0, 0, 1, 1, 0, 0, 0, 0, 0] }} transition={{ duration: 30, repeat: Infinity, times: T }} className="absolute">O_O</motion.span>
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="w-full h-full">
              <DinoSvg />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

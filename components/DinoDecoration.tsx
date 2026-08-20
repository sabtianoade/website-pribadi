"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function DinoDecoration() {
  const [mounted, setMounted] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const controls = useAnimation();
  const xRef = useRef(0); // track current X position 0..100 (vw%)

  useEffect(() => {
    setMounted(true);
  }, []);

  // Continuously walk left to right
  useEffect(() => {
    if (!mounted) return;
    const duration = 15000; // ms to cross screen
    const startTime = Date.now();

    const tick = () => {
      const elapsed = (Date.now() - startTime) % duration;
      xRef.current = (elapsed / duration) * 120 - 10; // -10vw to 110vw
    };
    const id = setInterval(tick, 16);
    return () => clearInterval(id);
  }, [mounted]);

  const handleClick = async () => {
    if (isJumping) {
      // chain jump — add extra power mid-air
      setJumpCount((c) => c + 1);
    } else {
      setJumpCount(1);
    }
  };

  // Trigger jump animation whenever jumpCount increases
  useEffect(() => {
    if (jumpCount === 0) return;

    const jumpHeight = Math.min(30 + jumpCount * 30, 300); // max 300px
    const jumpDuration = 0.35 + jumpCount * 0.05;

    setIsJumping(true);

    // Scroll page up proportionally — the higher dino jumps, the more it scrolls up
    const scrollAmount = jumpHeight * 3;
    window.scrollBy({ top: -scrollAmount, behavior: "smooth" });

    controls
      .start({
        y: -jumpHeight,
        transition: { duration: jumpDuration * 0.45, ease: "easeOut" },
      })
      .then(() =>
        controls.start({
          y: 0,
          transition: {
            duration: jumpDuration * 0.55,
            ease: [0.215, 0.61, 0.355, 1],
          },
        })
      )
      .then(() => {
        setIsJumping(false);
        setJumpCount(0);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpCount]);

  if (!mounted) return null;

  return (
    <div
      className="fixed bottom-4 z-50 opacity-70 cursor-pointer select-none"
      style={{ left: "4px", pointerEvents: "auto" }}
    >
      <motion.div
        /* walking: slide left-to-right + auto hop */
        animate={{ x: ["-10vw", "110vw"], y: [0, -50, 0, -35, 0, -60, 0] }}
        transition={{
          x: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative"
      >
        {/* jump wrapper */}
        <motion.div
          animate={controls}
          onClick={handleClick}
          title="Klik aku untuk loncat!"
          className="w-12 h-12 relative"
          whileHover={{ scale: 1.2 }}
        >
          {/* jump count badge */}
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

          {/* Pixel Art Dino SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
            style={{ color: "var(--foreground)" }}
          >
            <path d="M14 2h6v2h2v6h-2v2h-2v2h-2v-2h-2v-2h-2V8h-2V6h2V4h2V2zm4 4h-2v2h2V6zm-8 6h2v2h2v4h-2v2h-2v2H8v-2h2v-4H8v-2H6v-4H4v-2h4v2h2v4h2v-2zm-6 0H2v2h2v-2zm0-2H2v2h2v-2zm2-2H4v2h2v-2zm0-2H6v2h2v-2zm8 10h-2v2h-2v2h4v-4z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

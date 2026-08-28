"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Text to animate
  const text = "THOMAS";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[var(--background)]"
        >
          {/* Subtle glowing background pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 rounded-full bg-[var(--primary)] blur-[100px] pointer-events-none"
          />

          <div className="relative flex flex-col items-center overflow-hidden">
            {/* Staggered text reveal */}
            <div className="flex text-5xl md:text-7xl font-black tracking-[0.2em] text-[var(--foreground)] drop-shadow-2xl mb-4">
              {text.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Progress line loading */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="h-1 bg-[var(--primary)] rounded-full relative overflow-hidden w-48 shadow-[0_0_15px_var(--primary)]"
            >
              <motion.div 
                className="absolute inset-0 w-full h-full bg-white/50"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

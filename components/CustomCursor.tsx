"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  
  // Motion values for smoother movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    // Only show custom cursor on desktop devices that have pointer fine
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the cursor (32px width / 2)
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden sm:flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {/* Rotating outer square */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-primary m-1"
      />
      {/* Inner square dot */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-2 h-2 bg-primary" 
      />
    </motion.div>
  );
}

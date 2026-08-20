"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function DinoDecoration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none opacity-50">
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: ["-10vw", "110vw"],
        }}
        transition={{
          y: {
            duration: 0.4,
            repeat: Infinity,
            ease: "easeOut",
          },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }
        }}
        className="w-10 h-10"
      >
        {/* Simple Pixel Art Dinosaur SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full text-foreground"
        >
          <path d="M14 2h6v2h2v6h-2v2h-2v2h-2v-2h-2v-2h-2V8h-2V6h2V4h2V2zm4 4h-2v2h2V6zm-8 6h2v2h2v4h-2v2h-2v2H8v-2h2v-4H8v-2H6v-4H4v-2h4v2h2v4h2v-2zm-6 0H2v2h2v-2zm0-2H2v2h2v-2zm2-2H4v2h2v-2zm0-2H6v2h2v-2zm8 10h-2v2h-2v2h4v-4z" />
        </svg>
      </motion.div>
    </div>
  );
}

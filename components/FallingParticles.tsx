"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const NUM_PARTICLES = 30;

export default function FallingParticles() {
  const [particles, setParticles] = useState<{ id: number; left: number; duration: number; delay: number; size: number; rotate: number }[]>([]);

  useEffect(() => {
    // Generate random particles only on the client side to avoid hydration mismatch
    const generated = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 15, // fall duration between 15s and 30s
      delay: Math.random() * 15,
      size: Math.random() * 10 + 10, // size between 10px and 20px
      rotate: Math.random() * 360,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: 0, opacity: 0, rotate: p.rotate }}
          animate={{
            y: ["0vh", "120vh"],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0, 0.7, 0.7, 0],
            rotate: [p.rotate, p.rotate + 180, p.rotate + 360]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: -30,
            fontSize: p.size,
            filter: "drop-shadow(0 0 5px rgba(255, 105, 180, 0.5))"
          }}
        >
          {p.id % 3 === 0 ? '🌸' : p.id % 3 === 1 ? '💖' : '✨'}
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Motion values for dynamic animations
  const progress = useMotionValue(0);
  const progressText = useTransform(progress, (latest) => `${Math.round(latest)}%`);
  
  // Animate dino color from dark gray to bright white
  const dinoColor = useTransform(progress, [0, 100], ["#333333", "#ffffff"]);
  // 2 * Math.PI * radius (r=80)
  const circleRadius = 80;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = useTransform(progress, [0, 100], [circleCircumference, 0]);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Animate progress from 0 to 100 over 2.5 seconds
    const controls = animate(progress, 100, {
      duration: 2.5,
      ease: "easeInOut",
      onComplete: () => {
        // Wait a tiny bit at 100% before fading out
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "auto";
        }, 400); 
      }
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "auto";
    };
  }, [progress]);

  const GorillaSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="8" y="2" width="8" height="6" />
      <rect x="4" y="8" width="16" height="10" />
      <motion.rect animate={{ y: [0, -3, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="2" y="8" width="4" height="12" />
      <motion.rect animate={{ y: [-3, 0, -3] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="18" y="8" width="4" height="12" />
      <motion.rect animate={{ y: [0, -4, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="6" y="18" width="4" height="4" />
      <motion.rect animate={{ y: [-4, 0, -4] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} x="14" y="18" width="4" height="4" />
      <rect x="10" y="4" width="2" height="2" fill="black" />
      <rect x="14" y="4" width="2" height="2" fill="black" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.15) 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }}
        >
          <div className="flex flex-col items-center gap-8">
            
            {/* Circular Progress & Gorilla */}
            <div className="relative flex items-center justify-center w-56 h-56">
              {/* Outer Glowing Ring Background */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <circle 
                  cx="112" cy="112" r={circleRadius} 
                  stroke="#222" 
                  strokeWidth="8" 
                  fill="none" 
                />
                {/* Animated Progress Ring */}
                <motion.circle 
                  cx="112" cy="112" r={circleRadius} 
                  stroke="#ffffff" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  style={{ strokeDashoffset }}
                  className="drop-shadow-[0_0_8px_#ffffff]"
                />
              </svg>

              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] z-10"
                style={{ color: dinoColor }}
              >
                <GorillaSvg />
              </motion.div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              
              {/* User Identity */}
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-white/80 font-black text-xl tracking-[0.4em] uppercase"
              >
                Thomas
              </motion.h1>

              {/* Progress Text */}
              <motion.div 
                className="text-white font-black text-2xl tracking-widest drop-shadow-md"
              >
                <motion.span>{progressText}</motion.span>
              </motion.div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

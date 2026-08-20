"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({ navigate: () => {} });

export const useTransition = () => useContext(TransitionContext);

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (href: string) => {
    // If we're already on the page and it's not a hash link, do nothing
    if (pathname === href && !href.includes("#")) return;
    
    // Start transition
    setIsTransitioning(true);
    
    // Wait for the animation to cover the screen, then navigate
    setTimeout(() => {
      router.push(href);
      
      // Wait a tiny bit for the new route to start rendering, then animate out
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 600);
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] origin-bottom flex items-center justify-center"
            style={{ background: "var(--foreground)" }} // Uses monochrome theme
          >
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ delay: 0.2, duration: 0.4 }}
               className="flex flex-col items-center gap-4"
            >
              {/* Spinner */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-[var(--background)] border-t-transparent rounded-full"
              />
              <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "var(--background)" }}>
                Memuat
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

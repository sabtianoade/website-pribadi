"use client";

import { useState } from "react";
import WhackAGorilla from "./WhackAGorilla";
import DinoRun from "./DinoRun";
import SpaceShooter from "./SpaceShooter";
import { motion, AnimatePresence } from "motion/react";

export default function GamesZone() {
  const [activeGame, setActiveGame] = useState<"whack" | "dino" | "space">("whack");

  return (
    <section className="py-24 px-6 md:px-10 max-w-[1300px] mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Zona Bermain 🎮</h2>
        <p className="text-[var(--muted)] max-w-xl mx-auto">
          Bosan scroll doang? Ayo luangkan waktumu sebentar untuk bermain beberapa game seru di bawah ini!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {[
          { id: "whack", label: "🦍 Pukul Gorila" },
          { id: "dino", label: "🦖 Dino Run" },
          { id: "space", label: "🚀 Space Shooter" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveGame(tab.id as any)}
            className={`relative px-6 py-3 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider transition-colors ${
              activeGame === tab.id
                ? "text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--card)] border border-[var(--card-border)]"
            }`}
          >
            {activeGame === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Container */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeGame === "whack" && (
            <motion.div
              key="whack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WhackAGorilla />
            </motion.div>
          )}
          {activeGame === "dino" && (
            <motion.div
              key="dino"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DinoRun />
            </motion.div>
          )}
          {activeGame === "space" && (
            <motion.div
              key="space"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SpaceShooter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

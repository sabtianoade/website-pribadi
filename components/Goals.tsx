"use client";

import { motion } from "motion/react";
import { goals } from "@/data/goals";

const phaseConfig = {
  now: {
    label: "Sekarang",
    tag: "NOW",
    emoji: "⚡",
    desc: "Lagi dikerjain",
    color: "#6C63FF",
    bg: "#6C63FF",
    rotate: "-1deg",
  },
  next: {
    label: "Selanjutnya",
    tag: "NEXT",
    emoji: "🚀",
    desc: "Yang mau dicapai",
    color: "#F9C74F",
    bg: "#F97316",
    rotate: "0.5deg",
  },
  future: {
    label: "Masa Depan",
    tag: "FUTURE",
    emoji: "🌟",
    desc: "Mimpi jangka panjang",
    color: "#10B981",
    bg: "#10B981",
    rotate: "1.5deg",
  },
} as const;

type Phase = keyof typeof phaseConfig;

export default function Goals() {
  const phases: Phase[] = ["now", "next", "future"];

  return (
    <section
      id="goals"
      className="py-24 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* BIG background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[15vw] font-black uppercase opacity-[0.03] leading-none"
          style={{ color: "var(--foreground)" }}
        >
          GOALS
        </span>
      </div>

      <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Mau ke{" "}
            <span className="gradient-text">Mana</span>?
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Dari yang lagi dikerjain sekarang sampai mimpi jangka panjang.
          </p>
        </motion.div>

        {/* 3 sticky-note style columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, pi) => {
            const config = phaseConfig[phase];
            const phaseGoals = goals.filter((g) => g.phase === phase);

            return (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: config.rotate,
                }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: pi * 0.15 }}
                whileHover={{ rotate: "0deg", y: -4 }}
                className="flex flex-col gap-4 p-6 rounded-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  transformOrigin: "top center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                {/* Phase header */}
                <div
                  className="flex items-center gap-3 pb-4"
                  style={{ borderBottom: "2px solid var(--card-border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${config.color}20` }}
                    aria-hidden="true"
                  >
                    {config.emoji}
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: config.color }}
                    >
                      {config.tag}
                    </div>
                    <div className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                      {config.label}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {config.desc}
                    </div>
                  </div>
                </div>

                {/* Goals list */}
                <div className="flex flex-col gap-3">
                  {phaseGoals.map((goal, gi) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.3, delay: pi * 0.1 + gi * 0.08 }}
                      className="flex gap-3"
                    >
                      <span className="text-lg mt-0.5 flex-shrink-0" role="img" aria-label="">
                        {goal.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                          {goal.titleId}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                          {goal.descriptionId}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

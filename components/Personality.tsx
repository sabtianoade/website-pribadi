"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { personalityTraits } from "@/data/personality";

export default function Personality() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = personalityTraits.find((t) => t.id === selected);

  return (
    <section
      id="personality"
      className="py-24 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* BIG background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[18vw] font-black uppercase opacity-[0.03] leading-none"
          style={{ color: "var(--foreground)" }}
        >
          VIBES
        </span>
      </div>

      <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Gimana{" "}
            <span className="gradient-text">Sifatku</span>?
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Klik salah satu buat tahu lebih banyak. Ini bukan tes psikologi ya, cuma self-assessment yang fun 😄
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Bubble cloud */}
          <div className="flex-1 flex flex-wrap gap-3 content-start">
            {personalityTraits.map((trait, i) => (
              <motion.button
                key={trait.id}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                onClick={() => setSelected(selected === trait.id ? null : trait.id)}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className={`tag-bubble focus-visible:outline-none ${
                  trait.size === "lg"
                    ? "text-base px-6 py-3"
                    : trait.size === "sm"
                    ? "text-xs px-4 py-2"
                    : "text-sm px-5 py-2.5"
                }`}
                style={{
                  background:
                    selected === trait.id
                      ? trait.color
                      : `${trait.color}18`,
                  color: selected === trait.id ? "#fff" : trait.color,
                  border: `1.5px solid ${trait.color}${selected === trait.id ? "ff" : "40"}`,
                  boxShadow:
                    selected === trait.id
                      ? `0 8px 24px ${trait.color}40`
                      : "none",
                }}
                aria-pressed={selected === trait.id}
              >
                <span aria-hidden="true">{trait.emoji}</span>
                {trait.labelId}
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:w-80 flex-shrink-0">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "var(--card)",
                    border: `1.5px solid ${active.color}50`,
                    boxShadow: `0 8px 32px ${active.color}20`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl" role="img" aria-label={active.labelId}>
                      {active.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: active.color }}>
                        {active.labelId}
                      </h3>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              background:
                                i < Math.ceil(active.score / 20)
                                  ? active.color
                                  : `${active.color}30`,
                            }}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {active.descriptionId}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl text-center"
                  style={{
                    background: "var(--card)",
                    border: "1px dashed var(--card-border)",
                  }}
                >
                  <p className="text-4xl mb-3">👆</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Klik salah satu label di sebelah kiri untuk tahu lebih lanjut
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

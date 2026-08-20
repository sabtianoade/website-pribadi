"use client";

import { motion } from "motion/react";
import { facts } from "@/data/facts";

// Scattered layout positions: rotate and scale vary per card
const cardStyles = [
  { rotate: "-2deg", scale: 1.0 },
  { rotate: "1.5deg", scale: 0.98 },
  { rotate: "-1deg", scale: 1.02 },
  { rotate: "2deg", scale: 1.0 },
  { rotate: "-0.5deg", scale: 1.01 },
  { rotate: "1deg", scale: 0.99 },
  { rotate: "-1.5deg", scale: 1.0 },
  { rotate: "0.8deg", scale: 1.02 },
];

export default function RandomFacts() {
  return (
    <section
      id="facts"
      className="py-24 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "var(--muted-bg)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Fakta Random{" "}
            <span className="gradient-text">Tentang Aku</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Hal-hal yang mungkin nggak perlu kamu tahu, tapi sekarang kamu tahu. 😏
          </p>
        </motion.div>

        {/* Scattered cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facts.map((fact, i) => {
            const style = cardStyles[i % cardStyles.length];
            return (
              <motion.div
                key={fact.id}
                initial={{
                  opacity: 0,
                  y: 30,
                  rotate: 0,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: style.rotate,
                }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{
                  rotate: "0deg",
                  y: -8,
                  scale: 1.04,
                  zIndex: 10,
                }}
                className="relative flex flex-col gap-4 p-5 rounded-2xl cursor-default"
                style={{
                  background: "var(--card)",
                  border: `2px solid ${fact.color}25`,
                  boxShadow: `0 4px 24px ${fact.color}10`,
                  transformOrigin: "bottom center",
                  scale: style.scale,
                  position: "relative",
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                  style={{ background: fact.color, opacity: 0.5 }}
                  aria-hidden="true"
                />

                {/* Emoji */}
                <motion.div
                  className="text-3xl w-11 h-11 flex items-center justify-center rounded-xl"
                  style={{ background: `${fact.color}15` }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 15, 0] }}
                  aria-hidden="true"
                >
                  {fact.emoji}
                </motion.div>

                {/* Text */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {fact.textId}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

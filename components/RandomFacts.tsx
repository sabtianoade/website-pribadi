"use client";

import { motion } from "motion/react";
import { Headphones, Moon, UtensilsCrossed, Laptop, Bug, Coffee, Smartphone, Gamepad2 } from "lucide-react";
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

const factIcons: Record<string, React.ElementType> = {
  f1: Headphones,
  f2: Moon,
  f3: UtensilsCrossed,
  f4: Laptop,
  f5: Bug,
  f6: Coffee,
  f7: Smartphone,
  f8: Gamepad2,
};

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
            Hal-hal yang mungkin nggak perlu kamu tahu, tapi sekarang kamu tahu.
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
                className="relative flex flex-col gap-4 p-5 rounded-2xl cursor-default overflow-hidden"
                style={{
                  background: "var(--card)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  transformOrigin: "bottom center",
                  scale: style.scale,
                  position: "relative",
                }}
              >
                {/* SVG border draw — runs once around card, stays drawn */}
                <motion.svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ borderRadius: "1rem" }}
                  aria-hidden="true"
                >
                  <motion.rect
                    x="0.5"
                    y="0.5"
                    width="calc(100% - 1px)"
                    height="calc(100% - 1px)"
                    rx="15.5"
                    ry="15.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{
                      pathLength: 1,
                      opacity: 1,
                    }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      pathLength: { duration: 1.8, delay: i * 0.1, ease: "easeInOut" },
                      opacity: { duration: 0.1, delay: i * 0.1 },
                    }}
                  />
                </motion.svg>

                {/* White outline icon */}
                {(() => {
                  const Icon = factIcons[fact.id];
                  return Icon ? (
                    <div className="w-9 h-9 flex items-center justify-center" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
                    </div>
                  ) : null;
                })()}

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

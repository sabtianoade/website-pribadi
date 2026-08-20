"use client";

import { motion } from "motion/react";
import { hobbies } from "@/data/hobbies";

// Bento layout config: defines position and size of each card
const bentoConfig = [
  { colSpan: "lg:col-span-2 lg:row-span-2", minH: "min-h-[260px]" }, // 0: Badminton — BIG
  { colSpan: "lg:col-span-2", minH: "min-h-[120px]" },               // 1: Musik
  { colSpan: "lg:col-span-2", minH: "min-h-[120px]" },               // 2: Padel
  { colSpan: "lg:col-span-2", minH: "min-h-[120px]" },               // 3: Guitar
  { colSpan: "lg:col-span-2", minH: "min-h-[120px]" },               // 4: Coffee
  { colSpan: "lg:col-span-4 lg:row-span-2", minH: "min-h-[260px]" }, // 5: Coding — BIG
];

export default function Hobbies() {
  return (
    <section
      id="hobbies"
      className="py-24 px-6 md:px-10"
      style={{ background: "var(--background)" }}
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
            Hal yang{" "}
            <span className="gradient-text">Aku Suka</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Kumpulan aktivitas yang selalu bikin aku semangat, apapun situasinya.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {hobbies.map((hobby, i) => {
            const config = bentoConfig[i] ?? { colSpan: "", minH: "min-h-[120px]" };
            const isBig = i === 0 || i === 5;

            return (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative p-6 rounded-[2rem] flex flex-col gap-4 overflow-hidden ${config.colSpan} ${config.minH}`}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                }}
              >
                {/* Dynamic animated glow background on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ background: `radial-gradient(circle at center, ${hobby.color}15 0%, transparent 70%)` }}
                  aria-hidden="true"
                />

                {/* Emoji icon */}
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, -15, 15, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 text-4xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm"
                  style={{ background: `${hobby.color}15`, border: `1px solid ${hobby.color}30` }}
                  aria-hidden="true"
                >
                  {hobby.emoji}
                </motion.div>

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2 flex-1 mt-2">
                  <h3
                    className={`font-bold tracking-tight transition-colors group-hover:text-[${hobby.color}] ${isBig ? "text-2xl" : "text-lg"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    {hobby.titleId}
                  </h3>
                  {isBig && (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {hobby.descriptionId}
                    </p>
                  )}
                </div>

                {/* Bottom accent line that expands on hover */}
                <div
                  className="relative z-10 h-1 rounded-full transition-all duration-500 w-8 group-hover:w-full opacity-50 group-hover:opacity-100 mt-auto"
                  style={{ background: hobby.color, boxShadow: `0 0 10px ${hobby.color}80` }}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

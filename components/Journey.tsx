"use client";

import { motion } from "motion/react";
import { journeyItems } from "@/data/journey";

export default function Journey() {
  return (
    <section
      id="journey"
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
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Perjalananku{" "}
            <span className="gradient-text">Sejauh Ini</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Dari awal sampai sekarang. Setiap langkah punya ceritanya sendiri.
          </p>
        </motion.div>

        {/* Editorial timeline — single column diary style */}
        <div className="flex flex-col gap-0 max-w-2xl">
          {journeyItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex gap-6 pb-10"
            >
              {/* Left: Year column */}
              <div className="flex flex-col items-center w-16 flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                  className="w-4 h-4 rounded-full mt-1.5 flex-shrink-0 z-10"
                  style={{
                    background: item.highlight ? "var(--primary)" : "var(--card-border)",
                    border: item.highlight
                      ? "3px solid var(--background)"
                      : "3px solid var(--background)",
                    boxShadow: item.highlight ? "0 0 0 2px var(--primary)" : "none",
                  }}
                  aria-hidden="true"
                />
                {/* Vertical line */}
                {i < journeyItems.length - 1 && (
                  <div
                    className="flex-1 w-0.5 mt-2"
                    style={{ background: "var(--card-border)" }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 pb-2">
                {/* Year tag */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: item.highlight ? "var(--primary-light)" : "var(--card)",
                      color: item.highlight ? "var(--primary)" : "var(--muted)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    {item.year}
                  </span>
                  <span className="text-lg" role="img" aria-label="">
                    {item.emoji}
                  </span>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${item.highlight ? "var(--primary)40" : "var(--card-border)"}`,
                  }}
                >
                  <h3 className="font-bold text-base mb-1" style={{ color: "var(--foreground)" }}>
                    {item.titleId}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {item.descriptionId}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

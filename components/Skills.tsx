"use client";

import { motion } from "motion/react";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-10" style={{ background: "var(--muted-bg)" }}>
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
            Yang{" "}
            <span className="gradient-text">Aku Bisa</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Teknologi dan tools utama yang sering aku pakai sehari-hari.
          </p>
        </motion.div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ y: -3, scale: 1.05 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold cursor-default"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <span className="text-xl">{skill.emoji}</span>
              <span className="text-base">{skill.name}</span>
              <span
                className="w-2.5 h-2.5 rounded-full ml-1"
                style={{ background: skill.color }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.5 }}
          className="text-xs mt-12"
          style={{ color: "var(--muted)" }}
        >
          🌱 Selalu antusias buat belajar teknologi baru.
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skills, Skill, SkillCategory } from "@/data/skills";
import { Shield, Sword, Eye, Sparkles, X, Code, Braces, Wand2, Terminal, Cpu, Layout, Smartphone, FileCode2, Figma } from "lucide-react";

// Particle effect for background
const PARTICLE_COUNT = 40;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

const skillIcons: Record<string, any> = {
  html: Code,
  css: Layout,
  tailwind: Wand2,
  javascript: Braces,
  react: Cpu,
  nextjs: Terminal,
  figma: Figma,
  uiux: Smartphone,
  motion: Sparkles,
};

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Group skills by category
  const structureSkills = skills.filter((s) => s.category === "structure");
  const logicSkills = skills.filter((s) => s.category === "logic");
  const visionSkills = skills.filter((s) => s.category === "vision");

  const categories = [
    { id: "structure", title: "Path of Structure", icon: Shield, data: structureSkills, color: "text-[var(--foreground)]", glow: "shadow-[var(--foreground)]/10" },
    { id: "logic", title: "Path of Logic", icon: Sword, data: logicSkills, color: "text-[var(--foreground)]", glow: "shadow-[var(--foreground)]/10" },
    { id: "vision", title: "Path of Vision", icon: Eye, data: visionSkills, color: "text-[var(--foreground)]", glow: "shadow-[var(--foreground)]/10" },
  ];

  return (
    <section id="skills" className="relative py-24 px-6 md:px-10 overflow-hidden bg-[var(--background)] min-h-[800px] flex flex-col justify-center">
      {/* RPG Grid Background & Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[var(--primary)]"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] mb-4 shadow-lg shadow-[var(--primary)]/10">
            <Sparkles size={16} className="text-[var(--primary)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Skill Tree Unlocked</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
            Pohon <span className="text-[var(--primary)] drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">Keahlian</span>
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto font-medium">Pilih jalur kelasmu dan klik node untuk melihat detail dari setiap kekuatan teknologiku.</p>
        </motion.div>

        {/* Skill Tree Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {categories.map((cat, catIndex) => (
            <div key={cat.id} className="flex flex-col items-center">
              
              {/* Category Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.2 }}
                className="flex flex-col items-center mb-10"
              >
                <div className={`w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center mb-4 shadow-xl ${cat.glow}`}>
                  <cat.icon size={28} className={cat.color} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider">{cat.title}</h3>
              </motion.div>

              {/* The Tree Nodes */}
              <div className="relative flex flex-col items-center gap-12 w-full">
                {/* Vertical connecting line */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-[var(--card-border)] via-[var(--primary)]/50 to-[var(--card-border)] opacity-30" />

                {cat.data.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (catIndex * 0.2) + (index * 0.2), type: "spring", bounce: 0.5 }}
                    className="relative z-10 w-full flex justify-center"
                  >
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="group relative flex items-center gap-4 bg-[var(--card)] border-2 border-[var(--card-border)] hover:border-[var(--primary)] px-5 py-3 rounded-2xl shadow-lg transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] w-full max-w-[220px]"
                    >
                      {/* Active Node Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/10 transition-colors" />
                      
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--foreground)] bg-[var(--background)] border border-[var(--card-border)] shadow-inner" style={{ borderColor: skill.color }}>
                        {(() => {
                          const Icon = skillIcons[skill.id] || Code;
                          return <Icon size={20} />;
                        })()}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-[var(--foreground)] leading-none">{skill.name}</p>
                        <p className="text-[10px] font-black text-[var(--muted)] mt-1 uppercase tracking-widest">Lvl {skill.level}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail RPG Style */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--card)] border-2 border-[var(--card-border)] rounded-3xl p-8 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
              style={{ borderTopColor: selectedSkill.color }}
            >
              {/* Modal Decor */}
              <div className="absolute -top-16 -right-16 w-32 h-32 blur-[60px] opacity-20 rounded-full" style={{ backgroundColor: selectedSkill.color }} />
              
              <button 
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--background)] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-4">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-[var(--foreground)] mb-6 shadow-2xl relative"
                  style={{ backgroundColor: `var(--card)`, border: `2px solid ${selectedSkill.color}` }}
                >
                  {(() => {
                    const Icon = skillIcons[selectedSkill.id] || Code;
                    return <Icon size={48} />;
                  })()}
                  {/* Floating particles around selected icon */}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] border border-dashed rounded-full opacity-30" style={{ borderColor: selectedSkill.color }} />
                </div>
                
                <h3 className="text-3xl font-black mb-1">{selectedSkill.name}</h3>
                
                <div className="flex items-center gap-3 my-4 w-full bg-[var(--background)] p-3 rounded-xl border border-[var(--card-border)] shadow-inner">
                  <div className="text-right w-1/4">
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Level</p>
                    <p className="text-lg font-black" style={{ color: selectedSkill.color }}>{selectedSkill.level}</p>
                  </div>
                  <div className="flex-1">
                    {/* EXP Bar */}
                    <div className="h-2 w-full bg-[var(--card-border)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(parseInt(selectedSkill.level) / parseInt(selectedSkill.maxLevel)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: selectedSkill.color }}
                      />
                    </div>
                  </div>
                  <div className="text-left w-1/4">
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Max</p>
                    <p className="text-lg font-black text-[var(--foreground)]">{selectedSkill.maxLevel}</p>
                  </div>
                </div>

                <div className="mt-4 text-left w-full bg-[var(--background)] p-4 rounded-xl border border-[var(--card-border)]">
                  <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles size={12}/> Skill Info</p>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed font-medium">
                    {selectedSkill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

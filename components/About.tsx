"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MapPin, GraduationCap, Heart, Sparkles } from "lucide-react";
import TiltCard from "@/components/TiltCard";
import { supabase } from "@/lib/supabase";

export default function About() {
  const [aboutImage, setAboutImage] = useState("/upd.jpeg");
  const [aboutDescription, setAboutDescription] = useState("Aku adalah seorang pelajar SMK jurusan Rekayasa Perangkat Lunak. Selain koding, aku suka mendengarkan musik, bermain game, dan mengeksplorasi desain web yang unik.");

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const { data: imgData } = await supabase
          .from("gallery")
          .select("image_url")
          .eq("category", "about")
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (imgData && imgData.length > 0) {
          setAboutImage(imgData[0].image_url);
        }

        const { data: textData } = await supabase.from("site_settings").select("*");
        if (textData) {
          const desc = textData.find(item => item.id === "about_description")?.value;
          if (desc) setAboutDescription(desc);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    }
    
    fetchAboutData();
  }, []);

  return (
    <section
      id="about"
      className="relative py-24 px-6 md:px-10 overflow-hidden"
      style={{ background: "var(--muted-bg)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">

          {/* ── LEFT: Story text ── */}
          <div className="flex flex-col gap-8">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-8 h-0.5"
                style={{ background: "var(--primary)" }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                Tentang Aku
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
            >
              Siapa{" "}
              <span className="gradient-text">Aku</span>?
            </motion.h2>

            {/* Story paragraphs */}
            <div className="flex flex-col gap-4">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--muted)" }}
              >
                {aboutDescription}
              </motion.p>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4"
              style={{ borderTop: "1px solid var(--card-border)" }}
            >
              {[
                { number: "2021", label: "Mulai Coding" },
                { number: "10+", label: "Teknologi" },
                { number: "∞", label: "Semangat" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span
                    className="text-3xl font-black"
                    style={{ color: "var(--primary)" }}
                  >
                    {stat.number}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Profile Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {/* Photo */}
            <TiltCard>
              <div
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <Image
                  src={aboutImage}
                  alt="Foto Thomas yang santai dan friendly"
                  fill
                  quality={100}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 380px"
                />
                {/* floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "var(--accent)", color: "#1A1A1A" }}
                >
                  <Sparkles size={12} className="inline mr-1" aria-hidden="true" />
                  Open to chat!
                </motion.div>
              </div>
            </TiltCard>

            {/* Info cards */}
            <div
              className="p-4 rounded-2xl flex flex-col gap-3"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              {[
                { icon: GraduationCap, text: "SMKN 1 Pasuruan · RPL" },
                { icon: MapPin, text: "Pasuruan, Jawa Timur, Indonesia" },
                { icon: Heart, text: "Teknologi, Desain, Web Dev" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                    }}
                  >
                    <item.icon size={14} aria-hidden="true" />
                  </div>
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

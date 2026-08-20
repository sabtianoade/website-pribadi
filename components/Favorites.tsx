"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { favorites } from "@/data/favorites";
import GlossyCard from "@/components/GlossyCard";

export default function Favorites() {
  return (
    <section id="favorites" className="py-24 px-6 md:px-10" style={{ background: "var(--muted-bg)" }}>
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
            Yang Aku{" "}
            <span className="gradient-text">Suka Banget</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Dari makanan sampai game — ini hal-hal yang selalu bikin aku happy.
          </p>
        </motion.div>

        {/* Magazine-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              whileHover={{ y: -10, boxShadow: `0 20px 50px rgba(0,0,0,0.2)` }}
              className="group rounded-2xl overflow-hidden"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
              }}
            >
              {/* Image with aspect ratio variation */}
              <GlossyCard
                className={`w-full ${
                  i === 0 || i === 3 ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={item.imageSrc || `https://picsum.photos/seed/fav-${item.id}-${item.imageSeed}/600/400`}
                  alt={`Gambar representasi ${item.title} — ${item.category}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                  }}
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: `${item.color}cc` }}
                  >
                    {item.emoji} {item.categoryId}
                  </span>
                </div>
              </GlossyCard>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-base mb-0.5" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p className="text-xs mb-2 font-medium" style={{ color: item.color }}>
                  {item.subtitle}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.descriptionId}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

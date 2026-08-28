"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryCategories, type GalleryItem } from "@/data/gallery";
import GlossyCard from "@/components/GlossyCard";
import { supabase } from "@/lib/supabase";

const categoryLabels: Record<string, string> = {
  all: "Semua",
  me: "Aku",
  friends: "Teman",
  school: "Sekolah",
  food: "Makanan",
  random: "Random",
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .neq("category", "netha")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Map database schema to GalleryItem format
        const items: GalleryItem[] = (data || []).map((dbItem, index) => {
          // Assign random widths for masonry grid effect if needed
          const widths: ("normal" | "wide" | "tall")[] = ["normal", "wide", "tall"];
          const width = widths[index % 3]; 

          return {
            id: dbItem.id,
            src: dbItem.image_url,
            alt: dbItem.title,
            altId: dbItem.title,
            caption: dbItem.title,
            captionId: dbItem.title,
            category: dbItem.category as any,
            width: width,
          };
        });

        setGalleryItems(items);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGallery();
  }, []);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 px-6 md:px-10" style={{ background: "var(--background)" }}>
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
            Momen-Momen{" "}
            <span className="gradient-text">Kecil</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Koleksi foto dari kehidupan sehari-hariku. Klik foto untuk melihat lebih besar.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeCategory === cat.id ? "var(--primary)" : "var(--card)",
                color: activeCategory === cat.id ? "#fff" : "var(--muted)",
                border: "1px solid var(--card-border)",
              }}
              aria-pressed={activeCategory === cat.id}
            >
              {categoryLabels[cat.id] ?? cat.id}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "var(--primary)" }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>
            <p>Belum ada foto untuk kategori ini.</p>
          </div>
        ) : (
          /* Masonry grid */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                  style={{ border: "1px solid var(--card-border)" }}
                  onClick={() => setLightboxItem(item)}
                  onKeyDown={(e) => e.key === "Enter" && setLightboxItem(item)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Lihat foto: ${item.captionId ?? item.caption}`}
                >
                  <GlossyCard
                    className={`w-full ${
                      item.width === "tall" ? "aspect-[3/4]" : item.width === "wide" ? "aspect-[4/3]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.altId ?? item.alt}
                      fill
                      quality={100}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }}
                    >
                      <p className="px-4 py-3 text-white text-sm font-medium">
                        {item.captionId ?? item.caption}
                      </p>
                    </div>
                  </GlossyCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              onClick={() => setLightboxItem(null)}
              aria-label="Tutup preview foto"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full max-h-[80vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.altId ?? lightboxItem.alt}
                width={800}
                height={600}
                quality={100}
                className="w-full h-auto object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 px-6 py-4" style={{ background: "rgba(0,0,0,0.6)" }}>
                <p className="text-white font-medium">{lightboxItem.captionId ?? lightboxItem.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

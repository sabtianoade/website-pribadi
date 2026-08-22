"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type DeskItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  rotation: number;
  type: "photo" | "object";
};

const ITEMS: DeskItem[] = [
  { id: "1", src: "/momen-lagi.png", alt: "Momen 1", width: 250, height: 250, initialX: 50, initialY: 50, rotation: -5, type: "photo" },
  { id: "2", src: "/badmin.png", alt: "Badminton", width: 200, height: 250, initialX: 350, initialY: 20, rotation: 8, type: "photo" },
  { id: "3", src: "/gitar.png", alt: "Gitar", width: 180, height: 300, initialX: 600, initialY: 40, rotation: -15, type: "object" },
  { id: "4", src: "/bikinkopi.png", alt: "Kopi", width: 200, height: 200, initialX: 100, initialY: 300, rotation: 3, type: "object" },
  { id: "5", src: "/padel.png", alt: "Padel", width: 250, height: 200, initialX: 400, initialY: 320, rotation: -6, type: "photo" },
  { id: "6", src: "/makanan-fav.png", alt: "Makanan Fav", width: 220, height: 220, initialX: 750, initialY: 250, rotation: 12, type: "photo" }
];

export default function InteractiveDesk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [zoomedId, setZoomedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full py-20 bg-[#f5f5dc] dark:bg-[#2c2621] overflow-hidden border-y-8 border-[#8B4513]/20">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }} />
      
      <div className="relative max-w-7xl mx-auto px-6 mb-8 text-center z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#8B4513] dark:text-[#D2B48C]">
          MEJA KERJA <span className="text-[var(--primary)]">BERANTAKAN</span>
        </h2>
        <p className="text-[#5c4033] dark:text-[#a08b7d] max-w-2xl mx-auto font-medium">
          Selamat datang di meja kerjaku! Silakan geser-geser (drag & drop) barang-barang ini. Klik dua kali pada foto polaroid untuk melihatnya lebih jelas.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[600px] max-w-6xl mx-auto bg-black/5 dark:bg-black/20 rounded-3xl shadow-inner border border-black/10 overflow-hidden"
      >
        {ITEMS.map((item) => {
          const isZoomed = zoomedId === item.id;
          
          return (
            <motion.div
              key={item.id}
              drag={!isZoomed}
              dragConstraints={containerRef}
              dragElastic={0.1}
              dragMomentum={false}
              whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
              initial={{ 
                x: item.initialX, 
                y: item.initialY, 
                rotate: item.rotation 
              }}
              animate={isZoomed ? {
                x: (containerRef.current?.clientWidth || 1000) / 2 - item.width / 2,
                y: (containerRef.current?.clientHeight || 600) / 2 - item.height / 2,
                rotate: 0,
                scale: 1.5,
                zIndex: 60
              } : {
                scale: 1,
                zIndex: 10
              }}
              onDoubleClick={() => {
                if (item.type === "photo") {
                  setZoomedId(isZoomed ? null : item.id);
                }
              }}
              className={`absolute cursor-grab touch-none origin-center ${
                item.type === "photo" 
                  ? "bg-white p-4 pb-12 shadow-xl border border-gray-200" 
                  : "drop-shadow-2xl"
              }`}
              style={{ width: item.width, height: item.type === "photo" ? item.height + 40 : item.height }}
            >
              <div className="relative w-full h-full pointer-events-none">
                <Image 
                  src={item.src} 
                  alt={item.alt} 
                  fill 
                  className="object-cover pointer-events-none rounded-sm"
                />
              </div>
              {item.type === "photo" && (
                <div className="absolute bottom-3 left-0 w-full text-center font-mono text-gray-600 text-sm pointer-events-none">
                  {item.alt}
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Zoom Backdrop */}
        {zoomedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedId(null)}
            className="absolute inset-0 bg-black/50 z-50 cursor-pointer backdrop-blur-sm"
          />
        )}
      </div>
    </section>
  );
}

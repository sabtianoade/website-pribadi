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
  type: "photo" | "object" | "svg";
  svgContent?: React.ReactNode;
};

const ITEMS: DeskItem[] = [
  { id: "1", src: "/meja-makanan.jpeg", alt: "Makanan Favorit", width: 250, height: 250, initialX: 50, initialY: 50, rotation: -5, type: "photo" },
  { id: "2", src: "/meja-random.jpeg", alt: "Foto Random", width: 200, height: 250, initialX: 450, initialY: 30, rotation: 8, type: "photo" },
  { id: "3", src: "/meja-badminton.jpeg", alt: "Badminton", width: 250, height: 200, initialX: 650, initialY: 320, rotation: -15, type: "photo" },
  { id: "4", src: "/meja-gitar.jpeg", alt: "Gitar", width: 220, height: 250, initialX: 100, initialY: 300, rotation: 3, type: "photo" },
  { 
    id: "5", src: "", alt: "Kertas Dokumen", width: 200, height: 260, initialX: 250, initialY: 150, rotation: -4, type: "svg",
    svgContent: (
      <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-md">
        <rect x="0" y="0" width="200" height="260" fill="#fdfbf7" />
        <rect x="20" y="40" width="160" height="4" fill="#ddd" />
        <rect x="20" y="60" width="160" height="4" fill="#ddd" />
        <rect x="20" y="80" width="160" height="4" fill="#ddd" />
        <rect x="20" y="100" width="100" height="4" fill="#ddd" />
        {/* Paper clip */}
        <path d="M 30 10 L 30 30 C 30 35 35 35 35 30 L 35 5 C 35 0 25 0 25 5 L 25 35 C 25 45 40 45 40 35 L 40 10" fill="none" stroke="#silver" strokeWidth="4" />
      </svg>
    )
  },
  {
    id: "6", src: "", alt: "Tempat Pensil", width: 100, height: 140, initialX: 550, initialY: 120, rotation: 12, type: "svg",
    svgContent: (
      <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl">
        {/* Pencils sticking out */}
        <polygon points="30,80 40,30 50,80" fill="#fcd34d" />
        <polygon points="40,30 45,20 50,30" fill="#f87171" />
        <polygon points="60,80 70,20 80,80" fill="#60a5fa" />
        <polygon points="70,20 75,10 80,20" fill="#3b82f6" />
        {/* Cup */}
        <path d="M 20 60 L 80 60 L 70 140 L 30 140 Z" fill="#9ca3af" />
        <path d="M 20 60 L 80 60 L 75 70 L 25 70 Z" fill="#4b5563" />
      </svg>
    )
  },
  {
    id: "7", src: "", alt: "Kopi", width: 120, height: 120, initialX: 800, initialY: 100, rotation: 0, type: "svg",
    svgContent: (
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Saucer */}
        <ellipse cx="60" cy="90" rx="50" ry="15" fill="#e5e7eb" />
        <ellipse cx="60" cy="90" rx="35" ry="10" fill="#d1d5db" />
        {/* Cup */}
        <path d="M 30 40 L 90 40 C 90 80 80 90 60 90 C 40 90 30 80 30 40 Z" fill="#ffffff" />
        {/* Coffee */}
        <ellipse cx="60" cy="40" rx="28" ry="8" fill="#4a3f35" />
        {/* Handle */}
        <path d="M 85 50 C 110 50 110 70 85 70" fill="none" stroke="#ffffff" strokeWidth="10" />
      </svg>
    )
  }
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
    <section className="relative w-full py-20 bg-gray-200 dark:bg-zinc-900 overflow-hidden border-y-8 border-black/10 dark:border-white/5">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }} />
      
      <div className="relative max-w-7xl mx-auto px-6 mb-8 text-center z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-gray-800 dark:text-gray-200">
          MEJA KERJA <span className="text-[var(--primary)]">BERANTAKAN</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
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
                {item.type === "svg" ? (
                  item.svgContent
                ) : (
                  <Image 
                    src={item.src} 
                    alt={item.alt} 
                    fill 
                    className="object-cover pointer-events-none rounded-sm"
                  />
                )}
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

"use client";
import { motion } from "motion/react";
import { Music } from "lucide-react";

export default function SpotifyWidget() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-4 left-20 md:bottom-6 md:left-24 z-40 flex items-center gap-3 md:gap-4 bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--card-border)] p-2 md:p-3 pr-4 md:pr-6 rounded-2xl shadow-xl hover:border-[#1DB954]/50 transition-colors cursor-pointer group scale-90 md:scale-100 origin-bottom-left"
      onClick={() => window.open("https://open.spotify.com/track/1P6X7VMBGvHiy9Jm0yW3I5", "_blank")} // Default link, bisa diganti
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Music size={20} className="text-[#1DB954]" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wider">Now Playing</p>
          <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 0.5 }}
                className="w-1 bg-[#1DB954] rounded-t-sm"
              />
            ))}
          </div>
        </div>
        <p className="text-sm font-bold text-[var(--foreground)] truncate max-w-[150px]">Lagu Kesukaan Thomas</p>
        <p className="text-xs text-[var(--muted)] truncate max-w-[150px]">Spotify Vibes</p>
      </div>
    </motion.div>
  );
}

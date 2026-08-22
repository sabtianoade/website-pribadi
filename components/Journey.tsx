"use client";

import { motion } from "motion/react";
import { journeyItems } from "@/data/journey";
import { useRef } from "react";

export default function Journey() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="journey"
      className="py-24 relative overflow-hidden bg-[#87CEEB]" // Sky blue background
    >
      {/* Cloud Decorations */}
      <motion.div animate={{ x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-10 left-10 text-6xl opacity-70">☁️</motion.div>
      <motion.div animate={{ x: [0, -100, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute top-20 right-20 text-8xl opacity-50">☁️</motion.div>
      <motion.div animate={{ x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-40 left-1/2 text-5xl opacity-60">☁️</motion.div>

      <div className="px-6 md:px-10 mb-10 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3 text-white drop-shadow-md">
            Peta Perjalanan <span className="text-yellow-300">Quest</span>
          </h2>
          <p className="text-white/90 text-base max-w-md drop-shadow-sm font-medium">
            Geser (scroll) ke kanan untuk melihat area yang telah kutaklukkan sejauh ini.
          </p>
        </motion.div>
      </div>

      {/* RPG MAP CONTAINER */}
      <div className="relative w-full h-[500px] mt-10">
        
        {/* Grass Background */}
        <div className="absolute inset-0 bg-[#7CFC00] border-t-8 border-[#556B2F]" />
        
        {/* Scrollable Map Area */}
        <div 
          ref={scrollRef}
          className="absolute inset-0 overflow-x-auto overflow-y-hidden flex items-center px-20 pb-10 hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* Dirt Path (Horizontal line) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-16 bg-[#D2B48C] border-y-4 border-[#8B4513] w-[300vw] z-0" />

          {/* Map Nodes */}
          <div className="relative flex gap-32 md:gap-64 z-10 items-center">
            
            {/* Start point */}
            <div className="flex flex-col items-center justify-center shrink-0 w-32">
              <div className="text-6xl mb-2 animate-bounce">🏠</div>
              <div className="bg-white px-3 py-1 rounded-md font-bold text-sm border-2 border-black">Start</div>
            </div>

            {journeyItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollRef, margin: "0px -100px", once: true }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="relative flex flex-col items-center shrink-0 w-64 snap-center"
              >
                {/* Signpost or Building depending on index */}
                <div className="text-6xl mb-4 drop-shadow-lg z-10 relative">
                  {i % 3 === 0 ? "🏰" : i % 3 === 1 ? "⛺" : "🗿"}
                  
                  {/* Floating Pixel Hero (Only on the most recent/highlighted item) */}
                  {item.highlight && (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl"
                    >
                      🦍
                    </motion.div>
                  )}
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-xl p-4 shadow-[4px_4px_0_rgba(0,0,0,0.2)] border-2 border-[#8B4513] relative w-full text-center group hover:-translate-y-2 transition-transform cursor-pointer">
                  {/* Pin */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                  
                  <div className="text-xs font-black text-white bg-[#8B4513] inline-block px-3 py-1 rounded-full mb-2">
                    Level {item.year}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{item.titleId}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 group-hover:line-clamp-none transition-all">{item.descriptionId}</p>
                </div>
              </motion.div>
            ))}

            {/* End point (Future) */}
            <div className="flex flex-col items-center justify-center shrink-0 w-32 mr-20">
              <div className="text-6xl mb-2 opacity-50">❓</div>
              <div className="bg-white px-3 py-1 rounded-md font-bold text-sm border-2 border-gray-400 text-gray-400">TBA</div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}

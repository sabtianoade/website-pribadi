"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

const games = [
  {
    id: "flappy",
    href: "/game/flappy",
    title: "Flappy Bird",
    subtitle: "Terbang dan hindari pipa",
    tag: "REFLEX",
    controls: "SPASI / Klik",
    desc: "Klik atau tekan spasi untuk terbang, jangan sampai menabrak pipa.",
    char: "〉",
  },
  {
    id: "snake",
    href: "/game/snake",
    title: "Snake",
    subtitle: "Makan dan jangan gigit diri sendiri",
    tag: "CLASSIC",
    controls: "WASD / Arrow",
    desc: "Kendalikan ular, makan titik putih, hindari tabrak diri sendiri.",
    char: "〜",
  },
  {
    id: "memory",
    href: "/game/memory",
    title: "Memory Card",
    subtitle: "Balik kartu, cari pasangan",
    tag: "BRAIN",
    controls: "Klik",
    desc: "Ingat posisi kartu dan temukan semua pasangannya dengan moves sesedikit mungkin.",
    char: "◆",
  },
  {
    id: "tetris",
    href: "/game/tetris",
    title: "Tetris",
    subtitle: "Susun balok sampai penuh",
    tag: "PUZZLE",
    controls: "← → ↑ ↓ / SPASI",
    desc: "Susun balok jatuh agar membentuk baris penuh dan hilang. Jangan sampai penuh!",
    char: "▦",
  },
  {
    id: "pong",
    href: "/game/pong",
    title: "Pong",
    subtitle: "Ping pong lawan AI",
    tag: "VS AI",
    controls: "W/S / ↑/↓",
    desc: "Kendalikan paddle kiri, pantulkan bola, dan kalahkan AI — pertama ke 5 poin menang.",
    char: "◉",
  },
];

export default function GameMenuPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back */}
      <div className="relative z-10 w-full max-w-xl mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}
        >
          <ArrowLeft size={15} />
          kembali ke web
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-12"
      >
        <p style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", marginBottom: 12 }}>
          ARCADE.EXE
        </p>
        <h1 className="text-5xl font-black text-white mb-3">Pilih Game</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: 13 }}>
          Gabut? Sini main dulu
        </p>
      </motion.div>

      {/* Game cards */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <Link href={game.href} className="block group">
              <div
                className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {/* Hover fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                />

                {/* Big decorative char */}
                <div
                  className="absolute right-6 top-1/2 -translate-y-1/2 select-none"
                  style={{
                    fontSize: 80,
                    color: "rgba(255,255,255,0.04)",
                    fontFamily: "monospace",
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {game.char}
                </div>

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Tag */}
                    <span
                      className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
                      style={{
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "monospace",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {game.tag}
                    </span>
                    <h2 className="text-xl font-bold text-white mb-1">{game.title}</h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "monospace", marginBottom: 10 }}>
                      {game.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace" }}>KONTROL:</span>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "monospace" }}>{game.controls}</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:bg-white group-hover:border-white mt-1"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <ArrowLeft
                      size={16}
                      className="rotate-180 transition-colors duration-300 group-hover:text-black"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <p
        className="relative z-10 mt-10"
        style={{ color: "rgba(255,255,255,0.1)", fontFamily: "monospace", fontSize: 11 }}
      >
        more games coming soon... 🕹
      </p>
    </main>
  );
}

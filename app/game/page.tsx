"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const games = [
  {
    id: "flappy",
    href: "/game/flappy",
    title: "Flappy Bird",
    tag: "REFLEX",
    controls: "SPASI / Klik",
    desc: "Terbang dan hindari pipa. Jangan sampai menabrak!",
    char: "〉",
  },
  {
    id: "snake",
    href: "/game/snake",
    title: "Snake",
    tag: "CLASSIC",
    controls: "WASD / Arrow",
    desc: "Kendalikan ular, makan titik putih, hindari tabrak diri sendiri.",
    char: "〜",
  },
  {
    id: "memory",
    href: "/game/memory",
    title: "Memory Card",
    tag: "BRAIN",
    controls: "Klik",
    desc: "Ingat posisi kartu dan temukan semua pasangannya.",
    char: "◆",
  },
  {
    id: "tetris",
    href: "/game/tetris",
    title: "Tetris",
    tag: "PUZZLE",
    controls: "← → ↑ ↓ / SPASI",
    desc: "Susun balok jatuh agar baris terpenuhi. Jangan sampai penuh!",
    char: "▦",
  },
  {
    id: "pong",
    href: "/game/pong",
    title: "Pong",
    tag: "VS AI",
    controls: "W/S / ↑/↓",
    desc: "Ping pong lawan AI. Pertama ke 5 poin menang.",
    char: "◉",
  },
  {
    id: "whack",
    href: "/game/whack",
    title: "Whack-A-Gorilla",
    tag: "ACTION",
    controls: "Klik / Tap",
    desc: "Gorila muncul dari lubang secara acak. Pukul secepatnya!",
    char: "🦍",
  },
  {
    id: "dino",
    href: "/game/dino",
    title: "Dino Run",
    tag: "ARCADE",
    controls: "Spasi / Tap",
    desc: "Lompati gorila yang datang dari kanan. Bertahan selama mungkin!",
    char: "🦖",
  },
  {
    id: "space",
    href: "/game/space",
    title: "Space Shooter",
    tag: "SHOOTER",
    controls: "Mouse / Drag",
    desc: "Tembak jatuh pesawat musuh dan kumpulkan bintang untuk poin.",
    char: "🚀",
  },
];

// Loading screen overlay
function LoadingScreen({ title, onDone }: { title: string; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const doneRef = useRef(false);

  useEffect(() => {
    let cur = 0;
    const ramp = () => {
      if (doneRef.current) return;
      // Faster at start, slower near 90, then jumps to 100
      const remaining = 100 - cur;
      const step = cur < 70 ? 3 + Math.random() * 4 : cur < 90 ? 1 + Math.random() * 2 : 0.4;
      cur = Math.min(cur + step, 98);
      setProgress(Math.floor(cur));
      if (cur < 98) {
        setTimeout(ramp, 40 + Math.random() * 30);
      } else {
        setTimeout(() => {
          setProgress(100);
          setPhase("ready");
          setTimeout(() => { doneRef.current = true; onDone(); }, 600);
        }, 300);
      }
    };
    setTimeout(ramp, 80);
  }, [onDone]);

  const msgs = [
    "Memuat asset...",
    "Inisialisasi engine...",
    "Menyiapkan physics...",
    "Hampir siap...",
    "SIAP MAIN!",
  ];
  const msgIndex = progress < 30 ? 0 : progress < 55 ? 1 : progress < 75 ? 2 : progress < 99 ? 3 : 4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "#050505" }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 w-full max-w-sm px-8 flex flex-col items-center gap-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p style={{ color: "rgba(255,255,255,0.25)", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", marginBottom: 8 }}>
            MEMUAT
          </p>
          <h2 style={{ color: "white", fontFamily: "monospace", fontSize: 26, fontWeight: 700 }}>
            {title}
          </h2>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full flex flex-col gap-3">
          <div
            style={{
              width: "100%", height: 4, background: "rgba(255,255,255,0.08)",
              borderRadius: 99, overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%", background: "white",
                borderRadius: 99,
                boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: 11 }}>
              {msgs[msgIndex]}
            </span>
            <span style={{ color: phase === "ready" ? "white" : "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 13, fontWeight: 700, transition: "color 0.3s" }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Blinking cursor at end */}
        {phase === "ready" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 13 }}
          >
            ▶ MASUK...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function GameMenuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<{ title: string; href: string } | null>(null);

  const handleGameClick = (e: React.MouseEvent, game: typeof games[0]) => {
    e.preventDefault();
    setLoading({ title: game.title, href: game.href });
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            title={loading.title}
            onDone={() => router.push(loading.href)}
          />
        )}
      </AnimatePresence>

      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
        style={{ background: "#050505" }}
      >
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating corner decorations */}
        <div className="absolute top-8 right-8 pointer-events-none select-none" aria-hidden="true"
          style={{ color: "rgba(255,255,255,0.04)", fontFamily: "monospace", fontSize: 64, lineHeight: 1 }}>
          ◈
        </div>
        <div className="absolute bottom-8 left-8 pointer-events-none select-none" aria-hidden="true"
          style={{ color: "rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: 48, lineHeight: 1 }}>
          ⬡
        </div>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-xl mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
            <ArrowLeft size={15} /> kembali ke web
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center mb-10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", marginBottom: 12 }}
          >
            ARCADE.EXE
          </motion.p>
          <h1 className="text-5xl font-black text-white mb-3">Pilih Game</h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 13 }}>
            Gabut? Sini main dulu —{" "}
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{games.length} games</span>
          </p>
        </motion.div>

        {/* Game cards */}
        <div className="relative z-10 w-full max-w-xl flex flex-col gap-3">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href={game.href}
                onClick={(e) => handleGameClick(e, game)}
                className="block group cursor-pointer"
              >
                <div
                  className="relative overflow-hidden rounded-2xl p-5"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  {/* Shimmer on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
                      transition: "opacity 0.4s",
                    }}
                  />

                  {/* Big char */}
                  <div
                    className="absolute right-5 top-1/2 -translate-y-1/2 select-none group-hover:scale-110 transition-transform duration-500"
                    style={{ fontSize: 72, color: "rgba(255,255,255,0.05)", fontFamily: "monospace", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {game.char}
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 99,
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.12em",
                          }}
                        >
                          {game.tag}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10, fontFamily: "monospace" }}>
                          {game.controls}
                        </span>
                      </div>
                      <h2 style={{ color: "white", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>{game.title}</h2>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "monospace", lineHeight: 1.5 }}>{game.desc}</p>
                    </div>

                    {/* Play button */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border group-hover:bg-white group-hover:border-white transition-all duration-300"
                      style={{ borderColor: "rgba(255,255,255,0.2)" }}
                    >
                      <div
                        style={{
                          width: 0, height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: "8px solid rgba(255,255,255,0.6)",
                          marginLeft: 2,
                          transition: "border-left-color 0.3s",
                        }}
                        className="group-hover:[border-left-color:#050505]"
                      />
                    </div>
                  </div>

                  {/* Bottom progress-like decoration */}
                  <div className="relative z-10 mt-3 flex gap-1">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div
                        key={j}
                        style={{
                          height: 2, flex: 1, borderRadius: 99,
                          background: j <= i ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 mt-8"
          style={{ color: "rgba(255,255,255,0.1)", fontFamily: "monospace", fontSize: 11 }}
        >
          more games coming soon... 🕹
        </motion.p>
      </main>
    </>
  );
}

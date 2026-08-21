"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Instagram, MapPin, GraduationCap } from "lucide-react";
import { WhatsAppIcon, TikTokIcon } from "@/components/Icons";
import MagneticButton from "@/components/MagneticButton";
import TypewriterText from "@/components/TypewriterText";

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const { scrollY } = useScroll();

  // 3D Tilt Effect for Profile Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), { damping: 30, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Staggered text animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, type: "spring" as const, bounce: 0.4 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden perspective-1000"
      style={{ background: "var(--background)" }}
    >
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 15, -15, 0],
            opacity: [0.25, 0.35, 0.25]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "var(--primary)", transform: "translate(-30%, -30%)" }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -20, 20, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "var(--secondary)", transform: "translate(20%, 20%)" }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16 px-6 md:px-10 py-28 lg:py-0 max-w-[1300px] mx-auto"
      >
        {/* ── LEFT: Text Content ── */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          {/* Typing Effect Label */}
          <div className="flex items-center justify-center lg:justify-start">
            <motion.p
              initial={{ width: 0 }}
              animate={{ width: "fit-content" }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="text-sm font-semibold uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden border-r-2 border-[var(--primary)] pr-1"
              style={{ color: "var(--muted)", animation: "blink 1s step-end infinite" }}
            >
              Halo, nama saya
            </motion.p>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes blink {
                0%, 100% { border-color: transparent; }
                50% { border-color: var(--primary); }
              }
            `}} />
          </div>
          {/* Name with staggered letters */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="text-6xl md:text-7xl lg:text-[100px] font-black leading-none tracking-tight flex justify-center lg:justify-start"
          >
            {Array.from("Thomas").map((letter, index) => (
              <motion.span key={index} variants={item} className="inline-block hover:text-[var(--primary)] transition-colors duration-300">
                {letter}
              </motion.span>
            ))}
          </motion.h1>



          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center gap-4 justify-center lg:justify-start mt-2"
          >
            {[
              { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/6289677718775", hoverColor: "hover:text-[#25D366] hover:border-[#25D366]" },
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sabtianooo?igsh=azFoZzlseG5mMGJs&utm_source=qr", hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]" },
              { icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@sabtianooo?_r=1&_t=ZS-992uJK9aW7p", hoverColor: "hover:text-[#00f2fe] hover:border-[#00f2fe]" },
            ].map(({ icon: Icon, label, href, hoverColor }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 ${hoverColor}`}
              >
                <Icon className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            ))}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="text-base leading-relaxed max-w-md mx-auto lg:mx-0 mt-2"
            style={{ color: "var(--muted)", minHeight: "5rem" }}
          >
            <TypewriterText
              text="Hai, kamu! Makasih ya udah mampir ke sudut kecil gw ini — entah kamu orang asing, temen gw, atau teman deket gw. Intinya terima kasih banyak udah mampir ke keseharian dan kesukaan gw yang gw taruh di sini. Have fun ya 🙏"
              delay={1100}
              speed={22}
            />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2"
          >
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 12px 30px var(--glow)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll("about")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  boxShadow: "0 8px 20px var(--glow)",
                }}
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Kenalan Yuk <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↗</motion.span>
              </motion.button>
            </MagneticButton>
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "var(--primary-light)", color: "var(--primary)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll("hobbies")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-colors"
                style={{
                  background: "transparent",
                  border: "2px solid var(--card-border)",
                  color: "var(--foreground)",
                }}
              >
                Jelajahi Duniaku
              </motion.button>
            </MagneticButton>
          </motion.div>

          {/* Spotify Player */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="w-full max-w-2xl mx-auto lg:mx-0 mt-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Lagu Favoritku</p>
                {mounted && (
                  <iframe 
                    style={{ borderRadius: "12px", border: "none" }} 
                    src={`https://open.spotify.com/embed/track/3CBxVM0zGj41BQtE6m7gwb?utm_source=generator${resolvedTheme === "dark" ? "&theme=0" : ""}`} 
                    width="100%" 
                    height="152" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>tiano playlist</p>
                {mounted && (
                  <iframe 
                    style={{ borderRadius: "12px", border: "none" }} 
                    src={`https://open.spotify.com/embed/playlist/7LwClcFdlAr7BUz5Mp1wBS?utm_source=generator${resolvedTheme === "dark" ? "&theme=0" : ""}`} 
                    width="100%" 
                    height="152" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Profile Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.4 }}
          className="flex-shrink-0 w-full lg:w-auto flex justify-center perspective-[1000px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-72 md:w-[340px] rounded-3xl overflow-visible"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-[var(--primary)] blur-[60px] opacity-20 translate-y-4 rounded-full -z-10" />
            
            <div
              className="w-full h-full rounded-3xl overflow-hidden relative"
              style={{
                border: "1px solid var(--card-border)",
                background: "var(--card)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
              }}
            >
              {/* Photo */}
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src="/upd-foto1.jpeg"
                  alt="Foto profil Thomas"
                  fill
                  quality={100}
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                {/* Name overlay */}
                <motion.div 
                  className="absolute bottom-5 left-5"
                  style={{ transform: "translateZ(30px)" }} // 3D pop out
                >
                  <p className="text-white font-black text-3xl mb-1 tracking-tight">Thomas</p>
                </motion.div>
              </div>

              {/* Info bar at bottom */}
              <div
                className="flex items-center justify-between px-5 py-4 gap-3 bg-[var(--card)]"
                style={{ borderTop: "1px solid var(--card-border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[var(--primary-light)]">
                    <Image
                      src="/foto-thomas2.png"
                      alt="Avatar Thomas"
                      width={40}
                      height={40}
                      quality={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>
                      @thomas
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--glow)]"
                        style={{ background: "var(--foreground)" }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "var(--primary)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open("https://wa.me/6289677718775", "_blank")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 shadow-lg shadow-[var(--primary)]/20 transition-colors"
                  style={{ background: "var(--secondary)" }}
                >
                  Sapa Aku
                </motion.button>
              </div>

              {/* Quick info tags below card */}
              <div
                className="px-5 pb-5 pt-0 flex flex-col gap-2.5 bg-[var(--card)]"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
                  <MapPin size={14} className="text-[var(--primary)]" aria-hidden="true" />
                  <span>Pasuruan, Indonesia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleScroll("about")}
        aria-hidden="true"
      >
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: "var(--muted)" }}
        >
          <motion.div className="w-1 h-1.5 rounded-full bg-[var(--primary)]" />
        </motion.div>
      </motion.div>
      
      {/* Required for shimmer animation on button */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}

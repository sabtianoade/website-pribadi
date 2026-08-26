"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Coffee, MessageCircleHeart, Music, Play, Pause, Mail, MailOpen, Lock } from "lucide-react";
import Tilt from "react-parallax-tilt";
import confetti from "canvas-confetti";
import { useState, useRef, useEffect } from "react";
import FallingParticles from "@/components/FallingParticles";

const photos = [
  { src: "/momen-netha-1.jpeg", alt: "Netha 1", rotate: -4 },
  { src: "/momen-netha-2.jpeg", alt: "Netha 2", rotate: 2 },
  { src: "", alt: "coming soon", rotate: -2, isComingSoon: true },
];

const drinks = [
  { name: "Matcha Latte", desc: "meski ini 10x kayanya gabakal muak deh", img: "/matcha.jpeg" },
];

const chatScreenshots = [
  { src: "/chat-1.jpeg", alt: "Chat 1" },
  { src: "/chat-2.jpeg", alt: "Chat 2" },
  { src: "/chat-3.jpeg", alt: "Chat 3" },
];

export default function AyangPage() {
  const [isPlaying, setIsPlaying] = useState(false); // Play only after unlock
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [fireworksFired, setFireworksFired] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll animations for video background reveal
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0.75, 1], [0.25, 0.85]);
  const overlayOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  // Attempt to play only when unlocked
  useEffect(() => {
    if (isUnlocked && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.log("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    }
  }, [isUnlocked]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFireworks = () => {
    if (fireworksFired) return;
    setFireworksFired(true);

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.main 
            key="locked"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="min-h-[100dvh] bg-[var(--background)] flex items-center justify-center relative overflow-hidden p-4"
          >
            <FallingParticles />
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black w-full h-[100dvh]">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-20">
                <source src="/bg-video.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/80 to-[var(--background)]" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-[var(--card)]/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-[var(--card-border)] shadow-2xl flex flex-col items-center max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-6 shadow-[0_0_30px_rgba(255,20,147,0.3)]">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">Private Space</h2>
              <p className="text-[var(--muted)] text-sm mb-8 font-medium">Masukkan password rahasia untuk masuk.</p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordInput === "17082026") {
                    setIsUnlocked(true);
                    setIsPlaying(true);
                  } else {
                    setIsError(true);
                    setTimeout(() => setIsError(false), 1000);
                  }
                }}
                className="w-full flex flex-col gap-4"
              >
                <input 
                  type="password"
                  placeholder="Password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-black/30 border ${isError ? 'border-red-500' : 'border-[var(--card-border)]'} focus:border-[var(--primary)] rounded-xl px-4 py-4 text-center text-[var(--foreground)] tracking-[0.5em] font-mono outline-none transition-all duration-300`}
                />
                {isError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-medium">
                    Password salah! Coba lagi wkwk.
                  </motion.p>
                )}
                <button 
                  type="submit"
                  className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Unlock
                </button>
              </form>
            </motion.div>
          </motion.main>
        ) : (
          <motion.main 
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans pb-24 relative transition-colors duration-300"
          >
            
            {/* Falling Particles Effect */}
            <FallingParticles />

      {/* Background Enhancements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black w-full h-[100dvh]">
        {/* Video Background */}
        <motion.video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ opacity: videoOpacity }}
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </motion.video>
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[10%] left-[-20%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Gradient Overlay for seamless blending */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/80 to-[var(--background)]" 
        />
      </div>

      {/* Navigation */}
      <nav className="p-6 relative z-10 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </Link>
        <Heart className="text-red-500 animate-pulse" size={24} fill="currentColor" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 md:mb-32 mt-12 md:mt-20 px-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative inline-block w-24 h-24 md:w-32 md:h-32 rounded-full mb-6 mx-auto border-4 border-[var(--primary)] shadow-[0_0_30px_var(--primary-glow)] overflow-hidden"
          >
            <Image 
              src="/profil-netha.jpeg"
              alt="Profil Netha"
              fill
              className="object-cover"
            />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-[var(--foreground)] drop-shadow-md">
            Netha About
          </h1>
          <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            woi tau ga neth , aku bingung mau nambahin apalagi disini , aku tambahin kamu aja . ini tombol rahasiaa buat kamu wkwk.
          </p>
        </motion.section>

        {/* Us Section */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">You & Me</h2>
          </div>
          
          <div className="relative flex justify-center items-center h-[350px] md:h-[550px] mt-10">
            {["/fotbar-1.jpeg", "/fotbar-2.jpeg", "/fotbar-3.jpeg"].map((src, i) => (
              <motion.div
                key={i}
                tabIndex={0}
                initial={{ opacity: 0, scale: 0.8, rotate: 0, x: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: (i - 1) * 10, x: (i - 1) * 50 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: (i - 1) * 15, zIndex: 50, y: -20, x: (i - 1) * 90 }}
                whileFocus={{ scale: 1.05, rotate: (i - 1) * 15, zIndex: 50, y: -20, x: (i - 1) * 90 }}
                whileTap={{ scale: 1.05, rotate: (i - 1) * 15, zIndex: 50, y: -20, x: (i - 1) * 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute bg-[var(--card)] p-2 md:p-4 pb-10 md:pb-16 rounded-xl md:rounded-[1.5rem] shadow-2xl border border-[var(--card-border)] w-[160px] md:w-[320px] origin-bottom cursor-pointer hover:border-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors duration-300"
                style={{ zIndex: i * 10 }}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/20 rounded-xl pointer-events-none">
                  <Image 
                    src={src}
                    alt="Kita Berdua"
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="absolute bottom-3 md:bottom-5 left-0 w-full text-center pointer-events-none">
                  <p className="font-mono text-[var(--muted)] text-sm md:text-lg font-bold">Memori #{i + 1}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">our moment?</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 px-4">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotate: photo.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className="z-10 hover:z-20"
              >
                <Tilt 
                  glareEnable={true} 
                  glareMaxOpacity={0.4} 
                  glareColor="#ff69b4" 
                  glarePosition="all" 
                  scale={1.08} 
                  transitionSpeed={2500}
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                  className="relative bg-[var(--card)] p-3 pb-16 md:p-4 md:pb-20 rounded-[1.5rem] shadow-xl hover:shadow-[0_0_30px_rgba(255,20,147,0.4)] border border-[var(--card-border)] w-[240px] md:w-[280px] transition-all duration-300 group hover:border-[var(--primary)] cursor-pointer"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-black/20 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-[var(--primary)]/30 transition-colors duration-300">
                    {photo.isComingSoon ? (
                      <span className="text-[var(--muted)] font-medium tracking-widest uppercase text-sm">Coming Soon</span>
                    ) : (
                      <Image 
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-4 md:bottom-6 left-0 w-full text-center px-4 pointer-events-none">
                    <p className="font-mono text-[var(--muted)] text-sm md:text-base font-semibold truncate group-hover:text-[var(--primary)] transition-colors">{photo.alt}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Favorite Drinks Section */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Coffee size={24} className="text-[var(--foreground)]" />
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Minuman Favoritnya</h2>
          </div>

          <div className="flex justify-center max-w-2xl mx-auto px-4">
            {drinks.map((drink, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full rounded-[2.5rem] p-[2px] overflow-hidden group shadow-2xl cursor-pointer transition-all duration-500"
              >
                {/* Rotating Gradient Border Background */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_50%,var(--primary)_100%)] animate-[spin_4s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Inner Card */}
                <div className="relative flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8 w-full p-6 md:p-10 rounded-[2.4rem] bg-[var(--card)] overflow-hidden z-10 h-full">
                  {/* Subtle gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0 border-4 border-white/5 group-hover:border-[var(--primary)]/50 shadow-xl group-hover:rotate-12 transition-all duration-700">
                    <Image 
                      src={drink.img}
                      alt={drink.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col items-center md:items-start">
                    <h3 className="font-extrabold text-2xl md:text-4xl text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300 mb-3 tracking-tight drop-shadow-sm">
                      {drink.name}
                    </h3>
                    <div className="border-l-2 md:border-l-2 border-t-2 md:border-t-0 border-[var(--primary)]/50 pt-3 md:pt-0 pl-0 md:pl-4 md:py-1 mt-2 md:mt-0">
                      <p className="text-[var(--muted)] text-sm md:text-lg leading-relaxed italic group-hover:text-[var(--foreground)] transition-colors">
                        "{drink.desc}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Favorite Song Section */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Music size={24} className="text-[var(--foreground)]" />
            <h2 className="text-2xl font-bold text-[var(--foreground)]">her fav song</h2>
          </div>

          <div className="flex justify-center max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full rounded-[2.5rem] p-[2px] overflow-hidden group shadow-2xl transition-all duration-500"
            >
              {/* Rotating Gradient Border Background */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_50%,var(--primary)_100%)] animate-[spin_4s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Inner Card */}
              <div className="relative w-full h-full bg-[var(--card)] p-4 md:p-8 rounded-[2.4rem] overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 w-full flex justify-center">
                  <iframe 
                    style={{ borderRadius: "12px" }} 
                    src="https://open.spotify.com/embed/track/2XLfz8AHIhFH5tTfhx1lWR?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="max-w-[500px]"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Secret Message Section */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Mail size={24} className="text-[var(--foreground)]" />
            <h2 className="text-2xl font-bold text-[var(--foreground)]">pesan rahasia</h2>
          </div>

          <div className="flex justify-center max-w-2xl mx-auto px-4">
            <motion.div
              layout
              onClick={() => setIsEnvelopeOpen(!isEnvelopeOpen)}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative w-full rounded-[2.5rem] p-[2px] overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 group ${isEnvelopeOpen ? 'border-none' : 'border border-[var(--card-border)] hover:border-[var(--primary)]'}`}
            >
              {isEnvelopeOpen && (
                 <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_50%,var(--primary)_100%)] animate-[spin_4s_linear_infinite] opacity-40" />
              )}
              
              <motion.div 
                layout
                className="relative z-10 w-full h-full bg-[var(--card)] p-8 md:p-12 rounded-[2.4rem] overflow-hidden flex flex-col items-center justify-center text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-50" />
                
                <AnimatePresence mode="wait">
                  {!isEnvelopeOpen ? (
                    <motion.div
                      key="closed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
                        <Mail size={32} />
                      </div>
                      <p className="text-[var(--foreground)] font-bold text-lg">Ada satu pesan lagi nih...</p>
                      <p className="text-[var(--muted)] text-sm animate-pulse">(Tap untuk buka)</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="opened"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-2">
                        <MailOpen size={24} />
                      </div>
                      <p className="text-[var(--foreground)] text-lg md:text-xl font-medium leading-relaxed italic font-serif">
                        "neth thankyou ya , meski aku belom kenal kamu lebih jauh tapi kamu berhasil bikin aku ketawa lepas meski kita belom sejauh itu, itu udah nfjsjufcbjs banget wkwkwk. <br/><br/> moga kita bisa kenal lebih jauh ? ya? , kita gini terus . nice to meet u hehehe. kamu cantik, kamu pantes dapet cowo yang bener bener cakep dan baik buat kamu. kamu mau siapapun asal dia baikk dan ngusahin kamu , aku bakal support kamuu neth"
                      </p>
                      <p className="text-[var(--muted)] mt-4 text-sm font-semibold tracking-widest uppercase">
                        - Thomas
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16 flex flex-col items-center gap-8"
        >
          <p className="text-[var(--muted)] text-sm font-medium tracking-wider uppercase opacity-50">
            made with heart ni neth wkwk ❤️
          </p>
          
          {/* Secret Mirrored Text */}
          <div className="text-center mt-2 flex justify-center items-center">
            <p 
              className="text-[var(--muted)]/20 text-[10px] md:text-xs scale-x-[-1] inline-block select-all cursor-help hover:text-[var(--primary)]/50 transition-colors"
              title="Coba baca di depan cermin :)"
            >
              aku bener-bener beruntung bisa kenal kamu, neth. you're special.
            </p>
          </div>
        </motion.div>

        {/* Empty Space for Cinematic Video Reveal */}
        <div className="h-[75vh] flex items-end justify-center pb-12 pointer-events-none">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onViewportEnter={() => handleFireworks()}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-white/40 text-xs md:text-sm font-mono tracking-[0.3em] uppercase drop-shadow-md"
          >
            Memories in Motion
          </motion.p>
        </div>

      </div>
      
      {/* Background Audio */}
      <audio ref={audioRef} src="/backsound.mp3" loop />
      
      {/* Floating Music Control */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-[var(--card)] border border-[var(--card-border)] shadow-2xl hover:border-[var(--primary)] transition-all flex items-center justify-center group"
      >
        <div className="absolute inset-0 rounded-full bg-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isPlaying ? (
          <Pause size={24} className="text-[var(--primary)]" />
        ) : (
          <Play size={24} className="text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors ml-1" />
        )}
      </motion.button>
    </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

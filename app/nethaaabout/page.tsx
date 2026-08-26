"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Coffee, MessageCircleHeart, Music, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [isPlaying, setIsPlaying] = useState(true); // Default to true for autoplay
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll animations for video background reveal
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0.75, 1], [0.25, 0.85]);
  const overlayOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  // Attempt to play on mount since navigation is usually triggered by a user click
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => {
        // Autoplay was prevented by browser
        console.log("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    }
  }, []);

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

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans pb-24 relative transition-colors duration-300">
      
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
                initial={{ opacity: 0, scale: 0.8, rotate: 0, x: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: (i - 1) * 10, x: (i - 1) * 50 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: (i - 1) * 15, zIndex: 50, y: -20, x: (i - 1) * 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute bg-[var(--card)] p-2 md:p-4 pb-10 md:pb-16 rounded-xl md:rounded-[1.5rem] shadow-2xl border border-[var(--card-border)] w-[160px] md:w-[320px] origin-bottom cursor-pointer hover:border-[var(--primary)] transition-colors duration-300"
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
                whileHover={{ scale: 1.08, rotate: 0, zIndex: 20, y: -10 }}
                className="relative bg-[var(--card)] p-3 pb-16 md:p-4 md:pb-20 rounded-[1.5rem] shadow-xl hover:shadow-2xl border border-[var(--card-border)] w-[240px] md:w-[280px] transition-all duration-300 group hover:border-[var(--primary)]"
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
                <div className="absolute bottom-4 md:bottom-6 left-0 w-full text-center px-4">
                  <p className="font-mono text-[var(--muted)] text-sm md:text-base font-semibold truncate group-hover:text-[var(--primary)] transition-colors">{photo.alt}</p>
                </div>
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
                className="relative flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8 w-full p-6 md:p-10 rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden group shadow-2xl cursor-pointer hover:border-[var(--primary)] transition-colors duration-500 bg-[var(--card)]"
              >
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0 border-4 border-white/5 group-hover:border-[var(--primary)]/30 shadow-xl group-hover:rotate-12 transition-all duration-700">
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
                  <div className="border-l-2 md:border-l-2 border-t-2 md:border-t-0 border-[var(--primary)]/30 pt-3 md:pt-0 pl-0 md:pl-4 md:py-1 mt-2 md:mt-0">
                    <p className="text-[var(--muted)] text-sm md:text-lg leading-relaxed italic">
                      "{drink.desc}"
                    </p>
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
              className="relative w-full p-4 md:p-8 rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden shadow-2xl bg-[var(--card)] hover:border-[var(--primary)] transition-colors duration-500"
            >
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
        </motion.div>

        {/* Empty Space for Cinematic Video Reveal */}
        <div className="h-[75vh] flex items-end justify-center pb-12 pointer-events-none">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-white/40 text-xs md:text-sm font-mono tracking-[0.3em] uppercase drop-shadow-md"
          >
            Memories in Motion
          </motion.p>
        </div>

      </div>
      
      {/* Background Audio */}
      <audio ref={audioRef} src="/backsound.mp3" loop autoPlay />
      
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
    </main>
  );
}

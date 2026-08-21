"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "./PageTransitionProvider";
import ThemeToggle from "./ThemeToggle";

const mainLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
];

const otherLinks = [
  { label: "Hobi", href: "#hobbies" },
  { label: "Favorit", href: "/favorites" },
  { label: "Keahlian", href: "#skills" },
  { label: "Galeri", href: "/gallery" },
  { label: "Tujuan", href: "#goals" },
  { label: "Fakta", href: "#facts" },
  { label: "🕹 Mini Game", href: "/game" },
];

const allLinks = [...mainLinks, ...otherLinks];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = allLinks.map((l) => l.href.replace("#", ""));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const { navigate } = useTransition();

  const getIsActive = (href: string) => {
    if (href.startsWith("/")) return pathname === href;
    if (pathname === "/") return activeSection === href.replace("#", "");
    return false;
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    // If it's a completely different page
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    
    // If it's a hash link but we are not on the home page
    if (pathname !== "/") {
      navigate("/" + href);
      return;
    }

    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "var(--navbar-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled ? "var(--scrolled-shadow)" : "none",
          borderBottom: scrolled ? "1px solid var(--card-border)" : "none",
        }}
      >
        {/* Scroll Progress Bar - Now at the bottom to act as a separator/road */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left z-50"
          style={{ scaleX, background: "var(--foreground)" }}
        />
        <nav
          className="flex items-center justify-between h-16 px-6 md:px-10"
          style={{ maxWidth: 1300, margin: "0 auto" }}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            aria-label="Ke beranda"
            className="text-xl font-black tracking-tight transition-opacity hover:opacity-70"
            style={{ color: "var(--primary)" }}
          >
            thomas<span style={{ color: "var(--accent)" }}>.</span>
          </button>

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Desktop main links */}
            <ul className="hidden lg:flex items-center gap-6">
              {mainLinks.map((link) => {
                const isActive = getIsActive(link.href);
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-sm font-medium transition-colors relative group py-2"
                      style={{
                        color: isActive ? "var(--primary)" : "var(--muted)",
                      }}
                    >
                      <span className="group-hover:text-[var(--foreground)] transition-colors">
                        {link.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: "var(--primary)" }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Divider (Desktop only) */}
            <div className="hidden lg:block w-px h-4" style={{ background: "var(--card-border)" }} />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Hamburger Menu Button - Always visible to show 'other links' or 'all links' on mobile */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Buka menu navigasi"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: "var(--foreground)" }}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] z-[70] shadow-2xl flex flex-col"
              style={{ background: "var(--card)", borderLeft: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
                <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: "var(--muted)" }}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2 mt-2 px-3 lg:hidden" style={{ color: "var(--muted)" }}>
                  Utama
                </p>
                {allLinks.map((link, i) => {
                  const isFirstOther = i === mainLinks.length;
                  const isActive = getIsActive(link.href);
                  // Hide main links on desktop inside sidebar to avoid redundancy, but show them on mobile
                  const isMainLink = mainLinks.some(l => l.href === link.href);
                  
                  return (
                    <div key={link.href} className={isMainLink ? "lg:hidden" : ""}>
                      {isFirstOther && (
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-2 mt-4 px-3" style={{ color: "var(--muted)" }}>
                          Lainnya
                        </p>
                      )}
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          color: isActive ? "var(--primary)" : "var(--foreground)",
                          background: isActive ? "var(--primary-light)" : "transparent",
                        }}
                      >
                        <span>{link.label}</span>
                        {link.href.startsWith("/") && (
                          <ChevronRight size={16} opacity={0.5} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

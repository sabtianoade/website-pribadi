"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";

export default function SplineViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Custom elements are defined by the spline-viewer script
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden border border-[var(--card-border)]/50 shadow-2xl bg-black/5 group">
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.27/build/spline-viewer.js" 
        strategy="lazyOnload"
      />
      
      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] text-white/80 font-mono tracking-widest uppercase">Geser untuk memutar 3D</span>
      </div>
      
      {/* Fallback loading indicator while Spline is loading */}
      <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center -z-10 bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        <span className="text-xs text-[var(--muted)] font-mono animate-pulse">Memuat Objek 3D...</span>
      </div>

      {/* @ts-ignore - spline-viewer is a custom element */}
      <spline-viewer 
        url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
      ></spline-viewer>
    </div>
  );
}

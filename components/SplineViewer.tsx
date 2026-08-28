"use client";
import { Suspense, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SplineViewer() {
  const [isMounted, setIsMounted] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import("@splinetool/react-spline").then((mod) => {
      setSplineComponent(() => mod.default);
    });
  }, []);

  if (!isMounted || !SplineComponent) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col gap-4 items-center justify-center bg-black/5 rounded-[2rem] border border-[var(--card-border)]/50">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        <span className="text-xs text-[var(--muted)] font-mono animate-pulse">Memuat Objek 3D...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden border border-[var(--card-border)]/50 shadow-2xl bg-black/5 group">
      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-white/80 font-mono tracking-widest uppercase">Geser untuk memutar 3D</span>
      </div>
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      }>
        <SplineComponent scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </Suspense>
    </div>
  );
}

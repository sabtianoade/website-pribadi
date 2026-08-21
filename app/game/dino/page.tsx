import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DinoRun from "@/components/DinoRun";

export default function DinoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#050505" }}>
      <div className="mb-6 flex items-center justify-between w-full max-w-3xl mx-auto">
        <Link href="/game" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
          <ArrowLeft size={16} /> pilih game
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>DINORUN.EXE</span>
      </div>
      
      <div className="w-full max-w-3xl mx-auto">
        <DinoRun />
      </div>
    </main>
  );
}

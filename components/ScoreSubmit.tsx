"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Send } from "lucide-react";

export default function ScoreSubmit({ game, score, onSubmitted }: { game: string, score: number, onSubmitted: () => void }) {
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || score <= 0) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leaderboards").insert([
        {
          game,
          player_name: playerName.trim(),
          score: Math.floor(score)
        }
      ]);
      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 1500);
    } catch (err) {
      console.error("Error submitting score:", err);
      alert("Gagal mengirim skor");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-4 bg-green-500/20 text-green-500 font-bold rounded-xl animate-in zoom-in w-full max-w-sm mx-auto mt-4">
        Skor Berhasil Disimpan!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 w-full max-w-sm mx-auto bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-md">
      <p className="text-sm text-white/70 font-semibold mb-1 text-center">Skor Baru: <span className="text-[var(--primary)] font-black text-lg">{Math.floor(score)}</span></p>
      <input
        type="text"
        placeholder="Masukkan Namamu"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        maxLength={15}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white outline-none border border-white/20 focus:border-[var(--primary)] transition-colors text-center font-bold"
      />
      <button
        type="submit"
        disabled={submitting || !playerName.trim()}
        className="w-full px-4 py-3 rounded-lg bg-[var(--primary)] text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send size={18} /> Kirim Skor</>}
      </button>
    </form>
  );
}

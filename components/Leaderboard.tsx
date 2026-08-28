"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Loader2 } from "lucide-react";
import { motion } from "motion/react";

type LeaderboardEntry = {
  id: string;
  player_name: string;
  score: number;
  game: string;
  created_at: string;
};

export default function Leaderboard({ game = "all", limit = 10 }: { game?: string, limit?: number }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    let query = supabase.from("leaderboards").select("*").order("score", { ascending: false }).limit(limit);
    if (game !== "all") {
      query = query.eq("game", game);
    }
    const { data, error } = await query;
    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [game, limit]);

  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Trophy className="text-[var(--primary)]" size={24} />
          Papan Peringkat
        </h3>
        {game !== "all" && (
          <span className="text-xs font-semibold px-2 py-1 bg-[var(--muted-bg)] text-[var(--muted)] rounded-md uppercase tracking-wider">
            {game}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 text-[var(--muted)] flex flex-col items-center">
          <Trophy className="opacity-20 mb-2" size={32} />
          <p className="text-sm">Belum ada skor yang tercatat.<br/>Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 relative z-10">
          {entries.map((entry, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={entry.id} 
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                  ${index === 0 ? 'bg-yellow-400/20 text-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 
                    index === 1 ? 'bg-gray-300/20 text-gray-500' : 
                    index === 2 ? 'bg-amber-600/20 text-amber-700' : 
                    'bg-[var(--muted-bg)] text-[var(--muted)]'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] truncate max-w-[150px]">{entry.player_name}</p>
                  {game === "all" && <p className="text-[10px] text-[var(--muted)] uppercase">{entry.game}</p>}
                </div>
              </div>
              <div className="font-black text-[var(--primary)] text-lg">
                {entry.score.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

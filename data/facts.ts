export interface Fact {
  id: string;
  emoji: string;
  text: string;
  textId: string;
  color: string;
}

export const facts: Fact[] = [
  {
    id: "f1",
    emoji: "🎧",
    text: "I code better with music on.",
    textId: "Kalau nggak ada musik, ngodingku berantakan. Itu bukan bohong.",
    color: "#6C63FF",
  },
  {
    id: "f2",
    emoji: "🌙",
    text: "I'm more productive at night.",
    textId: "Pikiranku paling jernih waktu orang lain udah pada tidur. Aneh tapi nyata.",
    color: "#8B5CF6",
  },
  {
    id: "f3",
    emoji: "🍜",
    text: "I can eat bakso every single day.",
    textId: "Bakso setiap hari? Ya bisa. Bahkan mungkin direkomendasikan secara medis (mungkin).",
    color: "#F97316",
  },
  {
    id: "f4",
    emoji: "💻",
    text: "I genuinely enjoy reading documentation.",
    textId: "Baca dokumentasi itu seru. Siapapun yang bilang nggak mungkin belum ketemu docs yang oke.",
    color: "#06B6D4",
  },
  {
    id: "f5",
    emoji: "🐛",
    text: "Fixing a bug after hours is the best feeling.",
    textId: "Nge-debug berjam-jam terus akhirnya ketemu masalahnya — itu salah satu perasaan terbaik di dunia.",
    color: "#10B981",
  },
  {
    id: "f6",
    emoji: "☕",
    text: "I don't drink coffee. I run on cold drinks.",
    textId: "Nggak minum kopi. Energiku dari es teh, lo-fi beats, dan tekad bulat.",
    color: "#F9C74F",
  },
  {
    id: "f7",
    emoji: "📱",
    text: "I spend too much time exploring random apps.",
    textId: "Sering download aplikasi random cuma buat liat gimana mereka handle UX. Ini riset, bukan iseng.",
    color: "#EC4899",
  },
  {
    id: "f8",
    emoji: "🎮",
    text: "Games teach you problem-solving. That's my excuse.",
    textId: "Game itu ngajarin problem solving. Itu alasanku dan aku akan terus pakai alasan itu.",
    color: "#A78BFA",
  },
];

export interface PersonalityTrait {
  id: string;
  label: string;
  labelId: string;
  emoji: string;
  score: number;
  size: "sm" | "md" | "lg";
  description: string;
  descriptionId: string;
  color: string;
}

export const personalityTraits: PersonalityTrait[] = [
  {
    id: "creative",
    label: "Creative",
    labelId: "Kreatif",
    emoji: "🎨",
    score: 85,
    size: "lg",
    description: "I love thinking outside the box.",
    descriptionId:
      "Aku suka banget mikir dari sudut yang beda. Entah itu waktu desain UI, debug kode dengan cara unik, atau cuma brainstorming ide-ide gila yang belum tentu jalan.",
    color: "#A78BFA",
  },
  {
    id: "curious",
    label: "Curious",
    labelId: "Penasaran",
    emoji: "🔍",
    score: 92,
    size: "lg",
    description: "I'm always asking 'why?' and 'how does that work?'",
    descriptionId:
      "Rasa penasaran itu yang ngegerakin aku terus belajar. Kalau ada hal baru yang menarik, aku nggak bisa nggak ngulik sampe paham.",
    color: "#60A5FA",
  },
  {
    id: "chill",
    label: "Chill",
    labelId: "Santai",
    emoji: "😌",
    score: 78,
    size: "md",
    description: "I don't stress easily.",
    descriptionId:
      "Aku orangnya nggak gampang panik. Kalau ada masalah, lebih suka duduk tenang, pikir jernih, baru cari solusi.",
    color: "#34D399",
  },
  {
    id: "friendly",
    label: "Friendly",
    labelId: "Ramah",
    emoji: "🤝",
    score: 88,
    size: "md",
    description: "I genuinely enjoy meeting people.",
    descriptionId:
      "Aku suka ngobrol sama orang baru. Tiap orang punya cerita dan perspektif yang berbeda, dan itu selalu menarik buat aku.",
    color: "#F472B6",
  },
  {
    id: "tech-enthusiast",
    label: "Tech Enthusiast",
    labelId: "Tech Enthusiast",
    emoji: "⚡",
    score: 95,
    size: "lg",
    description: "Tech is not just a career path for me — it's a genuine passion.",
    descriptionId:
      "Teknologi buat aku bukan cuma soal kerjaan atau pelajaran. Aku beneran excited sama hal-hal baru di dunia tech, dari framework baru sampai gadget terkini.",
    color: "#6C63FF",
  },
  {
    id: "night-owl",
    label: "Night Owl",
    labelId: "Anak Malam",
    emoji: "🌙",
    score: 80,
    size: "md",
    description: "Some of my best ideas come after midnight.",
    descriptionId:
      "Entah kenapa, pikiran aku lebih jernih dan fokus lebih gampang datang waktu malam. Banyak project terbaiku lahir setelah tengah malam.",
    color: "#F9C74F",
  },
  {
    id: "overthinker",
    label: "Overthinker",
    labelId: "Terlalu Mikir",
    emoji: "💭",
    score: 70,
    size: "sm",
    description: "I tend to overthink things.",
    descriptionId:
      "Kadang aku mikirin hal yang harusnya simple jadi complicated. Tapi dari overthinking itu juga sering muncul solusi yang nggak kepikiran sebelumnya.",
    color: "#FB923C",
  },
  {
    id: "perfectionist",
    label: "Perfectionist",
    labelId: "Perfeksionis",
    emoji: "✨",
    score: 75,
    size: "sm",
    description: "Details matter to me.",
    descriptionId:
      "Detail kecil itu penting buat aku. 1px meleset, warna yang sedikit salah, atau animasi yang terlalu cepat — aku pasti ngerasain bedanya.",
    color: "#EC4899",
  },
];

export type SkillCategory = "structure" | "logic" | "vision";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: string;
  maxLevel: string;
  description: string;
  color: string;
  emoji: string;
}

export const skills: Skill[] = [
  // --- PATH OF STRUCTURE (HTML/CSS) ---
  { 
    id: "html", 
    name: "HTML5", 
    category: "structure", 
    level: "99", 
    maxLevel: "99", 
    description: "Fondasi dari segala web. Mengatur elemen dan semantik halaman web tanpa cela.",
    color: "var(--foreground)", 
    emoji: "🧱" 
  },
  { 
    id: "css", 
    name: "CSS3", 
    category: "structure", 
    level: "95", 
    maxLevel: "99", 
    description: "Seni dalam kode. Digunakan untuk membuat web responsif, transisi mulus, dan desain premium.",
    color: "var(--foreground)", 
    emoji: "🎨" 
  },
  { 
    id: "tailwind", 
    name: "Tailwind CSS", 
    category: "structure", 
    level: "90", 
    maxLevel: "99", 
    description: "Senjata andalan untuk styling super cepat berbasis utility. Membuat desain glassmorphism jadi mudah.",
    color: "var(--foreground)", 
    emoji: "🌊" 
  },

  // --- PATH OF LOGIC (JS/React) ---
  { 
    id: "javascript", 
    name: "JavaScript", 
    category: "logic", 
    level: "92", 
    maxLevel: "99", 
    description: "Otak dari semua interaksi. Mengatur state, fetch API, dan logic minigames yang ada di website ini.",
    color: "var(--foreground)", 
    emoji: "⚡" 
  },
  { 
    id: "react", 
    name: "React.js", 
    category: "logic", 
    level: "88", 
    maxLevel: "99", 
    description: "Library UI utama. Komponen modular, state management, dan hooks yang kuat.",
    color: "var(--foreground)", 
    emoji: "⚛️" 
  },
  { 
    id: "nextjs", 
    name: "Next.js", 
    category: "logic", 
    level: "85", 
    maxLevel: "99", 
    description: "Framework impian untuk SSR/SSG. Mempercepat performa web dan routing yang sangat mudah.",
    color: "var(--foreground)", 
    emoji: "▲" 
  },

  // --- PATH OF VISION (UI/UX) ---
  { 
    id: "figma", 
    name: "Figma", 
    category: "vision", 
    level: "80", 
    maxLevel: "99", 
    description: "Kanvas utama sebelum menulis kode. Digunakan untuk wireframing, prototyping, dan eksplorasi desain.",
    color: "var(--foreground)", 
    emoji: "🎯" 
  },
  { 
    id: "uiux", 
    name: "UI/UX Design", 
    category: "vision", 
    level: "75", 
    maxLevel: "99", 
    description: "Pemahaman tentang user journey, hierarki visual, dan prinsip desain untuk membuat aplikasi yang nyaman.",
    color: "var(--foreground)", 
    emoji: "✨" 
  },
  { 
    id: "motion", 
    name: "Framer Motion", 
    category: "vision", 
    level: "70", 
    maxLevel: "99", 
    description: "Library untuk animasi React yang sangat smooth. Membuat transisi halaman dan interaksi jadi terasa hidup.",
    color: "var(--foreground)", 
    emoji: "🎬" 
  },
];

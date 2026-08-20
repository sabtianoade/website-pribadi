export interface JourneyItem {
  id: string;
  year: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  emoji: string;
  highlight?: boolean;
}

export const journeyItems: JourneyItem[] = [
  {
    id: "j1",
    year: "2009",
    title: "The Beginning",
    titleId: "Awal Mula",
    description: "Born and raised in Pasuruan, Indonesia.",
    descriptionId: "Lahir dan besar di Pasuruan, Indonesia. Setiap cerita besar punya awal yang sederhana.",
    emoji: "🌟",
  },
  {
    id: "j2",
    year: "2021",
    title: "Entered SMKN 1 Pasuruan",
    titleId: "Masuk SMKN 1 Pasuruan",
    description: "Started vocational education in RPL (Software Engineering).",
    descriptionId:
      "Mulai perjalanan pendidikan vokasi dengan memilih jurusan RPL. Ini keputusan pertama yang beneran nentuin arah hidupku.",
    emoji: "🏫",
    highlight: true,
  },
  {
    id: "j3",
    year: "2022",
    title: "First Lines of Code",
    titleId: "Kali Pertama Nulis Kode",
    description: "Wrote my very first lines of HTML and CSS.",
    descriptionId:
      "HTML dan CSS pertama. Waktu browser ngerender halaman yang aku bikin sendiri untuk pertama kalinya — rasanya nggak bisa digambarkan.",
    emoji: "💻",
  },
  {
    id: "j4",
    year: "2023",
    title: "Discovered Web Development",
    titleId: "Jatuh Cinta sama Web Dev",
    description: "Fell in love with web development.",
    descriptionId:
      "Mulai serius ngulik JavaScript, PHP, dan Laravel. Sadar kalau web development bukan cuma pelajaran, tapi passion.",
    emoji: "🚀",
    highlight: true,
  },
  {
    id: "j5",
    year: "2024",
    title: "Leveling Up",
    titleId: "Naik Level",
    description: "Dived deeper into TypeScript, React, and modern frontend.",
    descriptionId:
      "Masuk ke ekosistem modern: TypeScript, React, dan semua hal yang bikin frontend terasa lebih powerful.",
    emoji: "⚡",
  },
  {
    id: "j6",
    year: "2025",
    title: "Exploring Next.js & Design",
    titleId: "Next.js & Desain",
    description: "Discovered Next.js and became obsessed with UI/UX.",
    descriptionId:
      "Ketemu Next.js dan langsung jatuh cinta. Sekarang mulai jembatani antara coding dan desain yang bagus.",
    emoji: "🎨",
    highlight: true,
  },
  {
    id: "j7",
    year: "2026",
    title: "This Website",
    titleId: "Website Ini",
    description: "Built my own personal website.",
    descriptionId:
      "Akhirnya bikin website pribadi sendiri dari nol. Dan cerita ini belum selesai...",
    emoji: "🌐",
    highlight: true,
  },
];

export interface Goal {
  id: string;
  phase: "now" | "next" | "future";
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  emoji: string;
}

export const goals: Goal[] = [
  // NOW
  {
    id: "now1",
    phase: "now",
    title: "Internship (PKL)",
    titleId: "Fokus PKL",
    description: "Currently doing my internship.",
    descriptionId: "Lagi sibuk-sibuknya jalanin PKL (Praktik Kerja Lapangan).",
    emoji: "💼",
  },
  {
    id: "now2",
    phase: "now",
    title: "Learning",
    titleId: "Belajar & Olahraga",
    description: "Learning new things and playing sports.",
    descriptionId: "Banyakin belajar hal baru dan sering main badminton biar sehat.",
    emoji: "🏸",
  },

  // NEXT
  {
    id: "next1",
    phase: "next",
    title: "Graduate",
    titleId: "Lulus dengan Baik",
    description: "Focus on graduating with good grades.",
    descriptionId: "Fokus nyelesain sekolah dan lulus dengan nilai memuaskan.",
    emoji: "🎓",
  },

  // FUTURE
  {
    id: "future1",
    phase: "future",
    title: "Travel",
    titleId: "Jalan-jalan & Bahagia",
    description: "Travel the world and enjoy life.",
    descriptionId: "Bisa jalan-jalan ke tempat baru, sukses, dan bahagiain orang tua.",
    emoji: "✈️",
  },
];

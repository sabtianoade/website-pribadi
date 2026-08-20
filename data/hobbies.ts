import { Code2, Music, Activity, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Hobby {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  icon: LucideIcon;
  color: string;
  emoji: string;
}

export const hobbies: Hobby[] = [
  {
    id: "badminton",
    title: "Badminton",
    titleId: "Bulu Tangkis",
    description: "Playing badminton keeps me active and competitive.",
    descriptionId: "Olahraga favoritku buat cari keringat dan jaga kebugaran sambil seru-seruan di lapangan.",
    icon: Activity,
    color: "var(--foreground)",
    emoji: "⚪",
  },
  {
    id: "music",
    title: "Listening to Music",
    titleId: "Dengerin Musik",
    description: "Music is always on when I'm working or relaxing.",
    descriptionId: "Tanpa musik, aku nggak bisa fokus. Seriously.",
    icon: Music,
    color: "var(--muted)",
    emoji: "⚫",
  },
  {
    id: "padel",
    title: "Padel",
    titleId: "Padel",
    description: "Enjoying the fast-paced and social game of padel.",
    descriptionId: "Seru banget main padel, gabungan antara tenis dan squash yang bikin ketagihan.",
    icon: Target,
    color: "var(--foreground)",
    emoji: "⚪",
  },
  {
    id: "coding",
    title: "Coding",
    titleId: "Ngoding",
    description: "I love writing code and turning ideas into real things.",
    descriptionId:
      "Nggak ada yang lebih memuaskan dari ngeliat kode yang kamu tulis tiba-tiba jalan dengan sempurna. Itu rasanya kayak sihir yang bisa dipelajari.",
    icon: Code2,
    color: "var(--muted)",
    emoji: "⚫",
  },
];

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  altId: string;
  caption: string;
  captionId: string;
  category: "me" | "friends" | "school" | "food" | "random";
  width: "normal" | "wide" | "tall";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "new-momen2",
    src: "/new-momen2.jpg",
    alt: "Foto momen 2",
    altId: "Foto momen 2",
    caption: "Good times 💛",
    captionId: "Waktu yang menyenangkan 💛",
    category: "friends",
    width: "wide",
  },
  {
    id: "new-momen3",
    src: "/new-momen3.jpg",
    alt: "Foto momen 3",
    altId: "Foto momen 3",
    caption: "Vibing 🎧",
    captionId: "Menikmati suasana 🎧",
    category: "random",
    width: "tall",
  },
  {
    id: "new-momen4",
    src: "/new-momen4.jpg",
    alt: "Foto momen 4",
    altId: "Foto momen 4",
    caption: "Exploring 🚶‍♂️",
    captionId: "Eksplorasi 🚶‍♂️",
    category: "school",
    width: "normal",
  },
  {
    id: "new-momen5",
    src: "/new-momen5.jpg",
    alt: "Foto momen 5",
    altId: "Foto momen 5",
    caption: "Special moment ✨",
    captionId: "Momen spesial ✨",
    category: "me",
    width: "tall",
  },
  {
    id: "new-momen6",
    src: "/new-momen6.jpg",
    alt: "Foto momen 6",
    altId: "Foto momen 6",
    caption: "Good day ☀️",
    captionId: "Hari yang cerah ☀️",
    category: "random",
    width: "wide",
  },
  {
    id: "new-momen7",
    src: "/new-momen7.jpg",
    alt: "Foto momen 7",
    altId: "Foto momen 7",
    caption: "Chilling 😎",
    captionId: "Santai 😎",
    category: "friends",
    width: "normal",
  },
  {
    id: "new-momen8",
    src: "/new-momen8.jpg",
    alt: "Foto momen 8",
    altId: "Foto momen 8",
    caption: "Another day 📸",
    captionId: "Hari lainnya 📸",
    category: "school",
    width: "tall",
  },
  {
    id: "new-momen9",
    src: "/new-momen9.jpg",
    alt: "Foto momen 9",
    altId: "Foto momen 9",
    caption: "Just vibes ✨",
    captionId: "Seru-seruan ✨",
    category: "me",
    width: "normal",
  },
];

export const galleryCategories = [
  { id: "all", label: "Semua" },
  { id: "me", label: "Aku" },
  { id: "friends", label: "Teman" },
  { id: "school", label: "Sekolah" },
  { id: "food", label: "Makanan" },
  { id: "random", label: "Random" },
] as const;

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
  { id: "momen-baru-1", src: "/momen-baru-1.jpeg", alt: "Foto momen 1", altId: "Foto momen 1", caption: "Momen baru 📸", captionId: "Momen baru 📸", category: "friends", width: "normal" },
  { id: "momen-baru-2", src: "/momen-baru-2.jpeg", alt: "Foto momen 2", altId: "Foto momen 2", caption: "Seru banget ✨", captionId: "Seru banget ✨", category: "random", width: "tall" },
  { id: "momen-baru-3", src: "/momen-baru-3.jpeg", alt: "Foto momen 3", altId: "Foto momen 3", caption: "Hari yang asik ✌️", captionId: "Hari yang asik ✌️", category: "friends", width: "wide" },
  { id: "momen-baru-4", src: "/momen-baru-4.jpeg", alt: "Foto momen 4", altId: "Foto momen 4", caption: "Good vibes ☀️", captionId: "Suasana nyaman ☀️", category: "me", width: "normal" },
  { id: "momen-baru-5", src: "/momen-baru-5.jpeg", alt: "Foto momen 5", altId: "Foto momen 5", caption: "Kumpul bareng 👥", captionId: "Kumpul bareng 👥", category: "friends", width: "tall" },
  { id: "momen-baru-6", src: "/momen-baru-6.jpeg", alt: "Foto momen 6", altId: "Foto momen 6", caption: "Senyum terus 😄", captionId: "Senyum terus 😄", category: "random", width: "wide" },
  { id: "momen-baru-7", src: "/momen-baru-7.jpeg", alt: "Foto momen 7", altId: "Foto momen 7", caption: "Waktu luang 🕰️", captionId: "Waktu luang 🕰️", category: "friends", width: "normal" },
  { id: "momen-baru-8", src: "/momen-baru-8.jpeg", alt: "Foto momen 8", altId: "Foto momen 8", caption: "Momen langka 🌟", captionId: "Momen langka 🌟", category: "school", width: "tall" },
  { id: "momen-baru-9", src: "/momen-baru-9.jpeg", alt: "Foto momen 9", altId: "Foto momen 9", caption: "Bikin memori 💭", captionId: "Bikin memori 💭", category: "friends", width: "wide" },
  { id: "momen-baru-10", src: "/momen-baru-10.jpeg", alt: "Foto momen 10", altId: "Foto momen 10", caption: "Random snap 📷", captionId: "Jepretan spontan 📷", category: "random", width: "normal" },
  { id: "momen-baru-11", src: "/momen-baru-11.jpeg", alt: "Foto momen 11", altId: "Foto momen 11", caption: "Nongkrong chill ☕", captionId: "Nongkrong chill ☕", category: "friends", width: "tall" },
  { id: "momen-baru-12", src: "/momen-baru-12.jpeg", alt: "Foto momen 12", altId: "Foto momen 12", caption: "Lagi santai 🍃", captionId: "Lagi santai 🍃", category: "me", width: "wide" },
  { id: "momen-baru-13", src: "/momen-baru-13.jpeg", alt: "Foto momen 13", altId: "Foto momen 13", caption: "Perfect day 💯", captionId: "Hari yang sempurna 💯", category: "friends", width: "normal" },
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

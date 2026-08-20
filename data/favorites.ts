export interface FavoriteItem {
  id: string;
  category: string;
  categoryId: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  descriptionId: string;
  imageSeed: number;
  color: string;
  imageSrc?: string;
}

export const favorites: FavoriteItem[] = [
  {
    id: "food",
    category: "Favorite Food",
    categoryId: "Makanan Favorit",
    emoji: "🍜",
    title: "Hotways Nashville Chicken",
    subtitle: "Fried chicken",
    description: "Spicy, crispy, and absolutely delicious.",
    descriptionId:
      "Ayam goreng pedas ala Nashville ini bumbunya meresap sampai ke dalam, bikin nagih dan nggak bisa berhenti makan!",
    imageSeed: 292,
    color: "#EF4444",
    imageSrc: "/new-momen1.jpg",
  },
  {
    id: "drink",
    category: "Favorite Drink",
    categoryId: "Minuman Favorit",
    emoji: "☕",
    title: "Kopi",
    subtitle: "Kopi hitam manis",
    description: "Simple, refreshing, and perfectly sweet.",
    descriptionId:
      "Teman terbaik saat sedang coding atau bersantai, rasanya pas bikin semangat.",
    imageSeed: 442,
    color: "#84CC16",
    imageSrc: "/minuman-fav.jpg",
  },

  {
    id: "food-2",
    category: "Favorite Food",
    categoryId: "Makanan Favorit",
    emoji: "🍕",
    title: "Makanan Favorit 2",
    subtitle: "Selalu bikin ngiler",
    description: "Always makes me hungry.",
    descriptionId: "Nggak pernah bosan makan ini, porsinya juga pas.",
    imageSeed: 102,
    color: "#EF4444",
    imageSrc: "/makanan-fav2.jpg",
  },
  {
    id: "food-3",
    category: "Favorite Food",
    categoryId: "Makanan Favorit",
    emoji: "🍟",
    title: "Makanan Favorit 3",
    subtitle: "Teman ngemil",
    description: "Perfect snack.",
    descriptionId: "Cocok banget buat nemenin waktu santai atau sambil kerja.",
    imageSeed: 103,
    color: "#10B981",
    imageSrc: "/makanan-fav3.jpg",
  },
];

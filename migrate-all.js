const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key.trim()] = value.join('=').trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const allNewPhotos = [
  // Hero
  { title: "Foto Profil Utama", image_url: "/upd-foto1.jpeg", category: "hero" },
  { title: "Avatar Kecil", image_url: "/foto-thomas2.png", category: "hero_avatar" },
  // About
  { title: "Foto Tentang Aku", image_url: "/upd.jpeg", category: "about" },
  // Hobbies
  { title: "Badminton", image_url: "/badmin.jpeg", category: "hobbies" },
  { title: "Dengerin Musik", image_url: "/musik.jpeg", category: "hobbies" },
  { title: "Padel", image_url: "/padel.jpeg", category: "hobbies" },
  { title: "Main Gitar", image_url: "/gitar.jpeg", category: "hobbies" },
  { title: "Bikin Kopi", image_url: "/bikinkopi.jpeg", category: "hobbies" },
  { title: "Coding", image_url: "/coding.jpeg", category: "hobbies" },
  // Interactive Desk
  { title: "Makanan Favorit", image_url: "/meja-makanan.jpeg", category: "interactive_desk" },
  { title: "Foto Random", image_url: "/meja-random.jpeg", category: "interactive_desk" },
  { title: "Badminton Desk", image_url: "/meja-badminton.jpeg", category: "interactive_desk" },
  { title: "Gitar Desk", image_url: "/meja-gitar.jpeg", category: "interactive_desk" },
  // Favorites
  { title: "Film/Series Fav", image_url: "/new-momen1.jpg", category: "favorites" },
  { title: "Matcha Latte", image_url: "/minuman-fav.jpg", category: "favorites" },
  { title: "Mie Gacoan", image_url: "/makanan-fav2.jpg", category: "favorites" },
  { title: "Nasi Goreng", image_url: "/makanan-fav3.jpg", category: "favorites" },
  // Netha
  { title: "Profil Netha", image_url: "/profil-netha.jpeg", category: "netha_hero" },
  { title: "Fotbar 1", image_url: "/fotbar-1.jpeg", category: "netha_fotbar" },
  { title: "Fotbar 2", image_url: "/fotbar-2.jpeg", category: "netha_fotbar" },
  { title: "Fotbar 3", image_url: "/fotbar-3.jpeg", category: "netha_fotbar" },
  { title: "Matcha Latte", image_url: "/matcha.jpeg", category: "netha_drinks" },
];

async function run() {
  try {
    const { data: existing } = await supabase.from("gallery").select("image_url");
    const existingUrls = new Set(existing?.map((e) => e.image_url) || []);

    const toInsert = allNewPhotos.filter((item) => !existingUrls.has(item.image_url));

    if (toInsert.length > 0) {
      const { error } = await supabase.from("gallery").insert(toInsert);
      if (error) throw error;
      console.log(`Inserted ${toInsert.length} items`);
    } else {
      console.log("No new items to insert");
    }
  } catch(e) {
    console.error(e);
  }
}

run();

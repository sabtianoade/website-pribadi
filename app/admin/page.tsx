"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Upload, Trash2, Image as ImageIcon, Loader2, Search, Filter } from "lucide-react";
import { logoutAction } from "./actions";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general"); 

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0] || !title) return;
    
    setUploading(true);
    setUploadError("");
    
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadErrorData, data: uploadData } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadErrorData) throw uploadErrorData;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from("gallery")
        .insert([
          {
            title: title,
            image_url: publicUrl,
            category: category
          }
        ]);

      if (dbError) throw dbError;

      // Success
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchGallery(); // Refresh list

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    
    try {
      // Delete from DB
      await supabase.from("gallery").delete().eq("id", id);
      
      // Delete from Storage (Extract path from URL)
      const urlObj = new URL(imageUrl);
      const pathSegments = urlObj.pathname.split('/');
      // /storage/v1/object/public/photos/uploads/filename.jpg
      const uploadsIndex = pathSegments.indexOf('uploads');
      if (uploadsIndex !== -1) {
        const filePath = pathSegments.slice(uploadsIndex).join('/');
        await supabase.storage.from("photos").remove([filePath]);
      }
      
      fetchGallery();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-10 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black text-[var(--foreground)]">Dashboard Admin</h1>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 font-semibold transition-colors">
              <LogOut size={18} /> Keluar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* UPLOAD FORM */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl sticky top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload size={20} className="text-[var(--primary)]" />
                Upload Foto Baru
              </h2>
              
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Pilih Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    required
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)]/10 file:text-[var(--primary)] hover:file:bg-[var(--primary)]/20 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]"
                  >
                    <optgroup label="Beranda">
                      <option value="general">Momen Umum / Galeri</option>
                      <option value="hero">Hero Background (1 Foto)</option>
                      <option value="hero_avatar">Hero Avatar (1 Foto)</option>
                      <option value="about">Tentang Aku Profile (1 Foto)</option>
                      <option value="hobbies">Hal yang Aku Suka (Bento 6 Foto)</option>
                      <option value="interactive_desk">Meja Interaktif (4 Foto)</option>
                      <option value="favorites">Yang Aku Suka Banget (4 Foto)</option>
                    </optgroup>
                    <optgroup label="Halaman Rahasia Netha">
                      <option value="netha">Momen Netha (Galeri Banyak Foto)</option>
                      <option value="netha_hero">Netha Profile (1 Foto)</option>
                      <option value="netha_fotbar">You & Me Fotbar (3 Foto)</option>
                      <option value="netha_drinks">Minuman Favoritnya (1 Foto)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Judul / Deskripsi</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Liburan ke Bali"
                    required
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full mt-2 bg-[var(--foreground)] text-[var(--background)] font-bold py-3 rounded-xl shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload Sekarang"}
                </button>
              </form>
            </div>
          </div>

          {/* GALLERY GRID */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon size={20} className="text-[var(--primary)]" />
                Galeri Tersimpan
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input 
                    type="text" 
                    placeholder="Cari foto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg text-sm w-full sm:w-48 outline-none focus:border-[var(--primary)]"
                  />
                </div>
                
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-9 pr-8 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg text-sm appearance-none outline-none focus:border-[var(--primary)]"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="general">Momen Umum</option>
                    <option value="hero">Hero Background</option>
                    <option value="hero_avatar">Hero Avatar</option>
                    <option value="about">Tentang Aku</option>
                    <option value="hobbies">Hobbies Bento</option>
                    <option value="interactive_desk">Meja Interaktif</option>
                    <option value="favorites">Favorites</option>
                    <option value="netha">Netha Galeri</option>
                    <option value="netha_hero">Netha Profile</option>
                    <option value="netha_fotbar">Netha Fotbar</option>
                    <option value="netha_drinks">Netha Drinks</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-[var(--card)] border border-[var(--card-border)] border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-[var(--muted)]">
                <ImageIcon size={48} className="opacity-20 mb-4" />
                <p>Tidak ada foto yang cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden group flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono uppercase">
                        {item.category}
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-semibold text-sm line-clamp-2" title={item.title}>{item.title}</p>
                      <p className="text-[10px] text-[var(--muted)] mt-auto pt-2">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

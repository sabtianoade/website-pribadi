"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Upload, Trash2, Image as ImageIcon, Loader2, Search, Filter, Edit3, X, Settings, Trophy, Save } from "lucide-react";
import { logoutAction } from "./actions";
import Leaderboard from "@/components/Leaderboard";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
};

type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  about_description: string;
  theme_primary_color: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"gallery" | "settings" | "leaderboard">("gallery");

  // === GALLERY STATE ===
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

  // Edit State
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isEditSaving, setIsEditSaving] = useState(false);

  // === SETTINGS STATE ===
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: "",
    hero_subtitle: "",
    about_description: "",
    theme_primary_color: "#333333"
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchGallery();
    fetchSettings();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*");
    if (!error && data) {
      const newSettings = { ...settings };
      data.forEach(item => {
        if (item.id in newSettings) {
          (newSettings as any)[item.id] = item.value;
        }
      });
      setSettings(newSettings);
    }
    setSettingsLoading(false);
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
      const { error: uploadErrorData, data: uploadData } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadErrorData) throw uploadErrorData;

      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("gallery")
        .insert([{ title, image_url: publicUrl, category }]);

      if (dbError) throw dbError;

      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchGallery(); 
    } catch (err: any) {
      setUploadError(err.message || "Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    try {
      await supabase.from("gallery").delete().eq("id", id);
      const urlObj = new URL(imageUrl);
      const pathSegments = urlObj.pathname.split('/');
      const uploadsIndex = pathSegments.indexOf('uploads');
      if (uploadsIndex !== -1) {
        const filePath = pathSegments.slice(uploadsIndex).join('/');
        await supabase.storage.from("photos").remove([filePath]);
      }
      fetchGallery();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsEditSaving(true);
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ title: editingItem.title, category: editingItem.category })
        .eq("id", editingItem.id);

      if (error) throw error;
      setEditingItem(null);
      fetchGallery();
    } catch (err) {
      alert("Gagal memperbarui data");
    } finally {
      setIsEditSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      // Upsert each setting
      const updates = Object.entries(settings).map(([id, value]) => ({ id, value, updated_at: new Date().toISOString() }));
      const { error } = await supabase.from("site_settings").upsert(updates);
      if (error) throw error;
      alert("Pengaturan berhasil disimpan! Perubahan akan langsung terlihat.");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan pengaturan: " + err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-10 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-[var(--foreground)]">Dashboard Admin</h1>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 font-semibold transition-colors">
              <LogOut size={18} /> Keluar
            </button>
          </form>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-[var(--card)] p-2 rounded-xl border border-[var(--card-border)]">
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === "gallery" ? "bg-[var(--primary)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"}`}
          >
            <ImageIcon size={18} /> Galeri Foto
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === "settings" ? "bg-[var(--primary)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"}`}
          >
            <Settings size={18} /> Pengaturan Teks & Tema
          </button>
          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === "leaderboard" ? "bg-[var(--primary)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"}`}
          >
            <Trophy size={18} /> Leaderboard
          </button>
        </div>

        {/* TAB 1: GALLERY */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl sticky top-24">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-[var(--primary)]" /> Upload Foto Baru
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Pilih Foto</label>
                    <input type="file" accept="image/*" ref={fileInputRef} required className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)]/10 file:text-[var(--primary)] hover:file:bg-[var(--primary)]/20 cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]">
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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Liburan ke Bali" required className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]" />
                  </div>
                  {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
                  <button type="submit" disabled={uploading} className="w-full mt-2 bg-[var(--foreground)] text-[var(--background)] font-bold py-3 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload Sekarang"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon size={20} className="text-[var(--primary)]" /> Galeri Tersimpan
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input type="text" placeholder="Cari foto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg text-sm w-full sm:w-48 outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="pl-9 pr-8 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg text-sm appearance-none outline-none focus:border-[var(--primary)]">
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
                  <p>Tidak ada foto yang cocok.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden group flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono uppercase">
                          {item.category}
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingItem(item)} className="bg-blue-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-md" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id, item.image_url)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-md" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
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
        )}

        {/* TAB 2: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 md:p-10 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-[var(--primary)]" />
              Pengaturan Teks & Tema
            </h2>

            {settingsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-8">
                
                {/* THEME COLOR */}
                <div className="bg-[var(--background)] p-6 rounded-xl border border-[var(--card-border)]">
                  <h3 className="text-lg font-bold mb-4 border-b border-[var(--card-border)] pb-2">Warna Tema (Color Picker)</h3>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={settings.theme_primary_color}
                      onChange={(e) => setSettings({ ...settings, theme_primary_color: e.target.value })}
                      className="w-16 h-16 rounded cursor-pointer border-none bg-transparent"
                    />
                    <div>
                      <p className="font-semibold text-sm">Pilih Warna Utama</p>
                      <p className="text-xs text-[var(--muted)]">Ubah nuansa warna seluruh website secara langsung.</p>
                      <div className="mt-2 text-xs font-mono bg-[var(--muted-bg)] px-2 py-1 rounded inline-block">
                        {settings.theme_primary_color}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TEXT SETTINGS */}
                <div className="bg-[var(--background)] p-6 rounded-xl border border-[var(--card-border)] flex flex-col gap-4">
                  <h3 className="text-lg font-bold mb-2 border-b border-[var(--card-border)] pb-2">Teks Beranda</h3>
                  
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Judul Utama (Hero)</label>
                    <input 
                      type="text" 
                      value={settings.hero_title}
                      onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                      placeholder="Hi, I'm Thomas"
                      className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Sub-Judul (Hero)</label>
                    <input 
                      type="text" 
                      value={settings.hero_subtitle}
                      onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                      placeholder="Front-End Developer"
                      className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Deskripsi "Tentang Aku"</label>
                    <textarea 
                      value={settings.about_description}
                      onChange={(e) => setSettings({ ...settings, about_description: e.target.value })}
                      placeholder="Ceritakan tentang dirimu..."
                      rows={5}
                      className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--primary)] resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={settingsSaving}
                  className="bg-[var(--foreground)] text-[var(--background)] font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                >
                  {settingsSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={20} /> Simpan Pengaturan</>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 md:p-10 shadow-xl text-center">
              <Trophy size={48} className="text-[var(--primary)] mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Papan Peringkat Global</h2>
              <p className="text-[var(--muted)] mb-8">Data skor tertinggi dari semua pemain di setiap minigame.</p>
              
              <Leaderboard game="all" limit={20} />
            </div>
          </div>
        )}

      </div>

      {/* EDIT MODAL FOR GALLERY */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--card-border)] p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditingItem(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)]">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit3 size={20} className="text-[var(--primary)]" /> Edit Detail Foto
            </h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Judul / Deskripsi</label>
                <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} required className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Kategori</label>
                <select value={editingItem.category} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]">
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
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl border border-[var(--card-border)] font-semibold hover:bg-[var(--background)] transition-colors">Batal</button>
                <button type="submit" disabled={isEditSaving} className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                  {isEditSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

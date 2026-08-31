"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Upload, Trash2, Image as ImageIcon, Loader2, Search, Filter, Edit3, X, Settings, Trophy, Save, CheckCircle2, Type, PaintBucket, Info } from "lucide-react";
import { logoutAction } from "./actions";
import Leaderboard from "@/components/Leaderboard";
import { motion, AnimatePresence } from "motion/react";

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
  footer_text: string;
  hobbies_title: string;
  hobbies_subtitle: string;
  random_facts_desc: string;
  theme_primary_color: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"gallery" | "settings" | "leaderboard">("gallery");

  // === GALLERY STATE ===
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
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
    footer_text: "Dibuat dengan ❤️ oleh Thomas",
    hobbies_title: 'Hal yang <span class="gradient-text">Aku Suka</span>',
    hobbies_subtitle: "Beberapa hal yang suka aku lakukan di waktu luang.",
    random_facts_desc: "Beberapa fakta acak tentang diriku yang mungkin (tidak) ingin kamu ketahui.",
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

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const compressImage = (file: File): Promise<{ file: File }> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const cleanName = file.name.replace(/\.(heic|heif|png|jpeg|jpg|webp)$/i, ".jpg");
                const newFile = new File([blob], cleanName, { type: "image/jpeg" });
                resolve({ file: newFile });
              } else {
                resolve({ file });
              }
            },
            "image/jpeg",
            0.85
          );
        } else {
          resolve({ file });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        // If image decoding fails (e.g. unsupported raw HEIC on some desktop browsers)
        resolve({ file });
      };

      img.src = url;
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !title) return;
    
    setUploading(true);
    setUploadError("");

    try {
      // Process and compress image file (resizes large HP photos, converts to JPEG)
      let fileToUpload: File = uploadFile;
      let contentType = uploadFile.type || "image/jpeg";

      try {
        const compressed = await compressImage(uploadFile);
        fileToUpload = compressed.file;
        contentType = "image/jpeg";
      } catch (e) {
        console.warn("Compression skipped, uploading original file", e);
      }
      
      const fileExt = fileToUpload.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadErrorData } = await supabase.storage
        .from("photos")
        .upload(filePath, fileToUpload, {
          contentType: contentType,
          upsert: true
        });

      if (uploadErrorData) throw uploadErrorData;

      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("gallery")
        .insert([{ title, image_url: publicUrl, category }]);

      if (dbError) throw dbError;

      // Reset form
      setTitle("");
      clearFile();
      fetchGallery(); 
    } catch (err: any) {
      setUploadError(err.message || "Gagal mengunggah foto. Pastikan ukuran file tidak terlalu besar dan format berupa JPG/PNG/WebP.");
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
    <div className="min-h-screen bg-[var(--background)] pb-20">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--card-border)] pt-8 pb-4 px-6 md:px-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Settings size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--foreground)] leading-tight">Admin Dashboard</h1>
              <p className="text-[var(--muted)] text-xs font-medium uppercase tracking-widest">Workspace Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* SEGMENTED CONTROL TABS */}
            <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--card-border)] shadow-inner overflow-x-auto hide-scrollbar">
              {[
                { id: "gallery", icon: ImageIcon, label: "Galeri" },
                { id: "settings", icon: Settings, label: "Pengaturan" },
                { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors z-10 ${
                      isActive ? "text-[var(--background)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[var(--foreground)] rounded-lg shadow-md -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form action={logoutAction}>
              <button type="submit" className="flex items-center justify-center w-11 h-11 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: GALLERY */}
          {activeTab === "gallery" && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              {/* UPLOAD SIDEBAR */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-xl sticky top-32">
                  <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Upload size={22} className="text-[var(--primary)]" /> Upload Foto Baru
                  </h2>
                  <form onSubmit={handleUpload} className="flex flex-col gap-6">
                    
                    {/* DRAG & DROP ZONE */}
                    <div>
                      <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">Pilih File Foto</label>
                      <div 
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                          dragActive ? "border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02] shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]" : 
                          uploadFile ? "border-green-500/50 bg-green-500/10" : "border-[var(--card-border)] hover:border-[var(--muted)] bg-[var(--background)]"
                        }`}
                      >
                        <input 
                          type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {uploadFile ? (
                          <div className="text-center flex flex-col items-center gap-3">
                            <CheckCircle2 size={40} className="text-green-500" />
                            <div className="font-bold text-sm truncate max-w-[200px] bg-[var(--card)] px-3 py-1 rounded-full border border-green-500/30">
                              {uploadFile.name}
                            </div>
                            <button type="button" onClick={(e) => { e.preventDefault(); clearFile(); }} className="text-xs text-red-500 font-bold hover:bg-red-500/10 px-3 py-1.5 rounded-full transition-colors relative z-20">
                              Hapus & Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="text-center flex flex-col items-center gap-3 pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center shadow-sm">
                              <ImageIcon size={28} className="text-[var(--muted)]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--foreground)]">Klik atau Drag & Drop foto</p>
                              <p className="text-xs text-[var(--muted)] mt-1">Maks. 5MB (JPG, PNG, WebP)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><Filter size={14}/> Kategori Galeri</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[var(--primary)] transition-all focus:shadow-[0_0_0_3px_var(--primary)] cursor-pointer appearance-none">
                        <optgroup label="Beranda (Home)">
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
                      <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><Type size={14}/> Judul / Deskripsi Singkat</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tulis sesuatu yang menarik..." required className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[var(--primary)] transition-all focus:shadow-[0_0_0_3px_var(--primary)]" />
                    </div>

                    {uploadError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">{uploadError}</div>}
                    
                    <button type="submit" disabled={uploading || !uploadFile || !title} className="w-full mt-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none">
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload size={18} /> Simpan Foto</>}
                    </button>
                  </form>
                </div>
              </div>

              {/* GALLERY GRID */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] p-4 sm:p-5 rounded-3xl border border-[var(--card-border)] shadow-md">
                  <h2 className="text-xl font-black flex items-center gap-2 px-2">
                    <ImageIcon size={22} className="text-[var(--primary)]" /> Koleksi <span className="text-sm font-bold bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded-full ml-2">{filteredItems.length}</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                      <input type="text" placeholder="Cari foto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm font-medium w-full sm:w-64 outline-none focus:border-[var(--primary)] transition-all focus:shadow-[0_0_0_3px_var(--primary)]" />
                    </div>
                    <div className="relative group hidden lg:block">
                      <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="pl-11 pr-10 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm font-bold appearance-none outline-none focus:border-[var(--primary)] transition-all focus:shadow-[0_0_0_3px_var(--primary)] cursor-pointer">
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
                  <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                    <p className="text-[var(--muted)] font-bold animate-pulse text-lg">Memuat Galeri...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="bg-[var(--card)] border border-[var(--card-border)] border-dashed rounded-3xl h-96 flex flex-col items-center justify-center text-[var(--muted)] gap-6">
                    <div className="p-6 bg-[var(--background)] rounded-full shadow-inner"><ImageIcon size={48} className="opacity-40" /></div>
                    <p className="font-bold text-lg">Tidak ada foto yang cocok.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <motion.div 
                        layoutId={`card-${item.id}`}
                        key={item.id} 
                        className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl overflow-hidden group flex flex-col shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--background)]">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          
                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-white font-black uppercase tracking-widest shadow-lg border border-white/10">
                            {item.category}
                          </div>
                          
                          {/* Hover Actions (Glassmorphism) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 gap-4">
                            <button onClick={() => setEditingItem(item)} className="bg-white/10 hover:bg-blue-500 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:scale-110 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)]" title="Edit">
                              <Edit3 size={20} />
                            </button>
                            <button onClick={() => handleDelete(item.id, item.image_url)} className="bg-white/10 hover:bg-red-500 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:scale-110 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)]" title="Hapus">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1 bg-[var(--card)] relative z-10 border-t border-[var(--card-border)]">
                          <p className="font-bold text-[var(--foreground)] text-lg line-clamp-2 leading-tight">{item.title}</p>
                          <p className="text-xs font-bold text-[var(--primary)] mt-auto pt-4 uppercase tracking-widest">
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === "settings" && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-[2.5rem] p-8 md:p-14 shadow-2xl">
                <h2 className="text-3xl font-black mb-10 flex items-center gap-4 border-b border-[var(--card-border)] pb-8">
                  <Settings className="text-[var(--primary)]" size={36} />
                  Pengaturan Identitas Web
                </h2>

                {settingsLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                    <p className="text-[var(--muted)] font-bold text-lg">Memuat Pengaturan...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveSettings} className="flex flex-col gap-12">
                    
                    {/* THEME COLOR */}
                    <div className="group bg-[var(--background)] p-8 md:p-10 rounded-3xl border border-[var(--card-border)] hover:border-[var(--primary)]/50 transition-colors relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)] blur-[100px] opacity-10 rounded-full pointer-events-none" />
                      
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><PaintBucket className="text-[var(--primary)]" size={28}/> Warna Utama</h3>
                      <div className="flex items-start sm:items-center gap-8 flex-col sm:flex-row relative z-10">
                        <div className="relative">
                          <input 
                            type="color" 
                            value={settings.theme_primary_color}
                            onChange={(e) => setSettings({ ...settings, theme_primary_color: e.target.value })}
                            className="w-32 h-32 rounded-2xl cursor-pointer border-8 border-[var(--card)] bg-transparent shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="font-bold text-[var(--foreground)] text-xl">Warna Aksen Website</p>
                          <p className="text-sm font-medium text-[var(--muted)] max-w-md leading-relaxed">
                            Warna ini akan mengubah tampilan seluruh tombol, garis, ikon, dan elemen dekoratif di website. Buat karaktermu sendiri!
                          </p>
                          <div className="mt-2 text-sm font-black font-mono bg-[var(--card)] border border-[var(--card-border)] px-5 py-3 rounded-xl inline-flex items-center gap-3 self-start shadow-md">
                            <span className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: settings.theme_primary_color }}></span>
                            {settings.theme_primary_color.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TEXT SETTINGS */}
                    <div className="bg-[var(--background)] p-8 md:p-10 rounded-3xl border border-[var(--card-border)] flex flex-col gap-8 shadow-inner">
                      <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Type className="text-[var(--primary)]" size={28}/> Konten Beranda</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Judul Utama (Hero)</label>
                          <input 
                            type="text" 
                            value={settings.hero_title}
                            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                            placeholder="Hi, I'm Thomas"
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Sub-Judul (Hero)</label>
                          <input 
                            type="text" 
                            value={settings.hero_subtitle}
                            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                            placeholder="Front-End Developer"
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Cerita "Tentang Aku"</label>
                        <textarea 
                          value={settings.about_description}
                          onChange={(e) => setSettings({ ...settings, about_description: e.target.value })}
                          placeholder="Ceritakan tentang dirimu..."
                          rows={6}
                          className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-5 font-medium outline-none focus:border-[var(--primary)] resize-none transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)] leading-relaxed text-lg"
                        />
                        <p className="text-[11px] font-bold text-[var(--muted)] uppercase mt-2 flex items-center gap-1.5"><Info size={14}/> Mendukung teks yang panjang. Buat sapaan yang hangat!</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Judul Hobi</label>
                          <input 
                            type="text" 
                            value={settings.hobbies_title}
                            onChange={(e) => setSettings({ ...settings, hobbies_title: e.target.value })}
                            placeholder="Hobi & Ketertarikan"
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Sub-Judul Hobi</label>
                          <input 
                            type="text" 
                            value={settings.hobbies_subtitle}
                            onChange={(e) => setSettings({ ...settings, hobbies_subtitle: e.target.value })}
                            placeholder="Beberapa hal yang suka aku lakukan..."
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Teks Fakta Acak</label>
                          <input 
                            type="text" 
                            value={settings.random_facts_desc}
                            onChange={(e) => setSettings({ ...settings, random_facts_desc: e.target.value })}
                            placeholder="Beberapa fakta acak tentang diriku..."
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">Teks Footer</label>
                          <input 
                            type="text" 
                            value={settings.footer_text}
                            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                            placeholder="Dibuat dengan ❤️ oleh Thomas"
                            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-sm focus:shadow-[0_0_0_4px_var(--primary)]"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={settingsSaving}
                      className="bg-[var(--foreground)] text-[var(--background)] font-black text-xl uppercase tracking-widest py-6 rounded-2xl shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.2)] hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 mt-6"
                    >
                      {settingsSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Save size={28} /> Simpan Perubahan</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: LEADERBOARD */}
          {activeTab === "leaderboard" && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto flex flex-col gap-8"
            >
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--primary)] blur-[120px] opacity-20 rounded-full pointer-events-none" />
                <div className="text-center relative z-10 mb-12">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-yellow-500/10 mb-8 shadow-[0_0_80px_rgba(234,179,8,0.3)] border-2 border-yellow-500/20">
                    <Trophy size={64} className="text-yellow-500" />
                  </div>
                  <h2 className="text-4xl font-black mb-4 uppercase tracking-widest">Papan Peringkat Global</h2>
                  <p className="text-[var(--muted)] font-medium text-lg max-w-2xl mx-auto">Pantau skor tertinggi dari seluruh pengunjung di setiap minigame yang ada di website kamu. Siapa yang jadi nomor satu?</p>
                </div>
                
                <div className="bg-[var(--background)] p-4 rounded-3xl border border-[var(--card-border)] shadow-inner">
                  <Leaderboard game="all" limit={30} />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* EDIT MODAL FOR GALLERY */}
      <AnimatePresence>
        {editingItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: "spring", bounce: 0.3 }}
              className="bg-[var(--card)] border border-[var(--card-border)] p-8 md:p-10 rounded-3xl w-full max-w-lg shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[var(--primary)] to-blue-500" />
              
              <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--background)] p-3 rounded-full transition-colors hover:scale-110">
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Edit3 size={28} className="text-[var(--primary)]" /> Edit Detail Foto
              </h3>
              
              {/* Preview image */}
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 border border-[var(--card-border)] relative shadow-inner">
                <img src={editingItem.image_url} alt={editingItem.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/80 px-6 py-2.5 rounded-xl text-sm font-black text-white tracking-widest uppercase shadow-2xl border border-white/10">
                    Preview Mode
                  </span>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest mb-3 block">Judul / Deskripsi</label>
                  <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} required className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-inner focus:shadow-[0_0_0_3px_var(--primary)]" />
                </div>
                <div>
                  <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest mb-3 block">Kategori Spesifik</label>
                  <select value={editingItem.category} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--primary)] transition-all shadow-inner focus:shadow-[0_0_0_3px_var(--primary)] appearance-none cursor-pointer">
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
                <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-5 rounded-2xl border-2 border-[var(--card-border)] font-black text-[var(--muted)] uppercase tracking-widest hover:text-[var(--foreground)] hover:border-[var(--muted)] hover:bg-[var(--background)] transition-all">Batal</button>
                  <button type="submit" disabled={isEditSaving} className="flex-1 py-5 rounded-2xl bg-[var(--primary)] text-white font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-3">
                    {isEditSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

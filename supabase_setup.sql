-- Hapus tabel jika sudah ada
DROP TABLE IF EXISTS public.gallery;

-- Buat tabel gallery
CREATE TABLE public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Atur keamanan (Row Level Security)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan: Semua orang bisa melihat (SELECT)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.gallery FOR SELECT
USING ( true );

-- Buat kebijakan: Siapapun bisa INSERT, UPDATE, DELETE (karena kita akan handle keamanan via password di aplikasi Next.js kita)
CREATE POLICY "Anyone can insert"
ON public.gallery FOR INSERT
WITH CHECK ( true );

CREATE POLICY "Anyone can update"
ON public.gallery FOR UPDATE
USING ( true )
WITH CHECK ( true );

CREATE POLICY "Anyone can delete"
ON public.gallery FOR DELETE
USING ( true );

-- SETUP STORAGE (BUKET FOTO)
-- Masukkan data bucket 'photos'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage: Semua orang bisa baca
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'photos' );

-- Kebijakan Storage: Semua orang bisa upload, update, delete
CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'photos' );

CREATE POLICY "Public Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'photos' );

CREATE POLICY "Public Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'photos' );

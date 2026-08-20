import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Galeri | Thomas",
  description: "Koleksi foto dari kehidupan sehari-hariku.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Gallery />
      </main>
      <Footer />
    </>
  );
}

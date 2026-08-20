import Navbar from "@/components/Navbar";
import Favorites from "@/components/Favorites";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Favorit | Thomas",
  description: "Hal-hal yang selalu bikin aku happy.",
};

export default function FavoritesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Favorites />
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SplineViewer from "@/components/SplineViewer";
import About from "@/components/About";
import Hobbies from "@/components/Hobbies";
import Skills from "@/components/Skills";
import Goals from "@/components/Goals";
import RandomFacts from "@/components/RandomFacts";
import Footer from "@/components/Footer";
import DinoDecoration from "@/components/DinoDecoration";
import ConfettiButton from "@/components/ConfettiButton";
import CustomCursor from "@/components/CustomCursor";
import ParticlesBackground from "@/components/ParticlesBackground";
import InteractiveDesk from "@/components/InteractiveDesk";
import SpotifyWidget from "@/components/SpotifyWidget";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <ParticlesBackground />
      <CustomCursor />
      <Navbar />
      <SpotifyWidget />
      <main className="relative overflow-hidden">
        <DinoDecoration />
        <ConfettiButton />
        <Hero />
        
        <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto relative z-20">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-purple-500 drop-shadow-sm">
              Interactive Dimension
            </h2>
            <p className="text-[var(--muted)] max-w-xl">
              Coba sentuh dan geser objek 3D di bawah ini dengan kursor/jari kamu untuk melihat dari berbagai sudut pandang.
            </p>
          </div>
          <div className="w-full h-[450px] md:h-[600px] rounded-[2.5rem] overflow-hidden p-1 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-[var(--card-border)] shadow-2xl relative group">
            <SplineViewer />
          </div>
        </section>

        <About />
        <Hobbies />
        <Skills />
        <Goals />
        <RandomFacts />
        <InteractiveDesk />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

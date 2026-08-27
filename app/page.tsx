import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
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

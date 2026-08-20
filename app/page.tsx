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

export default function Home() {
  return (
    <>
      <ParticlesBackground />
      <CustomCursor />
      <Navbar />
      <main className="relative overflow-hidden">
        <DinoDecoration />
        <ConfettiButton />
        <Hero />
        <About />
        <Hobbies />
        <Skills />
        <Goals />
        <RandomFacts />
      </main>
      <Footer />
    </>
  );
}

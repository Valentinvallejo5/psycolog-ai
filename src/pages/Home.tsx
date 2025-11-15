import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { EmotionalBalance } from "@/components/EmotionalBalance";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <EmotionalBalance />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

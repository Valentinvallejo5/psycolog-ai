import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { EmotionalBalance } from "@/components/EmotionalBalance";
import { Footer } from "@/components/Footer";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative">
        <BackgroundPaths />
        <Hero />
        <Features />
        <EmotionalBalance />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

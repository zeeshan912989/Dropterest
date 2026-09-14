import Navbar from "@/components/navbar/Navbar.jsx";
import Hero from "@/components/hero/Hero.jsx";
import IdeaShowcase from "@/components/showcase/IdeaShowcase.jsx";
import CuriosityFeature from "@/components/features/CuriosityFeature.jsx";
import EndlessCanvas from "@/components/canvas/EndlessCanvas.jsx";
import Footer from "@/components/footer/Footer.jsx";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#18181B] relative flex flex-col items-center">
      {/* Precision Floating Capsule Navbar */}
      <Navbar />

      {/* Editorial Hero Section */}
      <Hero />

      {/* Ideas, Beautifully Organized - Pinterest Masonry Showcase */}
      <IdeaShowcase />

      {/* Made for Curiosity - 3-Panel Journey Feature */}
      <CuriosityFeature />

      {/* Endless Canvas - "Everything starts with a drop." */}
      <EndlessCanvas />

      {/* Signature "Final Drop" Footer - "Keep discovering." */}
      <Footer />
    </main>
  );
}


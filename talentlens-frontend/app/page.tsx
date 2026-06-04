import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { TrustSection } from "@/components/marketing/TrustSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-green-500/30 selection:text-white">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}

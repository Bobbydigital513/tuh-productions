import HeroSection from "@/components/HeroSection";
import SurveySection from "@/components/SurveySection";
import BeatStarsSection from "@/components/BeatStarsSection";
import MerchSection from "@/components/MerchSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <SurveySection />
      <BeatStarsSection />
      <MerchSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

import Image from "next/image";
import CarouselSection from "./components/CarouselSection";
import ConsciousLifeSection from "./components/ConsciousLifeSection";
import PathAwakeningSection from "./components/PathAwakeningSection";
import PortalIntroSection from "./components/PortalIntroSection";
import ExclusiveContentSection from "./components/ExclusiveContentSection";
import TestimonialsSection from "./components/TestimonialsSection";
import RegisterSection from "./components/RegisterSection";
import VideosSection from "./components/VideosSection";
import NewsletterSection from "./components/NewsletterSection";
import ContactSection from "./components/ContactSection";
import AboutSection from "./components/AboutSection";
import FooterSection from "./components/FooterSection";

export default function Page() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <CarouselSection />
      <ConsciousLifeSection />
      <PathAwakeningSection />
      <PortalIntroSection />
      <ExclusiveContentSection />
      <TestimonialsSection />
      <RegisterSection />
      <VideosSection />
      <NewsletterSection />
      <ContactSection />
      <AboutSection />
      <FooterSection />
    
    </div>
  );
}

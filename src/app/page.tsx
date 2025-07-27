import Image from "next/image";
import CarouselSection from "./components/CarouselSection";
import ConsciousLifeSection from "./components/ConsciousLifeSection";
import PathAwakeningSection from "./components/PathAwakeningSection";
import PortalIntroSection from "./components/PortalIntroSection";
import ExclusiveContentSection from "./components/ExclusiveContentSection";
import TestimonialsSection from "./components/TestimonialsSection";
import RegisterSection from "./components/RegisterSection";
import VideosSection from "./components/VideosSection";

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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      </div>
    </div>
  );
}

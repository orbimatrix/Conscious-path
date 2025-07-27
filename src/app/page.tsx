import Image from "next/image";
import CarouselSection from "./components/CarouselSection";
import ConsciousLifeSection from "./components/ConsciousLifeSection";
import PathAwakeningSection from "./components/PathAwakeningSection";
import PortalIntroSection from "./components/PortalIntroSection";

export default function Page() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <CarouselSection />
      <ConsciousLifeSection />
      <PathAwakeningSection />
      <PortalIntroSection />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      </div>
    </div>
  );
}

import { Hero } from "@/components/sections/Hero";
import { KitchenShowcase } from "@/components/sections/KitchenShowcase";
import { CapabilityTicker } from "@/components/sections/CapabilityTicker";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/*
       * Hold spacer (desktop): the hero is a full 100svh and stays pinned
       * here, so the ENTIRE hero is shown and held before the stacking
       * panel begins to rise. The scroll-hint chevron invites the scroll.
       *
       * Scroll timeline on desktop:
       *   0 px            → full hero fills the viewport (held)
       *   0 → ~22vh       → hero stays pinned, fully visible
       *   past the hold   → stacking panel rises over the sticky hero
       */}
      <div aria-hidden className="hidden lg:block lg:h-[22vh]" />

      {/* Stacking panel — scrolls up over the pinned hero */}
      <div className="relative z-10 overflow-hidden rounded-t-[2rem] bg-paper shadow-[0_-30px_80px_-40px_rgba(28,27,27,0.5)] sm:rounded-t-[2.5rem]">
        <KitchenShowcase />
        <CapabilityTicker />
        <ServicesSection />
        <AboutSection />
        <ProductsShowcase />
        <ClientsSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </>
  );
}
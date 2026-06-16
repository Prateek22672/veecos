import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HeroClients } from "@/components/sections/HeroClients";
import { KitchenShowcase } from "@/components/sections/KitchenShowcase";
import { JourneySection } from "@/components/sections/JourneySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: {
    absolute:
      "Veecos — Best Commercial Kitchen Equipment Manufacturer in Visakhapatnam (Vizag)",
  },
  description:
    "Veecos Canteen Equipments — Visakhapatnam's trusted commercial kitchen equipment manufacturer since 1998. Cooking ranges, exhaust hoods, refrigeration & wash-area equipment with end-to-end design, fabrication and installation across Vizag, Andhra Pradesh & Telangana.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Stacking panel — rises over the pinned hero image */}
      <div
        id="work"
        className="relative z-10 scroll-mt-24 overflow-hidden rounded-t-[2rem] bg-paper shadow-[0_-26px_70px_-36px_rgba(20,20,15,0.5)] sm:rounded-t-[2.5rem]"
      >
        <HeroClients />
        <KitchenShowcase />
        <JourneySection />
        <ServicesSection />
        <AboutSection />
        <ProductsShowcase />
        <ClientsSection />
        <TestimonialsSection />
        <CtaBand />
      </div>
    </>
  );
}
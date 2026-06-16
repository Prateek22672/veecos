import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact — Kitchen Equipment Manufacturer in Visakhapatnam",
  description:
    "Get in touch with Veecos Canteen Equipments, Visakhapatnam. Call +91 9848196184 or email sales@vce.co.in. Workshop in Auto Nagar, Vizag — request a quote for commercial kitchen equipment & installation.",
  keywords: [
    "contact Veecos",
    "commercial kitchen equipment Visakhapatnam contact",
    "kitchen equipment shop Auto Nagar Vizag",
    "request a quote kitchen equipment",
  ],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={images.kitchenWarm}
        eyebrow="Contact"
        title="Get in touch"
        description="We'd love to hear from you. For inquiries, questions or to request a quote, reach out — we typically respond within one business day."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <ContactSection />

      {/* Map */}
      <section className="bg-paper pb-20 sm:pb-28">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
            <iframe
              title="Veecos Head Office location"
              src="https://www.google.com/maps?q=Auto+Nagar,+Visakhapatnam,+Andhra+Pradesh+530012&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[0.2]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialMarquee } from "@/components/ui/TestimonialMarquee";
import { getTestimonials } from "@/lib/api";
import { testimonials as fallbackTestimonials } from "@/lib/content";

export async function TestimonialsSection() {
  // Live from the admin panel; fall back to the built-in set if none/unavailable.
  const fetched = await getTestimonials();
  const items = fetched.length > 0 ? fetched : fallbackTestimonials;

  return (
    <section className="overflow-hidden bg-paper-2 pb-20 pt-2 sm:pb-28 sm:pt-4">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What our clients say"
          description="A few words from the institutions, hotels and canteens we've built kitchens for."
        />
      </Container>
      <div className="mt-14">
        <TestimonialMarquee items={items} />
      </div>
    </section>
  );
}

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerTestimonials } from "@/components/ui/StaggerTestimonials";
import { getTestimonials } from "@/lib/api";
import { testimonials as fallbackTestimonials } from "@/lib/content";

export async function TestimonialsSection() {
  // Live from the admin panel; fall back to the built-in set if none/unavailable.
  const fetched = await getTestimonials();
  const items = fetched.length > 0 ? fetched : fallbackTestimonials;

  return (
    <section className="overflow-hidden bg-paper-2 py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What our clients say"
          description="A few words from the institutions, hotels and canteens we've built kitchens for."
        />
      </Container>
      <div className="mt-12">
        <StaggerTestimonials items={items} />
      </div>
    </section>
  );
}

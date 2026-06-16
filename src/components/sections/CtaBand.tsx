import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";

export interface CtaBandProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  /** Optional secondary link (defaults to Browse products). Pass null to hide. */
  secondary?: { label: string; href: string } | null;
}

/**
 * The standard dark CTA band that sits directly above the footer on every page.
 * Charcoal background, oversized headline, white enquiry pill + outline link.
 */
export function CtaBand({
  title = "Ready to plan your commercial kitchen?",
  description = "Tell us about your space and requirements — our team will help you design an efficient, durable kitchen that fits your budget.",
  primaryLabel = "Get a free quote",
  secondary = { label: "Browse products", href: "/products" },
}: CtaBandProps) {
  return (
    <section className="bg-charcoal py-24 text-white sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[1.0] tracking-[-0.025em]">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <EnquiryDialog
              label={primaryLabel}
              trigger={{ size: "lg", variant: "white" }}
            />
            {secondary && (
              <Button
                href={secondary.href}
                size="lg"
                variant="outlineLight"
                withArrow
              >
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-night pt-40 pb-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-brand/15 blur-[130px]" />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[7rem] font-bold leading-none text-brand">404</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            This page isn&apos;t on the menu
          </h1>
          <p className="mt-4 text-base text-white/65">
            The page you&apos;re looking for may have moved or no longer exists.
            Let&apos;s get you back to something useful.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/" withArrow>
              Back home
            </Button>
            <Button
              href="/products"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white hover:text-ink"
            >
              Browse products
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

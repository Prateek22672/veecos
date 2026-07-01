import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

/**
 * Shared certifications panel (CE, ISO 9001, ISO 14001, OHSAS 18001).
 * `tone` matches the section to its surroundings (cream on the catalogue,
 * white on product pages) so there's no jarring colour band.
 */
export function Certifications({ tone = "paper" }: { tone?: "paper" | "white" }) {
  return (
    <section
      className={cn(
        "py-10 sm:py-14",
        tone === "white" ? "bg-white" : "bg-paper",
      )}
    >
      <div className="mx-auto w-[95%] max-w-6xl rounded-4xl border border-ink/10 bg-white shadow-[0_34px_90px_-60px_rgba(28,27,27,0.32)]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <Reveal>
              <div className="max-w-md">
                <Eyebrow>Quality &amp; compliance</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                  Certified to international standards
                </h2>
                <p className="mt-3.5 text-[15px] leading-relaxed text-ink/60">
                  Every Veecos product is built to recognised quality, safety
                  and environmental standards — CE, ISO 9001, ISO 14001 and
                  OHSAS 18001 — so you can specify our equipment with full
                  confidence.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto w-full max-w-60 overflow-hidden rounded-xl border border-line">
                <Image
                  src="/certification-veecos.png"
                  alt="Veecos certifications — CE, ISO 9001, ISO 14001 and OHSAS 18001 certified commercial kitchen equipment manufacturer in Visakhapatnam (Vizag)"
                  width={768}
                  height={980}
                  sizes="240px"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

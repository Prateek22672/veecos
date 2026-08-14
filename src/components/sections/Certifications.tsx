import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { images } from "@/lib/images";
import { cn } from "@/lib/cn";

type Tone = "paper" | "white" | "dark";

/**
 * Shared certifications panel. Uses the real badge artwork (NSIC + ISO
 * 9001:2015) rather than a composite image, so only certifications Veecos
 * actually holds are ever shown. `tone` matches the section to its
 * surroundings: cream on the catalogue, white on product pages, dark when it
 * sits directly above the charcoal CtaBand (so the two flow as one band
 * instead of a cream section sandwiched between two other tones).
 */
export function Certifications({ tone = "paper" }: { tone?: Tone }) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "py-10 sm:py-14",
        dark ? "bg-charcoal" : tone === "white" ? "bg-white" : "bg-paper",
      )}
    >
      <div
        className={cn(
          "mx-auto w-[95%] max-w-6xl rounded-4xl border",
          dark
            ? "border-white/10 bg-white/4"
            : "border-ink/10 bg-white shadow-[0_34px_90px_-60px_rgba(28,27,27,0.32)]",
        )}
      >
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <Reveal>
              <div className="max-w-md">
                <Eyebrow light={dark}>Quality &amp; compliance</Eyebrow>
                <h2
                  className={cn(
                    "mt-3 text-2xl font-semibold leading-tight sm:text-3xl",
                    dark ? "text-white" : "text-ink",
                  )}
                >
                  Certified to recognised standards
                </h2>
                <p
                  className={cn(
                    "mt-3.5 text-[15px] leading-relaxed",
                    dark ? "text-white/60" : "text-ink/60",
                  )}
                >
                  Veecos Canteen Equipments is NSIC registered and ISO
                  9001:2015 certified, so you can specify our commercial
                  kitchen equipment with full confidence.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto flex w-full max-w-60 items-center justify-center gap-6">
                {dark ? (
                  <>
                    <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white p-3 sm:size-28">
                      <Image
                        src={images.nsic}
                        alt="NSIC registered — Veecos Canteen Equipments"
                        width={112}
                        height={112}
                        className="h-auto w-full object-contain"
                      />
                    </span>
                    <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white p-3 sm:size-28">
                      <Image
                        src={images.iso}
                        alt="ISO 9001:2015 certified — Veecos Canteen Equipments"
                        width={112}
                        height={112}
                        className="h-auto w-full object-contain"
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <Image
                      src={images.nsic}
                      alt="NSIC registered — Veecos Canteen Equipments"
                      width={112}
                      height={112}
                      className="h-auto w-24 object-contain sm:w-28"
                    />
                    <Image
                      src={images.iso}
                      alt="ISO 9001:2015 certified — Veecos Canteen Equipments"
                      width={112}
                      height={112}
                      className="h-auto w-24 object-contain sm:w-28"
                    />
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

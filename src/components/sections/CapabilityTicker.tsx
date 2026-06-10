import Image from "next/image";
import { clientLogos } from "@/lib/clients";

export function CapabilityTicker() {
  const logos = clientLogos.flatMap((c) => c.logos);
  const strip = [...logos, ...logos];

  return (
    <div className="border-y border-line bg-white/60 py-7">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40">
        Trusted by leading institutions &amp; businesses
      </p>
      <div className="marquee-pause marquee-mask flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee marquee-slow items-center gap-4 pr-4">
          {strip.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="grid h-20 w-36 shrink-0 place-items-center rounded-2xl border border-line bg-white px-5 shadow-soft"
            >
              <div className="relative h-11 w-full">
                <Image
                  src={logo.src}
                  alt={logo.name || "Veecos client"}
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

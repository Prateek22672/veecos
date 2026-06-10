import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import AnimatedTextCycle from "@/components/ui/AnimatedTextCycle";
import { clientLogos, totalClients, type ClientLogo } from "@/lib/clients";

// Flatten all logos, then split into 3 interleaved rows for a mixed collage.
const ALL = clientLogos.flatMap((c) => c.logos);
const ROWS: ClientLogo[][] = [[], [], []];
ALL.forEach((logo, i) => ROWS[i % 3].push(logo));

function LogoCard({ logo }: { logo: ClientLogo }) {
  return (
    <div className="grid h-24 w-44 shrink-0 place-items-center rounded-2xl border border-line bg-white px-6 shadow-soft transition-shadow duration-300 hover:shadow-card">
      <div className="relative h-14 w-full">
        <Image
          src={logo.src}
          alt={logo.name || "Veecos client"}
          fill
          sizes="176px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

function MarqueeRow({
  logos,
  reverse = false,
  slow = false,
}: {
  logos: ClientLogo[];
  reverse?: boolean;
  slow?: boolean;
}) {
  const strip = [...logos, ...logos];
  return (
    <div className="marquee-pause marquee-mask flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-4 pr-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } ${slow ? "marquee-slow" : ""}`}
      >
        {strip.map((logo, i) => (
          <LogoCard key={`${logo.src}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}

export function ClientsSection() {
  return (
    <section
      id="clients"
      className="scroll-mt-24 overflow-hidden bg-paper-2 py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>Our clients</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl lg:text-[2.9rem]">
              Trusted by leading{" "}
              <AnimatedTextCycle
                words={["colleges", "hotels", "hospitals", "canteens", "resorts"]}
                className="text-brand-700"
              />
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/60">
              From engineering colleges and hospitals to hotels, resorts and
              industrial canteens —{" "}
              <span className="font-semibold text-ink">{totalClients}+</span>{" "}
              institutions &amp; businesses across Andhra Pradesh &amp; Telangana
              rely on Veecos.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Moving logo collage — full colour, pauses on hover */}
      <div className="mt-14 flex flex-col gap-4">
        <MarqueeRow logos={ROWS[0]} />
        <MarqueeRow logos={ROWS[1]} reverse slow />
        <MarqueeRow logos={ROWS[2]} />
      </div>
    </section>
  );
}

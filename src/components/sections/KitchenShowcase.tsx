import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SealBadge } from "@/components/ui/SealBadge";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

const STATS = [
  { to: 25, suffix: "+", label: "Years of experience" },
  { to: 100, suffix: "+", label: "Projects delivered" },
  { to: 50, suffix: "+", label: "Happy clients" },
];

export function KitchenShowcase() {
  return (
    <section className="relative bg-paper py-10 sm:py-14">
      <SealBadge
        sizeClass="size-24 lg:size-48"
        className="absolute -left-7 top-3 lg:-left-12 lg:top-10"
      />
      {/* Cutlery emblem — complements the chef hat, diagonally opposite */}
      <Image
        src="/cutlury-logo.svg"
        alt=""
        aria-hidden
        width={240}
        height={240}
        className="pointer-events-none absolute -right-7 top-[14%] size-24 -rotate-12 select-none opacity-[0.06] sm:-right-6 sm:size-28 lg:right-2 lg:top-[30%] lg:size-44"
      />
      <Container>
        {/* Heading */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              <span className="h-px w-8 bg-ink/25" />
              Our work
            </span>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.96] tracking-[-0.02em] text-ink">
              Built for real, working kitchens
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/55">
              From the first layout to the final weld — turn-key commercial
              kitchens engineered to run, day after day.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.05}>
          <dl className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  <Counter to={s.to} />
                  {s.suffix}
                </dt>
                <dd className="mt-1.5 text-xs leading-snug text-ink/45">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Project image */}
        <Reveal delay={0.1}>
          <div className="relative mt-14 aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] sm:aspect-[25/9] sm:rounded-[2rem]">
            <Image
              src={images.restaurantPass}
              alt="A complete commercial kitchen delivered by Veecos"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white sm:p-9">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                  Turn-key project
                </p>
                <p className="mt-1.5 text-lg font-medium leading-tight sm:text-2xl">
                  Designed, fabricated &amp; installed by Veecos
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur sm:inline-block">
                Since {site.established}
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

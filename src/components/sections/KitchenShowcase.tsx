import Image from "next/image";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

const STATS = [
  { to: 25, suffix: "+", label: "Years of experience" },
  { to: 100, suffix: "+", label: "Projects delivered" },
  { to: 50, suffix: "+", label: "Happy clients" },
];

export function KitchenShowcase() {
  return (
    <section className="overflow-hidden bg-paper pt-16 pb-24 sm:pt-24 sm:pb-32">
      <ContainerScroll
        titleComponent={
          <div className="mx-auto max-w-2xl px-5 text-center mb-10">
            <div className="flex justify-center">
              <Eyebrow>Our work</Eyebrow>
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
              Built for real,{" "}
              <span className="text-brand-700">working kitchens</span>
            </h2>
            
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/65">
              From the first layout to the final weld — turn-key commercial
              kitchens engineered to run, day after day.
            </p>

            <dl className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    <Counter to={s.to} />
                    <span className="text-brand-700">{s.suffix}</span>
                  </dt>
                  <dd className="mt-1.5 text-xs leading-snug text-ink/50">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div> 
        }
      >
        <div className="relative size-full">
          <Image
            src={images.restaurantPass}
            alt="A complete commercial kitchen delivered by Veecos"
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                Turn-key project
              </p>
              <p className="text-lg font-semibold sm:text-xl">
                Designed, fabricated &amp; installed by Veecos
              </p>
            </div>
            <span className="hidden rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-ink sm:inline-block">
              Since {site.established}
            </span>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

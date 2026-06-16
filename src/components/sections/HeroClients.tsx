import Image from "next/image";

const LOGOS = [
  { name: "Daspalla", src: "/clients/restaurants/daspalla.avif" },
  { name: "Best Western", src: "/clients/restaurants/best-western.avif" },
  { name: "Bangalore Bhavan", src: "/clients/restaurants/bangaluru-bhavan.avif" },
  { name: "Tycoon", src: "/clients/restaurants/tycoon.avif" },
  { name: "FoodEx", src: "/clients/restaurants/food-ex.avif" },
  { name: "Sunray", src: "/clients/resorts/sunray.avif" },
  { name: "Waltair Club", src: "/clients/resorts/waltair-club.avif" },
  { name: "ITC", src: "/clients/industrial/itc.avif" },
  { name: "Oakridge", src: "/clients/colleges/oakridge.avif" },
  { name: "JNTU", src: "/clients/colleges/jntu.avif" },
  { name: "Visakha", src: "/clients/colleges/307938-2a2166137d464e0681ad4f21b6170a81.avif" },
];

export function HeroClients() {
  const strip = [...LOGOS, ...LOGOS];

  return (
    <div className="border-b border-ink/10 bg-paper py-9 sm:py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40">
        Trusted by leading institutions &amp; businesses
      </p>

      {/* Slow horizontal marquee — pauses on hover; hovered logo scales up */}
      <div className="marquee-pause marquee-mask mt-7 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee marquee-slow items-center gap-12 py-2 pr-12 sm:gap-16 sm:pr-16">
          {strip.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="relative h-10 w-28 shrink-0 opacity-80 transition-all duration-300 ease-out hover:scale-110 hover:opacity-100 sm:h-11 sm:w-32"
            >
              <Image
                src={logo.src}
                alt={logo.name || "Veecos client"}
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

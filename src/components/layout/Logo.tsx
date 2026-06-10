import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { images } from "@/lib/images";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Veecos — Home">
      <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white p-1.5 shadow-[0_6px_16px_-8px_rgba(28,27,27,0.5)] ring-1 ring-line transition-transform duration-300 group-hover:scale-105">
        <Image
          src={images.logo}
          alt="Veecos logo"
          width={40}
          height={40}
          className="size-full rounded-full object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-bold tracking-tight",
            light ? "text-white" : "text-ink",
          )}
        >
          VEECOS
        </span>
        <span
          className={cn(
            "mt-0.5 text-[9px] font-semibold uppercase tracking-[0.28em]",
            light ? "text-white/55" : "text-ink/45",
          )}
        >
          Canteen Equipments
        </span>
      </span>
    </Link>
  );
}

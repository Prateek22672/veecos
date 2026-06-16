import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { images } from "@/lib/images";

export function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="Veecos — Home"
    >
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1.5 ring-1 ring-ink/10 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={images.logo}
          alt="Veecos logo"
          width={40}
          height={40}
          className="size-full rounded-full object-contain"
          priority
        />
      </span>

      {/* Wordmark — collapses to the mark only when compact (scrolled pill) */}
      <span
        className={cn(
          "flex flex-col overflow-hidden leading-none transition-all duration-500",
          compact ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100",
        )}
      >
        <span
          className={cn(
            "whitespace-nowrap text-[15px] font-bold tracking-[-0.01em]",
            light ? "text-white" : "text-ink",
          )}
        >
          VEECOS
        </span>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.32em]",
            light ? "text-white/50" : "text-ink/40",
          )}
        >
          Canteen Equipments
        </span>
      </span>
    </Link>
  );
}

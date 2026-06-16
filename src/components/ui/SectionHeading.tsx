import Image from "next/image";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/**
 * Faint circular cutlery emblem — fills the empty space beside a left-aligned
 * heading. Decorative only (aria-hidden). Hidden on small screens.
 */
export function HeadingMark({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/cutlury-logo.svg"
      alt=""
      aria-hidden
      width={240}
      height={240}
      className={cn(
        "pointer-events-none hidden size-40 select-none lg:block xl:size-48",
        light ? "opacity-[0.09] invert" : "opacity-[0.06]",
        className,
      )}
    />
  );
}

export function Eyebrow({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em]",
        light ? "text-white/55" : "text-ink/45",
        className,
      )}
    >
      <span className={cn("h-px w-8", light ? "bg-white/30" : "bg-ink/25")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  emblem = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  /** Show the cutlery emblem in the empty space on the right (left-align only). */
  emblem?: boolean;
}) {
  const text = (
    <>
      {eyebrow && (
        <Reveal>
          <Eyebrow light={light}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "mt-4 text-3xl font-semibold leading-[1.05] sm:text-4xl lg:text-[2.9rem]",
            light ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              light ? "text-white/70" : "text-ink/65",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </>
  );

  if (emblem && align !== "center") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-8",
          className,
        )}
      >
        <div className="max-w-2xl">{text}</div>
        <HeadingMark light={light} className="shrink-0" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center [&_span]:justify-center",
        className,
      )}
    >
      {text}
    </div>
  );
}

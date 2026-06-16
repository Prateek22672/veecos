import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "lucide-react";

type Variant =
  | "primary"
  | "brand"
  | "dark"
  | "white"
  | "outline"
  | "outlineLight"
  | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  md: "h-11 px-6",
  lg: "h-13 px-8 text-[15px]",
};

const variants: Record<Variant, string> = {
  // Default CTA — solid near-black pill (matches the hero + reference look)
  primary: "bg-ink text-paper hover:bg-charcoal hover:-translate-y-0.5",
  // Brand-yellow pill — use on dark sections / as accent
  brand:
    "bg-brand text-ink hover:bg-brand-600 shadow-[0_8px_24px_-8px_rgba(237,205,31,0.7)] hover:-translate-y-0.5",
  dark: "bg-ink text-paper hover:bg-charcoal hover:-translate-y-0.5",
  // Solid white pill — use on dark sections (text stays ink for contrast)
  white: "bg-white text-ink hover:bg-white/90 hover:-translate-y-0.5",
  outline:
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  outlineLight:
    "border border-white/30 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:bg-ink/5",
};

type CommonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
      {withArrow && (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Link>
  );
}

export function ButtonAction({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
      {withArrow && (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  );
}

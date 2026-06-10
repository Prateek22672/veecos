import { cn } from "@/lib/cn";

/** Circular rotating text badge with a centred icon — a premium hero accent. */
export function RotatingBadge({
  text = "VEECOS • CANTEEN EQUIPMENTS • SINCE 1998 • ",
  className,
  children,
  light = false,
}: {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <svg
        viewBox="0 0 100 100"
        className="size-full motion-safe:animate-[spin_20s_linear_infinite]"
        aria-hidden="true"
      >
        <defs>
          <path
            id="rb-circle"
            d="M 50,50 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
          />
        </defs>
        <text
          className={light ? "fill-white" : "fill-ink"}
          style={{
            fontSize: "8.2px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#rb-circle" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">{children}</span>
    </div>
  );
}

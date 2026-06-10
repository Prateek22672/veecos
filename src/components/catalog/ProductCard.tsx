import Link from "next/link";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { bareId, type Product } from "@/lib/api";
import { categoryVisual } from "@/lib/catalog-visuals";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const id = bareId(product.PK);
  const img = product.Images?.[0] || categoryVisual(product.Name, product.Slug).image;
  const firstSpec = product.Specs ? Object.entries(product.Specs)[0] : undefined;

  return (
    <Link
      href={`/product/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-2">
        <SmartImage
          src={img}
          alt={product.Name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          fallbackLabel={product.Name}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.IsAvailable === false ? (
            <Badge tone="muted">Out of stock</Badge>
          ) : (
            <Badge tone="ok">Available</Badge>
          )}
          {product.IsCustomizable && (
            <Badge tone="brand">
              <Settings2 className="size-3" /> Custom
            </Badge>
          )}
        </div>
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand-700">
          {product.Name}
        </h3>
        {firstSpec && (
          <p className="mt-2 text-xs text-ink/55">
            <span className="font-medium text-ink/70">{firstSpec[0]}:</span>{" "}
            {firstSpec[1]}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink/70">
          View details
          <span className="h-px w-5 bg-brand-600 transition-all duration-300 group-hover:w-8" />
        </span>
      </div>
    </Link>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "ok" | "muted" | "brand";
}) {
  const tones = {
    ok: "bg-white/90 text-ink",
    muted: "bg-ink/80 text-white",
    brand: "bg-brand text-ink",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

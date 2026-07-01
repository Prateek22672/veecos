import Link from "next/link";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { bareId, type Product } from "@/lib/catalog-types";
import { categoryVisual } from "@/lib/catalog-visuals";
import { productAlt } from "@/lib/seo";

export function ProductCard({
  product,
  priority = false,
  eyebrow,
}: {
  product: Product;
  priority?: boolean;
  eyebrow?: string;
}) {
  const id = bareId(product.PK);
  const img =
    product.Images?.[0] || categoryVisual(product.Name, product.Slug).image;
  const firstSpec = product.Specs ? Object.entries(product.Specs)[0] : undefined;
  const available = product.IsAvailable !== false;

  return (
    <Link
      href={`/product/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:border-ink/25 hover:shadow-[0_22px_50px_-32px_rgba(20,20,15,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-2 p-3">
        <div className="relative h-full w-full">
          <SmartImage
            src={img}
            alt={productAlt(product.Name)}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fallbackLabel={product.Name}
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>

        {product.IsCustomizable && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink backdrop-blur">
            <Settings2 className="size-3" /> Custom
          </span>
        )}

        {!available && (
          <span className="absolute inset-0 grid place-items-center bg-white/65 text-xs font-semibold uppercase tracking-wide text-ink backdrop-blur-[1px]">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">
            {eyebrow}
          </p>
        )}
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {product.Name}
        </h3>
        {firstSpec && (
          <p className="mt-1.5 line-clamp-1 text-xs text-ink/50">
            <span className="font-medium text-ink/65">{firstSpec[0]}:</span>{" "}
            {firstSpec[1]}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-medium text-ink/60 transition-colors group-hover:text-ink">
          View details
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

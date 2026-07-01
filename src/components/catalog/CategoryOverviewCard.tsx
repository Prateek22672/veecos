import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryVisual } from "@/lib/catalog-visuals";
import { categoryAlt } from "@/lib/seo";
import { bareId, type Category } from "@/lib/catalog-types";

/**
 * Landing category card that previews its ranges (sub-categories) as chips
 * *inside* the card — so a visitor sees exactly what's in each category without
 * clicking. It's a div (not a link) so the chips can be their own links.
 */
export function CategoryOverviewCard({
  category,
  subcategories,
  priority = false,
  meta,
}: {
  category: Category;
  subcategories: Category[];
  priority?: boolean;
  meta?: string;
}) {
  const id = bareId(category.PK);
  const { image, blurb } = categoryVisual(category.Name, category.Slug);
  const cover = category.ImageUrl || image;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:border-ink/20 hover:shadow-card">
      <Link
        href={`/products/${id}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <SmartImage
          src={cover}
          alt={categoryAlt(category.Name)}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fallbackLabel={category.Name}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent" />
        {meta && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink backdrop-blur">
            {meta}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-medium tracking-tight text-ink transition-colors group-hover:text-ink">
            {category.Name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/55">
          {blurb}
        </p>

        {subcategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {subcategories.slice(0, 5).map((s) => {
              const sid = bareId(s.PK);
              return (
                <Link
                  key={sid}
                  href={`/products/${sid}?p=${id}`}
                  className="rounded-full border border-ink/12 bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink/65 transition-colors hover:border-ink/30 hover:bg-white hover:text-ink"
                >
                  {s.Name}
                </Link>
              );
            })}
            {subcategories.length > 5 && (
              <Link
                href={`/products/${id}`}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-ink/45 transition-colors hover:text-ink"
              >
                +{subcategories.length - 5} more
              </Link>
            )}
          </div>
        )}

        <Link
          href={`/products/${id}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
        >
          Explore range
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

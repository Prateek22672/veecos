import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryVisual } from "@/lib/catalog-visuals";
import { bareId, type Category } from "@/lib/api";
import { cn } from "@/lib/cn";

export function CategoryCard({
  category,
  priority = false,
  className,
}: {
  category: Category;
  priority?: boolean;
  className?: string;
}) {
  const id = bareId(category.PK);
  const { image, blurb } = categoryVisual(category.Name, category.Slug);

  return (
    <Link
      href={`/products/${id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-400 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={image}
          alt={category.Name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fallbackLabel={category.Name}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
        <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-brand-700">
          {category.Name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/55">{blurb}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink/70">
          View range
          <span className="h-px w-6 bg-brand-600 transition-all duration-300 group-hover:w-10" />
        </span>
      </div>
    </Link>
  );
}

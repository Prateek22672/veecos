import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductBrowser } from "@/components/catalog/ProductBrowser";
import { Certifications } from "@/components/sections/Certifications";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  getCatalogTree,
  getAllProducts,
  resolveCategory,
  prettify,
  bareId,
} from "@/lib/api";
import { categoryMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cat = await resolveCategory(id);
  const name = cat?.Name ?? prettify(id);
  return categoryMetadata(name, id, cat?.ImageUrl);
}

export default async function CategoryPage({ params }: Params) {
  const { id } = await params;

  const [category, tree, allProducts] = await Promise.all([
    resolveCategory(id),
    getCatalogTree(),
    getAllProducts(),
  ]);

  // Is this a main category (has sub-categories)?
  const node = tree.find((n) => bareId(n.category.PK) === id);
  const subcategories = node?.subcategories ?? [];
  const isMain = subcategories.length > 0;

  // Parent (for breadcrumb) when this is a sub-category.
  const parentNode = tree.find((n) =>
    n.subcategories.some((s) => bareId(s.PK) === id),
  );
  const subFromParent = parentNode?.subcategories.find(
    (s) => bareId(s.PK) === id,
  );
  const name =
    category?.Name ?? node?.category.Name ?? subFromParent?.Name ?? prettify(id);
  const parentName = parentNode?.category.Name;
  const parentHref = parentNode
    ? `/products/${bareId(parentNode.category.PK)}`
    : undefined;

  const countFor = (catId: string, subIds: string[] = []) => {
    const set = new Set([catId, ...subIds]);
    return allProducts.filter((p) => p.CategoryId && set.has(p.CategoryId)).length;
  };

  // Products under this category (for SEO ItemList).
  const subIds = subcategories.map((s) => bareId(s.PK));
  const allowed = new Set([id, ...subIds]);
  const catProducts = allProducts.filter(
    (p) => p.CategoryId && allowed.has(p.CategoryId),
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];
  if (parentName && parentHref) crumbs.push({ name: parentName, path: parentHref });
  crumbs.push({ name, path: `/products/${id}` });
  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    isMain
      ? itemListJsonLd(
          `${name} — ranges`,
          subcategories.map((s) => ({
            name: s.Name,
            path: `/products/${bareId(s.PK)}?p=${id}`,
          })),
        )
      : itemListJsonLd(
          `${name} — commercial kitchen equipment`,
          catProducts.map((p) => ({
            name: p.Name,
            path: `/product/${bareId(p.PK)}`,
          })),
        ),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="bg-paper pb-8 pt-28 sm:pb-10 sm:pt-32">
        <Container>
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
            <Link href="/products" className="transition-colors hover:text-ink">
              Products
            </Link>
            {parentName && parentHref && (
              <>
                <ChevronRight className="size-3.5 text-ink/30" />
                <Link href={parentHref} className="transition-colors hover:text-ink">
                  {parentName}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5 text-ink/30" />
            <span className="text-ink/70">{name}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.02] tracking-tight text-ink">
            {name}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/55">
            {isMain
              ? "Choose a range to see its products — every item is built to your kitchen's size and workflow."
              : "Fully customisable to your kitchen's size and workflow. Request a quote on any product below."}
          </p>
        </Container>
      </section>

      <CategoryNav tree={tree} activeId={id} />

      <section className="bg-paper py-14 sm:py-20">
        <Container>
          {isMain ? (
            <>
              <Eyebrow>Ranges in {name}</Eyebrow>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((sub, i) => {
                  const sid = bareId(sub.PK);
                  const n = countFor(sid);
                  return (
                    <Reveal key={sub.PK} delay={(i % 3) * 0.07}>
                      <CategoryCard
                        category={sub}
                        parentId={id}
                        priority={i < 3}
                        cta="View products"
                        meta={
                          n > 0 ? `${n} ${n > 1 ? "products" : "product"}` : undefined
                        }
                      />
                    </Reveal>
                  );
                })}
              </div>
            </>
          ) : (
            <ProductBrowser products={allProducts} tree={tree} initialCat={id} />
          )}
        </Container>
      </section>

      <Certifications />

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}

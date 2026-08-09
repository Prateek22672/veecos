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
  getCatalogHealth,
  resolveCategory,
  prettify,
  bareId,
} from "@/lib/api";
import { CatalogDebug } from "@/components/providers/CatalogDebug";
import { toProductSummary, categoryCover } from "@/lib/catalog-types";
import { categoryMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

// Caching disabled: render on every request so anything the admin adds or
// edits appears immediately, with no stale window and no build-time snapshot.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cat = await resolveCategory(id);
  const name = cat?.Name ?? prettify(id);
  return categoryMetadata(name, id, cat ? categoryCover(cat) : undefined);
}

export default async function CategoryPage({ params }: Params) {
  const { id } = await params;

  const [category, tree, allProducts, health] = await Promise.all([
    resolveCategory(id),
    getCatalogTree(),
    getAllProducts(),
    getCatalogHealth(),
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
  const resolvedName =
    category?.Name ?? node?.category.Name ?? subFromParent?.Name;
  // If nothing resolved the id, prettify() just hands back the raw hash
  // (e.g. "97be0b6a") — never show that to a visitor.
  const looksLikeRawId = (v: string) => /^[0-9a-f]{6,}$/i.test(v);
  const name =
    resolvedName ?? (looksLikeRawId(id) ? "More products" : prettify(id));
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

      <CatalogDebug
        info={{
          page: `/products/${id}  (${name})`,
          categoriesDiscoverable: health.categoriesVisible,
          productsTotal: health.productsTotal,
          productsBrowsable: health.productsBrowsable,
          unreachableCategoryIds: health.unreachableCategoryIds,
          endpoints: [
            "GET /categories",
            "GET /categories/{id}/subcategories   (once per root category)",
            "GET /products   (paginated, 10/page via ?lastKey=)",
            `→ this category resolved to: ${category ? `"${category.Name}"` : "NOT FOUND in /categories or any /subcategories"}`,
            `→ products matched to this category: ${catProducts.length}`,
          ],
        }}
      />

      {/* Header — compact, store-style: crumb, title + live count, one line */}
      <section className="bg-paper pb-6 pt-28 sm:pb-8 sm:pt-32">
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
          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold leading-[1.05] tracking-tight text-ink">
              {name}
            </h1>
            <span className="inline-flex items-center rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-medium text-ink/60">
              {isMain
                ? `${subcategories.length} ${subcategories.length === 1 ? "range" : "ranges"}${catProducts.length > 0 ? ` · ${catProducts.length} products` : ""}`
                : `${catProducts.length} ${catProducts.length === 1 ? "product" : "products"}`}
            </span>
          </div>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink/55 sm:text-[15px]">
            {isMain
              ? "Choose a range to see its products — every item is built to your kitchen's size and workflow."
              : "Fully customisable to your kitchen's size and workflow. Request a quote on any product below."}
          </p>
        </Container>
      </section>

      <CategoryNav tree={tree} activeId={id} />

      <section className="bg-paper py-10 sm:py-12">
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

              {/* Products can also live directly under a main category — show
                  the full browsable list (direct + range products) below. */}
              {catProducts.length > 0 && (
                <div className="mt-14 border-t border-ink/10 pt-12 sm:mt-16">
                  <div className="mb-8">
                    <Eyebrow>All products in {name}</Eyebrow>
                  </div>
                  <ProductBrowser
                    products={allProducts.map(toProductSummary)}
                    tree={tree}
                    initialCat={id}
                  />
                </div>
              )}
            </>
          ) : (
            <ProductBrowser
              products={allProducts.map(toProductSummary)}
              tree={tree}
              initialCat={id}
            />
          )}
        </Container>
      </section>

      <Certifications />

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}

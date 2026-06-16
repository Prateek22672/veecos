import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CategoryRail } from "@/components/catalog/CategoryRail";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  getCatalogTree,
  getAllProducts,
  getSubcategories,
  getSearchItems,
  resolveCategory,
  prettify,
  bareId,
  type Category,
  type CatalogNode,
} from "@/lib/api";
import { categoryMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };
type Search = { searchParams: Promise<{ p?: string }> };

function synthCategory(id: string, name: string): Category {
  return {
    PK: `CATEGORY#${id}`,
    SK: `CATEGORY#${id}`,
    Name: name,
    Slug: "",
    Type: "Category",
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cat = await resolveCategory(id);
  const name = cat?.Name ?? prettify(id);
  return categoryMetadata(name, id, cat?.ImageUrl);
}

export default async function CategoryPage({
  params,
  searchParams,
}: Params & Search) {
  const { id } = await params;
  const { p: parentId } = await searchParams;

  const [category, subcategories, allProducts, tree, searchItems] =
    await Promise.all([
      resolveCategory(id),
      getSubcategories(id),
      // Use the same reliable global product list as the home page, then filter
      // by CategoryId — the /categories/{id}/products endpoint is inconsistent.
      getAllProducts(),
      getCatalogTree(),
      getSearchItems(),
    ]);

  const productsFor = (catId: string) =>
    allProducts.filter((prod) => prod.CategoryId === catId);

  const ownProducts = productsFor(id);
  const isMain = subcategories.length > 0;
  const isHashId = /^[0-9a-f]{6,}$/i.test(id);

  // --- Resolve the display name + sidebar branch, resilient to an empty root list ---
  let name = category?.Name ?? (isHashId ? "Catalogue" : prettify(id));
  let branch: CatalogNode | undefined;
  let parentName: string | undefined;
  let parentHref: string | undefined;

  if (isMain) {
    // This is a main category — its sub-categories form the left rail.
    branch = { category: synthCategory(id, name), subcategories };
  } else if (parentId) {
    // This is a sub-category reached from its parent — rebuild the sibling rail
    // and recover this category's real name from the parent's listing.
    const siblings = await getSubcategories(parentId);
    const me = siblings.find((c) => bareId(c.PK) === id);
    if (me) name = me.Name;
    const parentCat =
      tree.find((n) => bareId(n.category.PK) === parentId)?.category ??
      synthCategory(parentId, "Categories");
    parentName = parentCat.Name === "Categories" ? undefined : parentCat.Name;
    parentHref = `/products/${parentId}`;
    branch = { category: parentCat, subcategories: siblings };
  }

  // --- Decide what products to show on the right ---
  let rightProducts = ownProducts;
  let rightLabel = name;
  let activeId = id;

  if (isMain && ownProducts.length === 0) {
    // Main with no direct products → show the first sub-category's products.
    const first = subcategories[0];
    const firstId = bareId(first.PK);
    rightProducts = productsFor(firstId);
    rightLabel = first.Name;
    activeId = firstId;
  }

  const hasRail = tree.length > 0 || !!branch;

  // Horizontal sub-category pills (quick switching) built from the current branch.
  const railRootId = branch ? bareId(branch.category.PK) : "";
  const railRootName =
    branch && branch.category.Name !== "Categories"
      ? branch.category.Name
      : "All products";
  const railItems = branch
    ? [
        { id: railRootId, name: railRootName, href: `/products/${railRootId}` },
        ...branch.subcategories.map((s) => {
          const sid = bareId(s.PK);
          return {
            id: sid,
            name: s.Name,
            href: `/products/${sid}?p=${railRootId}`,
            count: productsFor(sid).length,
          };
        }),
      ]
    : [];

  // Structured data — breadcrumb trail + the products listed on this page.
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];
  if (parentName && parentHref) crumbs.push({ name: parentName, path: parentHref });
  crumbs.push({ name, path: `/products/${id}` });
  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    itemListJsonLd(
      `${rightLabel} — commercial kitchen equipment`,
      rightProducts.map((prod) => ({
        name: prod.Name,
        path: `/product/${bareId(prod.PK)}`,
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
      <section className="bg-paper pt-28 sm:pt-32">
        <Container>
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
            <Link href="/products" className="transition-colors hover:text-ink">
              Products
            </Link>
            {parentName && parentHref && (
              <>
                <ChevronRight className="size-3.5 text-ink/30" />
                <Link
                  href={parentHref}
                  className="transition-colors hover:text-ink"
                >
                  {parentName}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5 text-ink/30" />
            <span className="text-ink/70">{name}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.98] tracking-tight text-ink">
            {name}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/55 sm:text-lg">
            {isMain
              ? "Pick a range on the left to see its products. Every item is built to your kitchen's size and workflow."
              : "Fully customisable to your kitchen's size and workflow. Request a quote on any product below."}
          </p>
        </Container>
      </section>

      {/* Sub-category quick-nav — horizontal scroll, great on mobile */}
      {railItems.length > 1 && (
        <div className="sticky top-[4.75rem] z-30 mt-8 border-y border-ink/8 bg-paper/85 py-3 backdrop-blur-md sm:top-20">
          <Container>
            <CategoryRail items={railItems} activeId={activeId} />
          </Container>
        </div>
      )}

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div
            className={
              hasRail ? "grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14" : ""
            }
          >
            {hasRail && (
              <CatalogSidebar
                tree={tree}
                branch={branch}
                activeId={activeId}
                searchItems={searchItems}
              />
            )}

            <div>
              {rightProducts.length > 0 ? (
                <>
                  <Eyebrow>
                    {rightLabel} · {rightProducts.length} product
                    {rightProducts.length > 1 ? "s" : ""}
                  </Eyebrow>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {rightProducts.map((prod, i) => (
                      <Reveal key={prod.PK} delay={(i % 3) * 0.06}>
                        <ProductCard
                          product={prod}
                          eyebrow={rightLabel}
                          priority={i < 3}
                        />
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-ink/10 bg-paper-2 p-12 text-center">
                  <p className="text-ink/60">
                    Products in this range are being added. Contact us for the
                    full range and pricing.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-charcoal"
                    >
                      Request details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}

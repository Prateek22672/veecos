import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Settings2, CheckCircle2, XCircle, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductCard } from "@/components/catalog/ProductCard";
import { RichText } from "@/components/ui/RichText";
import { Certifications } from "@/components/sections/Certifications";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";
import { getProduct, getAllProducts, resolveCategory, bareId } from "@/lib/api";
import { site } from "@/lib/site";
import {
  productMetadata,
  productAlt,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return productMetadata(product, id);
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const categoryId = product.GSI1PK ? bareId(product.GSI1PK) : null;
  const specs = product.Specs ? Object.entries(product.Specs) : [];
  const available = product.IsAvailable !== false;

  // Resolve the real category name (never show the raw id/hash to users).
  const category = categoryId ? await resolveCategory(categoryId) : null;
  const categoryName = category?.Name;

  // Related products from the same category.
  const catKey = product.CategoryId ?? categoryId ?? undefined;
  const allProducts = await getAllProducts();
  const related = catKey
    ? allProducts
        .filter((p) => p.CategoryId === catKey && bareId(p.PK) !== id)
        .slice(0, 8)
    : [];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.Name,
    image: product.Images,
    description:
      product.Description ??
      `${product.Name} — customisable commercial kitchen equipment by Veecos Canteen Equipments, Visakhapatnam (Vizag).`,
    ...(categoryName ? { category: categoryName } : {}),
    sku: id,
    brand: { "@type": "Brand", name: site.shortName },
    manufacturer: {
      "@type": "Organization",
      name: site.name,
      areaServed: ["Visakhapatnam", "Vizag", "Hyderabad", "Andhra Pradesh", "Telangana"],
    },
    offers: {
      "@type": "Offer",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "INR",
      url: `${site.url}/product/${id}`,
      seller: { "@type": "Organization", name: site.name },
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(categoryId && categoryName
      ? [{ name: categoryName, path: `/products/${categoryId}` }]
      : []),
    { name: product.Name, path: `/product/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumb]),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-white pt-28 sm:pt-32">
        <Container>
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-ink/30" />
            <Link href="/products" className="transition-colors hover:text-ink">
              Products
            </Link>
            {categoryName && categoryId && (
              <>
                <ChevronRight className="size-3.5 text-ink/30" />
                <Link
                  href={`/products/${categoryId}`}
                  className="transition-colors hover:text-ink"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5 text-ink/30" />
            <span className="max-w-[16rem] truncate text-ink/70">
              {product.Name}
            </span>
          </nav>
        </Container>
      </div>

      <section className="bg-white pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Gallery */}
            <Reveal>
              <ProductGallery
                images={product.Images ?? []}
                alt={productAlt(product.Name)}
              />
            </Reveal>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {available ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    <CheckCircle2 className="size-3.5" /> Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink/70">
                    <XCircle className="size-3.5" /> Out of stock
                  </span>
                )}
                {product.IsCustomizable && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    <Settings2 className="size-3.5" /> Customisable
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                {product.Name}
              </h1>
              {product.Description && (
                <RichText html={product.Description} className="mt-4" />
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
                    Specifications
                  </h2>
                  <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-2">
                    {specs.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 gap-4 px-5 py-3.5 text-sm"
                      >
                        <dt className="font-medium text-ink/60">{key}</dt>
                        <dd className="text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <EnquiryDialog
                  label="Request a quote"
                  productId={id}
                  productName={product.Name}
                  trigger={{ size: "lg", className: "w-full sm:w-auto" }}
                />
                <a
                  href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-ink/20 px-7 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <Phone className="size-4" strokeWidth={1.8} />
                  {site.phones[0]}
                </a>
              </div>
              <p className="mt-3 text-sm text-ink/55">
                Pricing is quoted per project &amp; configuration — we reply within
                one business day.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Related products from the same category */}
      {related.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <Container>
            <Eyebrow>Related products</Eyebrow>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.PK} product={p} eyebrow={categoryName} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Certifications — common to every product */}
      <Certifications tone="white" />

      {/* Enquiry CTA — opens the quote wizard, pre-filled with this product */}
      <section className="bg-white pb-16 pt-4 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-12 text-center text-paper sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight">
              Interested in the {product.Name}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-paper/65">
              Tell us your requirements — capacity, dimensions &amp; finishes — and
              our team will send a tailored quote within one business day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <EnquiryDialog
                label="Request a quote"
                productId={id}
                productName={product.Name}
                trigger={{ variant: "white", size: "lg" }}
              />
              <a
                href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
              >
                <Phone className="size-4" strokeWidth={1.8} />
                Call {site.phones[0]}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Settings2, CheckCircle2, XCircle, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { LeadForm } from "@/components/contact/LeadForm";
import { getProduct, bareId, prettify } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  const specSummary = product.Specs
    ? Object.entries(product.Specs)
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    : "";
  return {
    title: product.Name,
    description: `${product.Name} by Veecos Canteen Equipments. ${specSummary}. Customisable commercial kitchen equipment — request a quote.`,
    alternates: { canonical: `/product/${id}` },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const categoryId = product.GSI1PK ? bareId(product.GSI1PK) : null;
  const specs = product.Specs ? Object.entries(product.Specs) : [];
  const available = product.IsAvailable !== false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.Name,
    image: product.Images,
    brand: { "@type": "Brand", name: site.shortName },
    manufacturer: { "@type": "Organization", name: site.name },
    offers: {
      "@type": "Offer",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "INR",
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* slim header */}
      <div className="bg-ink pt-28 pb-6 text-white sm:pt-32">
        <Container>
          <Link
            href={categoryId ? `/products/${categoryId}` : "/products"}
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Back to {categoryId ? prettify(categoryId) : "products"}
          </Link>
        </Container>
      </div>

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Gallery */}
            <Reveal>
              <ProductGallery images={product.Images ?? []} alt={product.Name} />
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">
                    <Settings2 className="size-3.5" /> Customisable
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                {product.Name}
              </h1>
              {product.Description && (
                <p className="mt-4 text-base leading-relaxed text-ink/65">
                  {product.Description}
                </p>
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
                    Specifications
                  </h2>
                  <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
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

              <div className="mt-8 rounded-2xl border border-brand/30 bg-brand-soft/40 p-5">
                <p className="text-sm text-ink/75">
                  Pricing is quoted per project and configuration. Send an enquiry
                  below or call{" "}
                  <a
                    href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                    className="font-semibold text-ink underline underline-offset-4"
                  >
                    {site.phones[0]}
                  </a>{" "}
                  for a fast quote.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Enquiry */}
      <section className="bg-paper-2 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                Enquire about this product
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
                Tell us your requirements — capacity, dimensions, finishes — and our
                team will get back with a tailored quote for the{" "}
                <span className="font-medium text-ink">{product.Name}</span>.
              </p>
              <a
                href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-brand"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand/15 text-brand-700">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-ink/55">Call us directly</span>
                  <span className="block text-sm font-semibold text-ink">
                    {site.phones[0]}
                  </span>
                </span>
              </a>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-9">
              <LeadForm productId={id} productName={product.Name} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

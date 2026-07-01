import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { Navbar, type MenuCard } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomBar } from "@/components/layout/BottomBar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SplashScreen } from "@/components/providers/SplashScreen";
import { SeoOverrides } from "@/components/providers/SeoOverrides";
import { getRootCategories, bareId } from "@/lib/api";
import { categoryVisual } from "@/lib/catalog-visuals";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "commercial kitchen equipment Visakhapatnam",
    "best kitchen equipment in Vizag",
    "commercial kitchen equipment installation",
    "canteen equipment manufacturer Visakhapatnam",
    "commercial kitchen equipment manufacturer Andhra Pradesh",
    "cooking range manufacturer Vizag",
    "exhaust hood manufacturer",
    "stainless steel kitchen equipment",
    "restaurant kitchen equipment Vizag",
    "hotel & hospital kitchen equipment",
    "industrial kitchen equipment",
    "turn-key commercial kitchen Visakhapatnam",
    "Veecos Canteen Equipments",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "Commercial Kitchen Equipment",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: "Veecos commercial kitchen equipment, Visakhapatnam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${site.url}/#business`,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  description: site.description,
  slogan: site.tagline,
  foundingDate: String(site.established),
  image: `${site.url}${site.ogImage}`,
  logo: `${site.url}/logo.png`,
  email: site.emails[0],
  telephone: site.phones[0],
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
  ],
  areaServed: [
    "Visakhapatnam",
    "Vizag",
    "Andhra Pradesh",
    "Telangana",
    "India",
  ],
  knowsAbout: [
    "Commercial kitchen equipment",
    "Cooking ranges",
    "Exhaust hoods",
    "Refrigeration",
    "Kitchen equipment installation",
    "Turn-key commercial kitchens",
  ],
  sameAs: [site.socials.instagram, site.socials.linkedin],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Live main categories → the Products mega-menu (deduped with page fetches).
  const roots = await getRootCategories();
  const productMenu: MenuCard[] = roots.slice(0, 5).map((c) => ({
    label: c.Name,
    href: `/products/${bareId(c.PK)}`,
    image: c.ImageUrl || categoryVisual(c.Name, c.Slug).image,
  }));
  if (productMenu.length > 0) {
    productMenu.push({ label: "All products", href: "/products", plus: true });
  }

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/*
          Site font stack is "Saans", Arial, sans-serif (see globals.css).
          Saans is a licensed font — drop its .woff2 files in /public/fonts and
          add an @font-face for "Saans" to load it; otherwise it falls back to
          Arial (the same clean grotesque used as the reference fallback).
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper">
        <SplashScreen />
        <SmoothScroll />
        <SeoOverrides />
        <Navbar productMenu={productMenu} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomBar />
      </body>
    </html>
  );
}

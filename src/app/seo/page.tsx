import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo-config";
import { site } from "@/lib/site";
import { SeoDashboard } from "@/components/seo/SeoDashboard";

export const metadata: Metadata = {
  title: "SEO Manager",
  robots: { index: false, follow: false },
};

export default function SeoPage() {
  const defaults = Object.entries(PAGE_SEO).map(([key, v]) => ({ key, ...v }));
  return <SeoDashboard defaults={defaults} siteUrl={site.url} />;
}

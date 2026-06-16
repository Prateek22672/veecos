import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Clock,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { nav, site } from "@/lib/site";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

const COMPANY_LINKS = [
  { label: "All products", href: "/products" },
  { label: "Our clients", href: "/#clients" },
  { label: "Request a quote", href: "/contact" },
  { label: "About Veecos", href: "/about" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      {/* Oversized brand watermark */}
      <span className="pointer-events-none absolute -bottom-6 -left-4 select-none text-[clamp(7rem,19vw,17rem)] font-bold leading-none tracking-tighter text-white/[0.035] sm:-bottom-12">
        VEECOS
      </span>

      <Container className="relative">
        {/* ── Top band: address + appointment CTA ── */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Logo light />
            <span className="hidden h-10 w-px bg-white/15 sm:block" />
            <p className="hidden max-w-[15rem] text-sm leading-snug text-white/55 sm:block">
              {site.address.line}, {site.address.city}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/contact"
              className="inline-flex h-13 items-center rounded-full border border-white/25 px-7 text-[15px] font-medium text-white transition-all duration-300 hover:bg-white hover:text-ink"
            >
              Schedule a consultation
            </Link>
            <Link
              href="/contact"
              aria-label="Contact us"
              className="grid size-13 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-all duration-300 hover:bg-white hover:text-ink"
            >
              <ArrowUpRight className="size-5" />
            </Link>
          </div>
        </div>

        {/* ── Columns ── */}
        <div className="grid gap-10 py-16 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-white/55">
              Commercial kitchen equipment manufacturer since {site.established}.
              Turn-key kitchens, custom fabrication &amp; after-sales support
              across Andhra Pradesh, Telangana and beyond.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href={site.socials.instagram} label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href={site.socials.linkedin} label="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
            </div>
          </div>

          <FooterCol title="Explore" items={nav} />
          <FooterCol title="Company" items={COMPANY_LINKS} />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/65">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4.5 shrink-0 text-white/40" />
                <span>{site.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4.5 shrink-0 text-white/40" />
                <span className="flex flex-col">
                  {site.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4.5 shrink-0 text-white/40" />
                <span className="flex flex-col">
                  {site.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="hover:text-white">
                      {e}
                    </a>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Trust badges ── */}
        <div className="grid gap-6 border-t border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <TrustBadge logo={images.nsic} title="NSIC Certified" sub="Govt. registered" />
          <TrustBadge logo={images.iso} title="ISO 9001:2015" sub="Quality assured" />
          <TrustBadge icon={Clock} title="25+ Years" sub="Of experience" />
          <TrustBadge icon={Headset} title="Pan-India" sub="After-sales support" />
        </div>

        {/* ── Legal ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-xs text-white/45 sm:flex-row">
          <p>
            © {site.established} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            <span>NSIC &amp; ISO 9001:2015 Certified · Made in India</span>
            <a
              href="https://foliofyx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/55 transition-colors hover:text-white"
            >
              Crafted by FOLIOFYX
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustBadge({
  logo,
  icon: Icon,
  title,
  sub,
}: {
  logo?: string;
  icon?: LucideIcon;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white p-2.5">
          <Image src={logo} alt="" width={36} height={36} className="size-full object-contain" />
        </span>
      ) : Icon ? (
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 text-white/70">
          <Icon className="size-5" />
        </span>
      ) : null}
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-[11px] text-white/45">{sub}</p>
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-white hover:bg-white hover:text-ink"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4V9Z" />
    </svg>
  );
}

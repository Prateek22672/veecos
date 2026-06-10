import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
      <Container className="relative">
        {/* CTA band */}
        <div className="grid gap-8 border-b border-white/10 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Get in touch
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
              Planning a new kitchen? Let&apos;s build it right.
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/contact"
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-brand px-8 text-[15px] font-medium text-ink transition-all hover:bg-brand-600 hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href={`mailto:${site.quoteEmail}`}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              or email {site.quoteEmail}
            </a>
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1.3fr]">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              Commercial kitchen equipment manufacturer since {site.established}.
              Turn-key kitchens, custom fabrication & after-sales support across
              Andhra Pradesh, Telangana and beyond.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href={site.socials.instagram} label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href={site.socials.linkedin} label="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
            </div>

            <div className="mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Certified &amp; registered
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <CertChip
                  src={images.nsic}
                  alt="NSIC certified"
                  title="NSIC"
                  subtitle="Govt. Registered"
                />
                <CertChip
                  src={images.iso}
                  alt="ISO 9001:2015 certified"
                  title="ISO 9001:2015"
                  subtitle="Quality Assured"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Head Office
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <span>{site.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <span className="flex flex-col">
                  {site.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-brand">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <span className="flex flex-col">
                  {site.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="hover:text-brand">
                      {e}
                    </a>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-white/45 sm:flex-row">
          <p>
            © {site.established} {site.name}. All rights reserved.
          </p>
          <p>NSIC &amp; ISO 9001:2015 Certified · Made in India</p>
        </div>
      </Container>
    </footer>
  );
}

function CertChip({
  src,
  alt,
  title,
  subtitle,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-2 pr-4 transition-colors duration-300 hover:border-brand/40 hover:bg-white/10">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white p-1.5">
        <Image src={src} alt={alt} width={44} height={44} className="size-full object-contain" />
      </span>
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-white">{title}</p>
        <p className="text-[10px] uppercase tracking-wide text-white/45">{subtitle}</p>
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
      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-brand hover:bg-brand hover:text-ink"
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

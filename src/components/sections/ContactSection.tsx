import { Mail, MapPin, Phone, Clock, Check, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";
import { site, whatsappUrl } from "@/lib/site";

const PERKS = [
  "Free design consultation",
  "Custom quote within one business day",
  "Turn-key — design, build & install",
];

/** Shared affordance so every clickable link reads clearly as a link. */
const LINK =
  "w-fit font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink";

const WHATSAPP_URL = whatsappUrl();

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Info */}
          <div>
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl">
                Let&apos;s talk about your kitchen
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
                For any inquiries, questions or commendations, call{" "}
                <a
                  href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                  className="font-medium text-ink underline underline-offset-4"
                >
                  {site.phones[0]}
                </a>{" "}
                or fill out the form and we&apos;ll be in touch.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              <InfoRow icon={MapPin} title="Head Office">
                {site.address.full}
              </InfoRow>
              <InfoRow icon={Phone} title="Call us">
                <div className="flex flex-col items-start gap-0.5">
                  {site.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className={LINK}>
                      {p}
                    </a>
                  ))}
                </div>
              </InfoRow>
              <InfoRow icon={WhatsAppIcon} title="WhatsApp">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 font-medium text-[#1aa851] underline decoration-[#1aa851]/35 underline-offset-4 transition-colors hover:decoration-[#1aa851]"
                >
                  Chat with us on WhatsApp
                  <ArrowUpRight className="size-3.5" />
                </a>
              </InfoRow>
              <InfoRow icon={Mail} title="Email">
                <div className="flex flex-col items-start gap-0.5">
                  {site.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className={LINK}>
                      {e}
                    </a>
                  ))}
                </div>
              </InfoRow>
              <InfoRow icon={Clock} title="Working hours">
                Mon – Sat · 9:30 AM – 7:00 PM
              </InfoRow>
            </div>
          </div>

          {/* Enquiry — opens a popup form */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-8 shadow-card sm:p-10">
              <div>
                <h3 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                  Schedule a consultation
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink/60">
                  Share your kitchen requirements and our team will get back with
                  a tailored plan and quote.
                </p>
                <ul className="mt-7 space-y-3">
                  {PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm text-ink/75">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full border border-ink/15 text-ink">
                        <Check className="size-3" strokeWidth={2.5} />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-9 space-y-3">
                <EnquiryDialog
                  label="Send us an enquiry"
                  trigger={{ size: "lg", className: "w-full" }}
                />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[15px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(37,211,102,0.8)] transition-all duration-300 hover:bg-[#1ebe5b]"
                >
                  <WhatsAppIcon className="size-5" />
                  Chat on WhatsApp
                </a>
                <p className="text-center text-xs text-ink/45">
                  Instant replies during working hours
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 text-ink">
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <div className="mt-1 text-sm leading-relaxed text-ink/60">{children}</div>
        </div>
      </div>
    </Reveal>
  );
}

/** WhatsApp brand glyph (inherits currentColor). */
function WhatsAppIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

import { Mail, MapPin, Phone, Clock, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";
import { site } from "@/lib/site";

const PERKS = [
  "Free design consultation",
  "Custom quote within one business day",
  "Turn-key — design, build & install",
];

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
                <div className="flex flex-col">
                  {site.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-ink">
                      {p}
                    </a>
                  ))}
                </div>
              </InfoRow>
              <InfoRow icon={Mail} title="Email">
                <div className="flex flex-col">
                  {site.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="hover:text-ink">
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
              <div className="mt-9">
                <EnquiryDialog
                  label="Send us an enquiry"
                  trigger={{ size: "lg", className: "w-full" }}
                />
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
  icon: typeof MapPin;
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

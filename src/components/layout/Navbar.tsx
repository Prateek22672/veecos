"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Menu, X, ArrowUpRight, ChevronDown, Plus } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";
import { services } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const mobileItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export type MenuCard = {
  label: string;
  href: string;
  image?: string;
  plus?: boolean;
};

// Static services mega-menu (the products one is passed in from the server).
const serviceMenu: MenuCard[] = [
  { label: "Design & Planning", href: "/services", image: services[0]?.image },
  { label: "Manufacturing", href: "/services", image: services[1]?.image },
  { label: "Installation", href: "/services", image: services[2]?.image },
  { label: "After-Sales", href: "/services", image: services[3]?.image },
  { label: "Request a quote", href: "/contact", plus: true },
];

export function Navbar({ productMenu }: { productMenu?: MenuCard[] }) {
  // Build the live mega-menus: services is static, products comes from the API.
  const navMenus: Record<string, MenuCard[]> = {
    "/services": serviceMenu,
    ...(productMenu && productMenu.length > 0
      ? { "/products": productMenu }
      : {}),
  };
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const closeMobile = () => {
    setOpen(false);
    setMobileExpanded(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const pill = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar — collapses on scroll */}
      <div
        className={cn(
          "hidden overflow-hidden transition-all duration-500 md:block",
          scrolled
            ? "h-0 border-b border-transparent opacity-0"
            : "h-9 border-b border-ink/10 bg-paper/90 opacity-100 backdrop-blur",
        )}
      >
        <Container className="flex h-9 items-center justify-between text-[12px] tracking-tight text-ink/55">
          <span>
            Workshop in Auto Nagar, Visakhapatnam · Open Mon–Sat, 9:30 AM – 7:00 PM
          </span>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1 font-medium text-ink/80 transition-colors hover:text-ink"
          >
            Planning a kitchen? Get a quote
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Container>
      </div>

      {/* Nav row — full-width bar → floating pill on scroll */}
      <div
        onMouseLeave={() => setActiveMenu(null)}
        className={cn(
          "relative z-50 transition-all duration-500",
          pill ? "px-3 pt-3 sm:px-5 sm:pt-4" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500",
            pill
              ? "h-16 max-w-6xl rounded-full border border-ink/10 bg-white/95 px-5 shadow-[0_16px_44px_-18px_rgba(20,20,15,0.35)] backdrop-blur-xl"
              : "h-16 max-w-7xl border-b border-ink/[0.06] bg-white/[0.88] px-5 backdrop-blur-md sm:h-[4.5rem] sm:px-8 lg:px-12",
          )}
        >
          <div className="col-start-1 flex justify-start">
            <Logo />
          </div>

          <ul className="col-start-2 hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const hasMenu = !!navMenus[item.href];
              return (
                <li
                  key={item.href}
                  onMouseEnter={() => setActiveMenu(hasMenu ? item.href : null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-[15px] tracking-tight transition-colors",
                      isActive(item.href) || activeMenu === item.href
                        ? "font-medium text-ink"
                        : "text-ink/55 hover:text-ink",
                    )}
                  >
                    {item.label}
                    {hasMenu && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-300",
                          activeMenu === item.href && "rotate-180",
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="col-start-3 flex items-center justify-end gap-2">
            <span className="hidden lg:inline-flex">
              <EnquiryDialog label="Get a Quote" trigger={{ size: "md" }} />
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-ink/15 bg-paper/60 text-ink transition-colors hover:bg-ink hover:text-paper lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mega-menu panel (desktop) */}
        <AnimatePresence>
          {activeMenu && navMenus[activeMenu] && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-full z-40 mt-2 hidden w-[min(92vw,68rem)] -translate-x-1/2 rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_30px_70px_-30px_rgba(20,20,15,0.4)] lg:block"
            >
              <div className="grid grid-cols-4 gap-3 lg:grid-cols-6">
                {navMenus[activeMenu].map((card) => (
                  <Link
                    key={card.label}
                    href={card.href}
                    onClick={() => setActiveMenu(null)}
                    className="group block"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-paper-2">
                      {card.plus || !card.image ? (
                        <span className="grid size-full place-items-center text-ink/35">
                          <Plus className="size-8" strokeWidth={1.6} />
                        </span>
                      ) : (
                        <Image
                          src={card.image}
                          alt=""
                          fill
                          sizes="220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="mt-2.5 text-[14px] font-medium text-ink/80 transition-colors group-hover:text-ink">
                      {card.label}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu — full-screen sheet with expandable image-card sections */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-paper pt-24 pb-12 lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
              className="px-5"
            >
              <ul className="border-t border-ink/10">
                {nav.map((item) => {
                  const cards = navMenus[item.href];
                  const expanded = mobileExpanded === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      variants={mobileItem}
                      className="border-b border-ink/10"
                    >
                      {cards ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpanded(expanded ? null : item.href)
                            }
                            className="flex w-full items-center justify-between py-4.5 text-xl tracking-tight text-ink"
                          >
                            {item.label}
                            <ChevronDown
                              className={cn(
                                "size-5 text-ink/40 transition-transform duration-300",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                  {cards.map((card) => (
                                    <Link
                                      key={card.label}
                                      href={card.href}
                                      onClick={closeMobile}
                                      className="group block w-36 shrink-0 snap-start"
                                    >
                                      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-paper-2">
                                        {card.plus || !card.image ? (
                                          <span className="grid size-full place-items-center text-ink/35">
                                            <Plus
                                              className="size-7"
                                              strokeWidth={1.6}
                                            />
                                          </span>
                                        ) : (
                                          <Image
                                            src={card.image}
                                            alt=""
                                            fill
                                            sizes="160px"
                                            className="object-cover"
                                          />
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm font-medium text-ink">
                                        {card.label}
                                      </p>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className={cn(
                            "flex items-center justify-between py-4.5 text-xl tracking-tight",
                            isActive(item.href) ? "text-ink" : "text-ink/70",
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div variants={mobileItem} className="mt-8">
                <EnquiryDialog
                  label="Get a Quote"
                  trigger={{ size: "lg", className: "w-full" }}
                />
                <div className="mt-6 flex flex-col gap-1.5 text-sm text-ink/55">
                  <a
                    href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                    className="font-medium text-ink"
                  >
                    {site.phones[0]}
                  </a>
                  <span>
                    {site.address.line}, {site.address.city}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

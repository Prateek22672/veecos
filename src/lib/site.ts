/**
 * Central place for brand/contact constants used across the site.
 */
export const site = {
  name: "Veecos Canteen Equipments",
  shortName: "Veecos",
  tagline: "Commercial Kitchen Equipment Manufacturer",
  established: 1998,
  url: "https://www.vce.co.in",
  /** Default Open Graph / Twitter share image (kitchen hero). */
  ogImage: "/hero-kitchen.jpeg",
  /** Approx. workshop location (Auto Nagar, Visakhapatnam) for LocalBusiness geo. */
  geo: { lat: 17.7326, lng: 83.2329 },
  description:
    "Veecos Canteen Equipments — leading manufacturer of commercial kitchen equipment in Visakhapatnam (Vizag) since 1998. Cooking ranges, exhaust hoods, refrigeration, wash-area equipment, installation and complete turn-key kitchen projects across Andhra Pradesh & Telangana.",
  phones: ["+91 9848196184", "+91 9581396184"],
  emails: ["sales@vce.co.in", "info@vce.co.in", "veecos@yahoo.co.in"],
  quoteEmail: "sales@vce.co.in",
  address: {
    line: "Plot No B 8, EEIE, IDA 'B' BLOCK, Auto Nagar",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    zip: "530012",
    full: "Plot No B 8, EEIE, IDA 'B' BLOCK, Auto Nagar, Visakhapatnam, Andhra Pradesh 530012",
  },
  socials: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Clients", href: "/#clients" },
  { label: "Contact", href: "/contact" },
] as const;

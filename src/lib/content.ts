import {
  PencilRuler,
  Factory,
  Wrench,
  LifeBuoy,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { images } from "./images";

export interface Service {
  no: string;
  icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  points: string[];
  image: string;
}

export const services: Service[] = [
  {
    no: "01",
    icon: PencilRuler,
    title: "Design & Planning",
    short: "Kitchen layouts optimised for flow, hygiene and space.",
    description:
      "Our experienced team designs kitchen layouts around how your chefs actually work — easy access, simple maintenance and smart space management so even compact kitchens run efficiently.",
    points: [
      "3D layout & workflow planning",
      "Space management for tight footprints",
      "Compliance & hygiene-first zoning",
    ],
    image: images.kitchenReference,
  },
  {
    no: "02",
    icon: Factory,
    title: "Customised Manufacturing",
    short: "High-precision CNC fabrication, built to your spec.",
    description:
      "High-precision CNC technology operated by engineers with 15+ years of fabrication experience lets us adapt to any kitchen size — fitting more capability into less space.",
    points: [
      "CNC-precision stainless fabrication",
      "Made-to-measure for any kitchen size",
      "304 / 316 food-grade steel",
    ],
    image: images.kitchenExhaust,
  },
  {
    no: "03",
    icon: Wrench,
    title: "Installation & Commissioning",
    short: "On-site install, tested and ready to cook.",
    description:
      "We handle on-site installation and commissioning exactly as designed, cutting down your downtime. Every piece is inspected on-site to ensure it works perfectly and you're satisfied.",
    points: [
      "On-site installation by experts",
      "Full equipment commissioning & testing",
      "Faster handover, less downtime",
    ],
    image: images.flameGrill,
  },
  {
    no: "04",
    icon: LifeBuoy,
    title: "After-Sales Servicing",
    short: "Support that keeps you running, pan-India.",
    description:
      "Customer happiness is a priority. We offer dependable after-sales service to clients throughout India, keeping your kitchen running with minimal interruption.",
    points: [
      "Pan-India after-sales support",
      "Preventive maintenance",
      "Genuine spares & quick response",
    ],
    image: images.chefsCooking,
  },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "High Durability & Strength",
    text: "Heavy-gauge food-grade stainless steel built to survive demanding commercial use.",
  },
  {
    icon: Zap,
    title: "Less Energy Consumption",
    text: "Efficient designs that cut running costs and reduce environmental impact.",
  },
  {
    icon: Sparkles,
    title: "Easy Operations",
    text: "Ergonomic, intuitive equipment that's simple for your team to run and clean.",
  },
  {
    icon: Layers,
    title: "Sublime Planning & Design",
    text: "Thoughtful layouts that make the most of every square foot of your kitchen.",
  },
];

export interface ClientGroup {
  category: string;
  names: string[];
}

export const clientGroups: ClientGroup[] = [
  {
    category: "Colleges & Institutions",
    names: ["GITAM", "GMRIT", "JNTU Kakinada", "SRKR Engineering", "Oakridge Intl."],
  },
  {
    category: "Restaurants & Hotels",
    names: ["Bangalore Bhavan", "Grand Bay", "Novotel", "The Park", "Daspalla"],
  },
  {
    category: "Resorts & Clubs",
    names: ["Bheemili Resort", "Visakha Club", "Waltair Club", "Green Park"],
  },
  {
    category: "Industrial Canteens",
    names: ["Vishnu Chemicals", "Visakhi Bio Marine", "Nerolac", "Coromandel"],
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Veecos handled our entire institutional kitchen end-to-end — design, fabrication and install. The build quality of their stainless steel is genuinely excellent.",
    name: "Procurement Head",
    role: "Engineering College, Visakhapatnam",
  },
  {
    quote:
      "Their team understood our limited kitchen space and engineered equipment that fit perfectly. After-sales support has been prompt every single time.",
    name: "Operations Manager",
    role: "Multi-cuisine Restaurant",
  },
  {
    quote:
      "Reliable, on-time and well within budget. The energy-efficient cooking ranges noticeably reduced our running costs.",
    name: "Facility Manager",
    role: "Industrial Canteen",
  },
  {
    quote:
      "From layout planning to commissioning, the process was smooth. Our hostel mess kitchen now runs faster with far less maintenance.",
    name: "Administrative Officer",
    role: "Residential College",
  },
  {
    quote:
      "The custom exhaust hoods and cooking ranges they fabricated for our hotel are top-class. Solid 304 steel, perfect finish.",
    name: "Executive Chef",
    role: "Business Hotel, Vizag",
  },
  {
    quote:
      "We've worked with Veecos across multiple canteen projects. Consistent quality, fair pricing and dependable service every time.",
    name: "Plant Facilities Lead",
    role: "Industrial Canteen",
  },
];

export const stats = [
  { value: "1998", label: "Year established" },
  { value: "100+", label: "Projects completed" },
  { value: "Fast", label: "Service response" },
  { value: "100%", label: "Satisfaction" },
];

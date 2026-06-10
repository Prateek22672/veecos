/**
 * Backend categories don't carry imagery, so we map them to our own
 * commercial-kitchen photos + short blurbs by keyword. Falls back to a
 * rotating set of local photos so any new category still looks intentional.
 */
import { images } from "./images";

type Visual = { image: string; blurb: string };

const RULES: Array<{ match: RegExp; image: string; blurb: string }> = [
  {
    match: /cook|range|burner|gas|steam|tandoor|griddle/i,
    image: images.flameGrill,
    blurb: "High-pressure ranges, steam cooking & heavy-duty burners.",
  },
  {
    match: /refriger|freez|cold|chiller/i,
    image: images.kitchenSteam,
    blurb: "Under-counter, reach-in & cold-room refrigeration systems.",
  },
  {
    match: /exhaust|hood|filter|ventilation/i,
    image: images.kitchenExhaust,
    blurb: "Exhaust hoods with filters for clean, compliant kitchens.",
  },
  {
    match: /wash|sink|drain|dish|steril/i,
    image: images.kitchenReference,
    blurb: "Sterilisers, sinks & wash-area equipment in 304 SS.",
  },
  {
    match: /prep|atta|grind|cut|mix/i,
    image: images.chefTossing,
    blurb: "Pre-preparation machines that speed up your line.",
  },
  {
    match: /table|counter|cabinet|work/i,
    image: images.kitchenWarm,
    blurb: "Work tables, counters & storage cabinets, fully customisable.",
  },
  {
    match: /rack|bin|trolley|shelf|storage/i,
    image: images.kitchenSteam,
    blurb: "Racks, bins & trolleys for a tidy, efficient kitchen.",
  },
  {
    match: /dinn|dining/i,
    image: images.restaurantPass,
    blurb: "Dining tables & front-of-house furniture in stainless steel.",
  },
];

// Rotated for categories that don't match a rule, so adjacent cards differ.
const FALLBACKS = [
  images.chefsCooking,
  images.flameGrill,
  images.wokFlame,
  images.chefLadle,
  images.kitchenWarm,
  images.chefTossing,
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function categoryVisual(name: string, slug = ""): Visual {
  const haystack = `${name} ${slug}`;
  const rule = RULES.find((r) => r.match.test(haystack));
  if (rule) return { image: rule.image, blurb: rule.blurb };
  return {
    image: FALLBACKS[hash(haystack) % FALLBACKS.length],
    blurb: "Precision-engineered commercial kitchen equipment.",
  };
}

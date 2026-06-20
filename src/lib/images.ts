/** Local, optimised brand & kitchen photography (in /public). Photos are WebP
 *  (compressed from the original PNGs); the OG share image stays JPEG. */
export const images = {
  // Brand / certifications
  logo: "/veecos-logo.png",
  nsic: "/nsic-image.png",
  iso: "/iso-image.png",

  // Hero / page headers (premium renders)
  hero: "/restaurant-pass.webp", // legacy hero image
  homeHero: "/sections/homeHero.webp", // cinematic kitchen + dining (home)
  aboutHero: "/sections/aboutHero.webp", // stainless + copper premium kitchen (about)
  serviceHero: "/sections/serviceHero.webp", // services header
  heroBg: "/restaurant-pass.webp", // cinematic chef plating in a pro kitchen (wide)

  // Photography
  chefTossing: "/chef-tossing.webp", // chef tossing a pan in an institutional kitchen
  chefLadle: "/chef-ladle.webp", // hand with ladle over a gas range (portrait)
  chefsCooking: "/chefs-cooking.webp", // two chefs cooking, seasoning a pan
  flameGrill: "/flame-grill.webp", // chef cooking with open flame on a range
  wokFlame: "/wok-flame.webp", // wok tossing over a blue gas flame (portrait)
  kitchenSteam: "/kitchen-steam.webp", // busy kitchen with steam (portrait)
  kitchenWarm: "/kitchen-warm.webp", // warm, atmospheric kitchen scene
  restaurantPass: "/hero-kitchen.jpeg", // restaurant pass with copper lamps (wide, OG)
  kitchenExhaust: "/kitchen-exhaust.webp", // stainless exhaust / ducting (portrait)
  kitchenReference: "/kitchen-reference.webp", // busy professional kitchen (portrait)
} as const;

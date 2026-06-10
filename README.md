# Veecos Canteen Equipments — Marketing Website

Premium, SEO-first marketing site for **Veecos Canteen Equipments**, a commercial
kitchen equipment manufacturer (est. 1998). Built with the **App Router**, it
pulls the live product catalogue from the Veecos serverless backend and submits
enquiries as leads.

> Backend API reference lives in [`BACKEND_API.md`](./BACKEND_API.md).

## Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4** (CSS-first theme tokens in `globals.css`)
- **Motion** (`motion/react`) for scroll/entry animations
- **lucide-react** icons
- **Switzer** typeface (via Fontshare) for a premium feel

### Design tokens

| Token         | Value             | Use                |
| ------------- | ----------------- | ------------------ |
| `brand`       | `#edcd1f`         | Primary yellow     |
| `ink`         | `rgb(47,46,46)`   | Text / dark UI     |
| `paper`       | `#faf9f5`         | Page background    |
| `charcoal`    | `#1c1b1b`         | Footer / dark band |

## Pages

| Route                | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `/`                  | Home — hero, services, about, products, clients, testimonials, contact |
| `/about`             | Company story, mission, vision, values                 |
| `/services`          | Design, manufacturing, installation, after-sales       |
| `/products`          | Root categories (live from API)                        |
| `/products/[id]`     | Category — subcategories + products                    |
| `/product/[id]`      | Product detail — gallery, specs, enquiry form          |
| `/contact`           | Contact details, map, lead form                        |

SEO: per-page metadata, Open Graph, Organization + Product JSON-LD,
`sitemap.xml` (includes live category routes) and `robots.txt`.

## Backend integration

All catalogue reads go through [`src/lib/api.ts`](./src/lib/api.ts) with ISR
(`revalidate: 300`). API failures degrade gracefully (empty states, never a
crash). The contact form `POST`s to `/leads`.

Backend categories carry no imagery, so [`src/lib/catalog-visuals.ts`](./src/lib/catalog-visuals.ts)
maps each category to a curated photo + blurb by keyword, and `SmartImage`
falls back to a branded placeholder when an image 404s.

## Getting started

```bash
cp .env.example .env.local   # optional — defaults to the prod API
npm install
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm run start   # production
npm run lint
```

## Environment

| Variable               | Default                                                  |
| ---------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE` | `https://vs1aoaj0t2.execute-api.ap-south-1.amazonaws.com` |

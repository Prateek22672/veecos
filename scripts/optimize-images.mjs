import sharp from "sharp";
import fs from "fs";
import path from "path";

const KB = (n) => (n / 1024).toFixed(0) + "KB";

async function toWebp(src, { maxW, quality = 76 } = {}) {
  const out = src.replace(/\.(png|PNG|jpe?g)$/, "") + ".webp";
  let img = sharp(src).rotate();
  const meta = await img.metadata();
  if (maxW && meta.width && meta.width > maxW) img = img.resize({ width: maxW });
  await img.webp({ quality, effort: 5 }).toFile(out);
  const a = fs.statSync(src).size;
  const b = fs.statSync(out).size;
  console.log(`${path.basename(src)} -> ${path.basename(out)}  ${KB(a)} -> ${KB(b)}`);
  if (src !== out) fs.unlinkSync(src); // drop the heavy original
}

async function recompressJpeg(src, { maxW = 1920, quality = 78 } = {}) {
  const tmp = src + ".tmp";
  let img = sharp(src).rotate();
  const meta = await img.metadata();
  if (meta.width && meta.width > maxW) img = img.resize({ width: maxW });
  await img.jpeg({ quality, mozjpeg: true }).toFile(tmp);
  const a = fs.statSync(src).size;
  fs.renameSync(tmp, src);
  console.log(`${path.basename(src)}  ${KB(a)} -> ${KB(fs.statSync(src).size)} (jpeg)`);
}

// 1) Remove unused heavy files
for (const f of ["public/hero.png", "public/sections/about.png", "public/sections/services.png"]) {
  if (fs.existsSync(f)) {
    console.log("delete (unused) " + path.basename(f) + " " + KB(fs.statSync(f).size));
    fs.unlinkSync(f);
  }
}

// 2) Convert card/portrait photos to WebP (small dims, just re-encode)
const photos = [
  "chef-tossing.png", "chef-ladle.png", "chefs-cooking.png", "flame-grill.png",
  "wok-flame.png", "kitchen-steam.png", "kitchen-warm.png", "kitchen-exhaust.png",
  "kitchen-reference.png", "restaurant-pass.png",
].map((f) => "public/" + f);
for (const p of photos) if (fs.existsSync(p)) await toWebp(p);

// 3) Full-bleed hero backgrounds → WebP, capped at 1920w
const sections = ["homeHero.PNG", "aboutHero.PNG", "serviceHero.PNG"].map((f) => "public/sections/" + f);
for (const s of sections) if (fs.existsSync(s)) await toWebp(s, { maxW: 1920, quality: 74 });

// 4) OG image stays JPEG (best share compatibility), just compressed
if (fs.existsSync("public/hero-kitchen.jpeg")) await recompressJpeg("public/hero-kitchen.jpeg");

console.log("done");

/**
 * Generates the brand icon set from src/app/icon.svg:
 *
 *   src/app/favicon.ico            16 + 32 + 48 px (PNG-encoded, ICO container)
 *   src/app/apple-icon.png         180 px, opaque
 *   src/app/opengraph-image.png    1200 x 630 social card
 *   public/icons/icon-192.png      PWA manifest icon
 *   public/icons/icon-512.png      PWA manifest icon
 *
 * Uses the sharp instance that ships with Next.js — no extra dependencies.
 * Run after editing icon.svg:  node scripts/build-icons.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const iconSvg = readFileSync(new URL("src/app/icon.svg", root));

const BACKGROUND = "#0a0a0a"; // --color-background
const GOLD = "#d4af37"; // --color-gold
const CREAM = "#f5f1e8"; // --color-foreground
const MUTED = "#9ca3af"; // --color-muted

/** Rasterize the 64px viewBox icon.svg at an exact pixel size. */
async function renderIcon(size, { opaque = true } = {}) {
  const density = Math.ceil((72 * size) / 64);
  let pipeline = sharp(iconSvg, { density }).resize(size, size, { fit: "fill" });
  if (opaque) pipeline = pipeline.flatten({ background: BACKGROUND });
  return pipeline.png().toBuffer();
}

/**
 * Pack PNG buffers into a single .ico file (all modern browsers and
 * Windows Vista+ accept PNG-compressed entries for 16/32/48 px).
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.data.length, 8); // compressed size
    entry.writeUInt32LE(offset, 12); // data offset
    offset += img.data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/** 1200 x 630 social card: logo mark, "Hair Luxe", hero tagline. */
async function buildOgImage() {
  // Embed the brand mark as a nested SVG so icon.svg stays the single source.
  const inner = iconSvg
    .toString("utf8")
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f5e6cc"/>
      <stop offset="0.5" stop-color="${GOLD}"/>
      <stop offset="1" stop-color="#a8862b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${BACKGROUND}"/>
  <svg x="120" y="225" width="180" height="180" viewBox="0 0 64 64">${inner}</svg>
  <text x="350" y="300" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="96" fill="${CREAM}">Hair Luxe</text>
  <rect x="352" y="330" width="180" height="5" rx="2.5" fill="url(#gold)"/>
  <text x="352" y="384" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="1" fill="${MUTED}">Premium wigs, hair revamping, makeup &amp; lash artistry.</text>
</svg>`;
  return sharp(Buffer.from(card)).png().toBuffer();
}

mkdirSync(new URL("public/icons", root), { recursive: true });

const [png16, png32, png48, png180, png192, png512, og] = await Promise.all([
  // Keep alpha in the ICO entries: Next's ICO decoder requires RGBA PNGs,
  // and the rounded corners read better on a light tab background.
  renderIcon(16, { opaque: false }),
  renderIcon(32, { opaque: false }),
  renderIcon(48, { opaque: false }),
  renderIcon(180),
  renderIcon(192),
  renderIcon(512),
  buildOgImage(),
]);

writeFileSync(new URL("src/app/favicon.ico", root), buildIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
  { size: 48, data: png48 },
]));
writeFileSync(new URL("src/app/apple-icon.png", root), png180);
writeFileSync(new URL("src/app/opengraph-image.png", root), og);
writeFileSync(new URL("public/icons/icon-192.png", root), png192);
writeFileSync(new URL("public/icons/icon-512.png", root), png512);

for (const [label, file] of [
  ["apple-icon.png", "src/app/apple-icon.png"],
  ["opengraph-image.png", "src/app/opengraph-image.png"],
  ["icon-192.png", "public/icons/icon-192.png"],
  ["icon-512.png", "public/icons/icon-512.png"],
]) {
  const meta = await sharp(readFileSync(new URL(file, root))).metadata();
  console.log(`${label}: ${meta.width}x${meta.height} ${meta.format}${meta.hasAlpha ? " (has alpha)" : ""}`);
}
const ico = readFileSync(new URL("src/app/favicon.ico", root));
const icoCount = ico.readUInt16LE(4);
const icoSizes = Array.from({ length: icoCount }, (_, i) => ico.readUInt8(6 + i * 16) || 256);
console.log(`favicon.ico: ${ico.length} bytes, ${icoCount} entries (${icoSizes.join(", ")} px)`);
console.log("Done.");

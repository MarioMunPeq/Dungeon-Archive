/**
 * Generates PNG brand assets that must match declared dimensions exactly:
 *   - public/icons/icon-192.png  (192x192)  — PWA manifest / apple-touch-icon
 *   - public/icons/icon-512.png  (512x512)  — PWA manifest (also maskable)
 *   - public/og-image.png        (1200x630) — Open Graph / Twitter cards
 *
 * Pure Node (zlib + a manual PNG encoder + a tiny rasterizer). No image
 * dependencies. Run with: pnpm assets
 *
 * The mark is a rounded "archive gate": a Jade-accent rounded square with an
 * arch cutout, on the app's warm near-black background — consistent with the
 * favicon.svg in public/ and the Design DNA palette.
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public");

type RGB = readonly [number, number, number];

function hexToRgb(hex: string): RGB {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff] as const;
}

const BG: RGB = hexToRgb("#12100e");
const ACCENT: RGB = hexToRgb("#3ab492");

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const k = clamp01(t);
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ] as const;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Coverage (0..1) of a rounded rectangle centered at (cx, cy). */
function roundedRectCoverage(
  px: number,
  py: number,
  cx: number,
  cy: number,
  halfW: number,
  halfH: number,
  radius: number,
): number {
  const dx = Math.abs(px - cx) - (halfW - radius);
  const dy = Math.abs(py - cy) - (halfH - radius);
  const outsideX = Math.max(dx, 0);
  const outsideY = Math.max(dy, 0);
  const dist = Math.hypot(outsideX, outsideY) + Math.min(Math.max(dx, dy), 0) - radius;
  return clamp01(0.5 - dist);
}

/** Coverage (0..1) of an arch (rounded-top rectangle), 1 = inside. */
function archCoverage(
  px: number,
  py: number,
  cx: number,
  top: number,
  bottom: number,
  halfW: number,
  radius: number,
): number {
  if (py < top || py > bottom) return 0;
  if (py >= top + radius) {
    return px >= cx - halfW && px <= cx + halfW ? 1 : 0;
  }
  const dx = Math.abs(px - cx) - (halfW - radius);
  if (dx <= 0) return 1;
  const dist = Math.hypot(dx, top + radius - py) - radius;
  return clamp01(0.5 - dist);
}

/** "Archive gate" mark: accent rounded square with an arch cutout. */
function gatePixel(px: number, py: number, size: number): RGB {
  const m = size;
  const outer = roundedRectCoverage(px, py, m / 2, m / 2, 0.31 * m, 0.31 * m, 0.15 * m);
  const arch = archCoverage(
    px,
    py,
    m / 2,
    m / 2 - 0.2 * m,
    m / 2 + 0.31 * m,
    0.17 * m,
    0.17 * m,
  );
  return mix(mix(BG, ACCENT, outer), BG, arch);
}

/** App-shell vignette factor: darker toward the edges. */
function vignetteFactor(px: number, py: number, width: number, height: number): number {
  const nx = (px / width) * 2 - 1;
  const ny = (py / height) * 2 - 1;
  const t = Math.hypot(nx, ny) / Math.hypot(1, 1);
  return 1 - 0.22 * smoothstep(0.5, 1, t);
}

function render(
  width: number,
  height: number,
  pixelAt: (x: number, y: number) => RGB,
): Buffer {
  const scanlineLength = width * 3;
  const raw = Buffer.alloc(height * (1 + scanlineLength));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelAt(x + 0.5, y + 0.5);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
    }
  }
  return deflateSync(raw);
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    let byte = (crc ^ (data[i] ?? 0)) & 0xff;
    for (let bit = 0; bit < 8; bit++) {
      byte = byte & 1 ? 0xedb88320 ^ (byte >>> 1) : byte >>> 1;
    }
    crc = (crc >>> 8) ^ byte;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, checksum]);
}

function encodePng(width: number, height: number, idat: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function writePng(filePath: string, width: number, height: number, idat: Buffer): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, encodePng(width, height, idat));
  console.log(`  ${filePath} (${width}x${height})`);
}

console.log("Generating brand PNG assets");

const icon192 = render(192, 192, (x, y) => gatePixel(x, y, 192));
writePng(join(PUBLIC_DIR, "icons", "icon-192.png"), 192, 192, icon192);

const icon512 = render(512, 512, (x, y) => gatePixel(x, y, 512));
writePng(join(PUBLIC_DIR, "icons", "icon-512.png"), 512, 512, icon512);

const ogWidth = 1200;
const ogHeight = 630;
const ogImage = render(ogWidth, ogHeight, (x, y) => {
  const gate = gatePixel(x, y, 400);
  const factor = vignetteFactor(x, y, ogWidth, ogHeight);
  return mix(BG, gate, factor);
});
writePng(join(PUBLIC_DIR, "og-image.png"), ogWidth, ogHeight, ogImage);

console.log("Done");

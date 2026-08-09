import { strictEqual, ok } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  \u2713 ${description}`);
  } catch (e) {
    console.error(`  \u2717 ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const viteConfig = readFileSync(join(repoRoot, "vite.config.ts"), "utf8");
const indexHtml = readFileSync(join(repoRoot, "index.html"), "utf8");
const publicDir = join(repoRoot, "public");

function readPngDimensions(filePath: string): { width: number; height: number } {
  const bytes = readFileSync(filePath);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  strictEqual(bytes.subarray(0, 8).equals(signature), true, `${filePath}: missing PNG signature`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

console.log("PWA manifest & shell\n");

test("base path targets the GitHub Pages subpath", () => {
  ok(viteConfig.includes('const BASE_PATH = "/Dungeon-Archive/"'), "BASE_PATH must be the subpath");
  ok(viteConfig.includes("base: BASE_PATH"), "vite base must use the subpath");
});

test("manifest is installable: standalone, portrait, fixed warm-near-black colors", () => {
  ok(viteConfig.includes('display: "standalone"'), 'display must be "standalone"');
  ok(viteConfig.includes('orientation: "portrait"'), 'orientation must be "portrait"');
  ok(
    viteConfig.includes('theme_color: "#12100e"') &&
      viteConfig.includes('background_color: "#12100e"'),
    "theme/background must be the fixed #12100e base",
  );
  ok(
    viteConfig.includes("scope: BASE_PATH") && viteConfig.includes("start_url: BASE_PATH"),
    "scope/start_url must use BASE_PATH so the installed app resolves under the subpath",
  );
});

test("short_name is a home-screen-safe label", () => {
  const match = viteConfig.match(/short_name:\s*"([^"]+)"/);
  ok(match !== null, "short_name must be set");
  ok(match![1]!.length <= 12, `short_name "${match![1]}" is too long for a home-screen label`);
});

test("manifest declares 192, 512, and maskable icons that exist at matching dimensions", () => {
  ok(viteConfig.includes('"192x192"'), "must declare a 192x192 icon");
  ok(viteConfig.includes('"512x512"'), "must declare a 512x512 icon");
  ok(viteConfig.includes('purpose: "maskable"'), "must declare a maskable icon");

  const declaredSrcs = [...viteConfig.matchAll(/src:\s*"icons\/(icon-[^"]+\.png)"/g)].map(
    (m) => m[1]!,
  );
  ok(declaredSrcs.length >= 2, "must reference at least two icon files");

  for (const file of declaredSrcs) {
    const filePath = join(publicDir, "icons", file);
    ok(existsSync(filePath), `manifest icon missing from public/: ${file}`);
    const { width, height } = readPngDimensions(filePath);
    strictEqual(width, height, `${file}: icon must be square`);
    ok(
      (width === 192 || width === 512) && width === height,
      `${file}: unexpected dimension ${width}x${height}`,
    );
  }
});

test("index.html carries the required PWA meta tags", () => {
  ok(
    indexHtml.includes('name="theme-color" content="#12100e"'),
    "theme-color meta must match manifest",
  );
  ok(
    indexHtml.includes('name="apple-mobile-web-app-capable" content="yes"'),
    "missing apple-mobile-web-app-capable",
  );
  ok(
    indexHtml.includes('name="apple-mobile-web-app-status-bar-style" content="black-translucent"'),
    "missing apple-mobile-web-app-status-bar-style",
  );
  ok(
    indexHtml.includes('name="apple-mobile-web-app-title" content="Dungeon Archive"'),
    "missing apple-mobile-web-app-title",
  );
  ok(
    /rel="apple-touch-icon"/.test(indexHtml) && indexHtml.includes("icons/icon-192.png"),
    "missing apple-touch-icon link",
  );
});

test("service worker is generated from vite-plugin-pwa", () => {
  ok(viteConfig.includes("VitePWA("), "vite-plugin-pwa must be configured");
  ok(viteConfig.includes('registerType: "autoUpdate"'), "registerType must be autoUpdate");
});

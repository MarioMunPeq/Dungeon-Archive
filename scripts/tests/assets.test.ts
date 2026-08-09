import { strictEqual, ok } from "node:assert";
import { readFileSync } from "node:fs";
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

function readPngDimensions(filePath: string): { width: number; height: number } {
  const bytes = readFileSync(filePath);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  strictEqual(
    bytes.subarray(0, 8).equals(signature),
    true,
    `${filePath}: missing PNG signature`,
  );
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  ok(width > 0 && height > 0, `${filePath}: invalid dimensions ${width}x${height}`);
  return { width, height };
}

console.log("generated PNG assets\n");

const cases: Array<{ file: string; width: number; height: number }> = [
  { file: "icons/icon-192.png", width: 192, height: 192 },
  { file: "icons/icon-512.png", width: 512, height: 512 },
  { file: "og-image.png", width: 1200, height: 630 },
];

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public");

for (const { file, width, height } of cases) {
  test(`${file} matches declared dimensions (${width}x${height})`, () => {
    const dims = readPngDimensions(join(publicDir, file));
    strictEqual(dims.width, width, `${file}: width mismatch`);
    strictEqual(dims.height, height, `${file}: height mismatch`);
  });
}

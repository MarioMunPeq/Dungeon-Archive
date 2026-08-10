/**
 * Copies the @3d-dice/dice-box theme assets (the "default" theme textures and
 * mesh config) from node_modules into public/dice-box/themes so the
 * lazy-loaded Dice Roller 3D stage can fetch them at runtime under the app's
 * base path. The bundled physics engine is embedded in the library's own world
 * module (the package's dist/assets/ammo folder is unused at runtime).
 *
 * The npm package's own postinstall (copyAssets.js) prompts interactively and
 * is disabled via --ignore-scripts; this script is the non-interactive
 * replacement. Run with: pnpm assets:dice-box
 */

import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SOURCE = join(ROOT, "node_modules", "@3d-dice", "dice-box", "dist", "assets", "themes");
const DEST = join(ROOT, "public", "dice-box", "themes");

mkdirSync(DEST, { recursive: true });
cpSync(SOURCE, DEST, { recursive: true });
console.log(`Copied dice-box theme assets to ${DEST}`);

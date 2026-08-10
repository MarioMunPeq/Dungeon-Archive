/**
 * Copies the @3d-dice/dice-box runtime assets from node_modules into
 * public/dice-box so the lazy-loaded Dice Roller 3D stage can fetch them at
 * runtime under the app's base path.
 *
 * Two folders are required:
 * - themes/    theme textures, mesh config, and dice labels
 * - ammo/      ammo.wasm.wasm, fetched by the offscreen physics worker at
 *              init time. Without it the physics worker never posts
 *              "init-complete" and box.init() hangs forever.
 *
 * The npm package's own postinstall (copyAssets.js) prompts interactively and
 * is disabled via --ignore-scripts; this script is the non-interactive
 * replacement. Run with: pnpm assets:dice-box
 */

import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SOURCE = join(ROOT, "node_modules", "@3d-dice", "dice-box", "dist", "assets");
const DEST = join(ROOT, "public", "dice-box");

mkdirSync(DEST, { recursive: true });
cpSync(SOURCE, DEST, { recursive: true });
console.log(`Copied dice-box assets to ${DEST}`);

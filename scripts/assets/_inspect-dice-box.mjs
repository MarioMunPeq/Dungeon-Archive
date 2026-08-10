import { readFileSync } from "node:fs";

const s = readFileSync("node_modules/@3d-dice/dice-box/dist/world.offscreen.js", "utf8");

// Find the big base64 string literal assigned to `const p = "..."`
const m = s.match(/const\s+p\s*=\s*"([A-Za-z0-9+/=]+)"/);
if (!m) {
  console.log("NO base64 blob found");
  process.exit(0);
}
const decoded = Buffer.from(m[1], "base64").toString("utf8");
console.log("decoded length:", decoded.length);

// Dump the worker's init/onmessage handling region to understand init sequence
const idx = decoded.indexOf("self.onmessage");
console.log("=== self.onmessage context ===");
console.log(decoded.slice(Math.max(0, idx - 300), idx + 2500).replace(/\n/g, " "));

// How is the physics worker port created / does it spawn another worker?
for (const p of ["MessageChannel", "physicsWorkerPort", "port1", "port2", "createDice", "loadTheme", "onInitComplete", "postMessage({action"]) {
  const i = decoded.indexOf(p);
  const count = decoded.split(p).length - 1;
  console.log(`\n=== ${p} count=${count} @ ${i} ===`);
  if (i > -1) console.log(decoded.slice(Math.max(0, i - 200), i + 300).replace(/\n/g, " "));
}

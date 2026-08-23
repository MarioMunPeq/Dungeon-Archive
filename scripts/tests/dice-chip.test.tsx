import * as React from "react";
import { strictEqual, ok } from "node:assert";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
// Make React available globally for JSX transform in imported components
(globalThis as Record<string, unknown>).React = React;

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

import { DiceChip } from "../../src/features/dice/dice-chip";

function chipHtml(sides: number): string {
  return renderToString(createElement(DiceChip, { sides, count: 0, max: 20, onChange: () => {} }));
}

console.log("die icon geometry\n");

const OLD_SHARED_OUTLINE = "M12 2.5 19.3 9.7 16.4 20.5 7.6 20.5 4.7 9.7Z";

test("d10 and d20 no longer share a silhouette", () => {
  const html = chipHtml(10);
  const html20 = chipHtml(20);
  ok(!html.includes(OLD_SHARED_OUTLINE), "d10 must drop the old generic pentagon");
  ok(!html20.includes(OLD_SHARED_OUTLINE), "d20 must drop the old generic pentagon");
  const d10 = /<path d="([^"]+)"/.exec(html)?.[1];
  const d20 = /<path d="([^"]+)"/.exec(html20)?.[1];
  ok(d10 !== undefined && d20 !== undefined, "both icons must draw an outline");
  ok(d10 !== d20, "silhouettes must differ");
});

test("d10 reads as a trapezohedron: kite silhouette plus girdle edge", () => {
  const html = chipHtml(10);
  ok(html.includes('d="M12 2 19.8 13.5 12 22 4.2 13.5Z"'), "kite outline");
  const details = [...html.matchAll(/stroke-width="1\.4"/g)];
  strictEqual(details.length, 1, "exactly one thin detail line");
  ok(html.includes('d="M4.2 13.5h15.6"'), "girdle edge across the widest points");
});

test("d20 matches the icosahedron projection used by the export sheet mark", () => {
  const html = chipHtml(20);
  ok(html.includes('d="M12 3.75 5.9 8.25v7.5L12 20.25l6.1-4.5v-7.5Z"'), "hexagonal outline");
  ok(
    html.includes(
      'd="M5.9 8.25h12.2M5.9 15.75h12.2M12 8.25v7.5M12 8.25 5.9 12l6.1 3.75M12 8.25l6.1 3.75L12 15.75"',
    ),
    "seven internal face edges",
  );
  ok(html.includes('stroke="var(--color-surface)"'), "number halo");
  ok(html.includes('paint-order="stroke"'), "halo behind digits");
});

test("d12 reads as a face-on dodecahedron pentagon", () => {
  const html = chipHtml(12);
  ok(html.includes('d="M12 2.85 2.97 9.41 6.42 20.04H17.58L21.03 9.41Z"'), "pentagon outline");
  strictEqual(/stroke-width="1\.4"/.exec(html), null, "no detail lines");
});

test("every standard die keeps its stamped number", () => {
  for (const sides of [4, 6, 8, 10, 12, 20, 100]) {
    const html = chipHtml(sides);
    ok(html.includes(`>${sides}</text>`), `d${sides} label`);
    ok(html.includes('aria-hidden="true"'), "icon stays decorative");
  }
});

test("unknown die faces render nothing", () => {
  const html = chipHtml(7);
  strictEqual(/<text/.exec(html), null, "no stamped number for unsupported faces");
});

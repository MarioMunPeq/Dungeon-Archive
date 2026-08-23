import * as React from "react";
import { strictEqual } from "node:assert";
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

import {
  componentsDisplay,
  expandComponents,
  SpellRenderer,
} from "../../src/features/compendium/renderers/spell-renderer";
import type { Spell } from "../../src/compendium";

console.log("spell renderer beginner support\n");

test("bare component letters expand to full words", () => {
  strictEqual(JSON.stringify(expandComponents(["V", "S"])), JSON.stringify(["Verbal", "Somatic"]));
});

test("material components keep their focus text", () => {
  strictEqual(
    expandComponents(["V", "S", "M (a bit of fleece)"]).join(", "),
    "Verbal, Somatic, Material (a bit of fleece)",
  );
});

test("unrecognized tokens pass through unchanged", () => {
  strictEqual(
    expandComponents(["GP worth of diamond dust"]).join(", "),
    "GP worth of diamond dust",
  );
  strictEqual(expandComponents([]).join(", "), "");
});

test("beginner mode shows expanded names, experienced mode keeps letters", () => {
  strictEqual(componentsDisplay(["V", "S"], true), "Verbal, Somatic");
  strictEqual(componentsDisplay(["V", "S"], false), "V, S");
  strictEqual(componentsDisplay(["M (a bit of fleece)"], true), "Material (a bit of fleece)");
  strictEqual(componentsDisplay(["M (a bit of fleece)"], false), "M (a bit of fleece)");
});

function spellFixture(opts?: { concentration?: boolean; ritual?: boolean }): Spell {
  return {
    id: "fire-bolt",
    canonicalId: "fire-bolt",
    name: "Fire Bolt",
    category: "spell",
    source: "PHB",
    level: 0,
    school: "evocation",
    castingTime: "1 action",
    range: "120 feet",
    duration: "Instantaneous",
    components: ["V", "S"],
    classes: ["Wizard"],
    description: [{ type: "paragraph", text: "You hurl a mote of fire." }],
    ritual: opts?.ritual ?? false,
    concentration: opts?.concentration ?? false,
  };
}

test("default render expands components and offers help buttons", () => {
  const html = renderToString(
    createElement(SpellRenderer, { entity: spellFixture({ concentration: true, ritual: true }) }),
  );
  strictEqual(html.includes("Verbal, Somatic"), true, "components expanded for beginners");
  strictEqual(
    html.includes('aria-label="What is concentration?"'),
    true,
    "concentration tip button",
  );
  strictEqual(html.includes('aria-label="What is ritual casting?"'), true, "ritual tip button");
});

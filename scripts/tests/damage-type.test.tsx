import * as React from "react";
import { strictEqual, ok, deepEqual, doesNotThrow } from "node:assert";
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

import { loadCompendium, getEntitiesForCategory } from "../../src/compendium";
import type { Equipment } from "../../src/compendium";
import { DamageTypeTag } from "../../src/components/entity";
import { damageTypeVisual } from "../../src/components/entity/damage-type";
import { EquipmentRenderer } from "../../src/features/compendium/renderers/equipment-renderer";

await loadCompendium();

console.log("damage-type visual language\n");

test("every damage type present in the data resolves to a visual", () => {
  const equipment = getEntitiesForCategory("equipment") as readonly Equipment[];
  const codes = new Set(equipment.filter((e) => e.damageType).map((e) => e.damageType as string));
  deepEqual([...codes].sort(), ["B", "N", "P", "R", "S", "Y"], "data codes");
  const labels = new Set(
    [...codes].map((code) => {
      const visual = damageTypeVisual(code);
      ok(visual.dotClass, `${code} must have a marker class`);
      return visual.label;
    }),
  );
  deepEqual(
    [...labels].sort(),
    ["Bludgeoning", "Necrotic", "Piercing", "Psychic", "Radiant", "Slashing"].sort(),
    "full labels",
  );
});

test("letter codes and full names resolve to the same visual", () => {
  const byCode = damageTypeVisual("S");
  const byName = damageTypeVisual("slashing");
  const byMixed = damageTypeVisual("Slashing");
  strictEqual(byCode.dotClass, byName.dotClass);
  strictEqual(byCode.label, byName.label);
  strictEqual(byCode.label, byMixed.label);
});

test("unknown or missing damage types fail gracefully", () => {
  const unknown = damageTypeVisual("Q");
  strictEqual(unknown.dotClass, null);
  strictEqual(unknown.label, "Q");
  const missing = damageTypeVisual(undefined);
  strictEqual(missing.dotClass, null);
  strictEqual(missing.label, "");
  deepEqual(damageTypeVisual(""), { label: "", dotClass: null });
});

test("DamageTypeTag renders marker plus readable text (never color alone)", () => {
  const html = renderToString(createElement(DamageTypeTag, { code: "P" }));
  ok(html.includes("Piercing"), "label text present");
  ok(html.includes('aria-hidden="true"'), "marker hidden from screen readers");
  ok(/bg-damage-\w+/.test(html), "identity marker class applied");
});

test("DamageTypeTag omits the marker for unknown types but keeps the text", () => {
  const html = renderToString(createElement(DamageTypeTag, { code: "fire" }));
  ok(html.includes("fire"), "passthrough label present");
  ok(!html.includes("rounded-full"), "no marker for unknown types");
});

test("DamageTypeTag renders nothing without a code", () => {
  const html = renderToString(createElement(DamageTypeTag, {}));
  strictEqual(html, "");
});

const weapon: Equipment = {
  id: "eq_longsword",
  canonicalId: "eq.longsword",
  category: "equipment",
  name: "Longsword",
  source: "XPHB",
  type: "Melee Weapon",
  damage: "1d8",
  damageType: "S",
  description: [],
};

function renderEquipment(entity: Equipment): string {
  return renderToString(createElement(EquipmentRenderer, { entity }));
}

test("equipment detail shows dice with the tagged damage type", () => {
  const html = renderEquipment(weapon);
  ok(html.includes("1d8"), "damage dice present");
  ok(html.includes("Slashing"), "damage type text present");
  ok(/bg-damage-slashing/.test(html), "slashing marker applied");
  ok(html.includes(">Type<") || html.includes("Melee Weapon"), "metadata intact");
});

test("equipment without a damage type renders unchanged", () => {
  const armor: Equipment = { ...weapon, name: "Shield", damage: undefined, damageType: undefined };
  const html = renderEquipment(armor);
  doesNotThrow(() => renderEquipment(armor));
  ok(!html.includes("rounded-full"), "no stray markers");
  ok(html.includes("Melee Weapon"), "metadata intact");
});

test("a damage type without dice still gets the tagged property", () => {
  const radiantOnly: Equipment = { ...weapon, damage: undefined, damageType: "R" };
  const html = renderEquipment(radiantOnly);
  ok(html.includes("Radiant"), "type text present");
  ok(/bg-damage-radiant/.test(html), "radiant marker applied");
});

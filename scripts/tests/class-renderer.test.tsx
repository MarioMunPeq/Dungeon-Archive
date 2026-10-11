import * as React from "react";
import { strictEqual, ok } from "node:assert";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
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
  buildLevelCards,
  blocksToPlainText,
  dedupeTableGroups,
  MAX_CLASS_LEVEL,
} from "../../src/features/compendium/renderers/class-levels";
import { ClassRenderer } from "../../src/features/compendium/renderers/class-renderer";
import type { Class } from "../../src/compendium";
import type { ClassTableGroup } from "../../src/types/compendium";

console.log("class level breakdown\n");

function group(
  title: string | undefined,
  colLabels: string[],
  rows: readonly (readonly (string | number | boolean | null)[])[],
): ClassTableGroup {
  return title === undefined ? { colLabels, rows } : { title, colLabels, rows };
}

function rows20(
  fill: (level: number) => (string | number | boolean | null)[],
): ClassTableGroup["rows"] {
  return Array.from({ length: MAX_CLASS_LEVEL }, (_, i) => fill(i + 1));
}

function feature(level: number, name: string) {
  return {
    name,
    className: "Barbarian",
    source: "PHB",
    level,
    gainSubclassFeature: false,
    description: [{ type: "paragraph" as const, text: `${name} does something useful.` }],
    consumes: null,
  };
}

function classFixture(overrides?: Partial<Class>): Class {
  return {
    id: "barbarian|phb",
    canonicalId: "class.barbarian",
    category: "class",
    name: "Barbarian",
    source: "PHB",
    hitDice: { number: 1, faces: 12 },
    proficiency: ["str", "con"],
    primaryAbility: ["str"],
    spellcastingAbility: null,
    casterProgression: null,
    startingProficiencies: {
      armor: ["Light armor", "Medium armor", "Shields"],
      weapons: ["Simple weapons", "Martial weapons"],
      tools: [],
      savingThrows: [],
      skills: [{ from: ["Athletics", "Nature"], count: 2 }],
    },
    startingEquipment: {
      groups: [{ alternatives: [{ label: "", items: ["Greataxe"], gold: null }] }],
      goldAlternative: null,
      additionalFromBackground: false,
    },
    multiclassing: null,
    classTableGroups: [
      group(
        "Rage",
        ["Rages", "Rage Damage"],
        rows20((l) => [l, String(l)]),
      ),
    ],
    classFeatures: [
      feature(1, "Rage"),
      feature(3, "Primal Knowledge"),
      feature(20, "Raging Wrath"),
    ],
    subclassTitle: "Primal Path",
    subclassGroups: [{ name: "Path of the Berserker", source: "PHB" }],
    ...overrides,
  };
}

test("every level 1-20 gets a card, including levels with nothing", () => {
  const cards = buildLevelCards(classFixture());
  strictEqual(cards.length, MAX_CLASS_LEVEL);
  strictEqual(cards[0]!.level, 1);
  strictEqual(cards[19]!.level, 20);
  // Features only exist at 1, 3 and 20; the rest must still render as empty levels.
  strictEqual(cards[2]!.features.length, 1);
  strictEqual(cards[12]!.features.length, 0);
  strictEqual(cards[13]!.empty, false, "progression values keep the card non-empty");
});

test("features land on the level they unlock", () => {
  const cards = buildLevelCards(classFixture());
  strictEqual(cards[0]!.features.map((f) => f.name).join(), "Rage");
  strictEqual(cards[2]!.features.map((f) => f.name).join(), "Primal Knowledge");
  strictEqual(cards[19]!.features.map((f) => f.name).join(), "Raging Wrath");
});

test("progression values are paired with their column label", () => {
  const cards = buildLevelCards(classFixture());
  strictEqual(cards[0]!.statGroups[0]!.title, "Rage");
  strictEqual(cards[4]!.statGroups[0]!.stats[0]!.label, "Rages");
  strictEqual(cards[4]!.statGroups[0]!.stats[0]!.value, "5");
});

test("blank progression cells are dropped unless they are spell slots", () => {
  const base = classFixture();
  const withGaps = classFixture({
    classTableGroups: [
      group(
        undefined,
        ["Extra Attack"],
        rows20((l) => (l >= 5 ? [1] : [null])),
      ),
      group(
        "Spell Slots",
        ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"],
        rows20(() => [2, 0, 0, 0, 0, 0, 0, 0, 0]),
      ),
    ],
  });
  const cards = buildLevelCards(withGaps);
  strictEqual(cards[0]!.statGroups.length, 1, "the empty Extra Attack table is skipped entirely");
  strictEqual(cards[4]!.statGroups.length, 2);
  strictEqual(cards[0]!.statGroups[0]!.stats.length, 9, "zero spell slots are still shown");
  strictEqual(base.classTableGroups.length, 1);
});

test("identical duplicate tables from multiple sources collapse to one", () => {
  const spellSlots = group(
    "Spell Slots",
    ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"],
    rows20(() => [2, 0, 0, 0, 0, 0, 0, 0, 0]),
  );
  strictEqual(dedupeTableGroups([spellSlots, spellSlots, spellSlots]).length, 1);
  const different = group(
    "Cantrips",
    ["Cantrips Known"],
    rows20(() => [3]),
  );
  strictEqual(dedupeTableGroups([spellSlots, different]).length, 2);
});

test("features from out-of-range levels are clamped into 1-20", () => {
  const cards = buildLevelCards(classFixture({ classFeatures: [feature(0, "Bogus")] }));
  strictEqual(cards[0]!.features.map((f) => f.name).join(), "Bogus");
});

test("blocksToPlainText flattens paragraphs, lists, tables and nested entries", () => {
  const text = blocksToPlainText([
    { type: "paragraph", text: "You gain benefits." },
    { type: "list", items: ["First choice", "Second choice"] },
    { type: "entries", name: "Weapon Mastery", blocks: [{ type: "paragraph", text: "Pick two." }] },
    {
      type: "table",
      headers: [{ text: "Level" }, { text: "Rages" }],
      rows: [[{ text: "1" }, { text: "2" }]],
    },
    { type: "dice", formula: "1d12", label: "per level" },
  ]);
  ok(text.includes("You gain benefits."), "paragraph kept");
  ok(text.includes("- First choice"), "list item marked");
  ok(text.includes("Weapon Mastery"), "entry name kept");
  ok(text.includes("Rages: 2"), "table row labelled");
  ok(text.includes("1d12 (per level)"), "dice formula kept");
});

test("renderer shows every level and keeps collapsed panels in the DOM", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture() }));
  strictEqual(
    (html.match(/aria-expanded="false"/g) ?? []).length > 0,
    true,
    "collapsed panels exist",
  );
  strictEqual(html.includes('aria-expanded="true"'), true, "level 1 starts open");
  strictEqual(html.includes("Primal Knowledge"), true, "level 3 feature is listed");
  strictEqual(html.includes("Raging Wrath"), true, "level 20 feature is listed");
  strictEqual(html.includes("1d12"), true, "hit dice still rendered");
  // The whole point of the change: feature text is no longer thrown away.
  strictEqual(
    html.includes("Rage does something useful."),
    true,
    "feature description is rendered",
  );
});

test("renderer labels progression values instead of showing a headerless table", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture() }));
  strictEqual(html.includes("Rages:"), true, "column label attached to its value");
  strictEqual(html.includes("Rage Damage:"), true, "second column labelled");
});

test("copy button is offered for each feature", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture() }));
  strictEqual((html.match(/aria-label="Copy text"/g) ?? []).length, 3);
});

test("a class with no levels at all still renders its basics", () => {
  const html = renderToString(
    createElement(ClassRenderer, {
      entity: classFixture({ classFeatures: [], classTableGroups: [] }),
    }),
  );
  strictEqual(html.includes("1d12"), true);
  strictEqual(html.includes("Path of the Berserker"), true, "subclasses still listed");
  strictEqual(
    html.includes("Progression by Level"),
    false,
    "no level cards when there is nothing to show",
  );
});

test("progression alone is enough to show the level breakdown", () => {
  const html = renderToString(
    createElement(ClassRenderer, { entity: classFixture({ classFeatures: [] }) }),
  );
  strictEqual(html.includes("Progression by Level"), true);
  strictEqual(html.includes("Rages:"), true, "values still explained without any features");
});

test("nested accordions never put a button inside a button", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture() }));
  // The level card and the feature rows are both <button>-based accordions.
  // Nesting them directly would be invalid HTML and breaks keyboard/screen-reader
  // behaviour, so the inner accordion must sit in the outer's sibling content div.
  const nested = /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/.test(html);
  strictEqual(nested, false, "no interactive control nested inside another");
});

test("every accordion toggle is labelled for assistive tech", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture() }));
  // 20 level cards + 3 feature rows. `HelpTip` also renders `aria-expanded`, so
  // count the accordions by `aria-controls` instead, which only they set.
  const toggles = (html.match(/aria-controls="/g) ?? []).length;
  strictEqual(toggles, 23, "one accordion per level plus one per feature");
  const expanded = (html.match(/aria-expanded="true"/g) ?? []).length;
  strictEqual(expanded, 1, "only level 1 starts open");
  strictEqual(
    (html.match(/hidden=""/g) ?? []).length,
    toggles - expanded,
    "every collapsed panel is hidden rather than unmounted",
  );
});

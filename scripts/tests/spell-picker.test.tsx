import * as React from "react";
import { ok } from "node:assert";
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
import type { Spell } from "../../src/compendium";
import { SpellPickerContent } from "../../src/features/character/components/spell-picker";

await loadCompendium();

const spells = getEntitiesForCategory("spell") as readonly Spell[];

function spellExists(name: string): void {
  ok(
    spells.some((s) => s.name === name),
    `expected spell "${name}" in compendium data`,
  );
}

spellExists("Fireball");
spellExists("Divine Smite");
ok(
  spells.find((s) => s.name === "Divine Smite")?.classes.includes("Wizard") !== true,
  "Divine Smite must not be a wizard spell",
);

interface PickerProps {
  readonly characterClass?: string;
  readonly selectedIds?: readonly string[];
  readonly initialQuery?: string;
  readonly initialScope?: "mine" | "all";
}

function renderPicker(props: PickerProps = {}): string {
  return renderToString(
    createElement(SpellPickerContent, {
      characterClass: props.characterClass ?? "",
      selectedIds: props.selectedIds ?? [],
      onToggle: () => undefined,
      onClose: () => undefined,
      initialQuery: props.initialQuery,
      initialScope: props.initialScope,
    }),
  );
}

console.log("SpellPicker\n");

test("renders a modal dialog labelled Select spells", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(html.includes('role="dialog"'), "dialog role present");
  ok(html.includes('aria-label="Select spells"'), "dialog label present");
});

test("renders the search field and Done button", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(html.includes('aria-label="Search spells"'), "search field present");
  ok(html.includes(">Done</button>"), "Done button present");
});

test("shows the class scope toggle for classed characters", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(html.includes("For Wizard"), "scoped option visible");
  ok(html.includes("All spells"), "unscoped option visible");
});

test("hides the scope toggle for characters without a class", () => {
  const html = renderPicker({ characterClass: "" });
  ok(!html.includes('aria-label="Which spells to show"'), "scope group absent");
});

test("defaults to the character's class list when it has spells", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(html.includes("Fireball"), "wizard spells listed");
  ok(!html.includes("Divine Smite"), "non-wizard spell hidden");
});

test("falls back to all spells when there is no class to scope by", () => {
  const html = renderPicker({ characterClass: "" });
  ok(html.includes("Fireball"), "wizard spell listed");
  ok(html.includes("Divine Smite"), "other class spells listed");
});

test("scope=all exposes spells outside the character's class", () => {
  const html = renderPicker({ characterClass: "Wizard", initialScope: "all" });
  ok(html.includes("Divine Smite"), "non-wizard spell listed");
});

test("marks selected spells and shows the known count", () => {
  const html = renderPicker({
    characterClass: "Wizard",
    selectedIds: [(spells.find((s) => s.name === "Fireball") as Spell).canonicalId],
  });
  ok(html.includes('aria-pressed="true"'), "selected row marked pressed");
  ok(html.includes("1 known"), "known count in header");
});

test("renders the level rail and advanced filter groups", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(html.includes('aria-label="Spell level"'), "level chips present");
  ok(html.includes("Cantrip"), "cantrip option present");
  ok(html.includes('aria-label="School"'), "school group present");
  ok(html.includes('aria-label="Concentration"'), "concentration group present");
  ok(html.includes('aria-label="Ritual"'), "ritual group present");
});

test("hides the redundant Class filter while scoped to the character", () => {
  const html = renderPicker({ characterClass: "Wizard", initialScope: "mine" });
  ok(!html.includes('aria-label="Class"'), "class group hidden when scoped");
});

test("shows the Class filter when browsing all spells", () => {
  const html = renderPicker({ characterClass: "Wizard", initialScope: "all" });
  ok(html.includes('aria-label="Class"'), "class group visible when unscoped");
});

test("shows the result count caption", () => {
  const html = renderPicker({ characterClass: "Wizard" });
  ok(/aria-label="status"|role="status"/.test(html), "count announced politely");
  ok(/\d+ spells/.test(html), "count caption present");
});

test("empty results offer a clear-filters action", () => {
  const html = renderPicker({
    characterClass: "Wizard",
    initialQuery: "zzzznothingmatches",
  });
  ok(html.includes("No spells found"), "empty message shown");
  ok(html.includes("Clear filters"), "clear filters action offered");
});

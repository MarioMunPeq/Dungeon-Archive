import * as React from "react";
import { ok } from "node:assert";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
// Make React available globally for JSX transform in imported components
// DicePage reads matchMedia during render (it is a client-only app, so that is
// fine); stub the minimum so the page can be server-rendered here.
if (typeof (globalThis as Record<string, unknown>).window === "undefined") {
  (globalThis as Record<string, unknown>).window = {
    matchMedia: (query: string) => ({ matches: false, media: query }),
  };
}

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

import { CombatPage } from "../../src/features/combat/combat-page";
import { DicePage } from "../../src/features/dice/dice-page";
import { CharacterPage } from "../../src/features/character/character-page";
import { ArchivePage } from "../../src/features/archive/archive-page";
import { NotFoundPage } from "../../src/features/not-found-page";
import { ClassRenderer } from "../../src/features/compendium/renderers/class-renderer";
import type { Class } from "../../src/compendium";

console.log("no stray source comments in rendered output\n");

/**
 * A `//` line comment is valid JS inside the parentheses of `return (`, a ternary
 * branch or an `&&` branch — those are JS taking a single expression, so nothing
 * is rendered. The same comment written directly between two JSX elements *is*
 * rendered as text, which is how a Design-DNA note about rule 28 once got drawn
 * in the middle of the Hit Points card.
 *
 * The rendered output is the ground truth here — no source heuristic, which
 * produced false positives on legitimate comments inside JS parentheses.
 */
function assertNoStrayComments(label: string, html: string): void {
  // `https://` is the only legitimate `//` in this app's output.
  const stripped = html.replace(/https?:\/\//g, "");
  const match = stripped.match(/.{0,50}\/\/.{0,50}/);
  ok(match === null, `${label} renders a source comment as text:\n      ${match?.[0]}`);
}

/** Pages using <Link> / useNavigate need a router; the assertion ignores markup. */
function renderAndCheck(label: string, node: React.ReactElement): void {
  const html = renderToString(
    createElement(MemoryRouter, null, createElement(React.Fragment, null, node)),
  );
  assertNoStrayComments(label, html);
}

test("CombatPage renders no source comments as text", () => {
  renderAndCheck("CombatPage", createElement(CombatPage));
});

test("DicePage renders no source comments as text", () => {
  renderAndCheck("DicePage", createElement(DicePage));
});

test("CharacterPage renders no source comments as text", () => {
  renderAndCheck("CharacterPage", createElement(CharacterPage));
});

test("ArchivePage renders no source comments as text", () => {
  renderAndCheck("ArchivePage", createElement(ArchivePage));
});

test("NotFoundPage renders no source comments as text", () => {
  renderAndCheck("NotFoundPage", createElement(NotFoundPage));
});

const classFixture = {
  id: "x",
  canonicalId: "class.barbarian",
  category: "class",
  name: "Barbarian",
  source: "PHB",
  hitDice: { number: 1, faces: 12 },
  proficiency: ["str", "con"],
  primaryAbility: ["str"],
  spellcastingAbility: null,
  casterProgression: null,
  startingProficiencies: { armor: [], weapons: [], tools: [], savingThrows: [], skills: [] },
  startingEquipment: { groups: [], goldAlternative: null, additionalFromBackground: false },
  multiclassing: null,
  classTableGroups: [
    { title: "Rage", colLabels: ["Rages"], rows: Array.from({ length: 20 }, (_, i) => [i + 1]) },
  ],
  classFeatures: [
    {
      name: "Rage",
      className: "Barbarian",
      source: "PHB",
      level: 1,
      gainSubclassFeature: false,
      description: [{ type: "paragraph" as const, text: "You gain benefits." }],
      consumes: null,
    },
  ],
  subclassTitle: null,
  subclassGroups: [],
} as unknown as Class;

test("ClassRenderer renders no source comments as text", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture }));
  assertNoStrayComments("ClassRenderer", html);
});

test("the level card keeps its labels after the comment fixes", () => {
  const html = renderToString(createElement(ClassRenderer, { entity: classFixture }));
  ok(html.includes("Level"), "level label present");
  ok(html.includes("Rages:"), "progression chip labelled");
  ok(html.includes("Numbers"), "inner progression label renamed");
  // The outer section owns "Progression by Level"; the per-level card must not
  // repeat it. Exactly one occurrence proves the duplicate heading is gone.
  const occurrences = html.split("Progression by Level").length - 1;
  ok(
    occurrences === 1,
    `expected the section title once, found ${occurrences} — the per-level label duplicates it`,
  );
});

console.log("");

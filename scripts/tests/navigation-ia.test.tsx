import * as React from "react";
import { ok, strictEqual } from "node:assert";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
// Make React available globally for JSX transform in imported components
(globalThis as Record<string, unknown>).React = React;

import { BottomNav } from "../../src/components/layout/bottom-nav";
import { ArchivePage } from "../../src/features/archive/archive-page";
import { CombatPage } from "../../src/features/combat/combat-page";
import { ROUTE_REDIRECTS } from "../../src/config/constants";
import { loadCompendium } from "../../src/compendium/loader";

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

function renderArchive(path: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <ArchivePage />
    </MemoryRouter>,
  );
}

async function main() {
  console.log("navigation-ia\n");

  await loadCompendium();

  test("bottom nav lists Home, Archive, Combat, Dice, Character in order", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>,
    );
    const home = html.indexOf(">Home<");
    const archive = html.indexOf(">Archive<");
    const combat = html.indexOf(">Combat<");
    const dice = html.indexOf(">Dice<");
    const character = html.indexOf(">Character<");
    ok(home >= 0, "Home item missing");
    ok(archive >= 0, "Archive item missing");
    ok(combat >= 0, "Combat item missing");
    ok(dice >= 0, "Dice item missing");
    ok(character >= 0, "Character item missing");
    ok(home < archive && archive < combat && combat < dice && dice < character);
  });

  test("bottom nav has no standalone Search or Rules items", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>,
    );
    ok(!html.includes(">Search<"), "Search item still present");
    ok(!html.includes(">Rules<"), "Rules item still present");
  });

  test("/archive defaults to the Search tab with the three rules tabs", () => {
    const html = renderArchive("/archive");
    ok(html.includes('type="search"'), "Search input missing on archive default");
    ok(html.includes(">Search<"), "Search tab missing");
    ok(html.includes(">How to Play<"), "How to Play tab missing");
    ok(html.includes(">Rules<"), "Rules tab missing");
    ok(html.includes(">Glossary<"), "Glossary tab missing");
  });

  test("/archive?tab=rules shows the rules content instead of search", () => {
    const html = renderArchive("/archive?tab=rules");
    ok(!html.includes('type="search"'), "Search input shown on rules tab");
    ok(html.includes("Beginner tips"), "Beginner tips toggle missing");
    ok(html.includes("The D20"), "Rule section missing");
  });

  test("/archive tab bar sticks flush with the scroll container top", () => {
    const html = renderArchive("/archive");
    ok(html.includes("sticky top-0"), "Tab bar is not sticky top-0");
    ok(!html.includes("sticky top-14"), "Tab bar carries the stale top-14 offset");
  });

  test("/archive?tab=glossary shows the glossary", () => {
    const html = renderArchive("/archive?tab=glossary");
    ok(html.includes("Ability Check"), "Glossary term missing");
  });

  test("retired routes redirect to the archive", () => {
    strictEqual(ROUTE_REDIRECTS["/search"], "/archive");
    strictEqual(ROUTE_REDIRECTS["/rules"], "/archive?tab=rules");
  });

  test("combat page has no Roll Dice entry (dice is a primary destination)", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/combat"]}>
        <CombatPage />
      </MemoryRouter>,
    );
    ok(!html.includes("Roll Dice"), "Combat still links to the dice roller");
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

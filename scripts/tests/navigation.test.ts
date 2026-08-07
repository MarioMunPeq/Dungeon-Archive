import { strictEqual } from "node:assert";
import { getTopBarState } from "../../src/components/layout/top-bar-route";
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

async function main() {
  console.log("navigation\n");

  await loadCompendium();

  test("home shows app name with no back button", () => {
    const state = getTopBarState("/");
    strictEqual(state.hidden, undefined);
    strictEqual(state.title, "Dungeon Archive");
    strictEqual(state.backTo, undefined);
  });

  test("search hides the top bar", () => {
    strictEqual(getTopBarState("/search").hidden, true);
  });

  test("quick rules shows fixed title without back", () => {
    const state = getTopBarState("/rules");
    strictEqual(state.title, "Quick Rules");
    strictEqual(state.backTo, undefined);
  });

  test("combat shows fixed title without back", () => {
    const state = getTopBarState("/combat");
    strictEqual(state.title, "Combat");
    strictEqual(state.backTo, undefined);
  });

  test("party shows fixed title without back", () => {
    const state = getTopBarState("/party");
    strictEqual(state.title, "Party");
    strictEqual(state.backTo, undefined);
  });

  test("category root shows plural title and back to search", () => {
    const state = getTopBarState("/spell");
    strictEqual(state.title, "Spells");
    strictEqual(state.backTo, "/search");
  });

  test("monster category root shows plural title and back to search", () => {
    const state = getTopBarState("/monster");
    strictEqual(state.title, "Monsters");
    strictEqual(state.backTo, "/search");
  });

  test("category detail shows entity name and back to category", () => {
    const state = getTopBarState("/spell/fireball");
    strictEqual(state.title, "Fireball");
    strictEqual(state.backTo, "/spell");
  });

  test("category detail falls back to singular label when entity is missing", () => {
    const state = getTopBarState("/spell/not-a-real-spell");
    strictEqual(state.title, "Spell");
    strictEqual(state.backTo, "/spell");
  });

  test("session shows back to home", () => {
    const state = getTopBarState("/session");
    strictEqual(state.title, "Session");
    strictEqual(state.backTo, "/");
  });

  test("backup shows back to home", () => {
    const state = getTopBarState("/backup");
    strictEqual(state.title, "Backup");
    strictEqual(state.backTo, "/");
  });

  test("debug routes show title and back to home", () => {
    const state = getTopBarState("/debug/content");
    strictEqual(state.title, "Debug");
    strictEqual(state.backTo, "/");
  });

  test("unknown route falls back to app name without back", () => {
    const state = getTopBarState("/not-a-route");
    strictEqual(state.title, "Dungeon Archive");
    strictEqual(state.backTo, undefined);
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

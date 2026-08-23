import { strictEqual, ok, deepEqual } from "node:assert";
import { loadCompendium, getEntitiesForCategory } from "../../src/compendium";
import type { Spell } from "../../src/compendium";
import {
  matchesCharacterClass,
  countClassSpells,
  scoreSpellMatch,
  filterSpellCandidates,
} from "../../src/features/character/spell-picker-model";

await loadCompendium();

const spells = getEntitiesForCategory("spell") as readonly Spell[];

function byName(name: string): Spell {
  const spell = spells.find((s) => s.name === name);
  ok(spell, `expected spell "${name}" in compendium data`);
  return spell;
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

console.log("spell-picker-model\n");

test("loadCompendium provides spells", () => {
  ok(spells.length > 500, `expected a large spell list, got ${spells.length}`);
});

test("matchesCharacterClass matches Title Case class exactly", () => {
  const fireball = byName("Fireball");
  ok(fireball.classes.includes("Wizard"), "Fireball is a wizard spell");
  ok(matchesCharacterClass(fireball, "Wizard"));
});

test("matchesCharacterClass ignores case and surrounding whitespace", () => {
  const fireball = byName("Fireball");
  ok(matchesCharacterClass(fireball, "wizard"));
  ok(matchesCharacterClass(fireball, " WIZARD "));
});

test("matchesCharacterClass returns false for unrelated or empty classes", () => {
  ok(!matchesCharacterClass(byName("Fireball"), "Barbarian"));
  ok(!matchesCharacterClass(byName("Fireball"), ""));
  ok(!matchesCharacterClass(byName("Fireball"), "   "));
});

test("scoreSpellMatch scores exact matches highest", () => {
  strictEqual(scoreSpellMatch(byName("Fireball"), "fireball"), 100);
});

test("scoreSpellMatch ranks prefix above substring and rejects misses", () => {
  strictEqual(scoreSpellMatch(byName("Fireball"), "fire"), 80);
  const includesOnly = spells.find(
    (s) => !s.name.toLowerCase().startsWith("fire") && s.name.toLowerCase().includes("fire"),
  );
  ok(includesOnly, "expected a spell containing fire but not starting with it");
  strictEqual(scoreSpellMatch(includesOnly!, "fire"), 60);
  strictEqual(scoreSpellMatch(byName("Fireball"), "ice"), null);
});

test("scoreSpellMatch treats an empty query as a neutral match", () => {
  strictEqual(scoreSpellMatch(byName("Fireball"), ""), 0);
  strictEqual(scoreSpellMatch(byName("Fireball"), "   "), 0);
});

test("countClassSpells counts scoped spells only", () => {
  const expected = spells.filter((s) => s.classes.includes("Wizard")).length;
  ok(expected > 0);
  strictEqual(countClassSpells(spells, "Wizard"), expected);
  strictEqual(countClassSpells(spells, ""), 0);
});

test("filterSpellCandidates without scope, query, or filters lists everything alphabetically", () => {
  const results = filterSpellCandidates(spells, {});
  strictEqual(results.length, spells.length);
  for (let i = 1; i < results.length; i++) {
    ok(results[i - 1]!.name.localeCompare(results[i]!.name) <= 0, "results are name-sorted");
  }
});

test("filterSpellCandidates scopes results to the character's class", () => {
  const results = filterSpellCandidates(spells, { characterClass: "wizard" });
  const expected = spells.filter((s) => s.classes.includes("Wizard")).length;
  strictEqual(results.length, expected);
  ok(results.every((s) => s.classes.some((c) => c.toLowerCase() === "wizard")));
});

test("filterSpellCandidates applies level filters inside the scope", () => {
  const results = filterSpellCandidates(spells, {
    characterClass: "Wizard",
    filters: { level: "3" },
  });
  ok(results.length > 0, "wizards have level 3 spells");
  ok(results.every((s) => s.level === 3 && s.classes.includes("Wizard")));
});

test("filterSpellCandidates composes query search with scope", () => {
  const results = filterSpellCandidates(spells, { characterClass: "Wizard", query: "fire" });
  ok(results.length > 0, "expected fire spells for wizards");
  ok(results.every((s) => s.name.toLowerCase().includes("fire")));
});

test("filterSpellCandidates sorts query matches by relevance then name", () => {
  const results = filterSpellCandidates(spells, { characterClass: "Wizard", query: "fire" });
  const lastPrefixIndex = results.reduce(
    (last, s, i) => (s.name.toLowerCase().startsWith("fire") ? i : last),
    -1,
  );
  const firstSubstringIndex = results.findIndex((s) => !s.name.toLowerCase().startsWith("fire"));
  ok(lastPrefixIndex >= 0, "prefix matches included");
  ok(firstSubstringIndex >= 0, "substring matches follow prefix matches");
  ok(lastPrefixIndex < firstSubstringIndex, "all prefix matches rank above substring matches");
  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1]!;
    const curr = results[i]!;
    if (scoreSpellMatch(prev, "fire") === scoreSpellMatch(curr, "fire")) {
      ok(prev.name.localeCompare(curr.name) <= 0, "ties are name-sorted");
    }
  }
});

test("filterSpellCandidates supports the class filter when no scope is active", () => {
  const results = filterSpellCandidates(spells, { filters: { class: "Paladin" } });
  ok(results.length > 0, "paladins have spells");
  ok(results.every((s) => s.classes.includes("Paladin")));
});

test("filterSpellCandidates composes concentration and ritual filters", () => {
  const results = filterSpellCandidates(spells, {
    characterClass: "Wizard",
    filters: { concentration: "yes", ritual: "yes" },
  });
  ok(results.length > 0, "wizards have concentration rituals");
  ok(results.every((s) => s.concentration && s.ritual));
});

test("filterSpellCandidates returns no results for impossible combinations", () => {
  const results = filterSpellCandidates(spells, {
    filters: { level: "0", ritual: "yes" },
  });
  deepEqual(results, [], "no ritual cantrips exist in the data");
});

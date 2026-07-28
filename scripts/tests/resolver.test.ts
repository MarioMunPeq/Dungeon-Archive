import { strictEqual, ok } from "node:assert";
import {
  sourcePriority,
  selectPreferredVersion,
} from "../../src/compendium/resolver/version-selector";
import {
  buildRegistry,
  getVersions,
  clearRegistry,
  registrySize,
} from "../../src/compendium/registry/entity-registry";
import { resolveEntity } from "../../src/compendium/resolver/entity-resolver";
import { state } from "../../src/compendium/loader";
import type { CompendiumEntry, Spell, Condition, EntityCategory } from "../../src/types/compendium";

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

function makeEntity(id: string, canonicalId: string, source: string): CompendiumEntry {
  const category: EntityCategory = canonicalId.startsWith("spell") ? "spell" : "condition";
  const name = id.split("|").pop() ?? id;
  const base = { id, canonicalId, name, source, category };
  if (category === "spell") {
    return {
      ...base,
      category: "spell" as const,
      level: 3,
      school: "V",
      castingTime: "1 action",
      range: "150 feet",
      components: ["V", "S", "M"],
      duration: "Instantaneous",
      description: [],
      classes: ["Sorcerer", "Wizard"],
      ritual: false,
      concentration: false,
    } as Spell;
  }
  return { ...base, category: "condition" as const, description: [] } as Condition;
}

function populateState(entities: CompendiumEntry[]): void {
  for (const e of entities) {
    const map =
      e.category === "spell"
        ? state.spells
        : e.category === "condition"
          ? state.conditions
          : e.category === "equipment"
            ? state.equipment
            : state.actions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as Map<string, any>).set(e.id, e);
  }
}

function clearState(): void {
  state.spells.clear();
  state.conditions.clear();
  state.equipment.clear();
  state.actions.clear();
}

function resetAll(): void {
  clearState();
  clearRegistry();
}

console.log("version-selector\n");

test("sourcePriority XPHB = 1", () => {
  strictEqual(sourcePriority("XPHB"), 1);
});

test("sourcePriority PHB = 2", () => {
  strictEqual(sourcePriority("PHB"), 2);
});

test("sourcePriority TCE = 3", () => {
  strictEqual(sourcePriority("TCE"), 3);
});

test("sourcePriority XGE = 4", () => {
  strictEqual(sourcePriority("XGE"), 4);
});

test("unknown source gets priority 99", () => {
  strictEqual(sourcePriority("AAG"), 99);
});

test("selectPreferredVersion picks XPHB over PHB", () => {
  const result = selectPreferredVersion([
    { id: "phb|fireball", source: "PHB", category: "spell" },
    { id: "xphb|fireball", source: "XPHB", category: "spell" },
  ]);
  strictEqual(result.source, "XPHB");
});

test("selectPreferredVersion picks PHB over TCE", () => {
  const result = selectPreferredVersion([
    { id: "tce|aid", source: "TCE", category: "spell" },
    { id: "phb|aid", source: "PHB", category: "spell" },
  ]);
  strictEqual(result.source, "PHB");
});

test("selectPreferredVersion returns single version", () => {
  const result = selectPreferredVersion([{ id: "phb|fireball", source: "PHB", category: "spell" }]);
  strictEqual(result.source, "PHB");
});

test("selectPreferredVersion throws on empty array", () => {
  try {
    selectPreferredVersion([]);
    ok(false, "Should have thrown");
  } catch {
    ok(true);
  }
});

console.log("\nentity-registry\n");

test("buildRegistry indexes by canonicalId", () => {
  resetAll();
  buildRegistry([
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
  ]);
  strictEqual(registrySize(), 1);
});

test("getVersions returns all versions for a canonicalId", () => {
  resetAll();
  buildRegistry([
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
  ]);
  const versions = getVersions("spell.fireball");
  ok(versions !== null);
  strictEqual(versions!.length, 2);
});

test("getVersions returns null for unknown canonicalId", () => {
  resetAll();
  strictEqual(getVersions("spell.unknown"), null);
});

test("buildRegistry handles multiple entities", () => {
  resetAll();
  buildRegistry([
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
    makeEntity("phb|mage-armor", "spell.mage-armor", "PHB"),
    makeEntity("tce|aid", "spell.aid", "TCE"),
    makeEntity("phb|aid", "spell.aid", "PHB"),
  ]);
  strictEqual(registrySize(), 3);
});

test("registry stores category in EntityVersion", () => {
  resetAll();
  buildRegistry([makeEntity("phb|fireball", "spell.fireball", "PHB")]);
  const versions = getVersions("spell.fireball");
  ok(versions !== null);
  strictEqual(versions![0]!.category, "spell");
});

console.log("\nentity-resolver\n");

test("resolveEntity returns selected as full entity for known canonicalId", () => {
  resetAll();
  const entities = [
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
  ];
  populateState(entities);
  buildRegistry(entities);

  const result = resolveEntity("spell.fireball");
  ok(result !== null);
  strictEqual(result.canonicalId, "spell.fireball");
  strictEqual(result.selected.source, "XPHB");
  strictEqual(result.selected.id, "xphb|fireball");
  strictEqual(result.versions.length, 2);
  ok("level" in result.selected, "selected is full entity (has level)");
  strictEqual((result.selected as Spell).level, 3);
});

test("resolveEntity returns null for unknown canonicalId", () => {
  resetAll();
  strictEqual(resolveEntity("spell.unknown"), null);
});

test("resolveEntity with explicit source picks that version", () => {
  resetAll();
  const entities = [
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
  ];
  populateState(entities);
  buildRegistry(entities);

  const result = resolveEntity("spell.fireball", "PHB");
  ok(result !== null);
  strictEqual(result.selected.source, "PHB");
  strictEqual(result.selected.id, "phb|fireball");
});

test("resolveEntity with missing explicit source falls back to priority", () => {
  resetAll();
  const entities = [
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("xphb|fireball", "spell.fireball", "XPHB"),
  ];
  populateState(entities);
  buildRegistry(entities);

  const result = resolveEntity("spell.fireball", "AAG");
  ok(result !== null);
  strictEqual(result.selected.source, "XPHB", "falls back to best priority");
});

test("resolveEntity returns single version for unique entity", () => {
  resetAll();
  const entities = [makeEntity("phb|blade-ward", "spell.blade-ward", "PHB")];
  populateState(entities);
  buildRegistry(entities);

  const result = resolveEntity("spell.blade-ward");
  ok(result !== null);
  strictEqual(result.selected.source, "PHB");
  strictEqual(result.versions.length, 1);
});

test("resolveEntity returns null if entity data missing from repository", () => {
  resetAll();
  buildRegistry([makeEntity("phb|fireball", "spell.fireball", "PHB")]);
  // Don't populate state — entity exists in registry but not in repository
  strictEqual(resolveEntity("spell.fireball"), null);
});

test("resolveEntity returns entity with correct category for different categories", () => {
  resetAll();
  const entities = [
    makeEntity("phb|fireball", "spell.fireball", "PHB"),
    makeEntity("phb|blinded", "condition.blinded", "PHB") as Condition,
  ];
  populateState(entities);
  buildRegistry(entities);

  const spell = resolveEntity("spell.fireball");
  const cond = resolveEntity("condition.blinded");
  ok(spell !== null);
  ok(cond !== null);
  strictEqual(spell.selected.category, "spell");
  strictEqual(cond.selected.category, "condition");
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);

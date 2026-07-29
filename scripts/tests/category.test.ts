import { strictEqual, ok, deepEqual } from "node:assert";
import {
  getEntitiesForCategory,
  collectUnique,
  buildOptions,
  buildFilterDefs,
  applyFilters,
  toCardData,
  SCHOOL_NAMES,
} from "../../src/compendium/category-display";
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
  console.log("category browsing\n");

  await loadCompendium();

  test("getEntitiesForCategory returns spells", () => {
    const spells = getEntitiesForCategory("spell");
    ok(spells.length > 0);
    strictEqual(spells[0]!.category, "spell");
  });

  test("getEntitiesForCategory returns monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    ok(monsters.length > 0);
    strictEqual(monsters[0]!.category, "monster");
  });

  test("getEntitiesForCategory returns equipment", () => {
    const equipment = getEntitiesForCategory("equipment");
    ok(equipment.length > 0);
    strictEqual(equipment[0]!.category, "equipment");
  });

  test("getEntitiesForCategory returns conditions", () => {
    const conditions = getEntitiesForCategory("condition");
    ok(conditions.length > 0);
    strictEqual(conditions[0]!.category, "condition");
  });

  test("getEntitiesForCategory returns actions", () => {
    const actions = getEntitiesForCategory("action");
    ok(actions.length > 0);
    strictEqual(actions[0]!.category, "action");
  });

  test("collectUnique deduplicates and sorts", () => {
    const result = collectUnique([{ x: "b" }, { x: "a" }, { x: "b" }], (i) => i.x);
    deepEqual(result, ["a", "b"]);
  });

  test("buildOptions prepends All option", () => {
    const options = buildOptions(["a", "b"]);
    strictEqual(options.length, 3);
    strictEqual(options[0]!.value, "");
    strictEqual(options[0]!.label, "All");
    strictEqual(options[1]!.value, "a");
  });

  test("buildOptions applies labelMap", () => {
    const options = buildOptions(["V", "A"], SCHOOL_NAMES);
    const vOpt = options.find((o) => o.value === "V");
    ok(vOpt);
    strictEqual(vOpt.label, "Evocation");
  });

  test("buildOptions applies labelFn", () => {
    const options = buildOptions(["XPHB", "PHB"], {}, (s) => (s === "XPHB" ? "PHB24" : s));
    const xphb = options.find((o) => o.value === "XPHB");
    ok(xphb);
    strictEqual(xphb.label, "PHB24");
  });

  test("buildFilterDefs creates level filter for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const level = defs.find((d) => d.key === "level");
    ok(level);
    strictEqual(level.label, "Level");
    ok(level.options.some((o) => o.value === "0"));
    ok(level.options.some((o) => o.value === "3"));
    ok(level.options.some((o) => o.value === "9"));
  });

  test("buildFilterDefs creates school filter for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const school = defs.find((d) => d.key === "school");
    ok(school);
    ok(school.options.some((o) => o.value === "V"));
    ok(school.options.some((o) => o.value === "A"));
  });

  test("buildFilterDefs creates CR filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const cr = defs.find((d) => d.key === "cr");
    ok(cr);
    ok(cr.options.some((o) => o.value === "1"));
    ok(cr.options.some((o) => o.value === "24"));
    ok(cr.options.some((o) => o.value === "1/4"));
  });

  test("buildFilterDefs creates type filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const type = defs.find((d) => d.key === "type");
    ok(type);
    ok(type.options.some((o) => o.value === "dragon"));
  });

  test("buildFilterDefs creates size filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const size = defs.find((d) => d.key === "size");
    ok(size);
    ok(size.options.some((o) => o.value === "Gargantuan"));
    ok(size.options.some((o) => o.value === "Tiny"));
  });

  test("buildFilterDefs creates type filter for equipment", () => {
    const equipment = getEntitiesForCategory("equipment");
    const defs = buildFilterDefs("equipment", equipment);
    const type = defs.find((d) => d.key === "type");
    ok(type);
    ok(type.options.some((o) => o.value !== ""));
  });

  test("buildFilterDefs creates source filter for all categories", () => {
    for (const cat of ["spell", "monster", "equipment", "condition", "action"] as const) {
      const entities = getEntitiesForCategory(cat);
      const defs = buildFilterDefs(cat, entities);
      const source = defs.find((d) => d.key === "source");
      ok(source, `${cat} should have source filter`);
    }
  });

  test("applyFilters returns all entities when no filters", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, {});
    strictEqual(result.length, spells.length);
  });

  test("applyFilters filters spells by level", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { level: "3" });
    ok(result.length > 0);
    ok(result.length < spells.length);
    for (const spell of result) {
      strictEqual((spell as import("../../src/types/compendium").Spell).level, 3);
    }
  });

  test("applyFilters filters spells by school", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { school: "V" });
    ok(result.length > 0);
    for (const spell of result) {
      strictEqual((spell as import("../../src/types/compendium").Spell).school, "V");
    }
  });

  test("applyFilters filters spells by source", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { source: "XPHB" });
    ok(result.length > 0);
    for (const spell of result) {
      strictEqual(spell.source, "XPHB");
    }
  });

  test("applyFilters combines multiple filters with AND", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { level: "3", school: "V", source: "XPHB" });
    for (const spell of result) {
      const s = spell as import("../../src/types/compendium").Spell;
      strictEqual(s.level, 3);
      strictEqual(s.school, "V");
      strictEqual(s.source, "XPHB");
    }
  });

  test("applyFilters filters monsters by CR", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = applyFilters("monster", monsters, { cr: "24" });
    ok(result.length > 0);
    for (const m of result) {
      const monster = m as import("../../src/types/compendium").Monster;
      strictEqual(monster.challengeRating, "24");
    }
  });

  test("applyFilters filters monsters by type", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = applyFilters("monster", monsters, { type: "dragon" });
    ok(result.length > 0);
    for (const m of result) {
      strictEqual((m as import("../../src/types/compendium").Monster).monsterType, "dragon");
    }
  });

  test("applyFilters filters monsters by size", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = applyFilters("monster", monsters, { size: "Gargantuan" });
    ok(result.length > 0);
    for (const m of result) {
      strictEqual((m as import("../../src/types/compendium").Monster).size, "Gargantuan");
    }
  });

  test("applyFilters filters monsters by source", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = applyFilters("monster", monsters, { source: "XMM" });
    ok(result.length > 0);
    for (const m of result) {
      strictEqual(m.source, "XMM");
    }
  });

  test("applyFilters combined monster filters", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = applyFilters("monster", monsters, { cr: "24", type: "dragon", source: "XMM" });
    for (const m of result) {
      const monster = m as import("../../src/types/compendium").Monster;
      strictEqual(monster.challengeRating, "24");
      strictEqual(monster.monsterType, "dragon");
      strictEqual(m.source, "XMM");
    }
  });

  test("toCardData produces correct spell card", () => {
    const spells = getEntitiesForCategory("spell");
    const fireball = spells.find((s) => s.name === "Fireball" && s.source === "XPHB");
    ok(fireball, "Fireball XPHB should exist");
    const card = toCardData("spell", fireball!);
    strictEqual(card.name, "Fireball");
    strictEqual(card.categoryLabel, "Spell");
    ok(card.metadata.includes("Level 3"));
    ok(card.metadata.includes("Evocation"));
    strictEqual(card.source, "XPHB");
    ok(card.href.startsWith("/spell/"));
  });

  test("toCardData produces correct monster card", () => {
    const monsters = getEntitiesForCategory("monster");
    const ancient = monsters.find(
      (m) => m.name.startsWith("Ancient Red Dragon") && m.source === "XMM",
    );
    ok(ancient, "Ancient Red Dragon XMM should exist");
    const card = toCardData("monster", ancient!);
    strictEqual(card.name, "Ancient Red Dragon");
    strictEqual(card.categoryLabel, "Monster");
    ok(card.metadata.includes("CR 24"));
    ok(card.metadata.includes("dragon"));
    strictEqual(card.source, "XMM");
    ok(card.href.startsWith("/monster/"));
  });

  test("toCardData produces correct equipment card", () => {
    const equipment = getEntitiesForCategory("equipment");
    const item = equipment.find((e) => e.name === "Backpack" && e.source === "XPHB");
    ok(item, "Backpack XPHB should exist");
    const card = toCardData("equipment", item!);
    strictEqual(card.name, "Backpack");
    strictEqual(card.categoryLabel, "Equipment");
    ok(card.href.startsWith("/equipment/"));
  });

  test("toCardData produces correct condition card", () => {
    const conditions = getEntitiesForCategory("condition");
    const blinded = conditions.find((c) => c.name === "Blinded");
    ok(blinded);
    const card = toCardData("condition", blinded!);
    strictEqual(card.categoryLabel, "Condition");
    strictEqual(card.metadata, "");
  });

  test("toCardData produces correct action card", () => {
    const actions = getEntitiesForCategory("action");
    const dodge = actions.find((a) => a.name === "Dodge");
    ok(dodge);
    const card = toCardData("action", dodge!);
    strictEqual(card.name, "Dodge");
    strictEqual(card.categoryLabel, "Action");
    strictEqual(
      card.metadata,
      dodge && "actionType" in dodge
        ? (dodge as import("../../src/types/compendium").Action).actionType
        : "",
    );
  });

  test("applyFilters returns empty array when no match", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { level: "999" });
    strictEqual(result.length, 0);
  });

  test("applyFilters with unknown key does not filter", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { unknown: "value" });
    strictEqual(result.length, spells.length);
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

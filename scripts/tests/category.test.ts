import { strictEqual, ok, deepEqual } from "node:assert";
import {
  getEntitiesForCategory,
  collectUnique,
  buildOptions,
  buildFilterDefs,
  applyFilters,
  toCardData,
  getSortOptions,
  sortEntities,
  dedupeEntities,
  SCHOOL_NAMES,
} from "../../src/compendium/category-display";
import { sourcePriority } from "../../src/compendium/resolver/version-selector";
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

  test("getEntitiesForCategory returns magic items", () => {
    const items = getEntitiesForCategory("magicitem");
    ok(items.length > 0);
    strictEqual(items[0]!.category, "magicitem");
  });

  test("getEntitiesForCategory returns feats", () => {
    const feats = getEntitiesForCategory("feat");
    ok(feats.length > 0);
    strictEqual(feats[0]!.category, "feat");
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
    const vOpt = options.find((o: { value: string }) => o.value === "V");
    ok(vOpt);
    strictEqual(vOpt.label, "Evocation");
  });

  test("buildOptions applies labelFn", () => {
    const options = buildOptions(["XPHB", "PHB"], {}, (s) => (s === "XPHB" ? "PHB24" : s));
    const xphb = options.find((o: { value: string }) => o.value === "XPHB");
    ok(xphb);
    strictEqual(xphb.label, "PHB24");
  });

  test("buildFilterDefs creates level filter for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const level = defs.find((d: { key: string }) => d.key === "level");
    ok(level);
    strictEqual(level.label, "Level");
    ok(level.options.some((o: { value: string }) => o.value === "0"));
    ok(level.options.some((o: { value: string }) => o.value === "3"));
    ok(level.options.some((o: { value: string }) => o.value === "9"));
  });

  test("buildFilterDefs creates school filter for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const school = defs.find((d: { key: string }) => d.key === "school");
    ok(school);
    ok(school.options.some((o: { value: string }) => o.value === "V"));
    ok(school.options.some((o: { value: string }) => o.value === "A"));
  });

  test("buildFilterDefs creates CR filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const cr = defs.find((d: { key: string }) => d.key === "cr");
    ok(cr);
    ok(cr.options.some((o: { value: string }) => o.value === "1"));
    ok(cr.options.some((o: { value: string }) => o.value === "24"));
    ok(cr.options.some((o: { value: string }) => o.value === "1/4"));
  });

  test("buildFilterDefs creates type filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const type = defs.find((d: { key: string }) => d.key === "type");
    ok(type);
    ok(type.options.some((o: { value: string }) => o.value === "dragon"));
  });

  test("buildFilterDefs creates size filter for monsters", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const size = defs.find((d: { key: string }) => d.key === "size");
    ok(size);
    ok(size.options.some((o: { value: string }) => o.value === "Gargantuan"));
    ok(size.options.some((o: { value: string }) => o.value === "Tiny"));
  });

  test("buildFilterDefs creates type filter for equipment", () => {
    const equipment = getEntitiesForCategory("equipment");
    const defs = buildFilterDefs("equipment", equipment);
    const type = defs.find((d: { key: string }) => d.key === "type");
    ok(type);
    ok(type.options.some((o: { value: string }) => o.value !== ""));
  });

  test("buildFilterDefs creates rarity filter for magic items", () => {
    const items = getEntitiesForCategory("magicitem");
    const defs = buildFilterDefs("magicitem", items);
    const rarity = defs.find((d: { key: string }) => d.key === "rarity");
    ok(rarity);
    ok(rarity.options.some((o: { value: string }) => o.value === "rare"));
    ok(rarity.options.some((o: { value: string }) => o.value === "legendary"));
  });

  test("buildFilterDefs creates itemType filter for magic items", () => {
    const items = getEntitiesForCategory("magicitem");
    const defs = buildFilterDefs("magicitem", items);
    const type = defs.find((d: { key: string }) => d.key === "itemType");
    ok(type);
    ok(type.options.some((o: { value: string }) => o.value === "Ring"));
    ok(type.options.some((o: { value: string }) => o.value === "Potion"));
  });

  test("buildFilterDefs creates attunement filter for magic items", () => {
    const items = getEntitiesForCategory("magicitem");
    const defs = buildFilterDefs("magicitem", items);
    const attune = defs.find((d: { key: string }) => d.key === "attunement");
    ok(attune);
    strictEqual(attune.options.length, 3);
    strictEqual(attune.options[1]!.value, "required");
    strictEqual(attune.options[2]!.value, "none");
  });

  test("buildFilterDefs creates prerequisite filter for feats", () => {
    const featsData = getEntitiesForCategory("feat");
    const defs = buildFilterDefs("feat", featsData);
    const prereq = defs.find((d: { key: string }) => d.key === "prerequisite");
    ok(prereq);
    strictEqual(prereq!.options.length, 3);
    strictEqual(prereq!.options[1]!.value, "yes");
    strictEqual(prereq!.options[2]!.value, "none");
  });

  test("buildFilterDefs creates repeatable filter for feats", () => {
    const featsData = getEntitiesForCategory("feat");
    const defs = buildFilterDefs("feat", featsData);
    const rep = defs.find((d: { key: string }) => d.key === "repeatable");
    ok(rep);
    strictEqual(rep!.options[1]!.value, "yes");
    strictEqual(rep!.options[2]!.value, "no");
  });

  test("buildFilterDefs creates source filter for all categories", () => {
    for (const cat of [
      "spell",
      "monster",
      "equipment",
      "condition",
      "action",
      "magicitem",
      "feat",
    ] as const) {
      const entities = getEntitiesForCategory(cat);
      const defs = buildFilterDefs(cat, entities);
      const source = defs.find((d: { key: string }) => d.key === "source");
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

  test("applyFilters filters magic items by rarity", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = applyFilters("magicitem", items, { rarity: "legendary" });
    ok(result.length > 0);
    ok(result.length < items.length);
    for (const item of result) {
      strictEqual((item as import("../../src/types/compendium").MagicItem).rarity, "legendary");
    }
  });

  test("applyFilters filters magic items by itemType", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = applyFilters("magicitem", items, { itemType: "Ring" });
    ok(result.length > 0);
    for (const item of result) {
      strictEqual((item as import("../../src/types/compendium").MagicItem).itemType, "Ring");
    }
  });

  test("applyFilters filters magic items by attunement required", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = applyFilters("magicitem", items, { attunement: "required" });
    ok(result.length > 0);
    for (const item of result) {
      ok(
        (item as import("../../src/types/compendium").MagicItem).requiresAttunement,
        "should require attunement",
      );
    }
  });

  test("applyFilters filters magic items by attunement none", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = applyFilters("magicitem", items, { attunement: "none" });
    ok(result.length > 0);
    for (const item of result) {
      strictEqual(
        (item as import("../../src/types/compendium").MagicItem).requiresAttunement,
        "",
        "should not require attunement",
      );
    }
  });

  test("applyFilters filters magic items by source", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = applyFilters("magicitem", items, { source: "DMG" });
    ok(result.length > 0);
    for (const item of result) {
      strictEqual(item.source, "DMG");
    }
  });

  test("applyFilters filters feats by prerequisite", () => {
    const featsData = getEntitiesForCategory("feat");
    const result = applyFilters("feat", featsData, { prerequisite: "yes" });
    ok(result.length > 0);
    ok(result.length < featsData.length);
    for (const f of result) {
      ok((f as import("../../src/types/compendium").Feat).prerequisite, "should have prerequisite");
    }
  });

  test("applyFilters filters feats by repeatable", () => {
    const featsData = getEntitiesForCategory("feat");
    const result = applyFilters("feat", featsData, { repeatable: "yes" });
    ok(result.length > 0);
    for (const f of result) {
      strictEqual((f as import("../../src/types/compendium").Feat).repeatable, true);
    }
  });

  test("applyFilters filters feats by source", () => {
    const featsData = getEntitiesForCategory("feat");
    const result = applyFilters("feat", featsData, { source: "XPHB" });
    ok(result.length > 0);
    for (const f of result) {
      strictEqual(f.source, "XPHB");
    }
  });

  test("toCardData produces correct feat card", () => {
    const featsData = getEntitiesForCategory("feat");
    const asi = featsData.find(
      (f: { name: string; source: string }) =>
        f.name === "Ability Score Improvement" && f.source === "XPHB",
    );
    ok(asi, "ASI XPHB should exist");
    const card = toCardData("feat", asi!);
    strictEqual(card.name, "Ability Score Improvement");
    strictEqual(card.categoryLabel, "Feat");
    strictEqual(card.metadata, "General");
    strictEqual(card.source, "XPHB");
    ok(card.href.startsWith("/feat/"));
  });

  test("toCardData produces correct magic item card", () => {
    const items = getEntitiesForCategory("magicitem");
    const item = items.find(
      (i: { name: string; source: string }) => i.name === "Staff of Power" && i.source === "DMG",
    );
    ok(item, "Staff of Power DMG should exist");
    const card = toCardData("magicitem", item!);
    strictEqual(card.name, "Staff of Power");
    strictEqual(card.categoryLabel, "Magic Item");
    ok(card.metadata.includes("very rare"));
    strictEqual(card.source, "DMG");
    ok(card.href.startsWith("/magicitem/"));
  });

  test("toCardData produces correct spell card", () => {
    const spells = getEntitiesForCategory("spell");
    const fireball = spells.find(
      (s: { name: string; source: string }) => s.name === "Fireball" && s.source === "XPHB",
    );
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
      (m: { name: string; source: string }) =>
        m.name.startsWith("Ancient Red Dragon") && m.source === "XMM",
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
    const item = equipment.find(
      (e: { name: string; source: string }) => e.name === "Backpack" && e.source === "XPHB",
    );
    ok(item, "Backpack XPHB should exist");
    const card = toCardData("equipment", item!);
    strictEqual(card.name, "Backpack");
    strictEqual(card.categoryLabel, "Equipment");
    ok(card.href.startsWith("/equipment/"));
  });

  test("toCardData produces correct condition card", () => {
    const conditions = getEntitiesForCategory("condition");
    const blinded = conditions.find((c: { name: string }) => c.name === "Blinded");
    ok(blinded);
    const card = toCardData("condition", blinded!);
    strictEqual(card.categoryLabel, "Condition");
    strictEqual(card.metadata, "");
  });

  test("toCardData produces correct action card", () => {
    const actions = getEntitiesForCategory("action");
    const dodge = actions.find((a: { name: string }) => a.name === "Dodge");
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

  test("getSortOptions provides alphabetical and recent for all categories", () => {
    for (const cat of [
      "spell",
      "monster",
      "equipment",
      "condition",
      "action",
      "magicitem",
      "feat",
    ] as const) {
      const options = getSortOptions(cat);
      ok(options.some((o: { value: string }) => o.value === "alphabetical"));
      ok(options.some((o: { value: string }) => o.value === "recent"));
    }
  });

  test("getSortOptions adds level only for spells", () => {
    const options = getSortOptions("spell");
    ok(options.some((o: { value: string }) => o.value === "level"));
    ok(!options.some((o: { value: string }) => o.value === "cr"));
  });

  test("getSortOptions adds cr only for monsters", () => {
    const options = getSortOptions("monster");
    ok(options.some((o: { value: string }) => o.value === "cr"));
    ok(!options.some((o: { value: string }) => o.value === "level"));
  });

  test("sortEntities returns original order when sort is null", () => {
    const spells = getEntitiesForCategory("spell");
    const result = sortEntities("spell", spells, null);
    deepEqual(result, spells);
  });

  test("sortEntities sorts alphabetically", () => {
    const spells = getEntitiesForCategory("spell");
    const result = sortEntities("spell", spells, "alphabetical");
    for (let i = 1; i < result.length; i++) {
      ok(result[i - 1]!.name.localeCompare(result[i]!.name) <= 0);
    }
  });

  test("sortEntities sorts spells by level then name", () => {
    const spells = getEntitiesForCategory("spell");
    const result = sortEntities("spell", spells, "level");
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1]! as import("../../src/types/compendium").Spell;
      const curr = result[i]! as import("../../src/types/compendium").Spell;
      ok(prev.level <= curr.level);
    }
  });

  test("sortEntities sorts monsters by challenge rating", () => {
    const monsters = getEntitiesForCategory("monster");
    const result = sortEntities("monster", monsters, "cr");
    const crValue = (m: import("../../src/types/compendium").Monster): number =>
      m.challengeRating.includes("/")
        ? Number(m.challengeRating.split("/")[0]) / Number(m.challengeRating.split("/")[1])
        : Number(m.challengeRating);
    for (let i = 1; i < result.length; i++) {
      ok(
        crValue(result[i - 1]! as import("../../src/types/compendium").Monster) <=
          crValue(result[i]! as import("../../src/types/compendium").Monster),
      );
    }
  });

  test("dedupeEntities removes duplicate canonicalIds", () => {
    const spells = getEntitiesForCategory("spell");
    const deduped = dedupeEntities(spells);
    const ids = new Set(deduped.map((d) => d.entity.canonicalId));
    strictEqual(deduped.length, ids.size, "each canonicalId appears once");
    ok(deduped.length < spells.length, "spells contain duplicate versions");
  });

  test("dedupeEntities keeps preferred source version", () => {
    const fireball = getEntitiesForCategory("spell").filter(
      (s: { name: string }) => s.name === "Fireball",
    );
    const versionSources = fireball.map((s: { source: string }) => s.source);
    ok(versionSources.includes("XPHB"), "Fireball has XPHB version");
    ok(versionSources.includes("PHB"), "Fireball has PHB version");
    const deduped = dedupeEntities(fireball);
    strictEqual(deduped.length, 1);
    strictEqual(deduped[0]!.entity.source, "XPHB", "prefers 2024 source");
    strictEqual(deduped[0]!.versionCount, 2);
  });

  test("dedupeEntities reports versionCount matching source frequency", () => {
    const spells = getEntitiesForCategory("spell");
    const frequency = new Map<string, number>();
    for (const s of spells) {
      frequency.set(s.canonicalId, (frequency.get(s.canonicalId) ?? 0) + 1);
    }
    const deduped = dedupeEntities(spells);
    for (const entry of deduped) {
      strictEqual(
        entry.versionCount,
        frequency.get(entry.entity.canonicalId),
        `${entry.entity.name} versionCount`,
      );
    }
  });

  test("dedupeEntities picks lowest-priority source per canonicalId", () => {
    const items = getEntitiesForCategory("magicitem");
    const deduped = dedupeEntities(items);
    for (const entry of deduped) {
      const candidates = items.filter((i) => i.canonicalId === entry.entity.canonicalId);
      const bestPriority = Math.min(...candidates.map((c) => sourcePriority(c.source)));
      strictEqual(
        sourcePriority(entry.entity.source),
        bestPriority,
        `${entry.entity.name} should prefer best source`,
      );
    }
  });

  test("dedupeEntities produces unique card hrefs", () => {
    const spells = getEntitiesForCategory("spell");
    const cards = dedupeEntities(spells).map(({ entity, versionCount }) => ({
      ...toCardData("spell", entity),
      versionCount,
    }));
    const hrefs = new Set(cards.map((c) => c.href));
    strictEqual(cards.length, hrefs.size, "every card has a unique href key");
  });

  test("toCardData includes the entity category", () => {
    const spells = getEntitiesForCategory("spell");
    const card = toCardData("spell", spells[0]!);
    strictEqual(card.category, "spell");
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

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

type SpellType = import("../../src/types/compendium").Spell;
type EquipmentType = import("../../src/types/compendium").Equipment;

function fakeSpell(overrides: Partial<SpellType> = {}): SpellType {
  return {
    id: "phb|fake",
    canonicalId: "spell.fake",
    category: "spell",
    name: "Fake Spell",
    source: "PHB",
    level: 1,
    school: "V",
    castingTime: "action",
    range: "Self",
    components: ["V"],
    duration: "Instantaneous",
    description: [],
    classes: [],
    ritual: false,
    concentration: false,
    ...overrides,
  };
}

function fakeEquipment(overrides: Partial<EquipmentType> = {}): EquipmentType {
  return {
    id: "phb|fake",
    canonicalId: "equipment.fake",
    category: "equipment",
    name: "Fake Item",
    source: "PHB",
    type: "Gear",
    description: [],
    ...overrides,
  };
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

  test("equipment type filter uses human-readable labels only", () => {
    const equipment = getEntitiesForCategory("equipment");
    const defs = buildFilterDefs("equipment", equipment);
    const type = defs.find((d: { key: string }) => d.key === "type");
    ok(type, "equipment should have a type filter");
    const codes = type!.options.filter((o: { value: string }) => o.value.includes("|"));
    deepEqual(codes, [], "no internal type codes should be exposed");
    ok(
      type!.options.some((o: { value: string }) => o.value === "Mount"),
      "Mount option exists",
    );
    ok(
      type!.options.some((o: { value: string }) => o.value === "Coin"),
      "Coin option exists",
    );
    ok(
      type!.options.some((o: { value: string }) => o.value === "Melee Weapon"),
      "Melee Weapon exists",
    );
  });

  test("applyFilters filters equipment by type", () => {
    const equipment = getEntitiesForCategory("equipment");
    const result = applyFilters("equipment", equipment, { type: "Coin" });
    ok(result.length > 0, "coin items should exist");
    for (const item of result) {
      ok(
        (item as import("../../src/types/compendium").Equipment).type.split("|")[0] === "$C",
        `${item.name} should be a coin`,
      );
    }
  });

  test("applyFilters groups equivalent equipment type codes", () => {
    const equipment = getEntitiesForCategory("equipment");
    const result = applyFilters("equipment", equipment, { type: "Mount" });
    const names = new Set(
      result.map((e) => (e as import("../../src/types/compendium").Equipment).type),
    );
    for (const raw of names) {
      ok(["MNT", "MNT|XPHB"].includes(raw), `unexpected type ${raw} matched Mount filter`);
    }
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

  test("buildFilterDefs creates concentration and ritual filters for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const concentration = defs.find((d: { key: string }) => d.key === "concentration");
    ok(concentration, "spells should have a concentration filter");
    deepEqual(
      concentration!.options.map((o: { value: string }) => o.value),
      ["", "yes", "no"],
    );
    const ritual = defs.find((d: { key: string }) => d.key === "ritual");
    ok(ritual, "spells should have a ritual filter");
    deepEqual(
      ritual!.options.map((o: { value: string }) => o.value),
      ["", "yes", "no"],
    );
  });

  test("applyFilters filters spells by concentration", () => {
    const spells = getEntitiesForCategory("spell");
    const yes = applyFilters("spell", spells, { concentration: "yes" });
    const no = applyFilters("spell", spells, { concentration: "no" });
    ok(yes.length > 0 && no.length > 0, "both partitions should be non-empty");
    strictEqual(yes.length + no.length, spells.length, "partitions cover every spell");
    for (const spell of yes) ok((spell as SpellType).concentration);
    for (const spell of no) ok(!(spell as SpellType).concentration);
  });

  test("applyFilters treats missing ritual metadata as not ritual", () => {
    const synthetic = [
      fakeSpell({ canonicalId: "spell.a", name: "Ritual", ritual: true }),
      fakeSpell({
        canonicalId: "spell.b",
        name: "Undefined Ritual",
        ritual: undefined as unknown as boolean,
      }),
    ];
    const yes = applyFilters("spell", synthetic, { ritual: "yes" });
    strictEqual(yes.length, 1);
    strictEqual(yes[0]!.name, "Ritual");
    const no = applyFilters("spell", synthetic, { ritual: "no" });
    strictEqual(no.length, 1);
    strictEqual(no[0]!.name, "Undefined Ritual");
  });

  test("applyFilters combines level, school and class with AND", () => {
    const spells = getEntitiesForCategory("spell");
    const combined = applyFilters("spell", spells, {
      level: "1",
      school: "V",
      class: "Wizard",
    });
    ok(combined.length > 0, "level 1 wizard evocation spells should exist");
    for (const spell of combined) {
      const s = spell as SpellType;
      strictEqual(s.level, 1);
      strictEqual(s.school, "V");
      ok(s.classes.includes("Wizard"));
    }
    const byLevel = applyFilters("spell", spells, { level: "1" });
    ok(byLevel.length > combined.length, "combined filters narrow more than one alone");
  });

  test("clearing one filter widens results while others stay active", () => {
    const spells = getEntitiesForCategory("spell");
    const all = applyFilters("spell", spells, { level: "1", school: "V", class: "Wizard" });
    const clearedSchool = applyFilters("spell", spells, { level: "1", class: "Wizard" });
    const clearedAll = applyFilters("spell", spells, {});
    ok(clearedSchool.length >= all.length);
    strictEqual(clearedAll.length, spells.length);
    for (const spell of clearedSchool) {
      const s = spell as SpellType;
      strictEqual(s.level, 1);
      ok(s.classes.includes("Wizard"));
    }
  });

  test("search narrows filtered results without resetting them", () => {
    const spells = getEntitiesForCategory("spell");
    const filtered = applyFilters("spell", spells, { level: "3", class: "Wizard" });
    const q = "fire";
    const searched = filtered.filter((entity) => entity.name.toLowerCase().includes(q));
    ok(searched.length > 0, "fire + level 3 wizard should match e.g. Fireball");
    ok(searched.length <= filtered.length, "search only narrows");
    for (const spell of searched) {
      ok(spell.name.toLowerCase().includes(q));
      const s = spell as SpellType;
      strictEqual(s.level, 3);
      ok(s.classes.includes("Wizard"));
    }
  });

  test("applyFilters returns empty for valid but unmatchable combination", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { level: "0", ritual: "yes" });
    strictEqual(result.length, 0, "no ritual cantrips exist in official content");
  });

  test("buildFilterDefs creates class filter for spells", () => {
    const spells = getEntitiesForCategory("spell");
    const defs = buildFilterDefs("spell", spells);
    const klass = defs.find((d: { key: string }) => d.key === "class");
    ok(klass, "spells should have a class filter");
    strictEqual(klass!.label, "Class");
    strictEqual(klass!.options[0]!.value, "", "first option is All");
    ok(klass!.options.some((o: { value: string }) => o.value === "Wizard"));
    ok(klass!.options.some((o: { value: string }) => o.value === "Bard"));
    const values = klass!.options.map((o: { value: string }) => o.value);
    deepEqual([...values].sort(), [...values], "class options are alphabetically sorted");
  });

  test("applyFilters filters spells by class", () => {
    const spells = getEntitiesForCategory("spell");
    const result = applyFilters("spell", spells, { class: "Druid" });
    ok(result.length > 0, "druid spells should exist");
    for (const spell of result) {
      ok((spell as SpellType).classes.includes("Druid"), `${spell.name} should list Druid`);
    }
  });

  test("applyFilters excludes spells without classes from class filter", () => {
    const synthetic = [
      fakeSpell({ canonicalId: "spell.a", name: "Has Class", classes: ["Wizard"] }),
      fakeSpell({ canonicalId: "spell.b", name: "No Class", classes: [] }),
    ];
    const result = applyFilters("spell", synthetic, { class: "Wizard" });
    strictEqual(result.length, 1);
    strictEqual(result[0]!.name, "Has Class");
  });

  test("buildFilterDefs creates damage type filter for equipment", () => {
    const equipment = getEntitiesForCategory("equipment");
    const defs = buildFilterDefs("equipment", equipment);
    const damageType = defs.find((d: { key: string }) => d.key === "damageType");
    ok(damageType, "equipment should have a damage type filter");
    strictEqual(damageType!.label, "Damage type");
    const labels = damageType!.options.map((o: { label: string }) => o.label);
    ok(labels.includes("Bludgeoning"), "human-readable labels only");
    ok(labels.includes("Piercing"));
    ok(labels.includes("Slashing"));
    for (const option of damageType!.options) {
      ok(!/^[BPSRNY]$/.test(option.label), `raw code must not leak: ${option.label}`);
    }
  });

  test("applyFilters filters weapons by damage type", () => {
    const equipment = getEntitiesForCategory("equipment");
    const result = applyFilters("equipment", equipment, { damageType: "P" });
    ok(result.length > 0, "piercing weapons should exist");
    for (const item of result) {
      strictEqual((item as EquipmentType).damageType, "P");
    }
  });

  test("applyFilters excludes items without damage metadata from damage type filter", () => {
    const synthetic = [
      fakeEquipment({
        canonicalId: "equipment.a",
        name: "Spear",
        type: "Melee Weapon",
        damage: "1d6",
        damageType: "P",
      }),
      fakeEquipment({ canonicalId: "equipment.b", name: "Rope", type: "Gear" }),
    ];
    const result = applyFilters("equipment", synthetic, { damageType: "P" });
    strictEqual(result.length, 1);
    strictEqual(result[0]!.name, "Spear");
  });

  test("buildFilterDefs creates property filter for equipment", () => {
    const equipment = getEntitiesForCategory("equipment");
    const defs = buildFilterDefs("equipment", equipment);
    const property = defs.find((d: { key: string }) => d.key === "property");
    ok(property, "equipment should have a property filter");
    ok(property!.options.some((o: { value: string }) => o.value === "Two-Handed"));
    ok(property!.options.some((o: { value: string }) => o.value === "Finesse"));
  });

  test("applyFilters filters weapons by property", () => {
    const equipment = getEntitiesForCategory("equipment");
    const result = applyFilters("equipment", equipment, { property: "Reach" });
    ok(result.length > 0, "reach weapons should exist");
    for (const item of result) {
      ok((item as EquipmentType).properties?.includes("Reach"), `${item.name} should have Reach`);
    }
  });

  test("magic item rarity options follow progression order with unknown last", () => {
    const items = getEntitiesForCategory("magicitem");
    const defs = buildFilterDefs("magicitem", items);
    const rarity = defs.find((d: { key: string }) => d.key === "rarity");
    ok(rarity, "magic items should have a rarity filter");
    const values = rarity!.options.map((o: { value: string }) => o.value).filter((v) => v !== "");
    const indexOf = (value: string): number => {
      const i = values.indexOf(value);
      ok(i !== -1, `rarity ${value} should be an option`);
      return i;
    };
    ok(indexOf("common") < indexOf("uncommon"), "common before uncommon");
    ok(indexOf("uncommon") < indexOf("rare"), "uncommon before rare");
    ok(indexOf("rare") < indexOf("very rare"), "rare before very rare");
    ok(indexOf("very rare") < indexOf("legendary"), "very rare before legendary");
    ok(indexOf("legendary") < indexOf("artifact"), "legendary before artifact");
    if (values.includes("unknown (magic)")) {
      ok(indexOf("artifact") < indexOf("unknown (magic)"), "unknown sorts last");
    }
  });

  test("getSortOptions adds rarity only for magic items", () => {
    const options = getSortOptions("magicitem");
    ok(options.some((o: { value: string }) => o.value === "rarity"));
    ok(!options.some((o: { value: string }) => o.value === "level"));
    ok(!getSortOptions("spell").some((o: { value: string }) => o.value === "rarity"));
    ok(!getSortOptions("monster").some((o: { value: string }) => o.value === "rarity"));
  });

  test("sortEntities sorts magic items by rarity then name", () => {
    const items = getEntitiesForCategory("magicitem");
    const result = sortEntities("magicitem", items, "rarity");
    type MagicItemType = import("../../src/types/compendium").MagicItem;
    const RANK: Record<string, number> = {
      common: 0,
      uncommon: 1,
      rare: 2,
      "very rare": 3,
      legendary: 4,
      artifact: 5,
    };
    let prevRank = -1;
    for (const item of result) {
      const r = RANK[(item as MagicItemType).rarity] ?? 99;
      ok(r >= prevRank, "rarity rank never decreases");
      prevRank = r;
    }
  });

  test("sortEntities places unknown rarity last with name tiebreak", () => {
    const items = [
      { ...fakeEquipment({ name: "Legendary Thing" }), rarity: "legendary" },
      { ...fakeEquipment({ name: "Common Thing" }), rarity: "common" },
      { ...fakeEquipment({ name: "Mystery" }), rarity: "unknown (magic)" },
      { ...fakeEquipment({ name: "Artifact Thing" }), rarity: "artifact" },
    ] as unknown as import("../../src/compendium/category-registry").AnyEntity[];
    const result = sortEntities("magicitem", items, "rarity");
    deepEqual(
      result.map((e) => e.name),
      ["Common Thing", "Legendary Thing", "Artifact Thing", "Mystery"],
    );
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

  test("buildFilterDefs sorts CR options numerically with fractions first", () => {
    const monsters = getEntitiesForCategory("monster");
    const defs = buildFilterDefs("monster", monsters);
    const cr = defs.find((d: { key: string }) => d.key === "cr");
    ok(cr, "monsters should have a CR filter");
    const values = cr!.options.map((o: { value: string }) => o.value).filter((v) => v !== "");
    const indexOf = (value: string): number => {
      const i = values.indexOf(value);
      ok(i !== -1, `CR ${value} should be an option`);
      return i;
    };
    ok(indexOf("0") < indexOf("1/8"), "0 before 1/8");
    ok(indexOf("1/8") < indexOf("1/4"), "1/8 before 1/4");
    ok(indexOf("1/4") < indexOf("1/2"), "1/4 before 1/2");
    ok(indexOf("1/2") < indexOf("1"), "1/2 before 1");
    ok(indexOf("1") < indexOf("2"), "1 before 2");
    ok(indexOf("2") < indexOf("10"), "2 before 10 (not string-sorted)");
    ok(indexOf("9") < indexOf("10"), "9 before 10");
    ok(indexOf("19") < indexOf("20"), "19 before 20");
    ok(indexOf("24") < indexOf("30"), "24 before 30");
  });

  test("toCardData exposes spell level stat", () => {
    const spells = getEntitiesForCategory("spell");
    const fireball = spells.find(
      (s: { name: string; source: string }) => s.name === "Fireball" && s.source === "XPHB",
    );
    ok(fireball, "Fireball XPHB should exist");
    const card = toCardData("spell", fireball!);
    deepEqual(card.stat, { label: "Level", value: "3", numeric: true });
  });

  test("toCardData exposes cantrip stat", () => {
    const spells = getEntitiesForCategory("spell");
    const cantrip = spells.find(
      (s) => s.name === "Fire Bolt" && s.source === "XPHB" && "level" in s && s.level === 0,
    );
    ok(cantrip, "Fire Bolt XPHB should exist");
    const card = toCardData("spell", cantrip!);
    deepEqual(card.stat, { label: "Level", value: "Cantrip", numeric: false });
  });

  test("toCardData exposes monster CR stat", () => {
    const monsters = getEntitiesForCategory("monster");
    const ancient = monsters.find(
      (m: { name: string; source: string }) =>
        m.name.startsWith("Ancient Red Dragon") && m.source === "XMM",
    );
    ok(ancient, "Ancient Red Dragon XMM should exist");
    const card = toCardData("monster", ancient!);
    deepEqual(card.stat, { label: "CR", value: "24", numeric: true });
  });

  test("toCardData exposes weapon damage stat", () => {
    const equipment = getEntitiesForCategory("equipment");
    const weapon = equipment.find(
      (e) => "damage" in e && typeof e.damage === "string" && e.damage.length > 0,
    );
    ok(weapon, "at least one weapon with damage should exist");
    const card = toCardData("equipment", weapon!);
    ok(card.stat, "weapon card should have a stat");
    strictEqual(card.stat!.label, "Damage");
    ok(card.stat!.value.length > 0);
  });

  test("toCardData omits stat when category has no key stat", () => {
    const conditions = getEntitiesForCategory("condition");
    const blinded = conditions.find((c: { name: string }) => c.name === "Blinded");
    ok(blinded);
    const card = toCardData("condition", blinded!);
    strictEqual(card.stat, undefined);
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

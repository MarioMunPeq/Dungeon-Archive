import { strictEqual, ok, deepStrictEqual } from "node:assert";
import { generateRelatedIndex } from "../../scripts/compendium/generate-related-index";
import type {
  CompendiumEntry,
  Spell,
  Monster,
  Equipment,
  Condition,
  Action,
} from "../../src/types/compendium";
import type { ContentBlock } from "../../src/types/content-block";
import {
  setRelatedIndex,
  getRelatedEntityIds,
  getReferencingEntityIds,
  getEntityTags,
} from "../../src/compendium/relationships";
import { state } from "../../src/compendium/loader";
import { buildRegistry, clearRegistry } from "../../src/compendium/registry/entity-registry";

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

// ── Helpers ──────────────────────────────────────────────

function makeSpell(
  canonicalId: string,
  name: string,
  level: number,
  school: string,
  classes: string[],
  source: string,
  extra?: Partial<Spell>,
): CompendiumEntry {
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category: "spell",
    source,
    level,
    school,
    castingTime: "1 action",
    range: "60 ft",
    components: ["V", "S"],
    duration: "Instantaneous",
    description: [],
    classes,
    ritual: false,
    concentration: false,
    ...extra,
  } as Spell;
}

function makeMonster(
  canonicalId: string,
  name: string,
  monsterType: string,
  tags: string[],
  challengeRating: string,
  size: string,
  source: string,
): CompendiumEntry {
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category: "monster",
    source,
    size,
    monsterType,
    tags,
    alignment: [],
    challengeRating,
    armorClass: "15",
    hitPoints: "100",
    speed: "30 ft",
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    traits: [],
    actions: [],
    reactions: [],
    legendaryActions: [],
    description: [],
  } as Monster;
}

function makeEquipment(
  canonicalId: string,
  name: string,
  type: string,
  source: string,
  damageType?: string,
): CompendiumEntry {
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category: "equipment",
    source,
    type,
    description: [],
    damageType,
  } as Equipment;
}

function makeCondition(canonicalId: string, name: string, source: string): CompendiumEntry {
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category: "condition",
    source,
    description: [],
  } as Condition;
}

function makeAction(
  canonicalId: string,
  name: string,
  actionType: string,
  source: string,
): CompendiumEntry {
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category: "action",
    source,
    actionType,
    description: [],
  } as Action;
}

function makeEntityWithRef(
  canonicalId: string,
  name: string,
  category: string,
  source: string,
  refTargets: string[],
): CompendiumEntry {
  const description: ContentBlock[] = refTargets.map((target) => ({
    type: "reference",
    target,
  }));
  return {
    id: `${source.toLowerCase()}|${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalId,
    name,
    category,
    source,
    description,
  } as CompendiumEntry;
}

function clearState(): void {
  state.spells.clear();
  state.conditions.clear();
  state.equipment.clear();
  state.actions.clear();
  state.monsters.clear();
}

function resetAll(): void {
  clearState();
  clearRegistry();
}

// ── Tests ────────────────────────────────────────────────

console.log("generate-related-index\n");

test("spell tags include school, level, ritual, concentration, classes", () => {
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB", {
      ritual: false,
      concentration: false,
    }),
  ];
  const index = generateRelatedIndex(entities);
  const entry = index["spell.fireball"]!;
  ok(entry.tags.includes("Evocation"), "school tag");
  ok(entry.tags.includes("Level 3"), "level tag");
});

test("spell tags include ritual and concentration when set", () => {
  const entities = [
    makeSpell(
      "spell.detect-magic",
      "Detect Magic",
      1,
      "D",
      ["Bard", "Sorcerer", "Wizard"],
      "XPHB",
      {
        ritual: true,
        concentration: true,
      },
    ),
  ];
  const index = generateRelatedIndex(entities);
  const entry = index["spell.detect-magic"]!;
  ok(entry.tags.includes("Ritual"), "ritual tag");
  ok(entry.tags.includes("Concentration"), "concentration tag");
});

test("monster tags include type, tags, tier, size", () => {
  const entities = [
    makeMonster(
      "monster.ancient-red-dragon",
      "Ancient Red Dragon",
      "dragon",
      ["Fire", "Legendary"],
      "24",
      "Gargantuan",
      "XMM",
    ),
  ];
  const index = generateRelatedIndex(entities);
  const entry = index["monster.ancient-red-dragon"]!;
  ok(entry.tags.includes("dragon"), "type tag");
  ok(entry.tags.includes("Fire"), "monster tag");
  ok(entry.tags.includes("Legendary"), "monster tag");
  ok(entry.tags.includes("Epic"), "CR tier");
  ok(entry.tags.includes("Gargantuan"), "size tag");
});

test("equipment tags include type and damage type", () => {
  const entities = [makeEquipment("equipment.longsword", "Longsword", "M", "XPHB", "Slashing")];
  const index = generateRelatedIndex(entities);
  const entry = index["equipment.longsword"]!;
  ok(entry.tags.includes("M"), "type tag");
  ok(entry.tags.includes("Slashing"), "damage type tag");
});

test("condition tags include name", () => {
  const entities = [makeCondition("condition.blinded", "Blinded", "XPHB")];
  const index = generateRelatedIndex(entities);
  const entry = index["condition.blinded"]!;
  ok(entry.tags.includes("Blinded"), "name tag");
});

test("action tags include action type", () => {
  const entities = [makeAction("action.attack", "Attack", "Standard", "XPHB")];
  const index = generateRelatedIndex(entities);
  const entry = index["action.attack"]!;
  ok(entry.tags.includes("Standard"), "action type tag");
});

test("actions have no related entities", () => {
  const entities = [
    makeAction("action.attack", "Attack", "Standard", "XPHB"),
    makeAction("action.dash", "Dash", "Standard", "XPHB"),
  ];
  const index = generateRelatedIndex(entities);
  strictEqual(index["action.attack"]!.related.length, 0);
  strictEqual(index["action.dash"]!.related.length, 0);
});

test("spells with same school are related", () => {
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
    makeSpell("spell.fire-storm", "Fire Storm", 7, "V", ["Cleric", "Sorcerer"], "XPHB"),
    makeSpell("spell.shield", "Shield", 1, "A", ["Bard"], "PHB"),
  ];
  const index = generateRelatedIndex(entities);
  const fireball = index["spell.fireball"]!;
  const fireStorm = index["spell.fire-storm"]!;
  ok(fireball.related.includes("spell.fire-storm"), "same school spells are related");
  ok(!fireball.related.includes("spell.shield"), "different school not related");
  ok(fireStorm.related.includes("spell.fireball"), "relation is symmetric");
});

test("spells with shared classes are related", () => {
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
    makeSpell("spell.lightning-bolt", "Lightning Bolt", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
  ];
  const index = generateRelatedIndex(entities);
  ok(index["spell.fireball"]!.related.includes("spell.lightning-bolt"));
});

test("monsters with same type are related", () => {
  const entities = [
    makeMonster("monster.red-dragon", "Red Dragon", "dragon", [], "10", "Huge", "XMM"),
    makeMonster("monster.green-dragon", "Green Dragon", "dragon", [], "8", "Large", "XMM"),
    makeMonster("monster.goblin", "Goblin", "humanoid", [], "1/4", "Small", "PHB"),
  ];
  const index = generateRelatedIndex(entities);
  ok(index["monster.red-dragon"]!.related.includes("monster.green-dragon"));
  ok(!index["monster.red-dragon"]!.related.includes("monster.goblin"));
});

test("monsters with same family name prefix are related", () => {
  const entities = [
    makeMonster(
      "monster.ancient-red-dragon",
      "Ancient Red Dragon",
      "dragon",
      [],
      "24",
      "Gargantuan",
      "XMM",
    ),
    makeMonster(
      "monster.ancient-gold-dragon",
      "Ancient Gold Dragon",
      "dragon",
      [],
      "24",
      "Gargantuan",
      "XMM",
    ),
  ];
  const index = generateRelatedIndex(entities);
  ok(index["monster.ancient-red-dragon"]!.related.includes("monster.ancient-gold-dragon"));
});

test("equipment of same type are related", () => {
  const entities = [
    makeEquipment("equipment.longsword", "Longsword", "M", "XPHB", "Slashing"),
    makeEquipment("equipment.shortsword", "Shortsword", "M", "XPHB", "Piercing"),
    makeEquipment("equipment.chain-mail", "Chain Mail", "HA", "PHB"),
  ];
  const index = generateRelatedIndex(entities);
  ok(index["equipment.longsword"]!.related.includes("equipment.shortsword"));
  ok(!index["equipment.longsword"]!.related.includes("equipment.chain-mail"));
});

test("conditions with same source are related", () => {
  const entities = [
    makeCondition("condition.blinded", "Blinded", "XPHB"),
    makeCondition("condition.charmed", "Charmed", "XPHB"),
    makeCondition("condition.deafened", "Deafened", "PHB"),
  ];
  const index = generateRelatedIndex(entities);
  ok(
    index["condition.blinded"]!.related.includes("condition.charmed"),
    "same source conditions related",
  );
  ok(
    !index["condition.blinded"]!.related.includes("condition.deafened"),
    "different source not related",
  );
});

test("max 8 related entities returned", () => {
  const entities: CompendiumEntry[] = [];
  for (let i = 0; i < 20; i++) {
    entities.push(makeSpell(`spell.spell-${i}`, `Spell ${i}`, 3, "V", ["Sorcerer"], "XPHB"));
  }
  const index = generateRelatedIndex(entities);
  const first = index["spell.spell-0"]!;
  ok(first.related.length <= 8, `got ${first.related.length}, expected ≤ 8`);
});

test("no self-references in related", () => {
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer"], "XPHB"),
    makeSpell("spell.lightning-bolt", "Lightning Bolt", 3, "V", ["Wizard"], "XPHB"),
  ];
  const index = generateRelatedIndex(entities);
  ok(!index["spell.fireball"]!.related.includes("spell.fireball"));
});

test("all related canonicalIds exist in index", () => {
  const entities = [
    makeSpell("spell.a", "Spell A", 1, "V", ["Sorcerer"], "XPHB"),
    makeSpell("spell.b", "Spell B", 2, "V", ["Wizard"], "XPHB"),
    makeSpell("spell.c", "Spell C", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
  ];
  const index = generateRelatedIndex(entities);
  for (const entry of Object.values(index)) {
    for (const relId of entry.related) {
      ok(relId in index, `related id ${relId} exists in index`);
    }
  }
});

test("reverse references from description blocks", () => {
  const entities: CompendiumEntry[] = [
    {
      ...makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
      description: [{ type: "reference" as const, target: "condition.on-fire" }],
    } as unknown as Spell,
    makeEntityWithRef("condition.on-fire", "On Fire", "condition", "XPHB", []),
  ];
  const index = generateRelatedIndex(entities);
  deepStrictEqual(index["condition.on-fire"]!.references, ["spell.fireball"]);
});

test("reverse references from nested blocks", () => {
  const entities: CompendiumEntry[] = [
    {
      ...makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer"], "XPHB"),
      description: [
        {
          type: "entries" as const,
          blocks: [
            {
              type: "entries" as const,
              blocks: [{ type: "reference" as const, target: "condition.burning" }],
            },
          ],
        },
      ],
    } as unknown as Spell,
    makeEntityWithRef("condition.burning", "Burning", "condition", "XPHB", []),
  ];
  const index = generateRelatedIndex(entities);
  deepStrictEqual(index["condition.burning"]!.references, ["spell.fireball"]);
});

test("graph integrity: deterministic output", () => {
  const entitiesA = [
    makeSpell("spell.a", "A", 1, "V", ["Sorcerer"], "XPHB"),
    makeSpell("spell.b", "B", 2, "V", ["Wizard"], "XPHB"),
    makeSpell("spell.c", "C", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
  ];
  const entitiesB = [
    makeSpell("spell.c", "C", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
    makeSpell("spell.b", "B", 2, "V", ["Wizard"], "XPHB"),
    makeSpell("spell.a", "A", 1, "V", ["Sorcerer"], "XPHB"),
  ];
  const indexA = generateRelatedIndex(entitiesA);
  const indexB = generateRelatedIndex(entitiesB);
  deepStrictEqual(indexA, indexB);
});

test("empty entities list produces empty index", () => {
  const index = generateRelatedIndex([]);
  strictEqual(Object.keys(index).length, 0);
});

test("single entity has no related", () => {
  const entities = [makeSpell("spell.only", "Only", 1, "A", ["Wizard"], "XPHB")];
  const index = generateRelatedIndex(entities);
  strictEqual(index["spell.only"]!.related.length, 0);
});

test("runtime API: getRelatedEntityIds works after setRelatedIndex", () => {
  resetAll();
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB"),
    makeSpell("spell.fire-storm", "Fire Storm", 7, "V", ["Cleric", "Sorcerer"], "XPHB"),
  ];
  // Set up state so resolveEntity can find these
  for (const e of entities) {
    state.spells.set(e.id, e as Spell);
  }
  buildRegistry(entities);

  const index = generateRelatedIndex(entities);
  setRelatedIndex(index);

  const ids = getRelatedEntityIds("spell.fireball");
  ok(ids.includes("spell.fire-storm"), "fireball relates to fire storm");
  resetAll();
});

test("runtime API: getEntityTags returns tags", () => {
  const entities = [
    makeSpell("spell.fireball", "Fireball", 3, "V", ["Sorcerer", "Wizard"], "XPHB", {
      concentration: true,
    }),
  ];
  const index = generateRelatedIndex(entities);
  setRelatedIndex(index);
  const tags = getEntityTags("spell.fireball");
  ok(tags.includes("Evocation"), "school in tags");
  ok(tags.includes("Level 3"), "level in tags");
  ok(tags.includes("Sorcerer"), "class in tags");
  ok(tags.includes("Concentration"), "concentration in tags");
});

test("runtime API: getReferencingEntityIds empty when no refs", () => {
  const entities = [makeCondition("condition.blinded", "Blinded", "XPHB")];
  const index = generateRelatedIndex(entities);
  setRelatedIndex(index);
  const refs = getReferencingEntityIds("condition.blinded");
  strictEqual(refs.length, 0);
});

test("runtime API: getRelatedEntityIds returns empty for unknown canonicalId", () => {
  const index = generateRelatedIndex([]);
  setRelatedIndex(index);
  strictEqual(getRelatedEntityIds("spell.nonexistent").length, 0);
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);

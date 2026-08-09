import { strictEqual, ok } from "node:assert";
import type { Equipment, MagicItem, Spell } from "../../src/types/compendium";
import type { CharacterReference } from "../../src/user-state/types";
import {
  buildCharacterSheetModel,
  exportClassLine,
  exportFileName,
  magicItemRow,
  spellRow,
  weaponRow,
} from "../../src/features/character/export/character-sheet-model";

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

function character(overrides: Partial<CharacterReference> = {}): CharacterReference {
  return {
    id: "char-1",
    name: "Test Hero",
    class: "Fighter",
    level: 3,
    subclass: "Champion",
    abilityScores: {
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 8,
      wisdom: 10,
      charisma: 12,
    },
    hitPoints: { current: 22, max: 26 },
    combatValues: { armorClass: 17, initiativeModifier: 2, passivePerception: 10, spellSaveDc: 13 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
    ...overrides,
  };
}

console.log("character-sheet-model\n");

test("exportClassLine includes subclass", () => {
  strictEqual(exportClassLine(character()), "Fighter (Champion) · Lv 3");
});

test("exportClassLine omits subclass when absent", () => {
  strictEqual(exportClassLine(character({ subclass: undefined })), "Fighter · Lv 3");
});

test("exportClassLine falls back to level only", () => {
  strictEqual(exportClassLine(character({ class: "", subclass: undefined })), "Lv 3");
});

test("spellRow formats a cantrip", () => {
  strictEqual(
    spellRow({ name: "Fire Bolt", level: 0, school: "V" }).meta,
    "Cantrip · Evocation",
  );
});

test("spellRow formats a leveled spell", () => {
  strictEqual(
    spellRow({ name: "Fireball", level: 3, school: "V" }).meta,
    "Level 3 · Evocation",
  );
});

test("spellRow falls back to the raw school", () => {
  strictEqual(spellRow({ name: "X", level: 1, school: "??" }).meta, "Level 1 · ??");
});

test("weaponRow shows damage when present", () => {
  strictEqual(
    weaponRow({ name: "Longsword", damage: "1d8", damageType: "S", type: "Melee Weapon" }).meta,
    "1d8 Slashing",
  );
});

test("weaponRow falls back to equipment type", () => {
  strictEqual(
    weaponRow({ name: "Shield", damage: undefined, damageType: undefined, type: "Shields" }).meta,
    "Shields",
  );
});

test("magicItemRow uses rarity as meta", () => {
  strictEqual(magicItemRow({ name: "Bag of Holding", rarity: "Uncommon" }).meta, "Uncommon");
});

test("exportFileName slugs the character name", () => {
  strictEqual(exportFileName("Test Hero"), "test-hero-character-sheet.png");
});

test("exportFileName falls back when name is empty", () => {
  strictEqual(exportFileName("   "), "character-character-sheet.png");
});

test("buildCharacterSheetModel derives ability modifiers", () => {
  const model = buildCharacterSheetModel(character(), [], [], []);
  const strength = model.abilities.find((a) => a.label === "STR");
  ok(strength);
  strictEqual(strength.modifier, 3);
  strictEqual(strength.score, 16);
});

test("buildCharacterSheetModel maps combat values", () => {
  const model = buildCharacterSheetModel(character(), [], [], []);
  strictEqual(model.name, "Test Hero");
  strictEqual(model.classLine, "Fighter (Champion) · Lv 3");
  strictEqual(model.hitPoints.current, 22);
  strictEqual(model.hitPoints.max, 26);
  strictEqual(model.armorClass, 17);
  strictEqual(model.passivePerception, 10);
  strictEqual(model.spellSaveDc, 13);
});

test("buildCharacterSheetModel maps references", () => {
  const model = buildCharacterSheetModel(
    character(),
    [{ name: "Fireball", level: 3, school: "V" }] as Spell[],
    [{ name: "Longsword", damage: "1d8", damageType: "S", type: "Melee Weapon" }] as Equipment[],
    [{ name: "Bag of Holding", rarity: "Uncommon" }] as MagicItem[],
  );
  strictEqual(model.spells[0]?.name, "Fireball");
  strictEqual(model.weapons[0]?.meta, "1d8 Slashing");
  strictEqual(model.magicItems[0]?.meta, "Uncommon");
});

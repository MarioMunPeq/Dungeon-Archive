import { SCHOOL_NAMES, formatEquipmentType } from "@/compendium/category-registry";
import { formatDamage } from "@/compendium/damage";
import type { Equipment, MagicItem, Spell } from "@/types/compendium";
import { abilityModifier } from "@/user-state/types";
import type { CharacterReference } from "@/user-state/types";

const SEPARATOR = "·";

export interface ExportAbilityRow {
  readonly label: string;
  readonly modifier: number;
  readonly score: number;
}

export interface ExportReferenceRow {
  readonly name: string;
  readonly meta: string;
}

export interface CharacterSheetModel {
  readonly name: string;
  readonly classLine: string;
  readonly hitPoints: { readonly current: number; readonly max: number };
  readonly armorClass: number;
  readonly passivePerception: number;
  readonly spellSaveDc: number;
  readonly abilities: readonly ExportAbilityRow[];
  readonly spells: readonly ExportReferenceRow[];
  readonly weapons: readonly ExportReferenceRow[];
  readonly magicItems: readonly ExportReferenceRow[];
}

const ABILITY_KEYS = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
] as const;

export function exportClassLine(
  character: Pick<CharacterReference, "class" | "subclass" | "level">,
): string {
  const cls = character.subclass ? `${character.class} (${character.subclass})` : character.class;
  return cls ? `${cls} ${SEPARATOR} Lv ${character.level}` : `Lv ${character.level}`;
}

export function spellRow(spell: Pick<Spell, "name" | "level" | "school">): ExportReferenceRow {
  const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
  const school = SCHOOL_NAMES[spell.school] ?? spell.school;
  return { name: spell.name, meta: `${levelText} ${SEPARATOR} ${school}` };
}

export function weaponRow(
  weapon: Pick<Equipment, "name" | "damage" | "damageType" | "type">,
): ExportReferenceRow {
  const damage = formatDamage(weapon.damage, weapon.damageType);
  return { name: weapon.name, meta: damage || formatEquipmentType(weapon.type) };
}

export function magicItemRow(item: Pick<MagicItem, "name" | "rarity">): ExportReferenceRow {
  return { name: item.name, meta: item.rarity };
}

export function exportFileName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "character"}-character-sheet.png`;
}

export function buildCharacterSheetModel(
  character: CharacterReference,
  spells: readonly Spell[],
  weapons: readonly Equipment[],
  magicItems: readonly MagicItem[],
): CharacterSheetModel {
  return {
    name: character.name,
    classLine: exportClassLine(character),
    hitPoints: character.hitPoints,
    armorClass: character.combatValues.armorClass,
    passivePerception: character.combatValues.passivePerception,
    spellSaveDc: character.combatValues.spellSaveDc ?? 10,
    abilities: ABILITY_KEYS.map(({ key, label }) => ({
      label,
      modifier: abilityModifier(character.abilityScores[key]),
      score: character.abilityScores[key],
    })),
    spells: spells.map(spellRow),
    weapons: weapons.map(weaponRow),
    magicItems: magicItems.map(magicItemRow),
  };
}

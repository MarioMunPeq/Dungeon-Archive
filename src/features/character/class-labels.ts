import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";

/**
 * Class and subclass names are stored in English on the character reference
 * because they have to match the `classes` field of the SRD spell data (that
 * is what the spell picker filters on). They are *displayed* through the
 * localized names below, so a Spanish sheet reads "Mago" while the underlying
 * value stays "Wizard".
 *
 * Names with no settled Spanish rendering fall through to the English original
 * rather than showing an empty or invented label.
 */
const CLASS_LABEL_KEYS: Record<string, TranslationKey> = {
  Barbarian: "class.Barbarian",
  Bard: "class.Bard",
  Cleric: "class.Cleric",
  Druid: "class.Druid",
  Fighter: "class.Fighter",
  Monk: "class.Monk",
  Paladin: "class.Paladin",
  Ranger: "class.Ranger",
  Rogue: "class.Rogue",
  Sorcerer: "class.Sorcerer",
  Warlock: "class.Warlock",
  Wizard: "class.Wizard",
  Artificer: "class.Artificer",
};

const SUBCLASS_LABEL_KEYS: Record<string, TranslationKey> = {
  Berserker: "subclass.Berserker",
  "Wild Heart": "subclass.Wild Heart",
  "World Tree": "subclass.World Tree",
  Zealot: "subclass.Zealot",

  "College of Dance": "subclass.College of Dance",
  "College of Glamour": "subclass.College of Glamour",
  "College of Lore": "subclass.College of Lore",
  "College of Valor": "subclass.College of Valor",
  "College of Whispers": "subclass.College of Whispers",
  "College of Swords": "subclass.College of Swords",

  "Life Domain": "subclass.Life Domain",
  "Light Domain": "subclass.Light Domain",
  "Trickery Domain": "subclass.Trickery Domain",
  "War Domain": "subclass.War Domain",
  "Knowledge Domain": "subclass.Knowledge Domain",
  "Nature Domain": "subclass.Nature Domain",
  "Tempest Domain": "subclass.Tempest Domain",
  "Twilight Domain": "subclass.Twilight Domain",
  "Forge Domain": "subclass.Forge Domain",

  "Circle of the Land": "subclass.Circle of the Land",
  "Circle of the Moon": "subclass.Circle of the Moon",
  "Circle of the Sea": "subclass.Circle of the Sea",
  "Circle of the Stars": "subclass.Circle of the Stars",
  "Circle of Wildfire": "subclass.Circle of Wildfire",

  "Battle Master": "subclass.Battle Master",
  Champion: "subclass.Champion",
  "Eldritch Knight": "subclass.Eldritch Knight",
  "Psi Warrior": "subclass.Psi Warrior",
  "Arcane Archer": "subclass.Arcane Archer",
  Samurai: "subclass.Samurai",

  "Way of the Open Hand": "subclass.Way of the Open Hand",
  "Way of Shadow": "subclass.Way of Shadow",
  "Way of the Four Elements": "subclass.Way of the Four Elements",
  "Way of Mercy": "subclass.Way of Mercy",
  "Way of the Astral Self": "subclass.Way of the Astral Self",
  "Way of the Kensei": "subclass.Way of the Kensei",

  "Oath of Devotion": "subclass.Oath of Devotion",
  "Oath of the Ancients": "subclass.Oath of the Ancients",
  "Oath of Vengeance": "subclass.Oath of Vengeance",
  "Oath of Conquest": "subclass.Oath of Conquest",
  "Oath of Redemption": "subclass.Oath of Redemption",
  "Oath of Glory": "subclass.Oath of Glory",
  "Oath of the Watchers": "subclass.Oath of the Watchers",

  Hunter: "subclass.Hunter",
  "Beast Master": "subclass.Beast Master",
  "Fey Wanderer": "subclass.Fey Wanderer",
  "Gloom Stalker": "subclass.Gloom Stalker",
  "Horizon Walker": "subclass.Horizon Walker",
  Swarmkeeper: "subclass.Swarmkeeper",
  Drakewarden: "subclass.Drakewarden",

  Thief: "subclass.Thief",
  Assassin: "subclass.Assassin",
  "Arcane Trickster": "subclass.Arcane Trickster",
  Soulknife: "subclass.Soulknife",
  Phantom: "subclass.Phantom",
  Inquisitive: "subclass.Inquisitive",
  Swashbuckler: "subclass.Swashbuckler",

  "Draconic Bloodline": "subclass.Draconic Bloodline",
  "Wild Magic": "subclass.Wild Magic",
  "Aberrant Mind": "subclass.Aberrant Mind",
  "Clockwork Soul": "subclass.Clockwork Soul",
  "Divine Soul": "subclass.Divine Soul",
  "Shadow Magic": "subclass.Shadow Magic",

  "The Archfey": "subclass.The Archfey",
  "The Fiend": "subclass.The Fiend",
  "The Great Old One": "subclass.The Great Old One",
  "The Celestial": "subclass.The Celestial",
  "The Hexblade": "subclass.The Hexblade",
  "The Genie": "subclass.The Genie",
  "The Undead": "subclass.The Undead",
  "The Fathomless": "subclass.The Fathomless",

  Evocation: "school.V",
  Abjuration: "school.A",
  Conjuration: "school.C",
  Divination: "school.D",
  Enchantment: "school.E",
  Illusion: "school.I",
  Necromancy: "school.N",
  Transmutation: "school.T",
  Bladesinging: "subclass.Bladesinging",
  "War Magic": "subclass.War Magic",

  Alchemist: "subclass.Alchemist",
  Artillerist: "subclass.Artillerist",
  "Battle Smith": "subclass.Battle Smith",
  Armorer: "subclass.Armorer",
};

export function classLabel(name: string): string {
  if (!name) return name;
  const key = CLASS_LABEL_KEYS[name];
  return key ? t(key) : name;
}

export function subclassLabel(name: string): string {
  if (!name) return name;
  const key = SUBCLASS_LABEL_KEYS[name];
  return key ? t(key) : name;
}

/** "Guerrero (Campeón) · Nv 5", or the call to action when no class is set. */
export function classLine(className: string, subclass: string | undefined, level: number): string {
  if (!className) return t("character.noClassYet");
  const cls = subclass
    ? `${classLabel(className)} (${subclassLabel(subclass)})`
    : classLabel(className);
  return `${cls} ${t("character.classLineSeparator")} ${t("term.levelShort", { level })}`;
}

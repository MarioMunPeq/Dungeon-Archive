import type {
  EntityCategory,
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  Feat,
} from "@/types/compendium";
import type { FilterDefinition, EntityCardData } from "./types";
import {
  getSpells,
  getMonsters,
  getEquipmentList,
  getConditions,
  getActions,
  getMagicItems,
  getFeats,
} from "./repository";
import { formatSource } from "./source";
import { referenceToUrl } from "./reference";

export type AnyEntity = Spell | Condition | Equipment | Action | Monster | MagicItem | Feat;

export interface CategoryRegistration {
  readonly singular: string;
  readonly plural: string;
  readonly getList: () => readonly AnyEntity[];
  readonly buildFilterDefs: (entities: readonly AnyEntity[]) => readonly FilterDefinition[];
  readonly toCardData: (entity: AnyEntity) => EntityCardData;
  readonly getSubtitle: (entity: AnyEntity) => string;
}

export const SCHOOL_NAMES: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

export const SOURCE_ORDER: Record<string, number> = {
  XPHB: 1,
  PHB: 2,
  TCE: 3,
  XGE: 4,
  XMM: 5,
  MPMM: 6,
  MM: 7,
  DMG: 8,
  XDMG: 9,
};

export function formatMonsterType(monster: Monster): string {
  const base = monster.monsterType;
  const tags = monster.tags;
  if (tags.length === 0) return base;
  return `${base} (${tags.join(", ")})`;
}

const EQUIPMENT_TYPE_DISPLAY: Record<string, string> = {
  $C: "Clothing",
  FD: "Food and Drink",
  GS: "Gaming Set",
  MNT: "Mount",
  SCF: "Spellcasting Focus",
  SHP: "Ship",
  TAH: "Tack and Harness",
  VEH: "Vehicle",
  WD: "Wand",
  G: "Gear",
  T: "Tool",
  AIR: "Air",
};

function formatEquipmentType(rawType: string): string {
  const clean = rawType.includes("|") ? rawType.split("|")[0]! : rawType;
  return EQUIPMENT_TYPE_DISPLAY[clean] ?? clean;
}

function collectUnique<T>(items: readonly T[], get: (item: T) => string): string[] {
  const set = new Set<string>();
  for (const item of items) {
    set.add(get(item));
  }
  return [...set].sort((a, b) => {
    const pa = SOURCE_ORDER[a] ?? 99;
    const pb = SOURCE_ORDER[b] ?? 99;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });
}

function buildOptions(
  values: string[],
  labelMap?: Record<string, string>,
  labelFn?: (v: string) => string,
): { value: string; label: string }[] {
  const options = [{ value: "", label: "All" }];
  for (const v of values) {
    const label = labelFn ? labelFn(v) : (labelMap?.[v] ?? v);
    options.push({ value: v, label });
  }
  return options;
}

function sourceFilter(entities: readonly AnyEntity[]): FilterDefinition {
  return {
    key: "source",
    label: "Source",
    options: buildOptions(
      collectUnique(entities, (e) => e.source),
      {},
      formatSource,
    ),
  };
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    spell: "Spells",
    condition: "Conditions",
    equipment: "Equipment",
    action: "Actions",
    monster: "Monsters",
    magicitem: "Magic Items",
    feat: "Feats",
  };
  return labels[category] ?? category;
}

export function categoryLabelSingular(category: string): string {
  const labels: Record<string, string> = {
    spell: "Spell",
    condition: "Condition",
    equipment: "Equipment",
    action: "Action",
    monster: "Monster",
    magicitem: "Magic Item",
    feat: "Feat",
  };
  return labels[category] ?? category;
}

export const CATEGORY_REGISTRY: Record<EntityCategory, CategoryRegistration> = {
  spell: {
    singular: "Spell",
    plural: "Spells",
    getList: getSpells,
    buildFilterDefs: (entities) => {
      const spells = entities as readonly Spell[];
      return [
        {
          key: "level",
          label: "Level",
          options: buildOptions(
            collectUnique(spells, (s) => String(s.level)),
            { "0": "Cantrip" },
          ),
        },
        {
          key: "school",
          label: "School",
          options: buildOptions(
            collectUnique(spells, (s) => s.school),
            SCHOOL_NAMES,
          ),
        },
        sourceFilter(spells),
      ];
    },
    toCardData: (entity) => {
      const spell = entity as Spell;
      const level = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const school = SCHOOL_NAMES[spell.school] ?? spell.school;
      return {
        name: spell.name,
        href: referenceToUrl(spell.canonicalId),
        categoryLabel: "Spell",
        metadata: `${level} \u00B7 ${school}`,
        source: spell.source,
        canonicalId: spell.canonicalId,
      };
    },
    getSubtitle: (entity) => {
      const spell = entity as Spell;
      const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const schoolName = SCHOOL_NAMES[spell.school] ?? spell.school;
      return `Spell \u00B7 ${levelText} \u00B7 ${schoolName} \u00B7 ${formatSource(spell.source)}`;
    },
  },

  monster: {
    singular: "Monster",
    plural: "Monsters",
    getList: getMonsters,
    buildFilterDefs: (entities) => {
      const monsters = entities as readonly Monster[];
      return [
        {
          key: "cr",
          label: "CR",
          options: buildOptions(collectUnique(monsters, (m) => m.challengeRating)),
        },
        {
          key: "type",
          label: "Type",
          options: buildOptions(collectUnique(monsters, (m) => m.monsterType)),
        },
        {
          key: "size",
          label: "Size",
          options: buildOptions(collectUnique(monsters, (m) => m.size)),
        },
        sourceFilter(monsters),
      ];
    },
    toCardData: (entity) => {
      const monster = entity as Monster;
      return {
        name: monster.name,
        href: referenceToUrl(monster.canonicalId),
        categoryLabel: "Monster",
        metadata: `CR ${monster.challengeRating} \u00B7 ${formatMonsterType(monster)}`,
        source: monster.source,
        canonicalId: monster.canonicalId,
      };
    },
    getSubtitle: (entity) => {
      const monster = entity as Monster;
      return `Monster \u00B7 CR ${monster.challengeRating} \u00B7 ${formatMonsterType(monster)} \u00B7 ${formatSource(monster.source)}`;
    },
  },

  equipment: {
    singular: "Equipment",
    plural: "Equipment",
    getList: getEquipmentList,
    buildFilterDefs: (entities) => {
      const equipment = entities as readonly Equipment[];
      return [
        {
          key: "type",
          label: "Type",
          options: buildOptions(collectUnique(equipment, (e) => e.type)),
        },
        sourceFilter(equipment),
      ];
    },
    toCardData: (entity) => {
      const item = entity as Equipment;
      return {
        name: item.name,
        href: referenceToUrl(item.canonicalId),
        categoryLabel: "Equipment",
        metadata: item.type,
        source: item.source,
        canonicalId: item.canonicalId,
      };
    },
    getSubtitle: (entity) => {
      const item = entity as Equipment;
      return `Equipment \u00B7 ${formatEquipmentType(item.type)} \u00B7 ${formatSource(item.source)}`;
    },
  },

  condition: {
    singular: "Condition",
    plural: "Conditions",
    getList: getConditions,
    buildFilterDefs: (entities) => [sourceFilter(entities)],
    toCardData: (entity) => ({
      name: entity.name,
      href: referenceToUrl(entity.canonicalId),
      categoryLabel: "Condition",
      metadata: "",
      source: entity.source,
      canonicalId: entity.canonicalId,
    }),
    getSubtitle: (entity) => `Condition \u00B7 ${formatSource(entity.source)}`,
  },

  action: {
    singular: "Action",
    plural: "Actions",
    getList: getActions,
    buildFilterDefs: (entities) => [sourceFilter(entities)],
    toCardData: (entity) => {
      const action = entity as Action;
      return {
        name: action.name,
        href: referenceToUrl(action.canonicalId),
        categoryLabel: "Action",
        metadata: action.actionType,
        source: action.source,
        canonicalId: action.canonicalId,
      };
    },
    getSubtitle: (entity) => `Action \u00B7 ${formatSource(entity.source)}`,
  },

  magicitem: {
    singular: "Magic Item",
    plural: "Magic Items",
    getList: getMagicItems,
    buildFilterDefs: (entities) => {
      const items = entities as readonly MagicItem[];
      return [
        {
          key: "rarity",
          label: "Rarity",
          options: buildOptions(collectUnique(items, (m) => m.rarity)),
        },
        {
          key: "itemType",
          label: "Type",
          options: buildOptions(collectUnique(items, (m) => m.itemType)),
        },
        {
          key: "attunement",
          label: "Attunement",
          options: [
            { value: "", label: "All" },
            { value: "required", label: "Required" },
            { value: "none", label: "None" },
          ],
        },
        sourceFilter(items),
      ];
    },
    toCardData: (entity) => {
      const magic = entity as MagicItem;
      const attunement = magic.requiresAttunement ? " \u00B7 Attunement" : "";
      return {
        name: magic.name,
        href: referenceToUrl(magic.canonicalId),
        categoryLabel: "Magic Item",
        metadata: `${magic.rarity}${attunement}`,
        source: magic.source,
        canonicalId: magic.canonicalId,
      };
    },
    getSubtitle: (entity) => {
      const magic = entity as MagicItem;
      const attune = magic.requiresAttunement ? " \u00B7 Requires Attunement" : "";
      return `Magic Item \u00B7 ${magic.rarity}${attune} \u00B7 ${formatSource(magic.source)}`;
    },
  },

  feat: {
    singular: "Feat",
    plural: "Feats",
    getList: getFeats,
    buildFilterDefs: (entities) => {
      const feats = entities as readonly Feat[];
      return [
        {
          key: "prerequisite",
          label: "Prerequisite",
          options: [
            { value: "", label: "All" },
            { value: "yes", label: "Has Prerequisite" },
            { value: "none", label: "No Prerequisite" },
          ],
        },
        {
          key: "repeatable",
          label: "Repeatable",
          options: [
            { value: "", label: "All" },
            { value: "yes", label: "Repeatable" },
            { value: "no", label: "Not Repeatable" },
          ],
        },
        sourceFilter(feats),
      ];
    },
    toCardData: (entity) => {
      const feat = entity as Feat;
      const meta = feat.featCategory ? feat.featCategory : "";
      return {
        name: feat.name,
        href: referenceToUrl(feat.canonicalId),
        categoryLabel: "Feat",
        metadata: meta,
        source: feat.source,
        canonicalId: feat.canonicalId,
      };
    },
    getSubtitle: (entity) => {
      const feat = entity as Feat;
      const prereq = feat.prerequisite ? `Prerequisite: ${feat.prerequisite}` : undefined;
      const repeatable = feat.repeatable ? "Repeatable" : undefined;
      const extras = [prereq, repeatable].filter(Boolean).join(" \u00B7 ");
      return extras
        ? `Feat \u00B7 ${extras} \u00B7 ${formatSource(feat.source)}`
        : `Feat \u00B7 ${formatSource(feat.source)}`;
    },
  },
};

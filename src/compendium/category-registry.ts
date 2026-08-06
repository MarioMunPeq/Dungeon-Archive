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
import type { FilterDefinition, EntityCardData, CardStat } from "./types";
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
import { METADATA_SEPARATOR } from "./separator";
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

function crValue(cr: string): number {
  if (cr.includes("/")) {
    const [numerator, denominator] = cr.split("/").map(Number);
    return (numerator ?? 0) / (denominator ?? 1);
  }
  const n = Number(cr);
  return Number.isFinite(n) ? n : 0;
}

function compareCr(a: string, b: string): number {
  return crValue(a) - crValue(b);
}

export function entityCardStat(entity: AnyEntity): CardStat | undefined {
  switch (entity.category) {
    case "spell": {
      const spell = entity as Spell;
      return {
        label: "Level",
        value: spell.level === 0 ? "Cantrip" : String(spell.level),
        numeric: spell.level > 0,
      };
    }
    case "monster": {
      const monster = entity as Monster;
      return { label: "CR", value: monster.challengeRating, numeric: true };
    }
    case "equipment": {
      const item = entity as Equipment;
      if (item.damage) return { label: "Damage", value: item.damage, numeric: true };
      return undefined;
    }
    default:
      return undefined;
  }
}

const EQUIPMENT_TYPE_DISPLAY: Record<string, string> = {
  $A: "Art Object",
  $C: "Coin",
  $G: "Gemstone",
  AF: "Firearm Ammunition",
  AIR: "Airship",
  EXP: "Explosive",
  FD: "Food and Drink",
  GS: "Gaming Set",
  MNT: "Mount",
  SCF: "Spellcasting Focus",
  SHP: "Ship",
  TAH: "Tack and Harness",
  TB: "Trade Bar",
  VEH: "Vehicle",
  WD: "Wand",
  G: "Gear",
  T: "Tool",
};

export function formatEquipmentType(rawType: string): string {
  const clean = rawType.includes("|") ? rawType.split("|")[0]! : rawType;
  return EQUIPMENT_TYPE_DISPLAY[clean] ?? clean;
}

function collectUnique<T>(
  items: readonly T[],
  get: (item: T) => string,
  compare?: (a: string, b: string) => number,
): string[] {
  const set = new Set<string>();
  for (const item of items) {
    set.add(get(item));
  }
  if (compare) return [...set].sort(compare);
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
        category: "spell",
        categoryLabel: categoryLabelSingular("spell"),
        metadata: `${level} ${METADATA_SEPARATOR} ${school}`,
        source: spell.source,
        canonicalId: spell.canonicalId,
        stat: entityCardStat(spell),
      };
    },
    getSubtitle: (entity) => {
      const spell = entity as Spell;
      const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const schoolName = SCHOOL_NAMES[spell.school] ?? spell.school;
      return `Spell ${METADATA_SEPARATOR} ${levelText} ${METADATA_SEPARATOR} ${schoolName} ${METADATA_SEPARATOR} ${formatSource(spell.source)}`;
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
          options: buildOptions(collectUnique(monsters, (m) => m.challengeRating, compareCr)),
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
        category: "monster",
        categoryLabel: categoryLabelSingular("monster"),
        metadata: `CR ${monster.challengeRating} ${METADATA_SEPARATOR} ${formatMonsterType(monster)}`,
        source: monster.source,
        canonicalId: monster.canonicalId,
        stat: entityCardStat(monster),
      };
    },
    getSubtitle: (entity) => {
      const monster = entity as Monster;
      return `Monster ${METADATA_SEPARATOR} CR ${monster.challengeRating} ${METADATA_SEPARATOR} ${formatMonsterType(monster)} ${METADATA_SEPARATOR} ${formatSource(monster.source)}`;
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
          options: buildOptions(collectUnique(equipment, (e) => formatEquipmentType(e.type))),
        },
        sourceFilter(equipment),
      ];
    },
    toCardData: (entity) => {
      const item = entity as Equipment;
      return {
        name: item.name,
        href: referenceToUrl(item.canonicalId),
        category: "equipment",
        categoryLabel: categoryLabelSingular("equipment"),
        metadata: formatEquipmentType(item.type),
        source: item.source,
        canonicalId: item.canonicalId,
        stat: entityCardStat(item),
      };
    },
    getSubtitle: (entity) => {
      const item = entity as Equipment;
      return `Equipment ${METADATA_SEPARATOR} ${formatEquipmentType(item.type)} ${METADATA_SEPARATOR} ${formatSource(item.source)}`;
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
      category: "condition",
      categoryLabel: categoryLabelSingular("condition"),
      metadata: "",
      source: entity.source,
      canonicalId: entity.canonicalId,
      stat: entityCardStat(entity),
    }),
    getSubtitle: (entity) => `Condition ${METADATA_SEPARATOR} ${formatSource(entity.source)}`,
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
        category: "action",
        categoryLabel: categoryLabelSingular("action"),
        metadata: action.actionType,
        source: action.source,
        canonicalId: action.canonicalId,
        stat: entityCardStat(action),
      };
    },
    getSubtitle: (entity) => `Action ${METADATA_SEPARATOR} ${formatSource(entity.source)}`,
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
      const attunement = magic.requiresAttunement ? ` ${METADATA_SEPARATOR} Attunement` : "";
      return {
        name: magic.name,
        href: referenceToUrl(magic.canonicalId),
        category: "magicitem",
        categoryLabel: categoryLabelSingular("magicitem"),
        metadata: `${magic.rarity}${attunement}`,
        source: magic.source,
        canonicalId: magic.canonicalId,
        stat: entityCardStat(magic),
      };
    },
    getSubtitle: (entity) => {
      const magic = entity as MagicItem;
      const attune = magic.requiresAttunement ? ` ${METADATA_SEPARATOR} Requires Attunement` : "";
      return `Magic Item ${METADATA_SEPARATOR} ${magic.rarity}${attune} ${METADATA_SEPARATOR} ${formatSource(magic.source)}`;
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
        category: "feat",
        categoryLabel: categoryLabelSingular("feat"),
        metadata: meta,
        source: feat.source,
        canonicalId: feat.canonicalId,
        stat: entityCardStat(feat),
      };
    },
    getSubtitle: (entity) => {
      const feat = entity as Feat;
      const prereq = feat.prerequisite ? `Prerequisite: ${feat.prerequisite}` : undefined;
      const repeatable = feat.repeatable ? "Repeatable" : undefined;
      const extras = [prereq, repeatable].filter(Boolean).join(` ${METADATA_SEPARATOR} `);
      return extras
        ? `Feat ${METADATA_SEPARATOR} ${extras} ${METADATA_SEPARATOR} ${formatSource(feat.source)}`
        : `Feat ${METADATA_SEPARATOR} ${formatSource(feat.source)}`;
    },
  },
};

export function categoryLabel(category: string): string {
  return CATEGORY_REGISTRY[category as EntityCategory]?.plural ?? category;
}

export function categoryLabelSingular(category: string): string {
  return CATEGORY_REGISTRY[category as EntityCategory]?.singular ?? category;
}

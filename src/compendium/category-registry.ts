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
import { formatDamageType } from "./damage";
import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";

export type AnyEntity = Spell | Condition | Equipment | Action | Monster | MagicItem | Feat;

export interface CategoryRegistration {
  /** Translation keys, resolved with `t()` at the point of display. */
  readonly singular: TranslationKey;
  readonly plural: TranslationKey;
  readonly getList: () => readonly AnyEntity[];
  readonly buildFilterDefs: (entities: readonly AnyEntity[]) => readonly FilterDefinition[];
  readonly toCardData: (entity: AnyEntity) => EntityCardData;
  readonly getSubtitle: (entity: AnyEntity) => string;
}

const SCHOOL_KEYS: Record<string, TranslationKey> = {
  A: "school.A",
  C: "school.C",
  D: "school.D",
  E: "school.E",
  I: "school.I",
  N: "school.N",
  T: "school.T",
  V: "school.V",
};

/** Falls back to the raw code for schools the SRD adds after this build. */
export function formatSchool(code: string): string {
  const key = SCHOOL_KEYS[code];
  return key ? t(key) : code;
}

const RARITY_KEYS: Record<string, TranslationKey> = {
  common: "rarity.common",
  uncommon: "rarity.uncommon",
  rare: "rarity.rare",
  "very rare": "rarity.very rare",
  legendary: "rarity.legendary",
  artifact: "rarity.artifact",
};

/** Rarity is stored in the SRD as a lowercase English slug. */
export function formatRarity(rarity: string): string {
  const key = RARITY_KEYS[rarity];
  return key ? t(key) : rarity;
}

/** Level 0 spells are cantrips; the rest read "Level N". */
export function spellLevelLabel(level: number): string {
  return level === 0 ? t("term.cantrip") : t("term.level", { level });
}

const CONDITION_KEYS: Record<string, TranslationKey> = {
  blinded: "condition.blinded",
  charmed: "condition.charmed",
  deafened: "condition.deafened",
  exhaustion: "condition.exhaustion",
  frightened: "condition.frightened",
  grappled: "condition.grappled",
  incapacitated: "condition.incapacitated",
  invisible: "condition.invisible",
  paralyzed: "condition.paralyzed",
  petrified: "condition.petrified",
  poisoned: "condition.poisoned",
  prone: "condition.prone",
  restrained: "condition.restrained",
  stunned: "condition.stunned",
  unconscious: "condition.unconscious",
};

/**
 * Condition names as the SRD states them ("Blinded", "Unconscious") rather
 * than the Spanish rules term ("Cegado", "Inconsciente").
 */
export function formatCondition(slug: string): string {
  const key = CONDITION_KEYS[slug];
  return key ? t(key) : slug;
}

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

export const RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  "very rare": 3,
  legendary: 4,
  artifact: 5,
};

const DAMAGE_TYPE_ORDER: Record<string, number> = {
  B: 0,
  P: 1,
  S: 2,
  R: 3,
  N: 4,
  Y: 5,
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

function compareRarity(a: string, b: string): number {
  const ra = RARITY_ORDER[a] ?? 99;
  const rb = RARITY_ORDER[b] ?? 99;
  return ra - rb || a.localeCompare(b);
}

function compareDamageType(a: string, b: string): number {
  const da = DAMAGE_TYPE_ORDER[a] ?? 99;
  const db = DAMAGE_TYPE_ORDER[b] ?? 99;
  return da - db || a.localeCompare(b);
}

function collectArrayValues(groups: readonly (readonly string[])[]): string[] {
  const set = new Set<string>();
  for (const values of groups) {
    for (const value of values) {
      set.add(value);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function entityCardStat(entity: AnyEntity): CardStat | undefined {
  switch (entity.category) {
    case "spell": {
      const spell = entity as Spell;
      return {
        label: t("filter.level"),
        value: spell.level === 0 ? t("term.cantrip") : String(spell.level),
        numeric: spell.level > 0,
      };
    }
    case "monster": {
      const monster = entity as Monster;
      return { label: t("term.cr"), value: monster.challengeRating, numeric: true };
    }
    case "equipment": {
      const item = entity as Equipment;
      if (item.damage) return { label: t("term.damage"), value: item.damage, numeric: true };
      return undefined;
    }
    default:
      return undefined;
  }
}

const EQUIPMENT_TYPE_KEYS: Record<string, TranslationKey> = {
  $A: "equip.$A",
  $C: "equip.$C",
  $G: "equip.$G",
  AF: "equip.AF",
  AIR: "equip.AIR",
  EXP: "equip.EXP",
  FD: "equip.FD",
  GS: "equip.GS",
  MNT: "equip.MNT",
  SCF: "equip.SCF",
  SHP: "equip.SHP",
  TAH: "equip.TAH",
  TB: "equip.TB",
  VEH: "equip.VEH",
  WD: "equip.WD",
  G: "equip.G",
  T: "equip.T",
};

export function formatEquipmentType(rawType: string): string {
  const clean = rawType.includes("|") ? rawType.split("|")[0]! : rawType;
  const key = EQUIPMENT_TYPE_KEYS[clean];
  return key ? t(key) : clean;
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
  labelMap?: Record<string, TranslationKey>,
  labelFn?: (v: string) => string,
): { value: string; label: string }[] {
  const options = [{ value: "", label: t("filter.all") }];
  for (const v of values) {
    const label = labelFn ? labelFn(v) : labelMap?.[v] ? t(labelMap[v]!) : v;
    options.push({ value: v, label });
  }
  return options;
}

function yesNoOptions(): { value: string; label: string }[] {
  return [
    { value: "", label: t("filter.all") },
    { value: "yes", label: t("filter.yes") },
    { value: "no", label: t("filter.no") },
  ];
}

function sourceFilter(entities: readonly AnyEntity[]): FilterDefinition {
  return {
    key: "source",
    label: t("filter.source"),
    options: buildOptions(
      collectUnique(entities, (e) => e.source),
      {},
      formatSource,
    ),
  };
}

export const CATEGORY_REGISTRY: Record<EntityCategory, CategoryRegistration> = {
  spell: {
    singular: "category.spell.one",
    plural: "category.spell.many",
    getList: getSpells,
    buildFilterDefs: (entities) => {
      const spells = entities as readonly Spell[];
      return [
        {
          key: "level",
          label: t("filter.level"),
          options: buildOptions(
            collectUnique(spells, (s) => String(s.level)),
            { "0": "term.cantrip" },
          ),
        },
        {
          key: "school",
          label: t("filter.school"),
          options: buildOptions(
            collectUnique(spells, (s) => s.school),
            SCHOOL_KEYS,
          ),
        },
        {
          key: "class",
          label: t("filter.class"),
          options: buildOptions(collectArrayValues(spells.map((s) => s.classes))),
        },
        {
          key: "concentration",
          label: t("filter.concentration"),
          options: yesNoOptions(),
        },
        {
          key: "ritual",
          label: t("filter.ritual"),
          options: yesNoOptions(),
        },
        sourceFilter(spells),
      ];
    },
    toCardData: (entity) => {
      const spell = entity as Spell;
      const level = spellLevelLabel(spell.level);
      const school = formatSchool(spell.school);
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
      const levelText = spellLevelLabel(spell.level);
      const schoolName = formatSchool(spell.school);
      return `${categoryLabelSingular("spell")} ${METADATA_SEPARATOR} ${levelText} ${METADATA_SEPARATOR} ${schoolName} ${METADATA_SEPARATOR} ${formatSource(spell.source)}`;
    },
  },

  monster: {
    singular: "category.monster.one",
    plural: "category.monster.many",
    getList: getMonsters,
    buildFilterDefs: (entities) => {
      const monsters = entities as readonly Monster[];
      return [
        {
          key: "cr",
          label: t("filter.cr"),
          options: buildOptions(collectUnique(monsters, (m) => m.challengeRating, compareCr)),
        },
        {
          key: "type",
          label: t("filter.type"),
          options: buildOptions(collectUnique(monsters, (m) => m.monsterType)),
        },
        {
          key: "size",
          label: t("filter.size"),
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
      return `${categoryLabelSingular("monster")} ${METADATA_SEPARATOR} CR ${monster.challengeRating} ${METADATA_SEPARATOR} ${formatMonsterType(monster)} ${METADATA_SEPARATOR} ${formatSource(monster.source)}`;
    },
  },

  equipment: {
    singular: "category.equipment.one",
    plural: "category.equipment.many",
    getList: getEquipmentList,
    buildFilterDefs: (entities) => {
      const equipment = entities as readonly Equipment[];
      const damaged = equipment.filter((e) => Boolean(e.damageType));
      return [
        {
          key: "type",
          label: t("filter.type"),
          options: buildOptions(collectUnique(equipment, (e) => formatEquipmentType(e.type))),
        },
        {
          key: "damageType",
          label: t("filter.damageType"),
          options: buildOptions(
            collectUnique(damaged, (e) => e.damageType!, compareDamageType),
            {},
            formatDamageType,
          ),
        },
        {
          key: "property",
          label: t("filter.property"),
          options: buildOptions(collectArrayValues(equipment.map((e) => e.properties ?? []))),
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
      return `${categoryLabelSingular("equipment")} ${METADATA_SEPARATOR} ${formatEquipmentType(item.type)} ${METADATA_SEPARATOR} ${formatSource(item.source)}`;
    },
  },

  condition: {
    singular: "category.condition.one",
    plural: "category.condition.many",
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
    getSubtitle: (entity) =>
      `${categoryLabelSingular("condition")} ${METADATA_SEPARATOR} ${formatSource(entity.source)}`,
  },

  action: {
    singular: "category.action.one",
    plural: "category.action.many",
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
    getSubtitle: (entity) =>
      `${categoryLabelSingular("action")} ${METADATA_SEPARATOR} ${formatSource(entity.source)}`,
  },

  magicitem: {
    singular: "category.magicitem.one",
    plural: "category.magicitem.many",
    getList: getMagicItems,
    buildFilterDefs: (entities) => {
      const items = entities as readonly MagicItem[];
      return [
        {
          key: "rarity",
          label: t("filter.rarity"),
          options: buildOptions(collectUnique(items, (m) => m.rarity, compareRarity)),
        },
        {
          key: "itemType",
          label: t("filter.type"),
          options: buildOptions(collectUnique(items, (m) => m.itemType)),
        },
        {
          key: "attunement",
          label: t("filter.attunement"),
          options: [
            { value: "", label: t("filter.all") },
            { value: "required", label: t("filter.required") },
            { value: "none", label: t("filter.none") },
          ],
        },
        sourceFilter(items),
      ];
    },
    toCardData: (entity) => {
      const magic = entity as MagicItem;
      const attunement = magic.requiresAttunement
        ? ` ${METADATA_SEPARATOR} ${t("term.attunement")}`
        : "";
      return {
        name: magic.name,
        href: referenceToUrl(magic.canonicalId),
        category: "magicitem",
        categoryLabel: categoryLabelSingular("magicitem"),
        metadata: `${formatRarity(magic.rarity)}${attunement}`,
        source: magic.source,
        canonicalId: magic.canonicalId,
        stat: entityCardStat(magic),
      };
    },
    getSubtitle: (entity) => {
      const magic = entity as MagicItem;
      const attune = magic.requiresAttunement
        ? ` ${METADATA_SEPARATOR} ${t("term.requiresAttunement")}`
        : "";
      return `${categoryLabelSingular("magicitem")} ${METADATA_SEPARATOR} ${formatRarity(magic.rarity)}${attune} ${METADATA_SEPARATOR} ${formatSource(magic.source)}`;
    },
  },

  feat: {
    singular: "category.feat.one",
    plural: "category.feat.many",
    getList: getFeats,
    buildFilterDefs: (entities) => {
      const feats = entities as readonly Feat[];
      return [
        {
          key: "prerequisite",
          label: t("filter.prerequisite"),
          options: [
            { value: "", label: t("filter.all") },
            { value: "yes", label: t("term.hasPrerequisite") },
            { value: "none", label: t("term.noPrerequisite") },
          ],
        },
        {
          key: "repeatable",
          label: t("filter.repeatable"),
          options: [
            { value: "", label: t("filter.all") },
            { value: "yes", label: t("term.repeatable") },
            { value: "no", label: t("term.notRepeatable") },
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
      const prereq = feat.prerequisite
        ? `${t("term.prerequisite")}: ${feat.prerequisite}`
        : undefined;
      const repeatable = feat.repeatable ? t("term.repeatable") : undefined;
      const extras = [prereq, repeatable].filter(Boolean).join(` ${METADATA_SEPARATOR} `);
      return extras
        ? `${categoryLabelSingular("feat")} ${METADATA_SEPARATOR} ${extras} ${METADATA_SEPARATOR} ${formatSource(feat.source)}`
        : `${categoryLabelSingular("feat")} ${METADATA_SEPARATOR} ${formatSource(feat.source)}`;
    },
  },
};

export function categoryLabel(category: string): string {
  const registration = CATEGORY_REGISTRY[category as EntityCategory];
  return registration ? t(registration.plural) : category;
}

export function categoryLabelSingular(category: string): string {
  const registration = CATEGORY_REGISTRY[category as EntityCategory];
  return registration ? t(registration.singular) : category;
}

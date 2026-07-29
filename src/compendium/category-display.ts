import type {
  EntityCategory,
  Spell,
  Monster,
  Equipment,
  Condition,
  Action,
  MagicItem,
} from "@/types/compendium";
import type { EntityCardData } from "@/features/compendium/components/entity-card";
import type { FilterDefinition } from "@/features/compendium/components/filter-bar";
import {
  getSpells,
  getMonsters,
  getEquipmentList,
  getConditions,
  getActions,
  getMagicItems,
} from "./repository";
import { slugFromCanonicalId, categoryLabelSingular } from "./slug";
import { formatSource } from "./source";

export type AnyEntity = Spell | Monster | Equipment | Condition | Action | MagicItem;

export function formatMonsterType(monster: Monster): string {
  const base = monster.monsterType;
  const tags = monster.tags;
  if (tags.length === 0) return base;
  return `${base} (${tags.join(", ")})`;
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

export function getEntitiesForCategory(category: EntityCategory): readonly AnyEntity[] {
  switch (category) {
    case "spell":
      return getSpells();
    case "monster":
      return getMonsters();
    case "equipment":
      return getEquipmentList();
    case "condition":
      return getConditions();
    case "action":
      return getActions();
    case "magicitem":
      return getMagicItems();
  }
}

export function collectUnique<T>(items: readonly T[], get: (item: T) => string): string[] {
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

export function buildOptions(
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

export function buildFilterDefs(
  category: EntityCategory,
  entities: readonly AnyEntity[],
): readonly FilterDefinition[] {
  switch (category) {
    case "spell": {
      const spells = entities as readonly Spell[];
      return [
        {
          key: "level",
          label: "Level",
          options: buildOptions(
            collectUnique(spells, (s) => String(s.level)),
            {
              "0": "Cantrip",
            },
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
        {
          key: "source",
          label: "Source",
          options: buildOptions(
            collectUnique(spells, (s) => s.source),
            {},
            formatSource,
          ),
        },
      ];
    }
    case "monster": {
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
        {
          key: "source",
          label: "Source",
          options: buildOptions(
            collectUnique(monsters, (m) => m.source),
            {},
            formatSource,
          ),
        },
      ];
    }
    case "equipment": {
      const equipment = entities as readonly Equipment[];
      return [
        {
          key: "type",
          label: "Type",
          options: buildOptions(collectUnique(equipment, (e) => e.type)),
        },
        {
          key: "source",
          label: "Source",
          options: buildOptions(
            collectUnique(equipment, (e) => e.source),
            {},
            formatSource,
          ),
        },
      ];
    }
    case "magicitem": {
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
        {
          key: "source",
          label: "Source",
          options: buildOptions(
            collectUnique(items, (e) => e.source),
            {},
            formatSource,
          ),
        },
      ];
    }
    case "condition":
    case "action":
      return [
        {
          key: "source",
          label: "Source",
          options: buildOptions(
            collectUnique(entities, (e) => e.source),
            {},
            formatSource,
          ),
        },
      ];
  }
}

export function applyFilters(
  _category: EntityCategory,
  entities: readonly AnyEntity[],
  filters: Record<string, string>,
): readonly AnyEntity[] {
  const keys = Object.keys(filters);
  if (keys.length === 0) return entities;

  return entities.filter((entity) => {
    for (const key of keys) {
      const value = filters[key]!;
      switch (key) {
        case "level":
          if (String((entity as Spell).level) !== value) return false;
          break;
        case "school":
          if ((entity as Spell).school !== value) return false;
          break;
        case "cr":
          if ((entity as Monster).challengeRating !== value) return false;
          break;
        case "type":
          if ((entity as Monster).monsterType !== value) return false;
          break;
        case "size":
          if ((entity as Monster).size !== value) return false;
          break;
        case "rarity":
          if ((entity as MagicItem).rarity !== value) return false;
          break;
        case "itemType":
          if ((entity as MagicItem).itemType !== value) return false;
          break;
        case "attunement":
          if (value === "required" && !(entity as MagicItem).requiresAttunement) return false;
          if (value === "none" && (entity as MagicItem).requiresAttunement !== "") return false;
          break;
        case "source":
          if (entity.source !== value) return false;
          break;
      }
    }
    return true;
  });
}

export function toCardData(category: EntityCategory, entity: AnyEntity): EntityCardData {
  const href = `/${category}/${slugFromCanonicalId(entity.canonicalId)}`;
  const label = categoryLabelSingular(category);

  switch (category) {
    case "spell": {
      const spell = entity as Spell;
      const level = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const school = SCHOOL_NAMES[spell.school] ?? spell.school;
      return {
        name: spell.name,
        href,
        categoryLabel: label,
        metadata: `${level} \u00B7 ${school}`,
        source: spell.source,
      };
    }
    case "monster": {
      const monster = entity as Monster;
      return {
        name: monster.name,
        href,
        categoryLabel: label,
        metadata: `CR ${monster.challengeRating} \u00B7 ${formatMonsterType(monster)}`,
        source: monster.source,
      };
    }
    case "equipment": {
      const item = entity as Equipment;
      return {
        name: item.name,
        href,
        categoryLabel: label,
        metadata: item.type,
        source: item.source,
      };
    }
    case "magicitem": {
      const magic = entity as MagicItem;
      const attunement = magic.requiresAttunement ? " \u00B7 Attunement" : "";
      return {
        name: magic.name,
        href,
        categoryLabel: label,
        metadata: `${magic.rarity}${attunement}`,
        source: magic.source,
      };
    }
    case "condition":
      return {
        name: entity.name,
        href,
        categoryLabel: label,
        metadata: "",
        source: entity.source,
      };
    case "action": {
      const action = entity as Action;
      return {
        name: action.name,
        href,
        categoryLabel: label,
        metadata: action.actionType,
        source: action.source,
      };
    }
  }
}

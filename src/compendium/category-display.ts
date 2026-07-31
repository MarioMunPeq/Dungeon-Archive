import type {
  EntityCategory,
  Spell,
  Monster,
  MagicItem,
  Feat,
} from "@/types/compendium";
import type { EntityCardData, FilterDefinition } from "./types";
import { CATEGORY_REGISTRY, SOURCE_ORDER } from "./category-registry";
export type { AnyEntity } from "./category-registry";
export { SCHOOL_NAMES, formatMonsterType } from "./category-registry";

export function getEntitiesForCategory(category: EntityCategory): readonly import("./category-registry").AnyEntity[] {
  return CATEGORY_REGISTRY[category].getList();
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
  entities: readonly import("./category-registry").AnyEntity[],
): readonly FilterDefinition[] {
  return CATEGORY_REGISTRY[category].buildFilterDefs(entities);
}

export function applyFilters(
  _category: EntityCategory,
  entities: readonly import("./category-registry").AnyEntity[],
  filters: Record<string, string>,
): readonly import("./category-registry").AnyEntity[] {
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
        case "prerequisite":
          if (value === "yes" && !(entity as Feat).prerequisite) return false;
          if (value === "none" && (entity as Feat).prerequisite) return false;
          break;
        case "repeatable":
          if (value === "yes" && !(entity as Feat).repeatable) return false;
          if (value === "no" && (entity as Feat).repeatable) return false;
          break;
        case "source":
          if (entity.source !== value) return false;
          break;
      }
    }
    return true;
  });
}

export function toCardData(category: EntityCategory, entity: import("./category-registry").AnyEntity): EntityCardData {
  return CATEGORY_REGISTRY[category].toCardData(entity);
}

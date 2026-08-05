import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  Feat,
  EntityCategory,
} from "@/types/compendium";
import type { CategoryMap, CategoryKey } from "./types";
import { state } from "./loader";

function resolveMap(category: EntityCategory): Map<string, CategoryMap[CategoryKey]> | null {
  switch (category) {
    case "spell":
      return state.spells;
    case "condition":
      return state.conditions;
    case "equipment":
      return state.equipment;
    case "action":
      return state.actions;
    case "monster":
      return state.monsters;
    case "magicitem":
      return state.magicItems;
    case "feat":
      return state.feats;
  }
}

export function getSpell(id: string): Spell | null {
  return state.spells.get(id) ?? null;
}

export function getCondition(id: string): Condition | null {
  return state.conditions.get(id) ?? null;
}

export function getEntity(category: EntityCategory, id: string): CategoryMap[CategoryKey] | null {
  const map = resolveMap(category);
  if (!map) return null;
  return map.get(id) ?? null;
}

export function getSpells(): readonly Spell[] {
  return state.spellList;
}

export function getConditions(): readonly Condition[] {
  return state.conditionList;
}

export function getEquipmentList(): readonly Equipment[] {
  return state.equipmentList;
}

export function getActions(): readonly Action[] {
  return state.actionList;
}

export function getMonsters(): readonly Monster[] {
  return state.monsterList;
}

export function getMagicItems(): readonly MagicItem[] {
  return state.magicItemList;
}

export function getFeats(): readonly Feat[] {
  return state.featList;
}

import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
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
  }
}

export function getSpell(id: string): Spell | null {
  return state.spells.get(id) ?? null;
}

export function getCondition(id: string): Condition | null {
  return state.conditions.get(id) ?? null;
}

export function getEquipment(id: string): Equipment | null {
  return state.equipment.get(id) ?? null;
}

export function getAction(id: string): Action | null {
  return state.actions.get(id) ?? null;
}

export function getMonster(id: string): Monster | null {
  return state.monsters.get(id) ?? null;
}

export function getMagicItem(id: string): MagicItem | null {
  return state.magicItems.get(id) ?? null;
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

export function getCategoryCount(category: EntityCategory): number {
  const map = resolveMap(category);
  return map ? map.size : 0;
}

export function isInitialized(): boolean {
  return state.initialized;
}

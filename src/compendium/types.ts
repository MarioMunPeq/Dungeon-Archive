import type { Spell, Condition, Equipment, Action } from "@/types/compendium";

export interface CompendiumState {
  spells: Map<string, Spell>;
  conditions: Map<string, Condition>;
  equipment: Map<string, Equipment>;
  actions: Map<string, Action>;
  spellList: readonly Spell[];
  conditionList: readonly Condition[];
  equipmentList: readonly Equipment[];
  actionList: readonly Action[];
  initialized: boolean;
}

export type CategoryMap = {
  spell: Spell;
  condition: Condition;
  equipment: Equipment;
  action: Action;
};

export type CategoryKey = keyof CategoryMap;

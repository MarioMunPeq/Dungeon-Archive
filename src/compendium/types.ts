import type { Spell, Condition, Equipment, Action, Monster } from "@/types/compendium";

export interface CompendiumState {
  spells: Map<string, Spell>;
  conditions: Map<string, Condition>;
  equipment: Map<string, Equipment>;
  actions: Map<string, Action>;
  monsters: Map<string, Monster>;
  spellList: readonly Spell[];
  conditionList: readonly Condition[];
  equipmentList: readonly Equipment[];
  actionList: readonly Action[];
  monsterList: readonly Monster[];
  initialized: boolean;
}

export type CategoryMap = {
  spell: Spell;
  condition: Condition;
  equipment: Equipment;
  action: Action;
  monster: Monster;
};

export type CategoryKey = keyof CategoryMap;

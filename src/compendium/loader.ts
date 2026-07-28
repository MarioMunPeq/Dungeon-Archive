import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  SearchIndexEntry,
} from "@/types/compendium";
import type { CompendiumState } from "./types";
import { buildRegistry } from "./registry/entity-registry";

export let state: CompendiumState = {
  spells: new Map(),
  conditions: new Map(),
  equipment: new Map(),
  actions: new Map(),
  monsters: new Map(),
  spellList: [],
  conditionList: [],
  equipmentList: [],
  actionList: [],
  monsterList: [],
  initialized: false,
};

function toMap<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(item.id, item);
  }
  return map;
}

export async function loadCompendium(): Promise<void> {
  if (state.initialized) return;

  const [spells, conditions, equipment, actions, monsters, searchIndex] = await Promise.all([
    import("../generated/compendium/spells.json"),
    import("../generated/compendium/conditions.json"),
    import("../generated/compendium/equipment.json"),
    import("../generated/compendium/actions.json"),
    import("../generated/compendium/monsters.json"),
    import("../generated/compendium/search-index.json"),
  ]);

  const spellList = Object.freeze(spells.default as Spell[]);
  const conditionList = Object.freeze(conditions.default as Condition[]);
  const equipmentList = Object.freeze(equipment.default as Equipment[]);
  const actionList = Object.freeze(actions.default as Action[]);
  const monsterList = Object.freeze(monsters.default as Monster[]);

  state = {
    spells: toMap(spellList),
    conditions: toMap(conditionList),
    equipment: toMap(equipmentList),
    actions: toMap(actionList),
    monsters: toMap(monsterList),
    spellList,
    conditionList,
    equipmentList,
    actionList,
    monsterList,
    initialized: true,
  };

  buildRegistry([...spellList, ...conditionList, ...equipmentList, ...actionList, ...monsterList]);

  setSearchIndex(searchIndex.default as SearchIndexEntry[]);
}

let searchIndex: SearchIndexEntry[] = [];
let searchIndexLower: readonly string[] = [];

function setSearchIndex(data: SearchIndexEntry[]): void {
  searchIndex = data;
  const lower = new Array<string>(data.length);
  for (let i = 0; i < data.length; i++) {
    lower[i] = data[i]!.name.toLowerCase();
  }
  searchIndexLower = Object.freeze(lower);
}

export { searchIndex, searchIndexLower };

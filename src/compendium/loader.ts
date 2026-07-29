import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  SearchIndexEntry,
} from "@/types/compendium";
import type { CompendiumState } from "./types";
import type { RelatedIndex } from "@/types/relationships";
import { buildRegistry } from "./registry/entity-registry";
import { setRelatedIndex } from "./relationships";

export let state: CompendiumState = {
  spells: new Map(),
  conditions: new Map(),
  equipment: new Map(),
  actions: new Map(),
  monsters: new Map(),
  magicItems: new Map(),
  spellList: [],
  conditionList: [],
  equipmentList: [],
  actionList: [],
  monsterList: [],
  magicItemList: [],
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

  const [
    spells,
    conditions,
    equipment,
    actions,
    monsters,
    magicItems,
    searchIndex,
    relatedIndexModule,
  ] = await Promise.all([
    import("../generated/compendium/spells.json"),
    import("../generated/compendium/conditions.json"),
    import("../generated/compendium/equipment.json"),
    import("../generated/compendium/actions.json"),
    import("../generated/compendium/monsters.json"),
    import("../generated/compendium/magic-items.json"),
    import("../generated/compendium/search-index.json"),
    import("../generated/compendium/related-index.json"),
  ]);

  const spellList = Object.freeze(spells.default as Spell[]);
  const conditionList = Object.freeze(conditions.default as Condition[]);
  const equipmentList = Object.freeze(equipment.default as Equipment[]);
  const actionList = Object.freeze(actions.default as Action[]);
  const monsterList = Object.freeze(monsters.default as Monster[]);
  const magicItemList = Object.freeze(magicItems.default as MagicItem[]);

  state = {
    spells: toMap(spellList),
    conditions: toMap(conditionList),
    equipment: toMap(equipmentList),
    actions: toMap(actionList),
    monsters: toMap(monsterList),
    magicItems: toMap(magicItemList),
    spellList,
    conditionList,
    equipmentList,
    actionList,
    monsterList,
    magicItemList,
    initialized: true,
  };

  buildRegistry([
    ...spellList,
    ...conditionList,
    ...equipmentList,
    ...actionList,
    ...monsterList,
    ...magicItemList,
  ]);

  setSearchIndex(searchIndex.default as SearchIndexEntry[]);
  setRelatedIndex(relatedIndexModule.default as RelatedIndex);
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

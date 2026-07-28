export { loadCompendium } from "./loader";
export { search } from "./search";
export {
  getSpell,
  getCondition,
  getEquipment,
  getAction,
  getEntity,
  getSpells,
  getConditions,
  getEquipmentList,
  getActions,
  getCategoryCount,
  isInitialized,
} from "./repository";

export type {
  Spell,
  Condition,
  Equipment,
  Action,
  SearchIndexEntry,
  CompendiumEntry,
  EntityCategory,
} from "@/types/compendium";

export type { ContentBlock } from "@/types/content-block";

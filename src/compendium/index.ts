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

export { resolveEntity } from "./resolver/entity-resolver";
export type { ResolvedEntity } from "./resolver/entity-resolver";

export { sourcePriority, selectPreferredVersion, formatSource } from "./resolver/version-selector";

export { getVersions, isRegistered, registrySize } from "./registry/entity-registry";

export type {
  Spell,
  Condition,
  Equipment,
  Action,
  SearchIndexEntry,
  CompendiumEntry,
  EntityCategory,
  EntityVersion,
} from "@/types/compendium";

export type { ContentBlock } from "@/types/content-block";

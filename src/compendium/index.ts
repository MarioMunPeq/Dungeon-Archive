export { loadCompendium } from "./loader";
export { search } from "./search";
export {
  getSpell,
  getCondition,
  getEquipment,
  getAction,
  getMonster,
  getMagicItem,
  getEntity,
  getSpells,
  getConditions,
  getEquipmentList,
  getActions,
  getMonsters,
  getMagicItems,
  getCategoryCount,
  isInitialized,
} from "./repository";

export { resolveEntity } from "./resolver/entity-resolver";
export type { ResolvedEntity } from "./resolver/entity-resolver";

export { sourcePriority, selectPreferredVersion } from "./resolver/version-selector";

export { getVersions, isRegistered, registrySize } from "./registry/entity-registry";

export { getSourceInfo, formatSource, formatEdition } from "./source";
export type { SourceInfo } from "./source";

export {
  getRelatedEntities,
  getReferencingEntities,
  getRelatedEntityIds,
  getReferencingEntityIds,
  getEntityTags,
} from "./relationships";

export { referenceToUrl, referenceLabel } from "./reference";

export {
  slugFromCanonicalId,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
} from "./slug";

export {
  getEntitiesForCategory,
  collectUnique,
  buildOptions,
  buildFilterDefs,
  applyFilters,
  toCardData,
  formatMonsterType,
  SCHOOL_NAMES,
  SOURCE_ORDER,
} from "./category-display";
export type { AnyEntity } from "./category-display";

export type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  SearchIndexEntry,
  CompendiumEntry,
  EntityCategory,
  EntityVersion,
} from "@/types/compendium";

export type { ContentBlock } from "@/types/content-block";

export { loadCompendium } from "./loader";
export { search } from "./search";
export {
  getSpell,
  getCondition,
  getEquipment,
  getAction,
  getMonster,
  getMagicItem,
  getFeat,
  getEntity,
  getSpells,
  getConditions,
  getEquipmentList,
  getActions,
  getMonsters,
  getMagicItems,
  getFeats,
  getCategoryCount,
  isInitialized,
} from "./repository";

export { resolveEntity } from "./resolver/entity-resolver";
export type { ResolvedEntity } from "./resolver/entity-resolver";

export { sourcePriority, selectPreferredVersion } from "./resolver/version-selector";

export { getVersions, isRegistered, registrySize } from "./registry/entity-registry";

export { getSourceInfo, formatSource, formatEdition } from "./source";
export type { SourceInfo } from "./source";

export { formatDamage, formatDamageType } from "./damage";

export {
  getRelatedEntities,
  getReferencingEntities,
  getRelatedEntityIds,
  getReferencingEntityIds,
  getEntityTags,
} from "./relationships";

export { referenceToUrl, referenceLabel } from "./reference";

export { slugFromCanonicalId, canonicalIdFromSlug } from "./slug";

export { categoryLabel, categoryLabelSingular } from "./category-registry";

export {
  CATEGORY_REGISTRY,
  SCHOOL_NAMES,
  SOURCE_ORDER,
  formatMonsterType,
} from "./category-registry";
export type { AnyEntity, CategoryRegistration } from "./category-registry";

export {
  getEntitiesForCategory,
  collectUnique,
  buildOptions,
  buildFilterDefs,
  applyFilters,
  toCardData,
} from "./category-display";

export type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  Feat,
  SearchIndexEntry,
  CompendiumEntry,
  EntityCategory,
  EntityVersion,
} from "@/types/compendium";

export type { ContentBlock } from "@/types/content-block";

export type { EntityCardData, FilterOption, FilterDefinition } from "./types";

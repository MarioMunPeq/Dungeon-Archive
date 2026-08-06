export { loadCompendium } from "./loader";
export { search } from "./search";
export {
  getSpell,
  getCondition,
  getEntity,
  getSpells,
  getConditions,
  getEquipmentList,
  getActions,
  getMonsters,
  getMagicItems,
  getFeats,
} from "./repository";

export { resolveEntity } from "./resolver/entity-resolver";

export { sourcePriority, selectPreferredVersion } from "./resolver/version-selector";

export { getVersions, isRegistered, registrySize } from "./registry/entity-registry";

export { getSourceInfo, formatSource, formatEdition } from "./source";
export type { SourceInfo } from "./source";

export { formatDamage, formatDamageType } from "./damage";

export { METADATA_SEPARATOR } from "./separator";

export {
  getRelatedEntities,
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
  entityCardStat,
} from "./category-registry";
export type { AnyEntity, CategoryRegistration } from "./category-registry";

export {
  getEntitiesForCategory,
  collectUnique,
  buildOptions,
  buildFilterDefs,
  applyFilters,
  toCardData,
  getSortOptions,
  sortEntities,
  dedupeEntities,
} from "./category-display";
export type { CategorySort, SortOption, DedupedEntity } from "./category-display";

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

export type { EntityCardData, FilterOption, FilterDefinition, CardStat } from "./types";

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

export { sourcePriority, selectPreferredVersion } from "./resolver/version-selector";

export { getVersions, isRegistered, registrySize } from "./registry/entity-registry";

export { getSourceInfo, formatSource, formatEdition } from "./source";
export type { SourceInfo } from "./source";

export { referenceToUrl, referenceLabel } from "./reference";

export {
  slugFromCanonicalId,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
} from "./slug";

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

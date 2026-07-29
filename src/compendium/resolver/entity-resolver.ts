import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  EntityVersion,
} from "@/types/compendium";
import { getVersions } from "../registry/entity-registry";
import { selectPreferredVersion } from "./version-selector";
import { getEntity } from "../repository";

type AnyEntity = Spell | Condition | Equipment | Action | Monster | MagicItem;

export interface ResolvedEntity {
  readonly canonicalId: string;
  readonly selected: AnyEntity;
  readonly versions: readonly EntityVersion[];
}

export function resolveEntity(canonicalId: string, source?: string): ResolvedEntity | null {
  const versions = getVersions(canonicalId);
  if (!versions || versions.length === 0) return null;

  if (source) {
    const exact = versions.find((v) => v.source === source);
    if (exact) {
      const entity = getEntity(exact.category, exact.id);
      if (entity) {
        return { canonicalId, selected: entity, versions };
      }
    }
  }

  const preferred = selectPreferredVersion(versions);
  const entity = getEntity(preferred.category, preferred.id);
  if (!entity) return null;

  return { canonicalId, selected: entity, versions };
}

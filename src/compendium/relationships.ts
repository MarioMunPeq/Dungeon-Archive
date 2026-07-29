import type { RelatedIndex, RelatedIndexEntry } from "@/types/relationships";
import type { AnyEntity } from "./category-display";
import { resolveEntity } from "./resolver/entity-resolver";

let relatedIndex: RelatedIndex | null = null;

export function setRelatedIndex(index: RelatedIndex): void {
  relatedIndex = index;
}

export function getRelatedIndexEntry(canonicalId: string): RelatedIndexEntry | null {
  if (!relatedIndex) return null;
  const entry = relatedIndex[canonicalId];
  return entry ?? null;
}

export function getRelatedEntityIds(canonicalId: string): readonly string[] {
  const entry = getRelatedIndexEntry(canonicalId);
  return entry?.related ?? [];
}

export function getRelatedEntities(canonicalId: string): readonly AnyEntity[] {
  const ids = getRelatedEntityIds(canonicalId);
  const entities: AnyEntity[] = [];
  for (const id of ids) {
    const resolved = resolveEntity(id);
    if (resolved) entities.push(resolved.selected);
  }
  return entities;
}

export function getReferencingEntityIds(canonicalId: string): readonly string[] {
  const entry = getRelatedIndexEntry(canonicalId);
  return entry?.references ?? [];
}

export function getReferencingEntities(canonicalId: string): readonly AnyEntity[] {
  const ids = getReferencingEntityIds(canonicalId);
  const entities: AnyEntity[] = [];
  for (const id of ids) {
    const resolved = resolveEntity(id);
    if (resolved) entities.push(resolved.selected);
  }
  return entities;
}

export function getEntityTags(canonicalId: string): readonly string[] {
  const entry = getRelatedIndexEntry(canonicalId);
  return entry?.tags ?? [];
}

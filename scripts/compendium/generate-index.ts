import type { SearchIndexEntry, EntityCategory } from "../../src/types/compendium";

export function generateSearchIndex(
  entities: readonly {
    readonly id: string;
    readonly canonicalId: string;
    readonly name: string;
    readonly category: EntityCategory;
  }[],
): SearchIndexEntry[] {
  return entities.map((e) => ({
    id: e.id,
    canonicalId: e.canonicalId,
    name: e.name,
    category: e.category,
  }));
}

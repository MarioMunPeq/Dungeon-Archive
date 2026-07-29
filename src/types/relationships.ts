export interface RelatedIndexEntry {
  readonly related: readonly string[];
  readonly tags: readonly string[];
  readonly references: readonly string[];
}

export type RelatedIndex = Readonly<Record<string, RelatedIndexEntry>>;

/** Mutable version used during index generation */
export type MutableRelatedIndex = Record<string, RelatedIndexEntry>;

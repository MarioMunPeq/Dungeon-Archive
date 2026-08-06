# Compendium Runtime

Runtime data layer for D&D 5e compendium data. This is the **only** way the UI accesses compendium data.

## Architecture

```
external/5etools/     (build pipeline input, gitignored)
        ↓  scripts/compendium/  (transform, validate, index)
src/generated/compendium/  (build pipeline output, committed to Git)
        ↓
    loader.ts           (async: imports all JSON, creates Maps + cached arrays)
        ↓
    repository.ts       (sync: Map lookups, cached array getters)
    search.ts           (sync: substring search with scoring)
    relationships.ts    (sync: related-entity index lookups)
        ↓
    index.ts            (public API surface)
        ↓
    React components    (import from @/compendium)
```

## Lifecycle

```
main.tsx
  → await loadCompendium()   // loads everything: entities + search index
  → React renders            // all data is in memory, all access is synchronous
```

Single initialization. No partial states. No two-step setup.

## Public API

Everything below is exported from `src/compendium/index.ts`. Types come from
`src/types/compendium.ts` and `src/types/content-block.ts`.

```typescript
// Initialization (call once before React renders)
await loadCompendium();

// Entity getters (synchronous, return null if not found)
getSpell(id): Spell | null
getCondition(id): Condition | null
getEntity(category, id): Entity | null

// List getters (return cached arrays, zero allocation)
getSpells(): readonly Spell[]
getConditions(): readonly Condition[]
getEquipmentList(): readonly Equipment[]
getActions(): readonly Action[]
getMonsters(): readonly Monster[]
getMagicItems(): readonly MagicItem[]
getFeats(): readonly Feat[]

// Search (synchronous, returns scored + sorted results)
search(query): readonly SearchIndexEntry[]

// Entity resolution (canonical ID → best available version)
resolveEntity(canonicalId, source?): ResolvedEntity | null
sourcePriority / selectPreferredVersion

// Registry (what entities exist)
getVersions(canonicalId): EntityVersion[]
isRegistered(canonicalId): boolean
registrySize(): number

// Relationships (prebuilt related-entity index)
getRelatedEntities(canonicalId): readonly AnyEntity[]
getRelatedEntityIds(canonicalId): readonly string[]
getReferencingEntityIds(canonicalId): readonly string[]
getEntityTags(canonicalId): readonly string[]

// Category display (list pages)
getEntitiesForCategory(category) / buildFilterDefs / applyFilters / buildOptions
toCardData / getSortOptions / sortEntities / dedupeEntities / collectUnique

// Formatting and labels
formatSource / formatEdition / formatDamage / formatDamageType
categoryLabel / categoryLabelSingular
slugFromCanonicalId / canonicalIdFromSlug / referenceToUrl / referenceLabel
```

## Adding a New Category

1. Add entity interface to `src/types/compendium.ts`
2. Add to `EntityCategory` union and `CATEGORY_REGISTRY`
3. Add Map + cached array + getter to `src/compendium/repository.ts`
4. Add to the resolver in `src/compendium/resolver/`
5. Add dynamic import to `src/compendium/loader.ts`
6. Add a transform + validate step under `scripts/compendium/categories/`
7. Add export to `src/compendium/index.ts`

No changes to search, hooks, or component architecture.

## Rules

- Components import from `@/compendium`, never from `@/generated/`
- All data access through exported functions, never direct Map access
- Initialization happens once, before React renders
- Unknown IDs return `null`, never throw
- Empty search returns `[]`
- No runtime validation (belongs to build pipeline)

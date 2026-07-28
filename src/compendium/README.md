# Compendium Runtime

Runtime data layer for D&D 5e compendium data. This is the **only** way the UI accesses compendium data.

## Architecture

```
src/generated/compendium/  (build pipeline output, committed to Git)
        ↓
    loader.ts               (async: imports all JSON, creates Maps + cached arrays)
        ↓
    repository.ts           (sync: Map lookups, cached array getters)
    search.ts               (sync: substring search with scoring)
        ↓
    index.ts                (public API surface)
        ↓
    React components        (import from @/compendium)
```

## Lifecycle

```
main.tsx
  → await loadCompendium()   // loads everything: entities + search index
  → React renders            // all data is in memory, all access is synchronous
```

Single initialization. No partial states. No two-step setup.

## Public API

```typescript
// Initialization (call once before React renders)
await loadCompendium();

// Entity getters (synchronous, return null if not found)
getSpell(id): Spell | null
getCondition(id): Condition | null
getEquipment(id): Equipment | null
getAction(id): Action | null
getEntity(category, id): Entity | null

// List getters (return cached arrays, zero allocation)
getSpells(): readonly Spell[]
getConditions(): readonly Condition[]
getEquipmentList(): readonly Equipment[]
getActions(): readonly Action[]
getCategoryCount(category): number

// Search (synchronous, returns sorted results)
search(query): readonly SearchIndexEntry[]

// Status
isInitialized(): boolean
```

## Adding a New Category

1. Add entity interface to `src/types/compendium.ts`
2. Add to `EntityCategory` union
3. Add Map + cached array + getter to `src/compendium/repository.ts`
4. Add to `resolveMap` switch
5. Add dynamic import to `src/compendium/loader.ts`
6. Add export to `src/compendium/index.ts`

No changes to search, hooks, or component architecture.

## Rules

- Components import from `@/compendium`, never from `@/generated/`
- All data access through exported functions, never direct Map access
- Initialization happens once, before React renders
- Unknown IDs return `null`, never throw
- Empty search returns `[]`
- No runtime validation (belongs to build pipeline)

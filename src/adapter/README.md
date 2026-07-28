# Adapter Layer

The adapter layer is a **first-class architectural concept**. It is NOT a service.

## Responsibility

The adapter layer is responsible ONLY for translating external data into Dungeon Archive's internal models.

Nothing else.

## Structure

```
src/adapter/
├── README.md
├── index.ts              ← re-exports DA types from @/compendium
└── 5etools/
    └── (raw types used by build scripts only)
```

## Rules

1. **The adapter is the only place allowed to know how external sources work.**
2. **Everything else communicates only with Dungeon Archive models.**
3. **External data never leaks past the adapter boundary.**
4. **The adapter exports only Dungeon Archive types, never external types.**

## Import Boundary

```
external/5etools/ → scripts/compendium/ → src/generated/ → src/compendium/ → src/adapter/ → src/
```

- `scripts/compendium/` reads from `external/5etools/` and writes to `src/generated/`
- `src/compendium/` loads generated JSON and provides the runtime API
- `src/adapter/` re-exports Dungeon Archive types
- Everything imports from `src/adapter/` (the barrel) or `src/compendium/` directly

## Future Adapters

When new external data sources are added, create a new subdirectory:

```
src/adapter/
├── 5etools/
└── future-source/
```

Each adapter follows the same rules.

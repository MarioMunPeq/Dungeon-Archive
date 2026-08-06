# Adapter Layer

The adapter layer is a **first-class architectural concept**. It is NOT a service.

## Responsibility

The adapter layer is responsible ONLY for owning the raw types of external data sources so the rest of the codebase never has to know how external sources work.

Nothing else.

## Structure

```
src/adapter/
├── README.md
└── 5etools-raw-types.ts    ← raw types mirroring the 5etools dataset
```

The 5etools raw types (`Raw5eSpell`, `Raw5eCondition`, `Raw5eItem`, `Raw5eMonster`, `Raw5eMagicItem`, `Raw5eFeat`) are consumed **only by the build scripts** (`scripts/compendium/`) when transforming the external dataset into the internal `src/types/compendium.ts` models.

## Rules

1. **The adapter is the only place allowed to know how external sources work.**
2. **Everything else communicates only with Dungeon Archive models.**
3. **External data never leaks past the adapter boundary.**
4. **The adapter exports raw external types, never Dungeon Archive types.**

## Import Boundary

```
external/5etools/ → scripts/compendium/ → src/generated/compendium/ → src/compendium/ → features/
```

- `scripts/compendium/` reads from `external/5etools/` (via the adapter's raw types) and writes to `src/generated/compendium/`
- `src/compendium/` loads the generated JSON and provides the runtime API
- Features import from `@/compendium` only
- The raw types in this folder are never imported by application code

## Future Adapters

When new external data sources are added, keep each source's raw types in a source-scoped file:

```
src/adapter/
├── 5etools-raw-types.ts
└── future-source-raw-types.ts
```

Each adapter follows the same rules.

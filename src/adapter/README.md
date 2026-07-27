# Adapter Layer

The adapter layer is a **first-class architectural concept**. It is NOT a service.

## Responsibility

The adapter layer is responsible ONLY for translating external data into Dungeon Archive's internal models.

Nothing else.

## Structure

```
src/adapter/
├── README.md
└── 5etools/
    └── (adapter implementation — Phase 2)
```

## Rules

1. **The adapter is the only place allowed to know how external sources work.**
2. **Everything else communicates only with Dungeon Archive models.**
3. **External data never leaks past the adapter boundary.**
4. **The adapter exports only Dungeon Archive types, never external types.**

## Import Boundary

```
external/5etools/ → src/adapter/5etools/ → src/ (everything else)
```

- `src/adapter/5etools/` can import from `external/5etools/`
- `src/adapter/` exports Dungeon Archive types
- Nothing else can import from `src/adapter/5etools/` directly
- Everything imports from `src/adapter/` (the barrel)

## Future Adapters

When new external data sources are added, create a new subdirectory:

```
src/adapter/
├── 5etools/
└── future-source/
```

Each adapter follows the same rules.

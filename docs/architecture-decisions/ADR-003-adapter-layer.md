# ADR-003: Adapter Layer

## Status

Accepted

## Context

Dungeon Archive consumes D&D 5e data from 5etools. The internal data model must be decoupled from 5etools' data structure to:

1. Prevent external data structure changes from breaking the application
2. Keep the application layer clean of external dependencies
3. Give the build pipeline a stable target

## Decision

The adapter layer is a first-class architectural concept at `src/adapter/`. It is the **only** place that owns the types of external sources.

**Rules:**
1. The adapter is the only place allowed to know how external sources are shaped
2. Everything else communicates only with Dungeon Archive models
3. External types never leak past the adapter boundary
4. The adapter exposes the external-source types (`5etools-raw-types.ts`); application code that needs them imports them from the adapter, never from 5etools sources

**Structure (actual):**
```
src/adapter/
├── 5etools-raw-types.ts   # Types mirroring the 5etools JSON shape
├── 5etools/               # Empty placeholder directory
└── README.md              # Adapter contract
```

**Related:** the build-time transforms under `scripts/compendium/` also read 5etools data, but they run at build time and emit `src/generated/compendium/`. The runtime never touches 5etools data; only the adapter's types describe it.

## Consequences

**Positive:**
- Application code is decoupled from 5etools
- External data structure changes only affect the adapter
- Clear architectural boundary

**Negative:**
- Extra layer of indirection
- Requires maintaining adapter types
- Build-time processing adds complexity

**Mitigation:**
- Adapter is simple type mapping, not business logic
- Runtime never parses 5etools; only generated JSON
- Build-time processing is a one-time setup cost

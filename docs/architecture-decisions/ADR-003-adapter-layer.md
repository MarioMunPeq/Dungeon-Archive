# ADR-003: Adapter Layer

## Status

Accepted

## Context

Dungeon Archive consumes D&D 5e data from 5etools. The internal data model must be decoupled from 5etools' data structure to:

1. Prevent external data structure changes from breaking the application
2. Allow multiple data sources in the future
3. Keep the application layer clean of external dependencies

## Decision

The adapter layer is a first-class architectural concept at `src/adapter/`. It is NOT a service.

**Rules:**
1. The adapter is the only place allowed to know how external sources work
2. Everything else communicates only with Dungeon Archive models
3. External data never leaks past the adapter boundary
4. The adapter exports only Dungeon Archive types, never external types

**Structure:**
```
src/adapter/
├── 5etools/
└── future-source/
```

## Consequences

**Positive:**
- Application code is decoupled from 5etools
- External data structure changes only affect the adapter
- Multiple data sources can be supported
- Clear architectural boundary

**Negative:**
- Extra layer of indirection
- Requires maintaining adapter types
- Build-time processing adds complexity

**Mitigation:**
- Adapter is simple translation code
- Types are generated from the data model
- Build-time processing is a one-time setup cost

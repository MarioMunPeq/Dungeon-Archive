# Folder Structure

This document describes the **actual** layout of the repository. Keep it in sync with the code.

---

## Project Root

```
dungeon-archive/
├── public/                  # Static assets
├── src/                     # Application source code
├── scripts/compendium/      # Build-time Compendium generation
├── external/5etools/        # Read-only external data source
├── docs/                    # Documentation
├── index.html               # Entry HTML
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # Base TypeScript config
├── tsconfig.app.json        # App typecheck config
├── tsconfig.scripts.json    # Scripts typecheck config
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
└── pnpm-lock.yaml           # Lock file
```

---

## Source Code Structure

```
src/
├── main.tsx                 # Entry point: loadCompendium → hydrate → render <App/>
├── index.css                # Global styles + Tailwind v4 design tokens (@theme)
│
├── app/                     # Application shell
│   ├── index.tsx            # Router provider, query client provider, layout
│   ├── router.tsx           # All routes (tabs, categories, entities, debug)
│   └── app-layout.tsx       # TopBar + main + BottomNav (max-w-xl)
│
├── features/                # Pages by product area
│   ├── home/                # home-page.tsx — landing (categories, favorites, recents, session, adventure, party)
│   ├── search/              # search-page.tsx + components/ (input, results, filter, empty states)
│   ├── adventure/           # adventure-page.tsx — campaign container (metadata, objectives, notes, references)
│   ├── party/               # party-page.tsx — player reference sheets
│   ├── session/             # session-page.tsx — pinned entities + history + clear
│   ├── compendium/          # Category + entity pages, renderers
│   │   ├── pages/           #   category-page.tsx, entity-page.tsx
│   │   ├── components/      #   entity-list, filter-bar, related-entities
│   │   └── renderers/       #   per-category content renderers (spell, monster, ...)
│   ├── debug/               # debug-content-page.tsx, debug-spell-page.tsx (dev)
│   └── not-found-page.tsx   # 404 route
│
├── compendium/              # Read-only Compendium API (in-memory)
│   ├── loader.ts            # Loads generated JSON into memory
│   ├── repository.ts        # Map-based lookups
│   ├── search.ts            # Synchronous scoring search
│   ├── index.ts             # Public API (loadCompendium, search, getEntity, ...)
│   ├── category-registry.ts # 7 category registry
│   ├── category-display.ts  # Category display metadata
│   ├── source.ts            # Source/edition info
│   ├── reference.ts         # Entity reference helpers
│   ├── relationships.ts     # Cross-entity relationships
│   ├── slug.ts              # Canonical id <-> slug
│   ├── types.ts             # Compendium domain types
│   └── README.md            # Compendium module docs
│
├── user-state/              # Persisted user state (Zustand + localStorage)
│   ├── store.ts             # Zustand store + actions
│   ├── types.ts             # UserState, PlayerReference, Adventure, ...
│   ├── persistence.ts       # localStorage read/write + versioning
│   ├── migrations.ts        # Versioned forward migrations (current: v7)
│   ├── normalize.ts         # Normalize persisted data on load
│   └── index.ts             # Public API (useUserState, selectors)
│
├── components/              # Shared UI
│   ├── layout/              #   bottom-nav.tsx, top-bar.tsx, nav-icons.tsx
│   ├── entity/              #   entity-card, entity-header, metadata-grid, reference rows
│   ├── content/             #   content-renderer + blocks/ (paragraph, list, table, dice, ...)
│   └── ui/                  #   Button-like atoms: FavoriteButton, SessionButton,
│                            #   AdventureButton, ReferencePicker, Inline editors, Badge, ...
│
├── adapter/                 # External-source types boundary
│   ├── 5etools-raw-types.ts # Types mirroring 5etools JSON shape
│   ├── index.ts             # Re-export of application-facing types
│   └── README.md            # Adapter contract
│
├── generated/compendium/    # Generated data (do not edit by hand)
│   ├── spells.json
│   ├── monsters.json
│   ├── equipment.json
│   ├── conditions.json
│   ├── actions.json
│   ├── magic-items.json
│   ├── feats.json
│   ├── search-index.json
│   ├── related-index.json
│   └── manifest.json
│
├── types/                   # Domain type definitions
│   ├── compendium.ts
│   ├── content-block.ts     # Renderable content blocks
│   ├── relationships.ts
│   └── index.ts
│
├── config/                  # App-wide constants
│   ├── constants.ts         # ROUTES, APP_NAME, category keys
│   └── tokens.ts            # Design tokens (spacing, etc.)
│
├── lib/                     # Utilities (utils.ts)
├── hooks/                   # Custom hooks (reserved)
├── shared/                  # Shared primitives (README.md)
└── assets/                  # Static assets
```

---

## Generated Data

`src/generated/compendium/` contains the output of the build-time pipeline:

- One JSON file per category (spells, monsters, equipment, conditions, actions, magic-items, feats).
- `search-index.json` — prebuilt search index.
- `related-index.json` — prebuilt cross-entity relationships.
- `manifest.json` — build metadata and source versions.

**Never edit these files by hand.** They are regenerated by `pnpm build:compendium`.

---

## Scripts Structure

```
scripts/compendium/
├── allowed-sources/         # Permitted 5etools sources
├── build/                   # Build orchestration
├── entries/                 # Per-category entry generation
├── generate-index/          # Search index generation
├── generate-related-index/  # Relationship index generation
├── categories/              # Per-category transforms + validation
│   ├── action/              # (also condition, equipment, feat, magic-item, monster, spell)
├── id/                      # Canonical id generation
├── identity/                # Identity / version dedup
└── ...                      # shared helpers
```

---

## External Dependencies

```
external/
└── 5etools/                 # Read-only D&D 5e data source
```

**Important:** Never modify files in `external/`. This directory is read-only and is only consumed at build time.

---

## Documentation

```
docs/
├── architecture.md          # Technical architecture
├── product-philosophy.md    # Product vision and principles
├── navigation.md            # Navigation model
├── roadmap.md               # Priorities
├── anti-features.md         # Explicit non-goals
├── folder-structure.md      # This document
├── glossary.md              # Shared vocabulary
├── success-metrics.md       # Product KPIs
├── user-questions.md        # What the app answers
├── mobile-first.md          # Mobile design principles
├── search-architecture.md   # Search system
├── compendium-architecture.md # Compendium system
├── engineering-contract.md  # Engineering commitments
├── coding-guidelines.md     # Code standards
├── design-principles.md     # Design principles
├── architecture-review-iteration3.md # Phase 20 architecture review report
└── architecture-decisions/  # ADRs (README + ADR-001..005)
```

---

## Import Boundaries

Dependencies flow one direction only:

```
external/5etools/
  → scripts/compendium/
    → src/generated/compendium/
      → src/compendium/
        → src/adapter/
          → src/  (features, components)
```

- Features import from `src/compendium/` (public API) and `src/user-state/`.
- Only `src/compendium/loader.ts` touches `src/generated/`.
- Only `src/adapter/` references 5etools types; everything else goes through the adapter.

---

## Naming Conventions

- **Feature pages:** kebab-case (`home-page.tsx`, `adventure-page.tsx`).
- **Feature dirs:** kebab-case (`compendium/`, `user-state/`).
- **UI components:** PascalCase files (`FavoriteButton.tsx`, `Badge.tsx`) except legacy kebab-case atoms (they are migrated as touched).
- **Module internal files:** kebab-case (`category-registry.ts`).
- **Domain types:** PascalCase (`UserState`, `PlayerReference`).

When in doubt, follow the conventions of the nearest existing file.

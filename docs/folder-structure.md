# Folder Structure

This document describes the **actual** layout of the repository. Keep it in sync with the code.

---

## Project Root

```
dungeon-archive/
├── public/                  # Static assets (favicon, PWA manifest, service worker)
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
├── pnpm-lock.yaml           # Lock file
├── LICENSE                  # MIT license
└── README.md                # Product landing page
```

---

## Source Code Structure

```
src/
├── main.tsx                 # Entry point: loadCompendium → hydrate → render <App/>
├── index.css                # Global styles + Tailwind v4 design tokens (@theme)
│
├── app/                     # Application shell
│   ├── index.tsx            # App providers (Snackbar, Auth, Router) + layout + ErrorBoundary
│   ├── router.tsx           # All routes (tabs, categories, entities, session, backup, debug)
│   ├── boot-screen.tsx      # Loading screen while the Compendium loads
│   └── layouts/
│       ├── app-layout.tsx   # TopBar + main + BottomNav (max-w-screen-xl)
│       └── use-scroll-restoration.ts
│
├── features/                # Pages by product area
│   ├── home/                # home-page.tsx, section-header.tsx — character, session, recents, rules
│   ├── search/              # search-page.tsx + components/ (input, results, highlight, empty state)
│   ├── session/             # session-page.tsx — pinned entities + history + clear
│   ├── rules/               # rules-page.tsx — quick rules reference
│   ├── combat/              # combat-page.tsx — combat tracker
│   ├── party/               # party-page.tsx — player reference sheets
│   ├── onboarding/          # onboarding.tsx — first-run walkthrough (4 steps)
│   ├── backup/              # backup-page.tsx — Cloud Backup (Firebase)
│   ├── auth/                # auth-provider.tsx, auth-context.ts — Firebase auth session
│   ├── compendium/          # Category + entity pages and renderers
│   │   ├── category-page.tsx, entity-page.tsx
│   │   ├── entity-list.tsx, filter-bar.tsx, related-entities.tsx
│   │   └── renderers/       # per-category content renderers (spell, monster, ...)
│   ├── debug/               # debug-content-page.tsx, debug-spell-page.tsx (dev only)
│   └── not-found-page.tsx   # 404 route
│
├── compendium/              # Read-only Compendium API (in-memory)
│   ├── loader.ts            # Loads generated JSON into memory
│   ├── repository.ts        # Map-based lookups
│   ├── search.ts            # Synchronous scoring search
│   ├── index.ts             # Public API (loadCompendium, search, getEntity, ...)
│   ├── category-registry.ts # 7-category registry with filters + card stats
│   ├── category-display.ts  # Category display metadata (labels, order, icons)
│   ├── source.ts            # Source/edition info
│   ├── reference.ts         # Entity reference helpers
│   ├── relationships.ts     # Cross-entity relationships
│   ├── slug.ts              # Canonical id <-> slug
│   ├── types.ts             # Compendium domain types
│   └── README.md            # Compendium module docs
│
├── user-state/              # Persisted user state (Zustand + localStorage)
│   ├── store.ts             # Zustand store + actions
│   ├── types.ts             # UserState, PlayerReference, Session, ...
│   ├── persistence.ts       # localStorage read/write + versioning
│   ├── migrations.ts        # Versioned forward migrations
│   ├── normalize.ts         # Normalize persisted data on load
│   ├── serialization.ts     # Cloud backup serialization
│   └── index.ts             # Public API (useUserState, selectors)
│
├── components/              # Shared UI
│   ├── layout/              #   bottom-nav.tsx, top-bar.tsx, top-bar-route.ts,
│   │                        #   nav-icons.tsx, cloud-status-icon.tsx
│   ├── search/              #   search-input.tsx (focused search field)
│   ├── entity/              #   entity-card, entity-header, metadata-grid, reference rows
│   ├── content/             #   content-renderer.tsx + blocks/ (paragraph, list, table, dice, ...)
│   └── ui/                  #   FavoriteButton, SessionButton, ReferencePicker, Badge, ...
│
├── adapter/                 # External-source types boundary
│   ├── 5etools-raw-types.ts # Types mirroring 5etools JSON shape
│   ├── 5etools/             # (empty placeholder directory)
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
│   ├── compendium.ts        # Entity types (Spell, Monster, ...)
│   ├── content-block.ts     # Renderable content blocks
│   ├── relationships.ts
│   └── index.ts
│
├── config/                  # App-wide constants
│   └── constants.ts         # ROUTES, APP_NAME, category keys, storage keys
│
├── sync/                    # Cloud sync adapter layer
│   ├── gateway.ts           # Gateway selection (real or disabled)
│   ├── disabled-gateway.ts  # No-op gateway when Firebase is not configured
│   ├── fake-gateway.ts      # In-memory gateway used by tests
│   ├── service.ts           # Cloud snapshot save/load logic
│   ├── firebase.ts          # Firebase gateway implementation
│   ├── errors.ts            # Friendly error mapping
│   ├── status.ts            # Cloud status helpers
│   ├── types.ts             # CloudGateway, CloudStatus types
│   └── index.ts             # Public API (useCloudStatus, ...)
│
├── lib/                     # Utilities
│   ├── utils.ts             # General helpers
│   └── firebase/            #   config.ts, auth.ts, auth-service.ts, firestore.ts
│
├── hooks/                   # Custom hooks
│   └── use-debounced-value.ts
│
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
├── build.ts                 # Build orchestration
├── entries.ts               # Per-category entry generation
├── generate-index.ts        # Search index generation
├── generate-related-index.ts# Relationship index generation
├── id.ts                    # Canonical id generation
├── identity.ts              # Identity / version dedup
├── allowed-sources.ts       # Permitted 5etools sources
├── normalizer/              # Text normalization (tags, whitespace)
└── categories/              # Per-category transforms + validation
    ├── action/              # (also condition, equipment, feat, magic-item, monster, spell)
    ├── ...
    └── each has transform.ts + validate.ts
```

---

## External Dependencies

```
external/
└── 5etools/                 # Read-only D&D 5e data source
```

**Important:** Never modify files in `external/`. This directory is read-only and is only consumed at build time. It is gitignored and fetched during setup.

---

## Documentation

```
docs/
├── README.md                # Docs index
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
├── cloud-backup.md          # Cloud Backup feature (Firebase)
├── screenshots/             # Product screenshots (used by README)
├── architecture-decisions/  # ADRs (README + ADR-001..005)
└── history/                 # Archived historical reports
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
- Cloud code (`src/sync/`, `src/lib/firebase/`, `src/features/auth/`, `src/features/backup/`) is isolated behind the gateway interface so the app works without Firebase.

---

## Naming Conventions

- **Feature pages:** kebab-case (`home-page.tsx`, `combat-page.tsx`).
- **Feature dirs:** kebab-case (`compendium/`, `user-state/`).
- **UI components:** PascalCase files (`FavoriteButton.tsx`, `Badge.tsx`) except legacy kebab-case atoms (they are migrated as touched).
- **Module internal files:** kebab-case (`category-registry.ts`).
- **Domain types:** PascalCase (`UserState`, `PlayerReference`).

When in doubt, follow the conventions of the nearest existing file.

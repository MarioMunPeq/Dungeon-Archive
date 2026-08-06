# Technical Architecture

## Overview

Dungeon Archive is a **client-side SPA** with **offline-first** architecture. All core data lives on-device. There is no backend server for the core product; Cloud Backup is an optional, user-initiated Firebase feature for moving state between devices.

The architecture follows a strict rule: **the Compendium is read-only official content, and user data is lightweight state that references it.** Official content and user data never mix.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | React 19 | Component framework |
| **Language** | TypeScript (strict) | Type safety |
| **Bundler** | Vite | Build tooling |
| **Styling** | Tailwind CSS (v4, design tokens) | Utility-first CSS |
| **State** | Zustand | Client state management |
| **Persistence** | localStorage (versioned, migrated) | User state storage |
| **Routing** | React Router | SPA routing |
| **Offline** | PWA (service worker) | Installability and asset caching |
| **Data Source** | 5etools | D&D 5e compendium data (build-time only) |
| **Cloud (optional)** | Firebase Auth + Firestore | Cloud Backup (user-initiated save/restore only) |
| **Desktop** | Development only | Not a product platform |

Notes:

- **No database layer.** The Compendium lives in memory as read-only Maps. User state lives in `localStorage`.
- **Cloud Backup is optional and isolated.** Without Firebase configuration the app builds and runs fully offline; a disabled gateway stands in for the cloud feature.
- Every technology has a concrete responsibility. No dependencies exist for trend reasons.

---

## System Architecture

```
┌──────────────────────────────────────────────┐
│                  Client (Browser)             │
├──────────────────────────────────────────────┤
│  React Components                            │
│  ├── Features (pages per area)               │
│  ├── Shared UI components                    │
│  └── Entity components (detail, cards)       │
├──────────────────────────────────────────────┤
│  Compendium API (read-only)                  │
│  ├── In-memory repository (Map lookups)      │
│  └── Search (synchronous, in-memory)         │
├──────────────────────────────────────────────┤
│  User State (Zustand + localStorage)         │
│  ├── Favorites / recents / searches          │
│  ├── Session list + history                  │
│  ├── Party reference sheets + active player  │
│  └── Combat values (HP, beginner mode)       │
├──────────────────────────────────────────────┤
│  Static JSON (generated compendium)          │
│  └── src/generated/compendium/               │
└──────────────────────────────────────────────┘
                        │  build-time only
                        ▼
              external/5etools/ (read-only)
```

---

## Core Systems

### 1. Compendium System

**Read-only reference data from D&D 5e.**

- **Seven categories:** Spells, Conditions, Actions, Equipment, Monsters, Magic Items, Feats.
- **Immutable** — User content never mixes with official data.
- **Pre-built** — Generated from 5etools at build time into static JSON.
- **In-memory** — Loaded once at startup; all access is synchronous Map lookups.

**Pipeline:**
```
external/5etools/ (read-only)
    ↓
scripts/compendium/ (build-time transforms + validation)
    ↓
src/generated/compendium/ (static JSON, shipped)
    ↓
src/compendium/ (API: loadCompendium, search, getEntity, resolveEntity, ...)
    ↓
Application code (via public API only)
```

**See:** [compendium-architecture.md](./compendium-architecture.md)

### 2. Search System

**Search is the primary interface.**

- **Global scope** — Spans the entire Compendium.
- **Synchronous** — Computed against the in-memory index, no round-trips.
- **Instant** — 200ms debounce, results appear as the user types; latency target < 150ms.
- **Scored** — Exact = 100, starts-with = 80, includes = 60; sorted by score then name.
- **Offline** — Works without internet by construction.

**See:** [search-architecture.md](./search-architecture.md)

### 3. User State System

**Lightweight context, persisted on-device.**

- **Favorites** — Pinned Compendium entities.
- **Recents** — Recently viewed entities and recent searches.
- **Party** — Player reference sheets: identity, ability scores and modifiers, quick combat values (AC, initiative, passive perception, spell DC/attack), hit points, known spells, weapons, magic items (as entity references), one quick note. One player can be set active.
- **Session** — Pinned entities for the current encounter, session history.
- **Combat** — The active player's hit points and a lightweight combat tracker; a Beginner Mode toggle that hides non-essential detail.
- **Onboarding** — First-run walkthrough flag.

**Persistence:**

- Stored in `localStorage` under a single key (`dungeon:userState:v1`).
- The persisted shape has a **version**. On load, migrations run forward until the shape matches the current version (v11).
- Notable migrations: v6 removed the legacy `scenes` field; v7 replaced `PartyMember`/`party` with `PlayerReference`/`players`; v10 added ability scores, hit points, and `beginnerMode`. Every migration is a pure function; persisted data is always normalized on load.
- The persisted shape still carries legacy adventure fields (`adventures`, `activeAdventureId`) for migration safety. They have **no UI** and are not a feature.

### 4. Offline System

- **Compendium data** — Shipped with the app; no network needed.
- **User state** — `localStorage`; no network needed.
- **Search** — In-memory; no network needed.
- **PWA** — Service worker caches app assets; the app is installable.
- **No runtime network requests** for any core feature.

---

## State Management

### Zustand Store

Holds all user state and exposes typed actions:

- `toggleFavorite`, `addRecentEntity`, `addRecentSearch`, `clearRecentSearches`, `clearRecentEntities`
- `addPlayerReference`, `updatePlayerReference`, `removePlayerReference`, `setActivePlayer`
- `toggleSession`, `clearSession`
- `setBeginnerMode`, `completeOnboarding`
- `_replace`, `_reset` (persistence/internal)

Mutations are centralized; components never write to `localStorage` directly.

### Compendium Module

Stateless, read-only, module-level maps populated by `loadCompendium()`. Application code accesses it only through the public API in `src/compendium/`.

---

## Data Flow

```
User Action
    ↓
React Component (feature page)
    ↓
Compendium API  or  Zustand action
    ↓
In-memory Maps  or  localStorage (persisted state)
    ↓
Re-render
```

There is no async data layer. Rendering reads directly from the in-memory Compendium and the Zustand store.

---

## Build System

### Development
- Vite dev server with HMR
- TypeScript type checking (`pnpm typecheck`)
- ESLint + Prettier (`pnpm lint`, `pnpm format`)

### Production
- `pnpm build` (runs `build:compendium` then Vite build)
- Bundle splitting and asset optimization (Vite)
- PWA asset generation (vite-plugin-pwa)
- Static JSON generation (`scripts/compendium/`)

### Build-Time Compendium Processing
```
scripts/compendium/
    ├── allowed-sources        # Which 5etools sources are permitted
    ├── build                  # Build orchestration
    ├── entries                # Per-category entry generation
    ├── generate-index         # Search index generation
    ├── generate-related-index # Cross-reference generation
    ├── categories/            # Per-category transforms + validation
    │   ├── action, condition, equipment, feat,
    │   └── magic-item, monster, spell
    ├── id                     # Canonical id generation
    ├── identity               # Deduplication / version identity
    └── ...                    # shared utilities
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

- **`src/adapter/`** owns the types of external sources (`5etools-raw-types.ts`). App code imports those raw types directly from the adapter; no application layer depends on 5etools sources outside it.
- No layer may reach into a layer two or more steps above it.

---

## Performance Targets

| Metric | Target |
|--------|--------|
| **First Contentful Paint** | < 1.5s |
| **Search Response** | < 150ms |
| **Compendium entry open** | < 100ms |
| **Time to Interactive** | < 3s |
| **Offline Ready** | Core features always available |

---

## Security & Privacy

- **No authentication required** — Local-only by default; sign-in exists solely for optional Cloud Backup.
- **No network requests** — Core features are offline-only; Cloud Backup uploads/restores only on explicit user action.
- **No secrets** — Firebase config is runtime env config; no API keys are committed for private services.
- **Read-only compendium** — No modification of official data.
- **User data on-device** — State stays on the device unless the user explicitly uploads a Cloud Backup.

---

## Related Documents

- [compendium-architecture.md](./compendium-architecture.md)
- [search-architecture.md](./search-architecture.md)
- [folder-structure.md](./folder-structure.md)
- [engineering-contract.md](./engineering-contract.md)
- [architecture-decisions/](./architecture-decisions/README.md)

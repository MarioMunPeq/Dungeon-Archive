# Dungeon Archive

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/PWA-installable-3AB492?style=flat-square&logo=pwa&logoColor=white" alt="PWA installable" />
</p>

A fast, mobile-first, offline-first companion for D&D 5e sessions. It puts the entire game reference — spells, monsters, equipment, conditions, actions, magic items, and feats — on the phone that is already on the table, and keeps the lightweight context of the game (your party, your current session, combat state) a tap away.

Its only purpose is reducing the dead time at the table: the gap between a question coming up and its answer being found. Everything in the app is built around closing that gap.

> **Try it live:** [Dungeon Archive](https://MarioMunPeq.github.io/Dungeon-Archive/) — installable PWA, works fully offline, no account needed. Hit **View Demo** on the Home screen to see the app pre-populated with a realistic character.

> **Version 0.1.0**

---

## Screenshots

_Images live in [`docs/screenshots/`](docs/screenshots/) and are linked below. (Placeholders until capture — the Home, Combat, Party, and Theme Picker screens are the most portfolio-relevant.)_

| Screen | File |
| ------ | ---- |
| Home | [`docs/screenshots/home.png`](docs/screenshots/home.png) |
| Theme picker (7 accent themes) | [`docs/screenshots/theme-picker.png`](docs/screenshots/theme-picker.png) |
| Search | [`docs/screenshots/search.png`](docs/screenshots/search.png) |
| Compendium (entity list) | [`docs/screenshots/compendium.png`](docs/screenshots/compendium.png) |
| Entity detail | [`docs/screenshots/entity-detail.png`](docs/screenshots/entity-detail.png) |
| Party | [`docs/screenshots/party.png`](docs/screenshots/party.png) |
| Combat | [`docs/screenshots/combat.png`](docs/screenshots/combat.png) |
| Session | [`docs/screenshots/session.png`](docs/screenshots/session.png) |
| Quick Rules | [`docs/screenshots/rules.png`](docs/screenshots/rules.png) |
| Cloud Backup | [`docs/screenshots/backup.png`](docs/screenshots/backup.png) |

---

## Key features

| Feature | What it does |
| ------- | ------------ |
| **Instant Search** | One search across the whole Compendium. As-you-type results from a prebuilt in-memory index; no network, no server. |
| **Offline Compendium** | The complete SRD reference for D&D 5e — spells, monsters, equipment, conditions, actions, magic items, and feats — compiled into the app at build time and available offline. |
| **Entity Relationships** | Entities link to each other. A spell shows its related conditions and spells; a monster shows the spells and equipment it references. |
| **Party Manager** | Lightweight player reference sheets: name, class, level, subclass, ability scores, AC / passive perception / spell DC, and references to known spells, weapons, and magic items. References point into the Compendium — nothing is duplicated. |
| **Combat tracker** | Per-character hit points with quick damage/heal deltas, a tap-to-toggle condition tray (13 conditions), a "what can I do on my turn" checklist, and the combat stats you consult most. |
| **Dice Roller** | Roll any die (d4–d100) any number of times, with an optional modifier. Spell damage rolls inline on tap from the Character sheet and Compendium. |
| **Session pins** | Pin monsters, spells, and items to the current session with one tap, and clear them all with **End Session**. |
| **Favorites & recents** | Mark entities as favorites and let the app remember what you recently viewed and searched. |
| **Beginner Mode** | New to the game? Toggle beginner tips that explain the d20, ability checks, and your turn in combat as you go. |
| **Quick Rules** | A built-in reference for the d20, ability checks, saving throws, combat turns, attacks & damage, hit points & resting, and spellcasting — plus a plain-language glossary. |
| **Cloud Backup (optional)** | Optional Google Sign-In with manual upload/restore of your local data to Firestore. Everything else works with zero internet. |
| **Progressive Web App** | Installable, with offline caching via a service worker. |

---

## Why offline-first?

During a session, information lives in books, PDFs, and spreadsheets. Finding something takes seconds or minutes, and while someone looks, the table waits.

A companion app that needs a connection creates a new kind of wait. It also fails at the moment it is needed most — at a table without reliable internet.

So Dungeon Archive is offline-first by design:

- The entire Compendium is shipped inside the app. Lookup never waits on the network.
- All user data lives in `localStorage` on the device. There is no database, no account, and no login required.
- Cloud Backup is an optional, manual addition for people who want a recovery copy. It is never a dependency.

The app is consulted, then set aside. It should never be the reason a session slows down.

---

## Design process

The interface follows a documented design system — [`docs/design-dna.md`](docs/design-dna.md) — that treats the app's look and feel as explicit rules rather than a style that "just happened." Everything from the 4px spacing grid to the single motion language is specified, so every screen reads as one product.

A few examples of how the system evolved:

- **Palette exploration.** The accent color went through several identities before landing on a themeable system: seven accent themes (Jade, Amber, Arcane Teal, Gold Sovereign, Wine Grimoire, Void Plum, Storm Steel) that swap via a signature ~600ms "wave" reveal, while the warm near-black background, surfaces, typography, and motion stay fixed. The rules forbid using the accent decoratively — it is reserved for interactive elements.
- **Consistency passes.** Dedicated passes swept the app for drift: radius tiers (stat/card/control), the spacing grid, icon treatments, metadata typography, and empty-state guidance. Each pass is documented under [`docs/history/`](docs/history/), including the root-cause write-ups.
- **Motion system.** One shared set of durations and easings (primary interactions ~200ms, screen transitions ~250ms) keeps every animation on the same rhythm, with exactly one signature exception.
- **Accessibility as a rule.** Text tiers are pinned to WCAG AA contrast on every surface, focus states are visible on all interactive elements, icon-only buttons carry labels, and dialogs trap focus and restore it on close.

The rules are the point: they make a small screen feel coherent and give the app a personality a generic template never would.

---

## Architecture

Dungeon Archive is a single-page client application with three layers:

### 1. The Compendium (read-only reference data)

Official D&D 5e data is pulled from the [5etools](https://github.com/5etools-mirror-1/5etools-mirror-1.github.io) dataset, transformed and validated at **build time**, and emitted as static JSON under `src/generated/compendium/`.

- **7 categories:** spells, monsters, equipment, conditions, actions, magic items, feats.
- Each entity has a stable **canonical ID** (e.g. `spell.fireball`).
- A **related-entities index** links entities to each other at build time.
- The generated data is the single source of truth. User data stores **references** to it, never copies.

### 2. The user state (tiny, versioned, local)

Everything the user creates lives in a single versioned document persisted in `localStorage`:

- favorites, recently viewed entities, recent searches
- the current session's pinned entities
- player reference sheets (party) and the active player
- beginner mode and onboarding flags

State is versioned with forward migrations, so saved data survives app updates. This is what Cloud Backup uploads and restores.

### 3. The app (React views)

A set of feature pages built on the design system, orchestrated by React Router. The route table:

| Path | Screen |
| ---- | ------ |
| `/` | Home — current character, session pins, recently viewed, learn-the-basics |
| `/search` | Search across the entire Compendium |
| `/rules` | Quick Rules, How to Play, and glossary (Beginner Mode toggle) |
| `/combat` | Combat tracker for the active player (links to the Dice Roller) |
| `/dice` | Dice Roller — roll any die, any number of dice, with an optional modifier |
| `/party` | Player reference sheets |
| `/session` | The pinned session list (End Session) |
| `/backup` | Cloud Backup (shows a "not available" state when the feature is disabled) |
| `/:category/:canonicalId` | Entity detail pages (e.g. `/spell/fireball`) |
| `/debug/*` | Dev-only debugging routes (never shipped) |

The shell is a top bar, a scrollable main area, and a bottom navigation bar with five tabs: **Home, Search, Rules, Combat, Character**. A first-run onboarding overlay introduces the app once.

---

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Language | TypeScript (strict) |
| Framework | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS v4 with design tokens (`@theme`) |
| Routing | React Router |
| State | Zustand (persisted, versioned user state) |
| PWA | `vite-plugin-pwa` (service worker + manifest) |
| Icons/fonts | Inline SVG icons; Inter Variable and JetBrains Mono Variable |
| Backend (optional) | Firebase Authentication + Firestore for Cloud Backup only |
| Hosting | GitHub Pages |

---

## Project structure

```
Dungeon Archive/
├── src/
│   ├── adapter/           # Boundaries around external data shapes (5etools types)
│   ├── app/               # App shell: index, router, layouts, scroll restoration
│   ├── compendium/        # Compendium public API, search index, entity registry
│   ├── components/        # Design-system primitives (ui/, layout/, entity/)
│   ├── config/            # App constants (name, version)
│   ├── features/          # Feature pages and components
│   │   ├── auth/          #   Firebase auth provider
│   │   ├── backup/        #   Cloud Backup page
│   │   ├── combat/        #   Combat tracker
│   │   ├── compendium/    #   Entity list + detail pages
│   │   ├── debug/         #   Dev-only routes
│   │   ├── home/          #   Landing screen
│   │   ├── onboarding/    #   First-run overlay
│   │   ├── party/         #   Player reference sheets
│   │   ├── rules/         #   Quick Rules
│   │   ├── search/        #   Global search
│   │   └── session/       #   Session pins
│   ├── generated/         # Build-time generated data (compendium JSON, related index)
│   ├── hooks/             # Shared hooks
│   ├── lib/               # Utilities, Firebase wiring
│   ├── sync/              # Cloud Backup gateway, status, errors
│   ├── types/             # Cross-cutting types (relationships, etc.)
│   └── user-state/        # Persisted user state, migrations, serialization
├── docs/                  # Project documentation (see below)
├── scripts/               # Build-time data processing (5etools → generated JSON)
├── .env.example           # Environment variable template
└── index.html
```

The `scripts/` pipeline is the only thing that reads 5etools data. The runtime never touches it.

---

## How data flows

```
5etools dataset
      │  scripts/ (build time: validate, transform, index)
      ▼
src/generated/compendium/  ──►  loaded once at startup (loadCompendium)
      │
      ▼
src/compendium/  ──►  search / getEntity / resolveEntity / getRelatedEntities
      │
      ▼
Feature pages  ──►  render entity content  ──►  user actions
                                                   │
                              reference only       ▼
                              (canonical IDs)  src/user-state/ (localStorage)
                                                   │
                                                   ▼ (optional, manual)
                                          Cloud Backup (Firestore)
```

- The Compendium is loaded once before first paint (a brief boot screen) and then queried synchronously in memory.
- Entity detail pages render from the generated JSON; nothing is fetched at runtime.
- User state stores canonical IDs and lightweight values only. When the Compendium changes, references keep working.
- On startup, persisted state is rehydrated, normalized, and migrated to the current version.

---

## Development

Requirements: **Node.js** and **pnpm**.

```sh
pnpm install
pnpm dev          # start the Vite dev server
```

### Scripts

| Script | Purpose |
| ------ | ------- |
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Type-check, build-time compendium processing, and production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | Type-check the app and scripts |
| `pnpm lint` | ESLint over the project |
| `pnpm test` | Run the test suite |
| `pnpm check` / `pnpm verify` | Aggregate checks used in CI |

Local development runs with no Firebase configuration by default. In development the Cloud Backup UI is exercised against a fake in-memory gateway; in a production build with no configuration the feature is disabled and hidden. Add a `.env` file (see `.env.example`) to enable it for real.

### Project conventions

The engineering rules that keep this codebase consistent live in [`docs/engineering-contract.md`](docs/engineering-contract.md). Highlights:

- The Compendium is the single source of truth; user data stores references, never copies.
- Only `src/compendium/` reads generated data; only `src/adapter/` knows external data shapes.
- Mobile is the primary platform; desktop is for development only.
- Search must be fast before it is polished.
- Every screen answers a real user question — see [`docs/user-questions.md`](docs/user-questions.md).

---

## Building and deploying

```sh
pnpm build          # produces dist/
```

Deployment is GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). The app is served from the repository's Pages URL with a base path of `/Dungeon-Archive/`. CI (`.github/workflows/ci.yml`) runs typecheck, lint, format check, and the production build on every push.

---

## Cloud Backup

Cloud Backup is **optional** and **manual**: sign in with Google, upload a snapshot of your local state to Firestore, and restore it later — for example after losing a device. It is a recovery copy, not a sync engine.

It is disabled by default. To enable it:

1. Create a Firebase project and enable Google Sign-In (see [`docs/cloud-backup.md`](docs/cloud-backup.md) for the full guide, including Firestore rules).
2. Set the `VITE_FIREBASE_*` environment variables (template in `.env.example`).
3. Rebuild. In a production build, the top-bar backup entry and the Backup page's sign-in appear only when Firebase is configured (development uses a fake gateway to exercise the UI).

### Disabling Cloud Backup

Build with the Firebase variables unset (or empty). In a production build the top-bar backup entry is hidden and the Backup page shows a "Cloud Backup is not available" message. The Firebase SDK sits behind a dynamic import that only loads when Firebase is configured — the app ships and runs with no cloud code executing.

---

## Future ideas

Not commitments — directions the project could grow, in order of current thinking:

- **Search across user data** — party members and session pins alongside Compendium results.
- **Session history** — a lightweight log of past sessions, reachable from the Session screen.
- **Favorites list** — a dedicated view of favorited entities.
- **Expanded Compendium content** — additional official sources and categories, still build-time and offline.
- **Rules deep links** — direct links from entity pages into the relevant Quick Rules sections.

---

## Documentation

| Document | What it covers |
| -------- | -------------- |
| [`docs/README.md`](docs/README.md) | Index of the documentation set |
| [`docs/product-philosophy.md`](docs/product-philosophy.md) | The product's north star and principles |
| [`docs/user-questions.md`](docs/user-questions.md) | The questions every screen answers |
| [`docs/anti-features.md`](docs/anti-features.md) | What the product deliberately is not |
| [`docs/architecture.md`](docs/architecture.md) | Architecture and data flow in depth |
| [`docs/compendium-architecture.md`](docs/compendium-architecture.md) | The Compendium pipeline and search index |
| [`docs/search-architecture.md`](docs/search-architecture.md) | Search behavior and design |
| [`docs/navigation.md`](docs/navigation.md) | Routes and navigation model |
| [`docs/design-principles.md`](docs/design-principles.md) | Design principles |
| [`docs/mobile-first.md`](docs/mobile-first.md) | Mobile-first UX rules |
| [`docs/folder-structure.md`](docs/folder-structure.md) | Repository layout in detail |
| [`docs/engineering-contract.md`](docs/engineering-contract.md) | Immutable engineering rules |
| [`docs/coding-guidelines.md`](docs/coding-guidelines.md) | Code style and conventions |
| [`docs/glossary.md`](docs/glossary.md) | Project terminology |
| [`docs/success-metrics.md`](docs/success-metrics.md) | Performance and UX targets |
| [`docs/roadmap.md`](docs/roadmap.md) | Current state and future direction |
| [`docs/cloud-backup.md`](docs/cloud-backup.md) | Firebase setup and security |
| [`docs/architecture-decisions/`](docs/architecture-decisions/) | Architecture Decision Records |
| [`docs/screenshots/`](docs/screenshots/) | Product screenshots |

---

## License

MIT — see [LICENSE](LICENSE).

# Glossary

## Purpose

Shared vocabulary for the Dungeon Archive project. Everyone — product, design, engineering — uses these terms consistently.

---

## Product Terms

### Dungeon Archive

The product itself. A mobile-first companion app for D&D 5e tabletop sessions. Reduces downtime by making reference information instantly searchable.

### Companion

What Dungeon Archive is. A tool that supports tabletop sessions without replacing them. It lives alongside physical play, not instead of it. Opened for a question, then set aside.

### Reference Tool

The category Dungeon Archive belongs to. It finds information and disappears. It is not a platform, a notebook, or a tracker.

### Anti-Feature

A product category that is explicitly excluded. See [anti-features.md](./anti-features.md). Anti-features are permanent exclusions, not future features.

### Dead Time

The time players spend waiting because someone is looking for information. The single problem Dungeon Archive exists to reduce.

---

## Game Terms

### Session

A single gathering where the group plays D&D. In the app, "Session" is the pinned list of entities for the current encounter — monsters, spells, items — cleared with a single End Session action. It is not a campaign planner and it is not a history log.

### Party

The group of player characters at the table. The app stores lightweight reference sheets for them, not full character sheets.

### Player Reference Sheet

The app's term for what other tools call a "character sheet": only the repeatedly-consulted information — name, class, level, subclass, ability scores, hit points, combat values (AC, initiative, passive perception, spell DC/attack), known spells, weapons, magic items (as Compendium references), active conditions, and one note. Never a full character sheet.

### Player Character (PC)

A character controlled by a player. Stored in the Party section as a reference sheet.

---

## Compendium Terms

### Compendium

The read-only reference database of official D&D 5e content. Generated from official data at build time, loaded into memory at startup, and never mixed with user data.

### Entity

Any item in the Compendium. Spells, conditions, actions, equipment, monsters, magic items, and feats.

### Category

The type of entity. Dungeon Archive has exactly seven: Spell, Condition, Action, Equipment, Monster, Magic Item, Feat.

### Official Content

D&D 5e rules, spells, monsters, equipment, and other content from official sources (PHB, DMG, XGtE, etc.). Stored in the Compendium.

### 5etools

The external data source for D&D 5e content. Lives in `external/5etools/` as an immutable read-only dependency. Never accessed directly at runtime — processed at build time.

### Build-Time Processing

The pipeline that converts 5etools data into optimized static JSON for the Compendium. Runs during application build, not at runtime. The runtime only ever reads the generated JSON.

### Source Version / Edition

The edition of the content (e.g., 2014 vs 2024) selectable on entity detail pages when both exist.

### Entity Reference

A pointer from user data to a Compendium entity, stored as a canonical identifier. User data never duplicates official content.

---

## Search Terms

### Search

The primary interface of Dungeon Archive. Users find information by asking, not by navigating.

### Global Search

Search that spans the entire Compendium. Accessible as a dedicated tab.

### Instant Results

Results appear as the user types (200ms debounce), computed synchronously against the in-memory Compendium. No round-trips.

### Relevance Score

A number assigned to each match. Exact match = 100, starts-with = 80, includes = 60. Results are sorted by score, then by name.

### Result Ranking

Ordering of results by relevance score, then alphabetically. Scoring is intentionally simple and deterministic.

### Category Filter

Narrows global search results to a single Compendium category.

### Recent Search

A previously used query, kept for quick re-use. Stored in user state.

---

## Data Terms

### User State

Everything the user creates: favorites, recently viewed entities, recent searches, the session's pinned entities, player references (party) and the active player, beginner mode, and the onboarding flag. Persisted in `localStorage`. Note: the persisted shape still carries legacy campaign data for migration safety; it has no UI.

### Cloud Backup

The optional, manual recovery feature. Signs in with Google and stores a snapshot of user state in Firestore. A recovery copy, not a sync engine. See [cloud-backup.md](./cloud-backup.md).

### User State Version

A numeric version of the persisted state shape. Incremented when the shape changes; migrations convert older versions forward.

### Migration

A function that transforms a persisted user state from an older version to the next one, applied automatically on load.

### localStorage

The browser's offline key-value storage. Dungeon Archive persists user state here.

### Static JSON

Pre-built Compendium data generated at build time and shipped with the app. Loaded into memory on startup.

### Offline-First

All core functionality works without internet. No server, no login, no network dependency. The PWA makes the app installable and caches assets.

### PWA (Progressive Web App)

The app ships as a service-worker-backed installable web app so it behaves like a native app on phones.

---

## Navigation Terms

### Tab Bar

The bottom navigation bar with 5 tabs: Home, Search, Rules, Combat, Party. Always visible, thumb-reachable.

### Home

The landing screen. Shows the current character (with a link to Combat), the session's pinned entities, recently viewed entities, and a link to the rules for newcomers.

### Search Tab

The tab dedicated to global search. The primary path to any entity.

### Rules Tab

Quick Rules for the game: the d20, ability checks, saving throws, combat turns, attacks & damage, hit points & resting, and spellcasting — plus How to Play and a glossary. Contains the Beginner Mode toggle.

### Combat Tab

The lightweight combat tracker for the active player: hit points with quick deltas, a condition tray, a turn checklist, and combat stats.

### Party Tab

The tab for the group's player reference sheets.

### Session Screen

The pinned-entities screen for the current encounter, with End Session.

### Screen

A full-page view in the application. Each screen answers one question.

### Entity Detail

The full view of any entity (spell, monster, equipment, etc.). Shows all information, related entities, and edition/source selection.

### Quick Action

A one-tap action on an entity detail: Favorite, or pin to the current Session.

### Route

A URL path (e.g., `/archive`, `/spell/fireball`). Routes exist for the tab screens, for every Compendium category and entity, and for Backup (when enabled).

---

## Technical Terms

### Mobile-First

Design and development prioritizes mobile devices. Desktop is for development only.

### One-Handed

The primary interaction model. All core features work with one thumb on a phone screen.

### Client-Side SPA

Single Page Application running entirely in the browser. No server backend.

### Adapter

The layer that owns the types of external sources (5etools). The app code imports types through `src/adapter/`; it never imports 5etools types directly.

### Compendium API

The read-only programmatic interface to the Compendium (`loadCompendium`, `search`, `getEntity`, `resolveEntity`, etc.). The only way application code accesses Compendium data.

### User State Store

The Zustand store that holds and mutates user state, with `localStorage` persistence.

---

## Usage Notes

- **"Session"** refers to the current encounter's pinned list. It is not a campaign planner.
- **"Search"** is always capitalized when referring to the feature. Lowercase for the action.
- **"Entity"** is the generic term for any Compendium item. Use specific terms (spell, condition, etc.) when possible.
- **"Compendium"** refers to official content only. User-created content is "User State".
- **"Reference Sheet"** is the correct term for party data. Never call it a character sheet.
- Avoid the term "character sheet", "inventory", "loot", "NPC roster", "campaign manager", and "worldbuilding" — these refer to anti-features, not features.

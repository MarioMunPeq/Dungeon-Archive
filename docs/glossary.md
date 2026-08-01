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

## Campaign Terms

### Campaign

The overall D&D story a group plays across many sessions. Dungeon Archive stores a lightweight container (adventure) for the current play context; it does not manage campaigns.

### Adventure

The active campaign container: title, description, objectives, private DM notes, and pinned entity references. One adventure is active at a time; previous ones can be archived and restored.

### Archive / Restore

The state of a finished adventure. Archived adventures are read-only and can be restored. Archiving is a single action, not a workflow.

### Session

A single gathering where the group plays D&D. In the app, "Session" refers to the pinned list of entities for the current encounter, plus session history.

### Party

The group of player characters in a campaign. The app stores lightweight reference sheets, not full character sheets.

### Player Reference Sheet

The app's replacement for "character sheet": only the repeatedly-consulted information — identity, level, class, subclass, race, passive senses, known spells, equipped armor/weapons/magic items (as Compendium references), and notes. Never a full character sheet.

### Player Character (PC)

A character controlled by a player. Stored in the Party section as a reference sheet.

### Objectives

Actionable goals of the active adventure. Stored as lightweight items with completion state.

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

Results appear as the user types (150ms debounce), computed synchronously against the in-memory Compendium. No round-trips.

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

Everything the user creates: favorites, recent entities, recent searches, the session list, adventures, the active adventure id, and player references. Persisted in `localStorage`.

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

The bottom navigation bar with 4 tabs: Home, Search, Adventure, Party. Always visible, thumb-reachable.

### Home

The landing screen. Shows the current adventure, party, continue-session, recents, favorites, and the Compendium category list.

### Search Tab

The tab dedicated to global search. The primary path to any entity.

### Adventure Tab

The tab for the active campaign container (metadata, objectives, notes, references).

### Party Tab

The tab for the group's player reference sheets.

### Screen

A full-page view in the application. Each screen answers one question.

### Entity Detail

The full view of any entity (spell, monster, equipment, etc.). Shows all information, related entities, and edition/source selection.

### Quick Action

A one-tap action on an entity detail: Favorite, Session (pin to the current encounter), or Adventure (pin as a reference).

### Route

A URL path (e.g., `/search`, `/spell/fireball`). Routes exist for the tab screens and for every Compendium category and entity.

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

- **"Adventure"** refers to the active campaign container. Use "archived adventure" for completed ones.
- **"Session"** refers to the current encounter's pinned list and session history. It is not a campaign planner.
- **"Search"** is always capitalized when referring to the feature. Lowercase for the action.
- **"Entity"** is the generic term for any Compendium item. Use specific terms (spell, condition, etc.) when possible.
- **"Compendium"** refers to official content only. User-created content is "User State".
- **"Reference Sheet"** is the correct term for party data. Never call it a character sheet.
- Avoid the term "character sheet", "inventory", "loot", "NPC roster", and "worldbuilding" — these refer to anti-features, not features.

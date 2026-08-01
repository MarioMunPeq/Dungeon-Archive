# Development Roadmap

## Overview

The roadmap reflects the current state of Dungeon Archive and the priorities that follow from the product philosophy. The guiding question for everything on this list:

> **Does this reduce the time players spend waiting because someone is looking for information?**

**Platform:** Mobile-first. Desktop exists for development only.

---

## Current State

What Dungeon Archive does today:

- **Compendium (7 categories)** — Spells, Conditions, Actions, Equipment, Monsters, Magic Items, and Feats, generated from official data at build time and available offline.
- **Search** — Instant, synchronous, substring-scored lookup across the entire Compendium, with a category filter and keyboard navigation.
- **Adventure** — A lightweight campaign container: title, description, objectives, private DM notes, and pinned entity references. One active adventure; previous ones can be archived and restored.
- **Party** — Lightweight player reference sheets: identity, level, passive senses, known spells, equipped armor/weapons/magic items (stored as Compendium references, never duplicated), and notes.
- **Session** — A pinned list of entities for the current encounter, with a clear/end action. Session history is kept for the DM.
- **Favorites & recents** — Quick access to the entities a user cares about.
- **Entity details** — Full entity views with content rendering, related/referencing entities, and source/edition version selection (2014 vs 2024).
- **Offline-first** — All data is on-device. No server, no login, no network dependency. PWA for installability.

---

## Priority: High

These are the next investments. They directly reduce dead time.

### Player Reference Sheets

The Party tab is now a fast-consultation HUD of player references (identity, ability modifiers, quick combat values, entity references to spells/weapons/magic items, one quick note), built to minimize dead time at the table. Possible follow-ups:

- Instant access to a member's spells, armor, weapons, and magic items from the party list.
- Combat-critical numbers surfaced without opening the editor (AC from armor, spell list, passive senses).
- Fewer taps between "whose turn — what do they have?" and the answer.

### Session History

Sessions are currently a pinned list of entities. The DM's history of sessions is the "what happened last week?" answer. Future work:

- Record a session (name/date/summary + the pinned entities) when the session ends.
- Browse past sessions from the Session screen.
- Link the adventure to its session history.

### Compendium Improvements

The Compendium is the heart. Improvements that speed retrieval:

- Better search relevance and typo tolerance.
- Faster entity detail rendering.
- Broader content coverage within the existing categories (more sources/editions, better metadata).
- Refined cross-references between entities (related entities are already generated; surface them better).

### Search Improvements

Search is the primary interface:

- Smarter ranking (multi-token matching, diacritics, prefix weighting).
- Search across user data (party members, adventures) in addition to Compendium entities.
- History and recent-search management.

### Performance & Offline

- Bundle size reduction and faster startup (the entire Compendium ships on-device).
- Load-time and search-latency budgets (see [success-metrics.md](./success-metrics.md)).
- PWA hardening: asset caching, update flow.

### Navigation Speed

- Quick links from the home screen to the most-used categories.
- Fewer taps between a question and an answer.
- Back/navigation behavior tuned for one-handed use.

---

## Priority: Lower

These are worth doing but come after the high-priority items. They are kept deliberately light to preserve the "quiet" product feel.

### Campaign Enhancements

- Better adventure organization (multiple adventures, reordering, richer objectives).
- Session history integrated into the adventure view.

### Visual Polish

- Refinement of the dark-first design system, spacing, and typography.
- Empty states and micro-interactions that never slow retrieval.

### Theme Improvements

- Additional theme variants only if they do not add maintenance burden or cognitive load.

---

## Not on the Roadmap

Everything in [anti-features.md](./anti-features.md) is a permanent exclusion. In particular: campaign planning/management tools, worldbuilding, encounter builders, initiative/combat trackers, dice rollers, character builders, digital notebooks, and any feature that requires a server.

---

## Verification

Every change ships only if:

- It reduces (or at least never increases) time-to-answer.
- It works fully offline.
- It works one-handed on a phone.
- It does not add permanent data-entry burden.

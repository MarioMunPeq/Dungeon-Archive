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
- **Rules** — A quick-rules reference for common game questions.
- **Combat** — A lightweight combat tracker tied to the active player's hit points, with a Beginner Mode toggle.
- **Party** — Lightweight player reference sheets: identity, ability scores, hit points, passive senses, known spells, equipped armor/weapons/magic items (stored as Compendium references, never duplicated), and notes. One player can be marked active.
- **Session** — A pinned list of entities for the current encounter, with a clear/end action. Session history is kept for the DM.
- **Favorites & recents** — Quick access to the entities a user cares about.
- **Entity details** — Full entity views with content rendering, related/referencing entities, and source/edition version selection (2014 vs 2024).
- **Offline-first** — All core data is on-device. No server, no login, no network dependency for core features. PWA for installability.
- **Cloud Backup (optional)** — User-initiated save/restore of state to Firebase, for moving between devices. Not a sync engine.

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
- Link a session to the party members who played in it.

### Compendium Improvements

The Compendium is the heart. Improvements that speed retrieval:

- Better search relevance and typo tolerance.
- Faster entity detail rendering.
- Broader content coverage within the existing categories (more sources/editions, better metadata).
- Refined cross-references between entities (related entities are already generated; surface them better).

### Search Improvements

Search is the primary interface:

- Smarter ranking (multi-token matching, diacritics, prefix weighting).
- Search across user data (party members, session history) in addition to Compendium entities.
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

### Combat Tracker

The Combat tab is a deliberately lightweight tracker: the active player's hit points, quick combat values, and a Beginner Mode toggle. Possible follow-ups that preserve the "lightweight" promise:

- Simpler hit-point entry and quick +/- adjustment.
- Cleaner connection between the party list and the combat screen.
- Nothing that grows into an encounter builder, initiative tracker, or monster tracker (those are exclusions, see [anti-features.md](./anti-features.md)).

### Visual Polish

- Refinement of the dark-first design system, spacing, and typography.
- Empty states and micro-interactions that never slow retrieval.

### Theme Improvements

- Additional theme variants only if they do not add maintenance burden or cognitive load.

---

## Not on the Roadmap

Everything in [anti-features.md](./anti-features.md) is a permanent exclusion. In particular: campaign planning/management tools, worldbuilding, encounter builders, initiative trackers, dice rollers, character builders, digital notebooks, and any feature that requires a server (with the single documented exception of Cloud Backup, which is a recovery copy, not a sync engine).

---

## Verification

Every change ships only if:

- It reduces (or at least never increases) time-to-answer.
- It works fully offline.
- It works one-handed on a phone.
- It does not add permanent data-entry burden.

# Engineering Contract

## Purpose

This document defines immutable engineering rules for Dungeon Archive. These are not suggestions — they are constraints that shape every technical decision.

When architecture and implementation conflict, **architecture wins**.

---

## Rules

### 1. Never Duplicate Compendium Data

The Compendium is the single source of truth for official D&D 5e content. Never copy, cache, or duplicate this data in application code.

**Why:** Duplication creates inconsistency. User data must store **references** (canonical identifiers) to Compendium entities, never copies of official content.

### 2. Never Access 5etools at Runtime

5etools data is processed at build time into static JSON under `src/generated/compendium/`. Never import, fetch, or reference 5etools files at runtime.

**Why:** 5etools data is not optimized for runtime use. Direct access bypasses validation, transformation, and indexing. The runtime only ever reads the generated JSON.

### 3. Only the Adapter Owns External Types

Application code imports external-source types exclusively through `src/adapter/`. No feature, component, or compendium module may import 5etools types directly.

**Why:** A single boundary keeps the rest of the codebase decoupled from upstream data-shape changes.

### 4. Only `src/compendium/` Reads Generated Data

Only the compendium loader touches `src/generated/`. Features access the Compendium through the public API (`loadCompendium`, `search`, `getEntity`, `resolveEntity`, ...).

**Why:** One access point keeps lookup behavior consistent and keeps the read-only contract honest.

### 5. Never Optimise Desktop Before Mobile

Mobile is the platform. Desktop is for development only. Never add desktop-specific features, keyboard shortcuts, or interaction patterns as product features.

**Why:** Desktop optimization diverts effort from the primary platform. Mobile constraints produce better design.

### 6. Never Implement a Feature Before Defining the User Problem

Every feature must answer a real user question from `user-questions.md`. If the user problem is not defined, the feature is not defined.

**Why:** Features without clear user problems add complexity without value. The product must stay focused.

### 7. Never Add an Anti-Feature

Anything listed in `anti-features.md` is a permanent exclusion: campaign planning, worldbuilding, encounter builders, combat/initiative trackers, dice rollers, character builders, full character sheets, notebooks, and anything requiring a server.

**Why:** The product's identity is defined as much by what it refuses as by what it does.

### 8. Offline Is Not Optional

All core features must work with zero network access. No feature may depend on a server, an account, or an internet connection.

**Why:** The table is the environment. Interruptions for connectivity are dead time.

### 9. Prefer Deleting Features Over Adding Complexity

When a feature is questionable, delete it. When a feature is rarely used, delete it. When a feature adds cognitive load without proportionate value, delete it.

**Why:** Simplicity is a feature. Every addition must justify its existence against the cost of increased complexity.

### 10. Performance Before Polish

Search must be fast before it is beautiful. Loading must be instant before it is animated. Functionality must work before it is refined.

**Why:** The product's core value is speed. Slow and polished is worse than fast and rough.

### 11. Question-Oriented UX

Every screen answers a question. Every interaction serves a purpose. If a screen doesn't answer a question from `user-questions.md`, it doesn't exist.

**Why:** Question-oriented design ensures every pixel serves the user's actual needs, not assumed needs.

### 12. Search Is the Primary Interface

Users find things by asking, not by browsing. Search is the primary path; category pages are fallbacks.

**Why:** Search is faster than navigation. The product's core value is finding information quickly.

### 13. Keep Components Small

Components should do one thing. If a component grows beyond ~150 lines, split it. If a component handles two concerns, separate them.

**Why:** Small components are easier to understand, test, and maintain.

### 14. Avoid Premature Abstractions

Don't create abstractions until you see three instances of the same pattern. Premature abstractions create coupling and complexity.

**Why:** Abstractions have a cost. Three is a pattern. Two is a coincidence.

### 15. Write Code for Future Maintainers

Code is read more than it is written. Write for the person who maintains this in six months — including yourself.

**Why:** Maintainability reduces long-term cost. Clever code is hard code.

### 16. When Architecture and Implementation Conflict, Architecture Wins

If the architecture says data flows one way and the implementation wants to flow another way, fix the implementation. Architecture decisions are deliberate; implementation shortcuts are accidental.

**Why:** Architecture represents product thinking. Implementation represents coding convenience. Product thinking wins.

---

## Verification

Before merging any change, verify:

- [ ] No new Compendium data duplication (references, not copies)
- [ ] No 5etools access at runtime; no imports outside the adapter
- [ ] Generated data touched only by `src/compendium/`
- [ ] No desktop-only features or shortcuts
- [ ] User problem is defined in `user-questions.md`
- [ ] Feature is not an anti-feature
- [ ] Feature works fully offline
- [ ] Architecture was consulted before implementation
- [ ] Performance targets are met
- [ ] Screen answers a question from `user-questions.md`
- [ ] Search covers any new entities
- [ ] Components are small and focused
- [ ] No premature abstractions
- [ ] Code is readable and documented where needed
- [ ] Architecture and implementation are aligned

---

## Summary

These rules are immutable. They exist to protect the product's focus, maintainability, and performance. When in doubt, refer to these rules. When rules conflict, refer to the product philosophy.

The architecture is the blueprint. The code is the building. The blueprint comes first.

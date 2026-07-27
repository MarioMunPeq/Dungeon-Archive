# Architecture Review — Iteration 3

## Status

**Complete.** All 11 architecture documents have been updated and one new document created.

---

## Summary

Dungeon Archive is a **mobile-first D&D 5e companion app** designed to reduce tabletop session downtime. The architecture is now finalized across three iterations.

### Core Identity

> **Designed for people sitting around a table with a phone in one hand and dice in the other.**

The app is a **companion**, not a platform. It finds information fast and disappears.

---

## Key Architectural Decisions

### 1. Mobile Is the Platform

- **One-handed first** — Thumb-reachable zones dictate layout
- **No keyboard shortcuts** — Mobile doesn't have a keyboard
- **Bottom tab bar** — Primary navigation, always thumb-accessible
- **Desktop** — Development only, not a product platform

### 2. Search Is the Application

- **Search everywhere** — Global search accessible from any screen
- **Contextual search** — Each section has its own search scope
- **Heterogeneous results** — Mixed types in relevance order, never grouped by category
- **Instant results** — < 200ms response time
- **Offline-first** — All search works without internet

### 3. Navigation Structure

- **4 tabs:** Home, Adventure, Search, Party
- **Journal → Adventure** — Session tracking and DM preparation
- **Character → Party** — Character management and party roster
- **NPCs managed independently** — Separate concept from characters

### 4. Compendium System

- **MVP categories:** Spells, Conditions, Actions, Equipment
- **Build-time indexing** — Processed at build time into static JSON
- **Immutable** — User content never mixes with official data
- **Progressive categories** — Add more over time (monsters, races, classes, etc.)

### 5. Reveal System

- **Generic, first-class feature** — Not limited to monsters
- **Progressive disclosure** — DM controls what players see
- **Monsters DM-only by default** — Players see name + image only
- **Configurable per entity** — NPCs, locations, loot, quests
- **Session-based** — DM can reveal during session, auto-hide after

### 6. Campaign System

- **Single active campaign** — One campaign "live" at a time
- **Previous campaigns archived** — Read-only access to past campaigns
- **No multi-campaign abstractions** — No "campaign selector" in UI

---

## Product Principles (14)

1. Utility over aesthetics
2. Speed over animations
3. Reduce downtime
4. One-handed first
5. Offline-first
6. Search-first
7. Question-oriented
8. Everything is searchable
9. Compendium is immutable
10. Campaign data is living
11. Never duplicate D&D content
12. Players never see spoilers
13. Every screen answers one question
14. Every interaction disappears into gameplay

---

## Anti-Features (Excluded)

**New document created:** [anti-features.md](./anti-features.md)

Explicitly excluded:
- Virtual Tabletop (VTT)
- Combat tracker / Initiative tracker
- Dice roller
- Character builder
- Campaign manager / Worldbuilder
- Map editor
- Wiki engine
- Rule automation
- AI DM assistance
- And 10+ more categories

**Purpose:** Prevent scope creep, clarify boundaries, help users choose the right tool.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18+ / TypeScript / Vite / Tailwind CSS |
| State | Zustand + TanStack Query |
| Database | Dexie.js (IndexedDB) |
| Data Source | 5etools (external/5etools/, read-only) |

---

## Documentation Structure

```
docs/
├── product-philosophy.md      # ✅ Rewritten (North Star, 14 principles, one-handed)
├── navigation.md              # ✅ Rewritten (Adventure, Party, contextual search)
├── architecture.md            # ✅ Rewritten (Reveal System, Compendium MVP)
├── search-architecture.md     # ✅ Rewritten (search everywhere, heterogeneous)
├── compendium-architecture.md # ✅ Rewritten (MVP categories)
├── data-architecture.md       # Existing (unchanged)
├── roadmap.md                 # ✅ Rewritten (Adventure, Party, Compendium MVP)
├── folder-structure.md        # ✅ Rewritten (Adventure, Party, Reveal)
├── mobile-first.md            # ✅ Rewritten (one-handed first, no keyboard shortcuts)
├── coding-guidelines.md       # ✅ Updated (Adventure, Party, Reveal naming)
└── anti-features.md           # ✅ NEW (excluded product categories)
```

---

## What Changed from Iteration 2

1. **North Star statement** added to product-philosophy.md
2. **One-handed-first** section added with thumb reach zones
3. **All 14 principles** explicitly listed
4. **Journal → Adventure** renamed across all documents
5. **Character → Party** renamed across all documents
6. **Search everywhere** concept (global + contextual)
7. **Heterogeneous search results** (mixed by relevance, not category)
8. **Reveal System** renamed from "Spoiler System", made generic
9. **Monsters DM-only by default** rule added
10. **Compendium MVP** scoped to spells, conditions, actions, equipment
11. **anti-features.md** created with excluded product categories
12. **Desktop keyboard shortcuts** removed from all documents
13. **14 principles** explicitly documented

---

## Ready for Implementation

The architecture is now finalized. All documents are consistent and aligned with the product vision.

**Next step:** Begin Phase 1 development (Foundation).

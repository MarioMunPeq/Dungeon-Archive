# Glossary

## Purpose

Shared vocabulary for the Dungeon Archive project. Everyone — product, design, engineering — uses these terms consistently.

---

## Core Terms

### Dungeon Archive

The product itself. A mobile-first companion app for D&D 5e tabletop sessions. Reduces downtime by making reference information instantly searchable.

### Companion

What Dungeon Archive is. A tool that supports tabletop sessions without replacing them. It lives alongside physical play, not instead of it.

### Campaign

A continuous D&D story played across multiple sessions. Dungeon Archive supports one active campaign at a time. Previous campaigns are archived.

### Archive

The state of a completed campaign. Archived campaigns are read-only. Users can review but not modify them.

### Session

A single gathering where the group plays D&D. Dungeon Archive tracks session notes, NPCs encountered, and loot distributed.

### Adventure

A specific storyline or quest within a campaign. Dungeon Archive's journal section for tracking active adventures, session notes, and DM preparation.

### Party

The group of player characters in a campaign. Dungeon Archive's section for managing character sheets, inventory, and party information.

### Player Character (PC)

A character controlled by a player. Managed in the Party section.

### NPC (Non-Player Character)

A character controlled by the DM. Managed independently from player characters. NPCs can be revealed or hidden from players via the Reveal System.

---

## Compendium Terms

### Compendium

The read-only reference database of official D&D 5e content. Immutable — user content never mixes with official data.

### Official Content

D&D 5e rules, spells, monsters, equipment, and other content from official sources (PHB, DMG, XGtE, etc.). Stored in the Compendium.

### Entity

Any item in the Compendium or Campaign data. Spells, conditions, actions, equipment, monsters, NPCs, characters — all are entities.

### Category

The type of entity. Examples: Spell, Condition, Action, Equipment, Monster, NPC, Character.

### 5etools

The external data source for D&D 5e content. Lives in `external/5etools/` as an immutable read-only dependency. Never accessed directly at runtime — processed at build time.

### Build-Time Processing

The pipeline that converts 5etools data into optimized static JSON for the Compendium. Runs during application build, not at runtime.

---

## Search Terms

### Search

The primary interface of Dungeon Archive. Users find information by asking, not by navigating.

### Global Search

Search that spans all categories and data sources. Accessible from any screen.

### Contextual Search

Search scoped to the current section. Examples: Adventure search (session notes), Party search (characters), Compendium search (official content).

### Heterogeneous Results

Search results mixed by relevance, not grouped by category. A search for "fireball" returns spells, conditions, and equipment together, ordered by relevance.

### Fuzzy Match

Search that tolerates typos. "firebal" matches "Fireball".

---

## Reveal Terms

### Reveal System

The generic system for controlling information visibility. DMs control what players can see. Not limited to monsters — applies to any entity.

### Reveal

The act of making hidden information visible to players. DMs reveal entities during sessions.

### DM-Only

Content visible only to the Dungeon Master. Monsters are DM-only by default.

### Player-Visible

Content that players can see. Set by the DM via the Reveal System.

---

## Data Terms

### Campaign Data

User-generated content: session notes, character sheets, NPC records, loot logs. Created and edited within the app. Stored in IndexedDB.

### IndexedDB

The browser's built-in database for offline storage. Dungeon Archive stores all data here via Dexie.js.

### Dexie.js

A JavaScript wrapper for IndexedDB. Simplifies database operations.

### Static JSON

Pre-built Compendium data generated at build time. Loaded into IndexedDB on first run.

### Offline-First

Core functionality works without internet. Network adds extras, never blocks essentials.

---

## Navigation Terms

### Tab Bar

The bottom navigation bar with 4 tabs: Home, Adventure, Search, Party. Always visible, thumb-reachable.

### Home

The landing screen. Shows active campaign, recent activity, and quick access.

### Screen

A full-page view in the application. Each screen answers one question.

### Entity Detail

The full view of any entity (spell, NPC, equipment, etc.). Shows all information about that entity.

---

## Technical Terms

### Mobile-First

Design and development prioritizes mobile devices. Desktop is for development only.

### One-Handed

The primary interaction model. All core features work with one thumb on a phone screen.

### Client-Side SPA

Single Page Application running entirely in the browser. No server backend for MVP.

### Adapter

The build-time layer that transforms 5etools data into Dungeon Archive's format. Lives in `scripts/compendium/`.

---

## Usage Notes

- **"Campaign"** always refers to the active campaign. Use "archived campaign" for completed ones.
- **"Search"** is always capitalized when referring to the feature. Lowercase for the action.
- **"Entity"** is the generic term for any data item. Use specific terms (spell, NPC, etc.) when possible.
- **"Reveal"** is the system name. Use "DM-only" and "player-visible" for visibility states.
- **"Compendium"** refers to official content only. User content is "Campaign Data".

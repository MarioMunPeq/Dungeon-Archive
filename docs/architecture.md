# Technical Architecture

## Overview

Dungeon Archive is a **client-side SPA** with **offline-first** architecture. All data lives on-device. No backend server for MVP.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | React 18+ | Component framework |
| **Language** | TypeScript | Type safety |
| **Bundler** | Vite | Build tooling |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | Zustand | Client state management |
| **Server State** | TanStack Query | Async state, caching |
| **Database** | IndexedDB via Dexie.js | Structured offline storage |
| **Data Source** | 5etools | D&D 5e compendium data |
| **Desktop** | Development only | Not a product platform |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
├─────────────────────────────────────────────────────┤
│  React Components                                  │
│  ├── Screens (pages)                               │
│  ├── Components (reusable UI)                      │
│  └── Hooks (state, data access)                    │
├─────────────────────────────────────────────────────┤
│  State Management                                  │
│  ├── Zustand Store (app state, UI state)           │
│  └── TanStack Query (server state, caching)        │
├─────────────────────────────────────────────────────┤
│  Data Layer                                        │
│  ├── Dexie.js (IndexedDB wrapper)                  │
│  ├── IndexedDB Database                            │
│  └── Static JSON Files (compendium)                │
├─────────────────────────────────────────────────────┤
│  External Data                                     │
│  └── 5etools (read-only, build-time adapter)       │
└─────────────────────────────────────────────────────┘
```

---

## Core Systems

### 1. Search System

**Search is the core interface of the application.**

- **Search Everywhere** — Global search accessible from any screen
- **Contextual Search** — Each section has its own search scope
- **Heterogeneous Results** — Mixed types in relevance order
- **Instant Results** — < 200ms response time
- **Offline-First** — All search works without internet

**Architecture:**
- Pre-indexed static JSON for compendium data
- In-memory search index loaded at startup
- Dexie.js queries for user data (campaigns, characters)
- Fuzzy matching for typo tolerance

**See:** [search-architecture.md](./search-architecture.md) for detailed implementation.

---

### 2. Compendium System

**Read-only reference data from D&D 5e.**

- **Immutable** — User-generated content never mixes with official data
- **Pre-indexed** — Built at application build time
- **Static JSON** — No runtime parsing of 5etools data
- **Progressive Categories** — Start with essentials, add more over time

**MVP Categories:**
- Spells
- Conditions
- Actions
- Equipment

**Later Categories:**
- Monsters (DM-only by default)
- Races
- Classes
- Feats
- Magic Items
- Rules

**Architecture:**
```
5etools/ (external dependency)
    ↓
Build-time Adapter (scripts/compendium/)
    ↓
Static JSON (data/compendium/)
    ↓
IndexedDB (Dexie.js)
    ↓
React Components
```

**See:** [compendium-architecture.md](./compendium-architecture.md) for detailed implementation.

---

### 3. Reveal System

**Generic, first-class feature for progressive information disclosure.**

The Reveal System protects information that should only be visible to certain roles. It is not limited to monsters — it applies to any content where information asymmetry is needed.

**Default Reveal Rules:**
- **Monsters** — DM-only by default (players see name + image only)
- **NPC Details** — Configurable per NPC
- **Loot** — Configurable (hidden until revealed)
- **Locations** — Configurable (fog of war)
- **Quest Details** — Configurable (hidden until discovered)

**User Roles:**
- **DM** — Sees all content by default
- **Player** — Sees only revealed content

**Reveal Mechanisms:**
- **Global toggle** — DM can reveal/hide categories
- **Per-entity toggle** — DM can reveal specific NPCs, locations, items
- **Session-based** — DM can reveal during session, auto-hide after
- **Bulk reveal** — DM can reveal all monsters for a specific encounter

**Architecture:**
- Reveal state stored in Dexie.js (per campaign)
- Reveal checks applied at render time (not data level)
- Search results respect reveal settings (hidden content not shown to players)
- Reveal state syncs across devices (future: optional sync)

---

### 4. Campaign System

**Single active campaign with archived history.**

- **One active campaign** — Only one campaign is "live" at a time
- **Previous campaigns archived** — Read-only access to past campaigns
- **No multi-campaign abstractions** — No "campaign selector" in UI
- **Campaign switching** — Archive current, start new

**Campaign Data:**
- Campaign metadata (name, system, dates)
- Characters (party members)
- NPCs (independent of characters)
- Session notes
- Loot tracking
- Location references
- Reveal settings

**See:** [data-architecture.md](./data-architecture.md) for schema details.

---

### 5. Offline System

**Core functionality works without internet.**

- **Compendium data** — Pre-downloaded at build time
- **Campaign data** — Stored in IndexedDB
- **Search** — All search works offline
- **No runtime network requests** for core features

**Future Enhancements:**
- Service worker for asset caching
- Optional cloud sync (future)
- Background data updates

---

## State Management

### Zustand Store

**Client-side state:**
- Current campaign ID
- User preferences (theme, settings)
- UI state (active tab, modal states)
- Reveal settings
- Search state

### TanStack Query

**Server-side state (async):**
- Compendium data loading
- IndexedDB queries
- Data transformation
- Cache management

---

## Data Flow

```
User Action
    ↓
React Component
    ↓
Hook (useSearch, useCampaign, etc.)
    ↓
Zustand Store (client state)
    ↓
TanStack Query (async operations)
    ↓
Dexie.js (IndexedDB) or Static JSON
    ↓
Response
    ↓
React Component Update
```

---

## Build System

### Development
- Vite dev server
- Hot Module Replacement (HMR)
- TypeScript type checking
- ESLint + Prettier

### Production
- Vite build
- Bundle splitting
- Asset optimization
- Static JSON generation

### Build-Time Compendium Processing
```
scripts/compendium/
    ├── fetch-data.ts        # Fetch from 5etools
    ├── transform-data.ts    # Normalize and index
    ├── generate-json.ts     # Output static JSON
    └── validate.ts          # Verify data integrity
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| **First Contentful Paint** | < 1.5s |
| **Search Response** | < 200ms |
| **Bundle Size (initial)** | < 200KB gzipped |
| **Time to Interactive** | < 3s |
| **Offline Ready** | Core features always available |

---

## Security Considerations

- **No authentication** — Local-only application
- **No network requests** — Core features are offline-only
- **No secrets** — No API keys, no sensitive data
- **Read-only compendium** — No modification of official data
- **User data isolation** — Campaign data stays on device

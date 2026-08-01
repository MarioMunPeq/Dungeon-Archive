# Navigation Architecture

## Mental Model

The application is a **second screen that sits next to the table**. Navigation exists only to reach information quickly. Users should never think about where something lives — they tap a tab or type a search.

Long-term the app gravitates toward five destinations:

1. **Compendium** — the reference database (reached via Search and category pages).
2. **Player** — the party's lightweight reference sheets.
3. **Campaign** — the active adventure's context.
4. **Sessions** — what happened last week, and what is pinned for the current encounter.
5. **Search** — the primary interface, available everywhere.

## Current Structure

The app uses a **4-tab bottom navigation bar**, always visible and thumb-reachable. Search is a dedicated tab and the home screen's first-class action.

### Tab Bar

```
┌─────────────────────────────────────┐
│                                     │
│  [Main content area — full screen]  │
│                                     │
├──────┬──────────┬──────────┬────────┤
│  ⌂   │   🔍     │  📜      │  👥    │
│ Home │  Search  │ Adventure│ Party  │
└──────┴──────────┴──────────┴────────┘
```

- **Home** — Landing screen. Current adventure, party, continue-session, recent entities, favorites, and the Compendium category list.
- **Search** — Global search across the entire Compendium. Instant results, category filter, keyboard navigation.
- **Adventure** — The active campaign container: title, description, objectives, private DM notes, and pinned references. Switch between adventures; archive/restore.
- **Party** — Lightweight player reference sheets: identity, passive senses, known spells, equipped items, notes.

**Session** has no tab. It is reached from Home ("Continue Session") and from the SessionButton on any entity. It holds the entities pinned for the current encounter and the "End Session" action.

### Compendium Routes

Every Compendium category has:

- **Category page** (`/spell`, `/monster`, `/equipment`, `/condition`, `/action`, `/magicitem`, `/feat`) — browsable list with filters and counts, linked from Home.
- **Entity detail** (`/spell/:canonicalId`, etc.) — full entity view with favorites, session pin, adventure pin, related entities, and edition/source version selection.

Category list pages are a fallback. Search is the primary path to an entity.

## Screen Inventory

### Global
- **Home** — `/` — landing, quick access to everything.
- **Search** — `/search` — the primary interface.
- **Session** — `/session` — pinned entities for the current encounter.

### Campaign
- **Adventure** — `/adventure` — active campaign context (title, description, objectives, notes, references). Create, switch, archive, restore.

### Party
- **Party** — `/party` — list and edit lightweight player reference sheets.

### Compendium
- **Category page** — `/spell`, `/monster`, `/equipment`, `/condition`, `/action`, `/magicitem`, `/feat`.
- **Entity detail** — `/{category}/:canonicalId`.

## Navigation Patterns

### One-Handed Navigation

All navigation is designed for one thumb:

- **Bottom tab bar** — primary navigation, thumb-reachable (56px target minimum).
- **Back navigation** — browser/back-button behavior plus breadcrumbs on entity detail.
- **Scroll** — single-finger swipe.
- **No hover states** — touch-first; active/pressed states via scale and color.

### Search Navigation

- **Tap search bar / Search tab** — opens search, keyboard appears.
- **Type** — results appear instantly (150ms debounce, synchronous scoring).
- **Arrow keys / Enter** — keyboard navigation through results (also usable with external keyboards).
- **Escape** — clear the query.
- **Tap result** — open entity detail.
- **Category filter** — narrow results to one category.

### Quick Actions (Entity Detail)

Every entity detail offers three one-tap actions:

- **Favorite** — pin to Home favorites.
- **Session** — pin to the current encounter's session list.
- **Adventure** — pin as an important reference of the active adventure.

## Information Architecture

```
Home
├── Current Adventure
├── Party
├── Continue Session
├── Continue Reading (recent entities)
├── Favorites
└── Compendium categories (7)

Search
├── Global search (whole Compendium)
├── Category filter
└── Entity detail

Session
└── Pinned entities for current encounter

Adventure
├── Title / description
├── Objectives
├── Important references
└── Private DM notes

Party
└── Player reference sheets (identity, passive senses, spells, items, notes)

Compendium
├── /spell, /monster, /equipment, /condition, /action, /magicitem, /feat
└── /{category}/:canonicalId (entity detail)
```

## Rules

- Every screen answers at least one question. If a screen doesn't, it doesn't exist.
- Search is the primary path; category pages are fallbacks.
- Never add navigation depth that requires more than two taps to reach an answer.
- The tab bar never grows beyond four tabs.

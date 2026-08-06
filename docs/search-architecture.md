# Search Architecture

## Overview

Search is not a feature — it is the core interface of Dungeon Archive. The Search tab is the primary way users find information. The whole app is built around the assumption that the fastest path to any answer is typing its name.

---

## Search Philosophy

### Search Is the Primary Interface

Users find things by asking, not by browsing:

- **Search tab** — A dedicated bottom-nav tab, one tap away from every screen.
- **Category pages are fallbacks** — browsable, but not the primary path.
- **Search from user data** (roadmap) — future work: party members and session history become searchable too.

### Instant Response

- Results appear as the user types.
- 200ms debounce on keystroke input.
- Synchronous in-memory scoring — no network, no loading states.
- Latency target < 150ms.

### Heterogeneous Results

Results are **mixed by relevance**, not grouped by category. A search for "fire" can return a spell (Fireball), a monster, a condition, and equipment together, ordered by score then name. This mirrors how humans think — "I'm looking for something about fire" — not how databases organize data.

---

## Current Implementation

### Data Source

```
Search Request
    ↓
search.ts (src/compendium/search.ts)
    ├── loads prebuilt index (search-index.json)
    ├── substring-scored matching
    └── sorts by score, then name
    ↓
readonly SearchIndexEntry[]
```

There is exactly **one search scope**: the Compendium. There is no search of user data yet (party members, session history — roadmap item).

### Search Index

- **Generated at build time** into `src/generated/compendium/search-index.json`.
- **Loaded once at startup** by `loadCompendium()` alongside all entity data.
- **In memory** for the lifetime of the app; every query is a synchronous pass.

### Scoring

Each result is scored deterministically:

| Match type | Score |
|-----------|-------|
| Exact name match | 100 |
| Name starts with query | 80 |
| Query included in name | 60 |

Results are sorted by **score descending**, then **name ascending**. The scoring is intentionally simple, predictable, and cheap.

### Entry Points

- **Search tab** — the primary entry point.
- **Category filter** — narrows results to one category after a search.
- **Keyboard navigation** — Arrow keys move through results, Enter opens, Escape clears.

---

## Result Display

### Result Row

Each result is a single row with:

```
┌────────────────────────────────────────┐
│ ⚔️  Action — Attack                    │
│    Quick metadata for the entity       │
└────────────────────────────────────────┘
```

- **Category icon + label** — visual category indicator.
- **Name** — entity name.
- **Quick metadata** — most relevant line (level, CR, cost, etc.).
- **Highlight** — matched substring highlighted.

### Result Actions

- **Tap** — open entity detail.

No swipe actions, no long-press menus. One tap to the answer.

---

## Edge Cases

### Empty Query
- No results shown; the page offers category browsing and recent searches.

### No Results
- "No results" state with a hint to check the spelling or change the filter.

### Too Many Results
- Results are capped; the category filter narrows the field.

### Offline Mode
- Search works offline by construction — it is a pure in-memory operation over shipped data.

### Empty Category Filter
- If the chosen category has no matches, the empty state explains it.

---

## Search State

- **Recent searches** — stored in user state (`recentSearches`), cleared via the store action.
- **Query and filter** — local to the search page; results are derived synchronously from the query.

---

## Performance Optimization

- **Prebuilt index** — no index construction at runtime.
- **Single startup load** — no lazy index, no async population.
- **200ms debounce** — prevents excess work during fast typing.
- **Cap results** — bounded work per keystroke.
- **No async state machinery** — search is synchronous in-memory; nothing is needed beyond the page.

---

## Future Work

- **Better ranking** — multi-token matching, diacritics, prefix weighting.
- **Typo tolerance** — deliberate fuzzy matching (currently absent by design; scoring is strict substring).
- **User-data search** — party members, session history alongside Compendium results.

---

## Non-Goals

- **No network-backed search.** No external search service, ever.
- **No search over user content until the product question is answered** ("When is searching my notes faster than scrolling them?").
- **No reveal-based filtering.** Search is a personal tool; there is no per-role visibility system.

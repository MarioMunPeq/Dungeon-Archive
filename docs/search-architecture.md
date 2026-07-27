# Search Architecture

## Overview

Search is not a feature — it is the core interface of Dungeon Archive. The search bar is the primary navigation method. Every screen should feel like a search result.

---

## Search Philosophy

### Search Everywhere

Search is accessible from every screen in the application:
- **Global search bar** — Persistent at top of every screen
- **Tab bar search entry** — Dedicated search tab
- **Contextual search** — Each section's search scope
- **Long-press search** — Quick search within current context

### Heterogeneous Results

Search results are **mixed by relevance**, not grouped by category. A search for "fireball" might return:
1. **Spell:** Fireball (most relevant)
2. **Condition:** Burning (related)
3. **Equipment:** Flask of Oil (combustible)
4. **Action:** Improvised Fire Damage (related)
5. **Rules:** Fire Damage (rules reference)

This mirrors how humans think — "I'm looking for something about fire" — not how databases organize data.

### Instant Response

- < 200ms for all searches
- Results appear as user types
- No loading states for search
- Typo tolerance via fuzzy matching

---

## Search Scopes

### Global Search

The default search scope. Searches across:
- Compendium (all categories)
- Campaign data (notes, NPCs, locations)
- User-created content

**Entry points:**
- Tap search bar at top of any screen
- Tap Search tab in bottom nav
- Long-press on any tab for quick search

### Contextual Search

Each section provides its own search scope:

#### Home Search
- Searches everything (same as global)
- Shows recent activity alongside results

#### Adventure Search
- Searches within current adventure's notes
- Searches NPCs in this adventure
- Searches session logs
- Shows compendium results as secondary

#### Compendium Search
- Searches only official D&D content
- Filters by category (spells, conditions, etc.)
- Shows related rules references

#### Party Search
- Searches within party characters
- Searches character inventories
- Searches party notes
- Searches NPCs the party knows

---

## Search Implementation

### Data Sources

```
Search Request
    ↓
┌─────────────────────────────────────┐
│  Search Router                      │
│  ├── Global → all sources           │
│  ├── Adventure → adventure data     │
│  ├── Compendium → compendium only   │
│  └── Party → party data             │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Data Sources                       │
│  ├── Static JSON (compendium)       │
│  ├── IndexedDB (campaign data)      │
│  └── In-memory index (search idx)   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Result Processor                   │
│  ├── Deduplicate                    │
│  ├── Rank by relevance              │
│  ├── Apply reveal filters           │
│  └── Format for display             │
└─────────────────────────────────────┘
    ↓
Heterogeneous Results
```

### Search Index

**Pre-built at application startup:**
- Load compendium static JSON into memory
- Build search index with fuzzy matching
- Index campaign data from IndexedDB

**Index structure:**
```typescript
interface SearchIndex {
  compendium: CompendiumEntry[];  // Loaded from static JSON
  campaign: CampaignEntry[];      // Loaded from IndexedDB
  recency: Map<string, number>;   // Last accessed timestamps
}
```

### Search Algorithm

1. **Tokenize** — Split query into tokens
2. **Fuzzy Match** — Find entries matching tokens (typo tolerance)
3. **Rank** — Score by relevance (exact match > partial > fuzzy)
4. **Boost** — Increase score for:
   - Recently accessed entries
   - Frequently accessed entries
   - Exact name matches
5. **Filter** — Apply reveal settings (hide DM content from players)
6. **Deduplicate** — Remove duplicate entries
7. **Limit** — Return top N results (configurable, default 20)

### Search Types

#### Exact Match
```
Query: "Fireball"
→ Spell: Fireball (exact match, highest rank)
```

#### Partial Match
```
Query: "fire"
→ Spell: Fireball
→ Spell: Fire Bolt
→ Condition: Burning
→ Action: Improvised Fire Damage
```

#### Fuzzy Match (typo tolerance)
```
Query: "firebal"
→ Spell: Fireball (fuzzy match)
```

#### Multi-token Match
```
Query: "lightning bolt"
→ Spell: Lightning Bolt (both tokens match)
→ Spell: Chain Lightning (partial match)
```

---

## Search Results Display

### Result Card Structure

Each search result is displayed as a **heterogeneous card**:

```
┌─────────────────────────────────────┐
│ 🔮 Spell                        3rd │
│ Fireball                          🔥│
│ A bright streak flashes from your  │
│ pointing finger to a point you     │
│ choose...                          │
├─────────────────────────────────────┤
│ Evocation · 150 ft · 1 round       │
└─────────────────────────────────────┘
```

```
┌─────────────────────────────────────┐
│ ⚔️ Action                          │
│ Improvised Fire Damage              │
│ When you throw something flammable │
│ at a creature...                   │
├─────────────────────────────────────┤
│ 1d6 fire damage                    │
└─────────────────────────────────────┘
```

### Result Types

Each result shows:
- **Type icon** — Visual category indicator (Spell, Condition, Equipment, etc.)
- **Name** — Entity name
- **Quick info** — Most relevant stats (level, damage, cost, etc.)
- **Preview** — First line of description
- **Relevance badge** — Why this result appeared

### Result Actions

From any search result:
- **Tap** — Open full detail view
- **Long-press** — Context menu (copy, share, favorite)
- **Swipe right** — Quick add to favorites
- **Swipe left** — Dismiss (for future similar results)

---

## Search State

### Zustand Store

```typescript
interface SearchState {
  query: string;
  scope: 'global' | 'adventure' | 'compendium' | 'party';
  results: SearchResult[];
  isLoading: boolean;
  recentSearches: string[];
  favorites: string[];
}
```

### Persisted State

- **Recent searches** — Last 10 searches (stored in localStorage)
- **Favorites** — Bookmarked entries (stored in IndexedDB)
- **Search history** — Per-session (memory only)

---

## Performance Optimization

### Lazy Loading
- Search index loads asynchronously at startup
- Results render progressively (virtual scrolling)
- Images load on demand

### Caching
- Recent searches cached in memory
- Frequent queries cached via TanStack Query
- Static JSON cached after first load

### Debouncing
- 150ms debounce on keystroke input
- Prevents excessive searches during fast typing

---

## Edge Cases

### Empty Results
- Show "No results found"
- Suggest related searches
- Offer to search in compendium

### Too Many Results
- Limit to top 20 by default
- "Show more" button for additional results
- Category filters to narrow results

### Offline Mode
- All search works offline
- No network requests for search
- Static JSON pre-loaded at build time

### Reveal Filtering
- DM sees all results
- Player sees only revealed content
- Hidden content filtered out of results
- Search never reveals hidden information

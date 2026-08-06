# ADR-005: Search-First Philosophy

## Status

Accepted

## Context

The primary user need is finding information quickly during tabletop sessions. Traditional navigation (menus, categories, hierarchies) is slow. Search is fast.

## Decision

Search is the primary interface. Users find things by asking, not by navigating.

- Search is a dedicated bottom-nav tab, one tap away from every screen
- Results are heterogeneous (mixed by relevance, not grouped by category)
- Category pages exist as fallbacks, not as the primary path
- Search is synchronous, in-memory, and works offline
- Results appear as the user types (200ms debounce, substring scoring)

## Consequences

**Positive:**
- Fastest path to information
- Reduces navigation complexity
- Matches how people think ("I need X") rather than how data is organized
- Works fully offline

**Negative:**
- Requires a good search index (prebuilt at build time)
- Strict substring scoring gives no typo tolerance yet
- Discovery of unknown content is harder

**Mitigation:**
- All data is pre-indexed at build time (`search-index.json`)
- Typo tolerance / better ranking are roadmap items (see roadmap)
- Recent searches and favorites surface frequently used content
- Categories exist as fallback, not primary

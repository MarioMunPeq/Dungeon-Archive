# ADR-005: Search-First Philosophy

## Status

Accepted

## Context

The primary user need is finding information quickly during tabletop sessions. Traditional navigation (menus, categories, hierarchies) is slow. Search is fast.

## Decision

Search is the primary interface. Users find things by asking, not by navigating.

- Search bar is always visible
- Every screen has contextual search
- Search results are heterogeneous (mixed by relevance, not category)
- Categories are secondary to search
- Search works offline

## Consequences

**Positive:**
- Fastest path to information
- Reduces navigation complexity
- Works for all user skill levels
- Matches how people think ("I need X") rather than how data is organized

**Negative:**
- Requires good search algorithm (relevance ranking)
- Requires pre-indexed data
- Discovery of unknown content is harder

**Mitigation:**
- Pre-index all data at build time
- Implement fuzzy matching for typo tolerance
- Recent/frequent items surface naturally
- Categories exist as fallback, not primary

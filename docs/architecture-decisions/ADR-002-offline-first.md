# ADR-002: Offline-First Architecture

## Status

Accepted

## Context

Dungeon Archive is used at tabletop sessions where internet connectivity is unreliable or unavailable. The app must work without a network connection.

## Decision

Core functionality works offline. Network adds extras, never blocks essentials.

- Compendium data is pre-indexed at build time
- Campaign data is stored in IndexedDB via Dexie.js
- No runtime network requests for core features
- Optional cloud sync is a future enhancement, not a baseline requirement

## Consequences

**Positive:**
- Works in any environment (basements, parks, convention centers)
- Instant response times (no network latency)
- No server infrastructure required for MVP

**Negative:**
- Larger initial bundle size (all compendium data on device)
- Data sync across devices requires future work
- No real-time multiplayer features

**Mitigation:**
- Lazy-load compendium categories on demand
- Cloud sync designed as optional enhancement
- Real-time features are explicitly excluded (anti-features)

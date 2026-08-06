# ADR-002: Offline-First Architecture

## Status

Accepted (amended 2026-08: Cloud Backup is the single documented exception)

## Context

Dungeon Archive is used at tabletop sessions where internet connectivity is unreliable or unavailable. The app must work without a network connection.

## Decision

Core functionality works offline. Core features have no server, no login, and no runtime network dependency. Cloud Backup is an optional, user-initiated Firebase feature for moving state between devices; it is a recovery copy, not a sync engine.

- **Compendium data** is generated at build time into static JSON (`src/generated/compendium/`) and shipped with the app. It is loaded into memory once at startup (`loadCompendium()`); all runtime access is synchronous.
- **User state** (favorites, recents, searches, session, party, combat) is persisted in `localStorage` under a versioned key with forward migrations. There is no database layer.
- **PWA** (service worker) caches app assets and makes the app installable.
- No runtime network requests for any core feature.

## Consequences

**Positive:**
- Works in any environment (basements, parks, convention centers)
- Instant response times (no network latency)
- No server infrastructure required for the core product

**Negative:**
- Larger initial bundle (all Compendium data ships on-device)
- No cross-device sync (permanent exclusion; Cloud Backup is a manual recovery copy, not sync)
- Startup pays a one-time load cost for the whole Compendium

**Mitigation:**
- The load happens once, before first render; navigation after that is instant
- Sync and real-time features are explicitly excluded (anti-features)
- Bundle and load-time budgets are tracked in success-metrics

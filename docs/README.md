# Documentation

This directory documents Dungeon Archive as it is built today. The docs describe the shipped product — **not** planned features. When the code changes, update the docs.

## Reading Order

New readers should start with the product story, then the architecture, then the engineering rules:

1. [Product Philosophy](../README.md) — what the app is and why (the README is the landing page)
2. [Product Philosophy](./product-philosophy.md) — vision, users, and principles
3. [User Questions](./user-questions.md) — the questions every screen answers
4. [Navigation](./navigation.md) — the 5-tab structure and routes
5. [Architecture](./architecture.md) — technical architecture
6. [Engineering Contract](./engineering-contract.md) — immutable engineering rules
7. [Anti-Features](./anti-features.md) — what the app deliberately refuses to be

## Document Index

### Product

| Document | Purpose |
|----------|---------|
| [product-philosophy.md](./product-philosophy.md) | Product vision, users, and guiding principles |
| [user-questions.md](./user-questions.md) | The questions the app answers (drives screens and features) |
| [navigation.md](./navigation.md) | Bottom-nav model, top bar, and full route list |
| [anti-features.md](./anti-features.md) | Explicit non-goals (permanent exclusions) |
| [success-metrics.md](./success-metrics.md) | Product KPIs — time to answer |
| [roadmap.md](./roadmap.md) | Current state and priorities |
| [glossary.md](./glossary.md) | Shared vocabulary |

### Design

| Document | Purpose |
|----------|---------|
| [design-principles.md](./design-principles.md) | Visual and interaction principles |
| [mobile-first.md](./mobile-first.md) | Mobile/one-handed design model |

### Engineering

| Document | Purpose |
|----------|---------|
| [architecture.md](./architecture.md) | Technical architecture |
| [compendium-architecture.md](./compendium-architecture.md) | Read-only Compendium system |
| [search-architecture.md](./search-architecture.md) | Search system |
| [engineering-contract.md](./engineering-contract.md) | Immutable engineering rules |
| [coding-guidelines.md](./coding-guidelines.md) | Code standards |
| [folder-structure.md](./folder-structure.md) | Repository layout |
| [architecture-decisions/](./architecture-decisions/README.md) | ADRs (001–005) |

### Features

| Document | Purpose |
|----------|---------|
| [cloud-backup.md](./cloud-backup.md) | Cloud Backup (Firebase): flow, Firestore, env, deployment |

### Archived

| Document | Purpose |
|----------|---------|
| [history/](./history/README.md) | Historical reports and the redesign campaign (not the current product) |

## Maintenance Rules

- **Document only what exists.** No planned features described as shipped.
- **Keep names in sync** with code: tabs, routes, store actions, file paths.
- **Run `pnpm build:compendium` changes through the compendium docs** (`compendium-architecture.md`).
- **ADR changes** are recorded in `architecture-decisions/`; the index table stays updated.
- **Screenshots** live in `screenshots/` and are referenced from the README.

# Success Metrics

## Purpose

Dungeon Archive exists to reduce downtime during tabletop sessions. These metrics measure whether the product achieves that goal. They are **product KPIs**, not technical KPIs.

Every metric answers one question: **"How fast can a user get the information they need?"**

---

## Primary Metrics

### Lookup Speed

| Action | Target | Why |
|--------|--------|-----|
| Find any spell | < 3 seconds | Spells are the most common lookup |
| Find any monster | < 3 seconds | Monsters are the most common DM lookup |
| Find any magic item | < 3 seconds | DMs hand out items mid-session |
| Find any equipment | < 3 seconds | Players check items constantly |
| Find any condition | < 3 seconds | Conditions slow combat |
| Find any action | < 3 seconds | New players forget their options |
| Find any feat | < 3 seconds | Feats come up at level-up and play |
| Search any entity | < 5 seconds | Upper bound for any lookup |

### Navigation Speed

| Action | Target | Why |
|--------|--------|-----|
| Open party reference sheet | < 2 seconds | Players check their sheet mid-combat |
| Open the current adventure | < 2 seconds | DMs access campaign context |
| Open the current session list | < 2 seconds | DMs and players check pinned entities |
| Open a favorite entity | < 2 seconds | Favorites exist to be fast |
| Open a recent entity | < 2 seconds | Recents exist to be fast |
| Switch between tabs | < 200ms | Tab switching must feel instant |

### System Performance

| Metric | Target | Why |
|--------|--------|-----|
| Search latency | < 150ms | Results must appear instantly |
| App startup (cold) | < 2 seconds | First impression matters |
| Compendium entry open | < 100ms | Detail views must feel instant |
| Offline availability | 100% | Core features never require internet |

---

## Secondary Metrics

### Reliability

| Metric | Target | Why |
|--------|--------|-----|
| Data integrity | 100% | User state must never be lost |
| Offline success rate | 100% | Core features always work |
| Search success rate | > 95% | Users should find what they need |
| Error recovery | < 5 seconds | Errors must not block sessions |

### Usability

| Metric | Target | Why |
|--------|--------|-----|
| First-time usability | No instruction needed | New users should be immediately productive |
| One-handed operation | 100% of core features | Users hold dice in the other hand |
| Task completion rate | > 90% | Users should succeed without confusion |
| Data-entry burden | Near zero | Consultation over administration |

---

## Measurement Rules

### How to Measure

1. **Time from intent to answer** — Start counting when the user decides to look something up. Stop when they have the answer.
2. **Real conditions** — Measure on mid-range phones, not high-end devices.
3. **Offline mode** — Measure with airplane mode enabled.
4. **Cold start** — Measure from app launch to first usable state.
5. **Typical usage** — Measure with one hand, while "distracted" (simulating table conversation).

### What Not to Measure

- Aesthetic satisfaction
- Feature count
- Technical complexity
- Code elegance
- Animation smoothness

---

## The Rule

> **If a feature negatively affects these metrics, it should be redesigned or removed.**

No feature is worth slowing down the core experience. If a new feature adds 500ms to search, it must justify that cost. If it cannot, it does not ship.

Speed is not a feature. Speed is the product.

---

## Baseline Comparison

Before Dungeon Archive, users rely on:

| Action | Typical Time | With App |
|--------|-------------|----------|
| Look up spell in PHB | 30-60 seconds | < 3 seconds |
| Look up condition online | 10-20 seconds | < 3 seconds |
| Look up monster online | 15-30 seconds | < 3 seconds |
| Check player reference info | 5-10 seconds | < 2 seconds |
| Open a favorite/recent entity | 10-30 seconds | < 2 seconds |

The product must beat these baselines by at least 10x to justify its existence.

---

## Non-Goals

These are explicitly **not** success metrics:

- Number of campaigns managed, NPCs recorded, loot logs written.
- Time spent **inside** the app. Longer engagement is a failure, not a success.
- Feature adoption beyond search, favorites, session pins, and reference sheets.

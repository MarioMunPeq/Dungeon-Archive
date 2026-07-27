# Engineering Contract

## Purpose

This document defines immutable engineering rules for Dungeon Archive. These are not suggestions — they are constraints that shape every technical decision.

When architecture and implementation conflict, **architecture wins**.

---

## Rules

### 1. Never Duplicate Compendium Data

The Compendium is the single source of truth for official D&D 5e content. Never copy, cache, or duplicate this data in application code.

**Why:** Duplication creates inconsistency. When data changes, duplicated copies diverge. The Compendium must remain authoritative.

### 2. Never Access 5etools Directly Outside the Adapter

5etools data is processed at build time through the adapter layer (`scripts/compendium/`). Never import, fetch, or reference 5etools files at runtime.

**Why:** 5etools data is not optimized for runtime use. Direct access bypasses validation, transformation, and indexing.

### 3. Never Optimise Desktop Before Mobile

Mobile is the platform. Desktop is for development only. Never add desktop-specific features, keyboard shortcuts, or interaction patterns.

**Why:** Desktop optimization diverts effort from the primary platform. Mobile constraints produce better design.

### 4. Never Implement a Feature Before Defining the User Problem

Every feature must answer a real user question from `user-questions.md`. If the user problem is not defined, the feature is not defined.

**Why:** Features without clear user problems add complexity without value. The product must stay focused.

### 5. Prefer Deleting Features Over Adding Complexity

When a feature is questionable, delete it. When a feature is rarely used, delete it. When a feature adds cognitive load without proportionate value, delete it.

**Why:** Simplicity is a feature. Every addition must justify its existence against the cost of increased complexity.

### 6. Architecture First

Design the data model, component hierarchy, and interaction flow before writing code. Architecture decisions are made before implementation decisions.

**Why:** Code without architecture becomes technical debt. Architecture without code is just documentation — but documentation is cheaper to rewrite than code.

### 7. Performance Before Polish

Search must be fast before it is beautiful. Loading must be instant before it is animated. Functionality must work before it is refined.

**Why:** The product's core value is speed. Slow and polished is worse than fast and rough.

### 8. Question-Oriented UX

Every screen answers a question. Every interaction serves a purpose. If a screen doesn't answer a question from `user-questions.md`, it doesn't exist.

**Why:** Question-oriented design ensures every pixel serves the user's actual needs, not assumed needs.

### 9. Search Is the Primary Navigation

Users find things by asking, not by browsing. Search is the first interface. Categories, filters, and navigation are secondary.

**Why:** Search is faster than navigation. The product's core value is finding information quickly.

### 10. Keep Components Small

Components should do one thing. If a component grows beyond 150 lines, split it. If a component handles two concerns, separate them.

**Why:** Small components are easier to understand, test, and maintain. Large components become liability.

### 11. Avoid Premature Abstractions

Don't create abstractions until you see three instances of the same pattern. Premature abstractions create coupling and complexity.

**Why:** Abstractions have a cost. Three is a pattern. Two is a coincidence.

### 12. Write Code for Future Maintainers

Code is read more than it is written. Write for the person who maintains this in six months — including yourself.

**Why:** Maintainability reduces long-term cost. Clever code is hard code.

### 13. When Architecture and Implementation Conflict, Architecture Wins

If the architecture says data flows one way and the implementation wants to flow another way, fix the implementation. Architecture decisions are deliberate; implementation shortcuts are accidental.

**Why:** Architecture represents product thinking. Implementation represents coding convenience. Product thinking wins.

---

## Verification

Before merging any change, verify:

- [ ] No new Compendium data duplication
- [ ] No 5etools direct access outside adapter
- [ ] No desktop-only features or shortcuts
- [ ] User problem is defined in `user-questions.md`
- [ ] Feature does not add unnecessary complexity
- [ ] Architecture was consulted before implementation
- [ ] Performance targets are met
- [ ] Screen answers a question from `user-questions.md`
- [ ] Search works for new entities
- [ ] Components are small and focused
- [ ] No premature abstractions
- [ ] Code is readable and documented where needed
- [ ] Architecture and implementation are aligned

---

## Summary

These rules are immutable. They exist to protect the product's focus, maintainability, and performance. When in doubt, refer to these rules. When rules conflict, refer to the product philosophy.

The architecture is the blueprint. The code is the building. The blueprint comes first.

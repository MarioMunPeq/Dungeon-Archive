# Development Roadmap

## Overview

Phased development with functional milestones. Each phase delivers a working product increment.

**Platform:** Mobile-only for product. Desktop for development only.

---

## Phase 1: Foundation (Weeks 1-2)

**Goal:** Core infrastructure and basic compendium search.

### Deliverables
- [ ] Project setup (Vite, React, TypeScript, Tailwind)
- [ ] IndexedDB integration (Dexie.js)
- [ ] Basic search functionality
- [ ] 5etools adapter layer (build-time)
- [ ] Static JSON generation for spells
- [ ] Spell search and detail view
- [ ] Basic navigation (bottom tabs)
- [ ] Mobile-first responsive layout

### Milestone
**Search for any spell by name, see full details.**

---

## Phase 2: Compendium Essentials (Weeks 3-4)

**Goal:** Complete MVP compendium categories.

### Deliverables
- [ ] Conditions data and search
- [ ] Actions data and search
- [ ] Equipment data and search
- [ ] Heterogeneous search results
- [ ] Search result ranking
- [ ] Recent searches
- [ ] Favorites system

### Milestone
**Search across spells, conditions, actions, and equipment with instant results.**

---

## Phase 3: Campaign System (Weeks 5-6)

**Goal:** Basic campaign management with DM tools.

### Deliverables
- [ ] Campaign creation and switching
- [ ] Single active campaign
- [ ] Session notes (markdown)
- [ ] NPC management
- [ ] Basic Reveal System (DM/Player modes)
- [ ] Monsters (DM-only by default)

### Milestone
**DM can create a campaign, manage NPCs, and control what players see.**

---

## Phase 4: Character Management (Weeks 7-8)

**Goal:** Party and character sheets.

### Deliverables
- [ ] Character creation
- [ ] Basic character sheet view
- [ ] Inventory tracking
- [ ] Party roster
- [ ] Character notes

### Milestone
**Players can manage their characters and view party information.**

---

## Phase 5: Session Tools (Weeks 9-10)

**Goal:** DM session management tools.

### Deliverables
- [ ] Session logging
- [ ] Encounter tracker (non-combat)
- [ ] Loot tracking
- [ ] Location references
- [ ] Session summary generation

### Milestone
**DM can track sessions, log encounters, and manage loot.**

---

## Phase 6: Polish (Weeks 11-12)

**Goal:** Refine UX and prepare for release.

### Deliverables
- [ ] Search performance optimization
- [ ] Offline reliability testing
- [ ] Mobile touch optimization
- [ ] Accessibility improvements
- [ ] Error handling and recovery
- [ ] Data validation and integrity

### Milestone
**App is reliable, fast, and pleasant to use during sessions.**

---

## Post-MVP (Future Phases)

### Phase 7: Advanced Compendium
- Races
- Classes
- Feats
- Magic items
- Rules

### Phase 8: Advanced Tools
- Initiative tracking (optional)
- Combat calculator
- Map integration
- Cloud sync

### Phase 9: Community
- Custom content creation
- Campaign sharing
- Export/import
- Print-friendly views

---

## Technical Dependencies

### External
- **5etools** — D&D 5e data source (read-only)
- **Dexie.js** — IndexedDB wrapper
- **TanStack Query** — Async state management
- **Zustand** — Client state management

### Internal
- **Build system** — Vite + TypeScript
- **Testing** — Vitest + Testing Library
- **Linting** — ESLint + Prettier
- **Type checking** — TypeScript strict mode

---

## Success Criteria

### Phase 1 Success
- App starts in < 2 seconds
- Search returns results in < 200ms
- Works offline for core search
- Mobile-friendly interface

### Phase 4 Success
- Character sheet loads in < 1 second
- Campaign data persists across sessions
- Reveal System correctly filters content
- Search respects DM/Player permissions

### Phase 6 Success
- Zero data loss during sessions
- Smooth 60fps interactions
- Intuitive navigation without instructions
- Reliable offline performance

---

## Risk Mitigation

### Data Complexity
- Start with simplest categories (spells, conditions)
- Progressively add complexity
- Validate data integrity at each phase

### Performance
- Pre-index all search data
- Lazy load non-essential features
- Profile and optimize bottlenecks

### Offline Reliability
- Test with network disabled
- Graceful fallback for missing data
- Regular data integrity checks

### Mobile UX
- Test on real devices early
- Optimize for thumb reach zones
- Minimize text input requirements

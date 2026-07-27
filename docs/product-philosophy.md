# Product Philosophy

## North Star

> **Designed for people sitting around a table with a phone in one hand and dice in the other.**

Dungeon Archive is a **companion app** for D&D 5e tabletop sessions. It exists to reduce the dead time between turns — the moments when a player looks up a spell, a DM checks a condition, or someone tries to remember what an item does.

It is **not** a VTT, a campaign manager, a digital rulebook, a character builder, a combat tracker, a dice roller, or a wiki engine. It is a tool that lives in the gaps of gameplay, disappears when it's done its job, and never becomes the center of attention.

---

## Product Principles

These 14 principles guide every product decision:

1. **Utility over aesthetics.** Every screen exists to solve a specific problem. Visual polish is secondary to functional clarity.

2. **Speed over animations.** A fast result beats a beautiful transition. 200ms search is the minimum standard.

3. **Reduce downtime.** The core metric: how many seconds of gameplay does each interaction cost? Every feature must justify its impact on session flow.

4. **One-handed first.** The primary interface is a phone held in one hand. Thumb reach zones dictate layout. No feature requires two hands.

5. **Offline-first.** Core functionality (compendium search, campaign data) works without internet. Network adds extras, never blocks essentials.

6. **Search-first.** The search bar is the primary interface. Users find things by asking, not by navigating hierarchies.

7. **Question-oriented.** Every screen answers a question. "What spell should I use?" "What does this condition do?" "How much does this cost?" If a screen doesn't answer a question, it doesn't exist.

8. **Everything is searchable.** Spells, monsters, equipment, conditions, actions, rules — all findable from a single search. Search spans every category.

9. **Compendium is immutable.** User-generated content never mixes with official data. The compendium is read-only, authoritative, and consistent.

10. **Campaign data is living.** Session notes, character sheets, and DM preparations are the user's own content — created, edited, and organized within the app.

11. **Never duplicate D&D content.** The app doesn't reproduce the Player's Handbook. It indexes, links, and surfaces — it never quotes at length.

12. **Players never see spoilers.** The Reveal System protects DM content. Players see only what the DM allows.

13. **Every screen answers one question.** A single purpose per screen. If a screen tries to do two things, split it.

14. **Every interaction disappears into gameplay.** The app is a tool, not entertainment. The best interaction is the one the user forgets they had.

---

## Core Values

### Companion, Not Commander

The app supports the session — it doesn't run it. A DM uses their own methods for encounter design, world-building, and campaign planning. The app handles the moment-to-moment lookups and data management that slow things down.

### Simplicity Over Completeness

Every feature added increases cognitive load. Every option added increases decision time. The app is intentionally incomplete — it covers the essentials and deliberately omits the rest.

### Progressive Disclosure

Start with the simplest version of every interaction. Add complexity only when the user needs it. The app should be immediately usable without reading a manual.

### Data Integrity

Official D&D content stays pure. User content stays separate. The boundary is never ambiguous.

---

## Success Criteria

The app is successful when:

- A player looks up a spell in under 3 seconds
- A DM finds a monster's stat block in under 5 seconds
- The app is never the reason a session slows down
- The app is forgotten during gameplay (used, then set aside)
- New users understand core functionality without instruction
- Core functionality works without internet connection

---

## Anti-Features (Excluded Product Categories)

See [anti-features.md](./anti-features.md) for the full list of excluded product categories and the reasoning behind each exclusion.

Core exclusions:
- Virtual Tabletop (VTT)
- Character builder
- Combat tracker / Initiative tracker
- Campaign manager / Worldbuilder
- Dice roller
- Map editor
- Rule automation / macros
- AI-powered DM assistance

---

## Disappearing Software

> **The application should never become the focus of attention.**

The best experience is:

1. Player asks a question.
2. Player finds the answer.
3. Player immediately returns attention to the table.

Dungeon Archive should disappear into the gameplay. The moment a user notices the app — admires its design, explores its features, or spends time adjusting settings — the product has failed.

This is the opposite of most software. Most applications compete for attention. Dungeon Archive surrenders it.

### What This Means

- **No onboarding.** The app should be immediately usable without instruction.
- **No exploration.** Every screen answers a question; there is nothing to browse for fun.
- **No notifications.** The app never interrupts gameplay.
- **No gamification.** No achievements, streaks, or rewards for using the app.
- **No suggestions.** The app never says "Did you know?" or "You might also like..."
- **No social features.** The app is not a community; it is a tool.
- **No customization for its own sake.** Themes, wallpapers, and personalization add complexity without reducing downtime.

### The Test

After a session, the user should barely remember using the app. They should remember the game, the dice rolls, the laughter — not the interface. The app served its purpose and vanished.

That is disappearing software.

### Why It Matters

The tabletop experience is social, physical, and immediate. A phone in hand is already a compromise — it pulls attention away from the table. The app must minimize that compromise by being as fast and invisible as possible.

Every second spent in the app is a second not spent playing. The goal is to make that time as close to zero as possible.

The application should disappear. The game should remain.

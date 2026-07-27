# Anti-Features

## Overview

Dungeon Archive is intentionally incomplete. This document lists features that are **explicitly excluded** from the product. These are not "future features" — they are permanent exclusions that define what the product is not.

The purpose of this list is to:
1. Prevent scope creep
2. Clarify product boundaries
3. Help users choose the right tool for their needs
4. Keep the product focused on its core mission

---

## Core Mission

> **Reduce tabletop session downtime by making D&D 5e reference information instantly searchable.**

Every feature must directly support this mission. If it doesn't reduce downtime, it doesn't belong.

---

## Excluded Features

### Virtual Tabletop (VTT)

**What it is:** A digital interface for playing D&D online with maps, tokens, and real-time interaction.

**Why excluded:**
- Requires internet connectivity (breaks offline-first)
- Requires a server backend (breaks client-only architecture)
- Changes the nature of the product from companion to platform
- Existing VTTs (Roll20, Foundry, Owlbear Rodeo) already do this well

**Alternative:** Use Owlbear Rodeo, Roll20, or Foundry VTT for online play.

---

### Combat Tracker

**What it is:** Initiative order, hit points, conditions, and combat round management.

**Why excluded:**
- The product is not a combat manager
- Combat tracking requires constant interaction during turns (breaks "disappears into gameplay")
- Adds complexity without reducing downtime (combat tracking is its own workflow)
- DMs typically use their own methods (paper, whiteboard, etc.)

**Alternative:** Use paper initiative tracker or dedicated combat apps.

---

### Initiative Tracker

**What it is:** A system for rolling initiative and managing turn order.

**Why excluded:**
- Subset of combat tracker
- Requires constant interaction during combat
- DMs typically handle this manually
- Would become the focus of the session rather than a companion

**Alternative:** Roll dice and write on paper.

---

### Dice Roller

**What it is:** Virtual dice rolling with results and calculations.

**Why excluded:**
- Physical dice are part of the tabletop experience
- Rolling dice is a social, tactile activity
- Digital dice feel impersonal and reduce engagement
- The product is not about replacing physical components

**Alternative:** Roll physical dice.

---

### Character Builder

**What it is:** Step-by-step character creation with level-up tracking.

**Why excluded:**
- Complex, time-consuming feature
- Requires extensive validation rules
- Character creation is a social, collaborative activity
- Existing tools (D&D Beyond, Roll20) do this well
- Adds significant complexity without reducing session downtime

**Alternative:** Use D&D Beyond or paper character sheets.

---

### Campaign Manager

**What it is:** Long-term campaign planning, story arcs, world-building, and session scheduling.

**Why excluded:**
- Changes the product from companion to project management tool
- Requires ongoing maintenance and data entry
- Campaign planning happens outside sessions (not during downtime)
- Existing tools (Notion, Obsidian, World Anvil) do this better

**Alternative:** Use Notion, Obsidian, or World Anvil for campaign planning.

---

### World Builder

**What it is:** Creating and managing fictional worlds, maps, lore, and setting details.

**Why excluded:**
- Creative, time-consuming activity
- Not related to session downtime reduction
- Requires extensive content creation tools
- Changes the product from reference tool to creative tool

**Alternative:** Use World Anvil, Azgaar's Fantasy Map Generator, or paper.

---

### Map Editor

**What it is:** Creating and editing tactical maps with tokens and fog of war.

**Why excluded:**
- Requires complex graphics editor
- Changes the product to a visual tool
- Existing map tools (Dungeondraft, Wonderdraft, Owlbear Rodeo) do this well
- Not related to reference lookup

**Alternative:** Use Dungeondraft, Wonderdraft, or Owlbear Rodeo for maps.

---

### Wiki Engine

**What it is:** Creating and organizing interconnected articles about campaign world.

**Why excluded:**
- Requires content creation and editing tools
- Changes the product from reference tool to content management system
- Existing wikis (Notion, Obsidian, World Anvil) do this better
- Not related to session downtime reduction

**Alternative:** Use Notion or Obsidian for campaign wikis.

---

### Rule Automation

**What it is:** Automated rule calculations, macros, and condition tracking.

**Why excluded:**
- Requires complex rule engine
- Changes the product from reference tool to automation platform
- Removes DM agency and judgment
- Increases complexity exponentially

**Alternative:** DMs make rulings manually.

---

### Calendar System

**What it is:** In-game calendar tracking, time passage, and scheduling.

**Why excluded:**
- Niche feature with limited use cases
- Adds complexity without reducing downtime
- DMs typically handle time manually
- Not related to reference lookup

**Alternative:** Track time manually or use simple notes.

---

### Quest Generator

**What it is:** AI-powered or procedural quest creation.

**Why excluded:**
- Creative activity, not reference lookup
- Requires AI/ML infrastructure
- Changes the product from tool to content generator
- DMs prefer their own creative content

**Alternative:** DMs create their own quests.

---

### AI DM Assistance

**What it is:** AI-powered suggestions for DMs (encounter design, story hooks, etc.).

**Why excluded:**
- Requires AI/ML infrastructure
- Changes the product from tool to assistant
- Removes DM agency and creativity
- Adds complexity and potential inaccuracies
- Not related to reference lookup

**Alternative:** DMs use their own judgment and resources.

---

### Inventory Management

**What it is:** Detailed item tracking, weight calculation, and encumbrance rules.

**Why excluded:**
- Detailed tracking requires constant data entry
- Most groups ignore encumbrance rules
- Changes the product from reference tool to bookkeeping tool
- Not related to session downtime reduction

**Alternative:** Use paper or simple notes for inventory.

---

### Spell Slot Tracker

**What it is:** Tracking spell slot usage and rests.

**Why excluded:**
- Requires constant interaction during sessions
- Players typically track this manually
- Changes the product from reference tool to tracker
- Not related to reference lookup

**Alternative:** Players track spell slots on paper.

---

### NPC Generator

**What it is:** Procedural or AI-powered NPC creation.

**Why excluded:**
- Creative activity, not reference lookup
- DMs prefer their own NPCs
- Adds complexity without reducing downtime
- Changes the product from tool to generator

**Alternative:** DMs create their own NPCs.

---

### Encounter Builder

**What it is:** Tools for designing balanced encounters with XP calculation.

**Why excluded:**
- Complex calculation tool
- Happens outside sessions (not during downtime)
- Existing tools (Kobold Fight Club) do this well
- Not related to reference lookup

**Alternative:** Use Kobold Fight Club or DMG guidelines.

---

### Treasure Generator

**What it is:** Procedural loot generation based on challenge rating.

**Why excluded:**
- DMs typically prepare loot in advance
- Adds complexity without reducing downtime
- Not related to reference lookup
- Existing tools exist for this purpose

**Alternative:** Use DMG loot tables manually.

---

### Session Recorder

**What it is:** Audio/video recording of sessions.

**Why excluded:**
- Requires microphone/camera access
- Privacy concerns
- Changes the product from tool to recording platform
- Not related to reference lookup

**Alternative:** Use phone or dedicated recording device.

---

## Feature Request Filter

When evaluating new feature requests, ask:

1. **Does this reduce session downtime?** If no, reject.
2. **Does this require constant interaction during sessions?** If yes, reject.
3. **Does this change the product from companion to platform?** If yes, reject.
4. **Does this require a server backend?** If yes, reject.
5. **Does this require internet connectivity?** If yes, reject.
6. **Does this duplicate existing tools?** If yes, consider alternatives.

---

## Permanent Product Rules

### The 80% Rule

> **"If 80% of users would not use this feature during a normal game session, it probably does not belong in Dungeon Archive."**

This rule exists because Dungeon Archive is a **companion**, not a platform. The product serves the moments between turns — the quick lookups, the reference checks, the "what does this spell do again?" moments.

Features that serve edge cases, niche workflows, or rare use cases add complexity without proportionate value. Every feature increases cognitive load, maintenance burden, and UI clutter. If most users will never touch it during a session, the cost outweighs the benefit.

The app must stay simple enough to use without thinking. Features that serve 20% of users in 20% of sessions dilute the core experience for everyone.

**How to apply:** Before adding any feature, ask: "Will most users need this during a typical session?" If the answer is no, the feature does not belong.

### The "Just Because" Rule

> **"We can build it" is never a valid reason. "We need it at the table" is.**

This rule exists because technical capability does not equal product value. The fact that something is possible does not mean it should exist.

Dungeon Archive's purpose is to reduce downtime at the table. Every feature must justify its existence by answering a real question that real players and DMs ask during sessions. "Because we can" is a technical justification. "Because we need it" is a product justification.

The difference matters. Technical justification leads to feature bloat. Product justification leads to focused utility.

**How to apply:** When proposing a feature, the first question is not "Can we build this?" It is "Do users need this at the table?" If the answer is no, stop there.

---

## Summary

Dungeon Archive is a **reference companion**, not a **game platform**. It finds information fast and disappears. Every excluded feature exists to preserve this focus.

The product is successful when it's forgotten during gameplay — used, then set aside.

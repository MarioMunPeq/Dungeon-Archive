# Anti-Features

## Overview

Dungeon Archive is intentionally incomplete. This document lists product categories that are **explicitly excluded** — permanent exclusions, not "future features". They define what the product is not.

The purpose of this list is to:

1. Prevent scope creep.
2. Clarify product boundaries.
3. Help users choose the right tool for their needs.
4. Keep the product focused on its core mission.

## Core Mission

> **Reduce dead time during play.**

The single test for every feature request:

> **Does this reduce the time players spend waiting because someone is looking for information?**

If the answer is no, the feature does not belong.

## The Filter

When evaluating any proposed feature, run it through this filter:

1. **Does it reduce dead time at the table?** If no, reject.
2. **Does it require constant data entry or maintenance?** If yes, reject (consultation over administration).
3. **Does it turn the app from reference into a platform?** If yes, reject.
4. **Does it need a server or an internet connection?** If yes, reject (offline-first). The single documented exception is **Cloud Backup**, an optional manual recovery copy that is never a dependency of any core feature.
5. **Does it duplicate a tool that already does this well?** If yes, reject and point users to that tool.
6. **Does it duplicate Compendium data?** If yes, reject (the Compendium is the single source of truth).

## Excluded Features

### Virtual Tabletop (VTT)

**What it is:** Online play with maps, tokens, and real-time interaction (Roll20, Foundry, Owlbear Rodeo).

**Why excluded:** Requires internet and a server. Changes the product from companion to platform. Online play tools already do this well.

**Alternative:** Roll20, Foundry VTT, or Owlbear Rodeo.

---

### Combat Manager

**What it is:** Full combat management — initiative order, turn automation, encounter pacing, monster HP pools, and positional tracking.

**Why excluded:** Full encounter management turns the app into the focus of the session rather than a companion. The app ships a deliberate **lightweight combat tab** — per-player hit points with quick deltas, a condition tray, and a turn checklist — that takes seconds to use and disappears. Everything beyond that (initiative rolls, encounter design, monster tracking, movement/positioning) is excluded.

**Alternative:** Paper, a whiteboard, or a dedicated combat/VTT tool.

---

### Initiative Tracker

**What it is:** Rolling initiative and managing turn order.

**Why excluded:** Requires constant interaction mid-combat — the opposite of a reference companion. DMs handle this manually.

**Alternative:** Roll dice and write on paper.

---

### Dice Roller

**What it is:** Virtual dice rolling with results and calculations.

**Why excluded:** Physical dice are part of the tabletop experience — tactile and social. Digital dice are impersonal. The product is not about replacing physical components.

**Alternative:** Roll physical dice.

---

### Character Builder

**What it is:** Step-by-step character creation and level-up tracking.

**Why excluded:** Complex, time-consuming, and full of validation rules. Character creation is a social, collaborative activity. Dedicated tools do this well.

**Alternative:** D&D Beyond or paper character sheets.

---

### Character Sheet Replacement

**What it is:** A full digital character sheet that replaces the paper sheet — ability scores and modifiers, all stats, proficiencies, features, resources, and per-use tracking.

**Why excluded:** Full sheets are administration, not consultation. They require constant maintenance and invite the user to run their whole character from the phone. Dungeon Archive stores only the repeatedly-consulted combat information (passive senses, known spells, equipped items), never a full sheet.

**Alternative:** Paper character sheet. The phone complements it; it does not replace it.

---

### Campaign Manager

**What it is:** Long-term campaign planning, story arcs, session scheduling, plot tracking.

**Why excluded:** Turns the product from companion into a project-management tool. Requires ongoing maintenance and data entry. Campaign planning happens outside sessions — it is not dead time at the table. Note: Dungeon Archive is not a "lightweight version" of these tools; it is a different category of product.

**Alternative:** A campaign planner, wiki, or note tool of the DM's choice.

---

### Digital Notebook / Wiki Engine

**What it is:** Creating and organizing interconnected articles about the campaign world (a "second brain" or "DM wiki").

**Why excluded:** Requires content creation and editing tools. Changes the product from reference tool to content-management system. Dedicated wikis and notes apps do this better. This product is explicitly **not** a lightweight Obsidian/Notion.

**Alternative:** Notion, Obsidian, or a wiki tool.

---

### Worldbuilding Tool

**What it is:** Creating and managing fictional worlds, maps, lore, and settings.

**Why excluded:** Creative, time-consuming activity. Not related to session-time retrieval. Changes the product from reference tool to creative tool.

**Alternative:** A worldbuilding platform or paper.

---

### Timeline Manager

**What it is:** Tracking in-game dates, events, and chronology.

**Why excluded:** A niche workflow with ongoing maintenance. DMs track time manually. Not related to reference lookup.

**Alternative:** Simple notes or paper.

---

### Map Editor

**What it is:** Creating and editing tactical maps with tokens and fog of war.

**Why excluded:** Requires a complex graphics editor. Changes the product into a visual tool. Dedicated map tools exist.

**Alternative:** Dungeondraft, Wonderdraft, or Owlbear Rodeo.

---

### Encounter Builder

**What it is:** Designing balanced encounters with XP calculation.

**Why excluded:** Happens outside sessions. A complex calculation tool. Existing tools do this well.

**Alternative:** Kobold Fight Club or DMG guidelines.

---

### Rule Automation / Rules Engine

**What it is:** Automated rule calculations, macros, and condition tracking.

**Why excluded:** Requires a rule engine. Changes the product from reference to automation platform. Removes DM agency and judgment.

**Alternative:** DMs make rulings manually; the app provides the rule text.

---

### Inventory Manager

**What it is:** Detailed item tracking, weight calculation, and encumbrance.

**Why excluded:** Constant data entry. Most groups ignore encumbrance. Turns reference into bookkeeping. Party members may reference equipped items, but the app never tracks counts, weights, or containers.

**Alternative:** Paper or simple notes.

---

### Equipment Tracker / Gold Tracker / XP Tracker

**What it is:** Tracking equipment quantities, currency, or experience points.

**Why excluded:** All are bookkeeping. All require constant maintenance. None reduce dead time at the table.

**Alternative:** Paper character sheet.

---

### Spell Slot Tracker

**What it is:** Tracking spell slot usage and rests.

**Why excluded:** Constant interaction during sessions. Players track this manually on their sheets. Not reference lookup.

**Alternative:** Players track spell slots on paper.

---

### NPC Generator / Quest Generator / Treasure Generator / AI DM Assistance

**What it is:** Procedural or AI-powered creation of NPCs, quests, treasure, or DM suggestions.

**Why excluded:** Creative activities, not reference lookup. Require AI/ML infrastructure. Change the product from tool to generator/assistant. DMs prefer their own creative content.

**Alternative:** DMs create their own content.

---

### AI Campaign Generator

**What it is:** AI-generated campaigns, plots, or adventures.

**Why excluded:** Creative generation is the opposite of consultation. Requires infrastructure. Changes the product's nature.

**Alternative:** DMs write their own adventures.

---

### Calendar System

**What it is:** In-game calendar and scheduling.

**Why excluded:** Niche, with manual tracking. Not related to reference lookup.

**Alternative:** Track time manually.

---

### Session Recorder

**What it is:** Audio/video recording of sessions.

**Why excluded:** Requires microphone/camera access, raises privacy concerns, and changes the product from tool to recording platform.

**Alternative:** A dedicated recording device.

---

### Multiplayer / Sync / Social Features

**What it is:** Real-time sync, shared sessions, chat, community features.

**Why excluded:** Require a server and internet, breaking offline-first. Add accounts and complexity without reducing dead time. The one exception is **Cloud Backup**: an optional, manual upload/restore of local data (see [cloud-backup.md](./cloud-backup.md)). It is a recovery copy, not a sync engine — there is no live sync, no shared state, and no multiplayer.

**Alternative:** The phone is a personal reference; the table is the shared screen.

---

## Summary

Dungeon Archive is a **reference companion**, not a **game platform**. It finds information fast and disappears. Every excluded feature exists to preserve this focus.

The product succeeds when it is forgotten during gameplay — used, then set aside.

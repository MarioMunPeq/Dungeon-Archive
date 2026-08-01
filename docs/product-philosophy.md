# Product Philosophy

## North Star

> **Dungeon Archive is a mobile-first table companion for D&D 5e.**
> **Its sole purpose is reducing dead time during play.**

The dead time is the gap between a question and its answer: a player needs a spell, a DM needs a stat block, someone forgot what a condition does. That gap is what the app exists to close.

Fast information retrieval is always prioritized over feature richness.

## Core Problem

During a session, information lives in books, PDFs, and spreadsheets. Finding something takes seconds or minutes. While someone looks, the table waits.

Dungeon Archive puts the reference data and the lightweight context of the game on the phone that is already on the table. When a question comes up, the answer is a tap away.

Every feature, screen, and screen element must pass one test:

> **Does this reduce the time players spend waiting because someone is looking for information?**

If the answer is no, the feature does not belong in this project.

## Primary Users

### The Dungeon Master

Uses Dungeon Archive to:

- Look up spells, conditions, actions, equipment, monsters, magic items, and feats without opening a book.
- Keep lightweight campaign context: an adventure title, description, objectives, notes, and pinned references.
- Answer "what happened last session?" from session history.

The DM is the main consumer of the Compendium. Fast retrieval matters most during combat and encounters.

### The Player

Uses Dungeon Archive to:

- Look up their own spells and equipment (via the party's lightweight player reference sheets).
- Find rules references without asking the DM.

Players are secondary users. The app never requires players to create or maintain anything.

## The Mental Model

The application is a **second screen that sits next to the table**. It answers questions. It does not ask users to do work.

- The app is opened when a question appears.
- The answer is found.
- The phone is put down.

There is no dashboard to manage, no status to update, no workflow to complete. The app does not want to be used; it wants to be looked up.

## What Dungeon Archive Is Today

A client-side mobile web app that ships with:

- **The Compendium** — the complete reference database for D&D 5e (spells, conditions, actions, equipment, monsters, magic items, feats), built from official data at build time and available offline.
- **Search** — instant lookup across the entire Compendium.
- **Campaign context** — an adventure with a title, description, objectives, private DM notes, and pinned entity references. One active adventure, previous ones archived.
- **Player reference** — lightweight party sheets holding only what is consulted at the table: passive senses, known spells, equipped armor/weapons/magic items, and notes. References point into the Compendium; nothing is duplicated.
- **Session** — a pinned list of entities for the current encounter, and the session history kept by the DM.

Nothing in the app requires a server, a login, or an internet connection.

## Product Principles

### 1. Speed Over Completeness

The Compendium returns results in milliseconds. Search is synchronous over a prebuilt in-memory index. Everything a feature adds must justify its cost in retrieval time. If completeness slows the answer, completeness loses.

### 2. Consultation Over Administration

The app is consulted, not maintained. Data entry is the enemy: the less the user must type, the better. Campaign state is kept deliberately minimal (adventure metadata, objectives, notes, references). Anything that turns the app into a project-management tool is rejected.

### 3. The Compendium Is the Heart

The Compendium is the single source of truth for rules. User data stores **references** (canonical IDs), never copies of rules text. If a piece of information exists in the Compendium, the app never stores a second version of it. This keeps official data immutable and user data tiny.

### 4. Combat Is Where Dead Time Matters Most

During combat, waits are felt in rounds. Stat blocks, conditions, and spell lookups during a fight are the highest-value moments of the app. These flows are optimized first and never regressed.

### 5. Minimal State

The user layer holds only lightweight context:

- Adventure: title, description, objectives, notes, pinned references, archive status.
- Party (player reference): name, class, level, subclass, ability modifiers, quick combat values (AC, initiative, passive perception, spell DC/attack), known spells, weapons, magic items (as references), one quick note.
- Session: a list of pinned entity references and the DM's session history.

Nothing heavier. No inventories, no XP tracking, no worldbuilding.

### 6. Everything Immediately Accessible

Open the app, open the player, and everything needed for combat is visible. No navigation through hierarchies to reach a stat block. Search is a tap away from every screen. The path from question to answer is as short as possible.

### 7. The App Should Feel Quiet

No dashboards, no analytics, no project management, no workflows, no "workspace". The app is a reference shelf. It should not compete for attention, and it should never interrupt play.

## Disappearing Software

> **The application should never become the focus of attention.**

The best experience is:

1. A question comes up at the table.
2. The answer is found.
3. Attention returns to the game.

The moment a user notices the app — admires its design, explores its features, or spends time in settings — the product has failed. The app serves its purpose and is set aside.

- No onboarding.
- No exploration for fun.
- No notifications.
- No gamification.
- No suggestions ("Did you know?").
- No social features.
- No customization for its own sake.

After a session, the user should barely remember using the app. They should remember the game — not the interface.

## Success Criteria

The product succeeds when:

- A spell is found in under 3 seconds.
- A monster stat block is found in under 5 seconds.
- The app is never the reason a session slows down.
- The app works with no internet connection.
- New users understand it without instruction.
- The app is forgotten during gameplay: used, then set aside.

## Anti-Features

The project explicitly excludes entire categories of features. See [anti-features.md](./anti-features.md) for the full list. In short: Dungeon Archive is **not** a campaign manager, a VTT, a character builder, a combat tracker, a digital notebook, or a worldbuilding tool.

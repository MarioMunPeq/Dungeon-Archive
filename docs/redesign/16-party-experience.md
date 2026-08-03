# 16 — Party Experience

## Purpose

The Party Experience is the operational center for managing the adventuring party.

It is not a character selection screen.

It is not a database.

It is the place where the Dungeon Master maintains awareness of the current group.

Its primary purpose is to answer one question instantly:

"How is my party doing right now?"

Everything else is secondary.

---

# Design Rationale

During a game session, the Dungeon Master constantly switches attention between players.

The Party screen exists to minimize this context switching.

Users should never need to remember information that the interface can display.

The Party should become a persistent overview rather than a management tool.

Management actions exist.

Awareness is the priority.

---

# User Journey

Typical session:

Open Dungeon Archive

↓

Party appears

↓

Locate the desired character

↓

Open character

↓

Inspect information

↓

Open related entity (spell, item, condition...)

↓

Return

↓

Exact previous Party position restored

The user should never feel that navigation interrupted their workflow.

---

# User Goals

The Party Experience is successful if users can:

• Find any party member in under 2 seconds.

• Open any character with a single tap.

• Check HP and AC instantly.

• Identify critical conditions without opening the character.

• Switch between characters rapidly.

• Resume their previous context after returning.

---

# Product Philosophy

The Party screen should behave like a real tabletop.

Every player is visible.

Every important status is immediately available.

Nothing feels hidden.

Nothing requires unnecessary drilling.

Information should remain one tap away.

---

# Core Principles

The Party Experience should be:

Immediate.

Readable.

Dense.

Predictable.

Scannable.

Reliable.

Every interaction should reduce table downtime.

---

# Information Hierarchy

Each character card should expose:

Portrait

↓

Character Name

↓

Class

↓

Level

↓

Hit Points

↓

Armor Class

↓

Important Status Indicators

Everything else belongs inside the Character page.

---

# Character Recognition

Recognition should happen before reading.

Portraits.

Names.

Color-coded status.

Small metadata.

The user should identify the desired character almost instantly.

---

# Character Cards

Character cards represent navigation.

Not editing.

The entire card should behave as a touch target.

Cards should feel lightweight.

Compact.

Highly readable.

Avoid oversized cards.

Avoid unnecessary decoration.

---

# Status Indicators

Only essential status should appear directly in the Party.

Examples:

Low HP.

Unconscious.

Dead.

Concentrating.

Conditions.

Everything else remains inside the Character page.

The objective is awareness.

Not completeness.

---

# Health Presentation

Health information is critical.

It should remain visible without dominating the interface.

Users should understand a character's condition with a quick glance.

Avoid excessive visual effects.

Health should communicate urgency through clarity.

Not drama.

---

# Party Density

The Party should expose as many members as comfortably possible.

Large cards reduce efficiency.

Tiny cards reduce readability.

The redesign should balance recognition with information density.

---

# Scrolling

Scrolling should remain minimal.

A standard party should fit comfortably within a small amount of scrolling.

Users should rarely lose awareness of the entire group.

---

# Character Actions

Primary interaction:

Tap card

↓

Open Character

Secondary interactions:

Long press

↓

Contextual actions

Examples:

Rename.

Duplicate.

Delete.

Export.

Primary interactions should never be hidden.

Advanced actions should never clutter the interface.

---

# Party State

The Party should always communicate its current state.

Examples:

No characters.

Incomplete party.

Full party.

Imported party.

Errors.

Users should never wonder why information is missing.

---

# Empty State

When no Party exists:

Explain the situation.

Offer:

Create Party.

Import Party.

The screen should immediately become useful.

Never appear unfinished.

---

# Large Parties

Future support for larger parties should preserve the same interaction model.

Scrolling should scale naturally.

Card density should remain consistent.

No alternative layouts should appear.

---

# Persistence

Returning from:

Character

Spell

Item

Monster

Condition

Should restore:

Scroll position.

Selection.

Reading context.

The user should never lose orientation.

---

# Performance

The Party screen should feel instantaneous.

Switching between characters should never appear delayed.

Scrolling should remain perfectly smooth.

State updates should appear immediately.

---

# Future Scalability

Future additions may include:

Initiative.

Temporary effects.

Spell slots.

Inspiration.

Resources.

These additions must never compromise readability.

If information becomes excessive,

move it inside the Character page.

Never overload the Party.

---

# Decision Tree — New Information

Before displaying additional information ask:

Will the Dungeon Master need this repeatedly during almost every session?

↓

YES

↓

Display in Party.

↓

NO

↓

Display in Character.

The Party exists for rapid awareness.

Not detailed inspection.

---

# Good Example

```
────────────────────────

🧙 Arannis

Wizard • Lv 7

HP 31 / 42

AC 14

⚡ Concentrating

────────────────────────

⚔ Kael

Fighter • Lv 7

HP 62 / 68

AC 19

────────────────────────
```

Recognition happens immediately.

---

# Bad Example

```
Portrait

Biography

Inventory Summary

Experience

Languages

Traits

Equipment

Story

Personality

Alignment

HP

```

The user scrolls through secondary information before reaching critical gameplay data.

The Party has failed.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Make the entire card tappable.

• Reduce unnecessary metadata.

• Prioritize recognition over completeness.

• Standardize every Party card.

• Preserve navigation context.

• Ensure instant switching between characters.

• Remove decorative elements.

• Keep interactions identical for every party member.

Whenever uncertain,

remove information rather than shrinking typography.

Readability always wins.

---

# Anti-patterns

The following are explicitly forbidden:

• Tiny touch targets.

• Oversized profile cards.

• Biography previews.

• Multiple primary actions.

• Hidden primary interactions.

• Decorative graphics.

• Different card layouts.

• Inconsistent status indicators.

• Losing scroll position.

• Page reload feeling when switching characters.

---

# Acceptance Criteria

The Party Experience is considered complete only if:

- [ ] Every party member is identifiable in under two seconds.
- [ ] Character cards are fully tappable.
- [ ] HP and AC are immediately visible.
- [ ] Critical status effects are recognizable at a glance.
- [ ] Navigation preserves context and scroll position.
- [ ] Party cards remain visually consistent.
- [ ] Decorative information has been removed.
- [ ] The screen prioritizes awareness over management.
- [ ] Scrolling remains minimal for typical party sizes.
- [ ] The Party Experience feels like a real-time control panel for the Dungeon Master rather than a character database.

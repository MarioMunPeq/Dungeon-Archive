# 11 — Navigation System

## Purpose

Navigation is the skeleton of Dungeon Archive.

Users should never think about navigation.

They should simply move through the application naturally.

Every navigation decision should reduce the time required to reach information.

If navigation attracts attention to itself,

it has failed.

The ideal navigation system becomes invisible after only a few minutes of use.

---

# Design Rationale

Dungeon Archive is used during live Dungeons & Dragons sessions.

The user is usually interrupted.

Players are waiting.

Time matters.

Navigation therefore prioritizes:

Speed.

Recognition.

Predictability.

Muscle memory.

Not exploration.

The objective is allowing users to reach information almost automatically.

---

# Navigation Philosophy

Dungeon Archive has one navigation model.

Not several.

Users should never wonder:

"Where should I look?"

Every screen should immediately communicate:

Where am I?

How did I get here?

How do I go back?

What can I do next?

Navigation should answer these questions without requiring conscious thought.

---

# Core Principles

Navigation should be:

Flat.

Predictable.

Consistent.

Minimal.

Fast.

Every additional navigation layer increases cognitive load.

Every unnecessary screen transition reduces usability.

The shortest correct path is almost always the best path.

---

# Navigation Hierarchy

The application is divided into four navigation layers.

Layer 1

Bottom Navigation

↓

Layer 2

Pages

↓

Layer 3

Sections

↓

Layer 4

Entity Detail

The application should never exceed four navigation levels.

If a fifth level becomes necessary,

the information architecture should be redesigned instead.

---

# Bottom Navigation

The Bottom Navigation is the primary navigation system.

It contains only the application's permanent destinations.

These destinations should change very rarely.

Every destination must represent a major area of the product.

The Bottom Navigation should never become crowded.

If too many destinations appear,

the information architecture should be reconsidered.

---

# Bottom Navigation Behaviour

The Bottom Navigation should:

Always remain visible while reading.

Hide when scrolling down.

Reappear when scrolling up.

Remain stable.

Never animate dramatically.

Never distract.

Navigation should quietly support reading.

---

# Search

Search is not merely another page.

Search is the primary workflow.

Users should always feel that searching is faster than browsing.

Search should therefore receive visual priority across the entire application.

Whenever uncertainty exists,

users should naturally choose Search.

---

# Back Navigation

Back should always behave predictably.

Never surprise the user.

The Back action should always return the user to their previous context.

Never reset navigation unnecessarily.

Never discard navigation history unexpectedly.

Users should always feel oriented.

---

# Deep Navigation

Deep navigation should become increasingly rare.

Whenever users must perform:

Page

↓

Section

↓

Subsection

↓

Entity

↓

Detail

The hierarchy should be reconsidered.

Information should become flatter whenever possible.

---

# Decision Tree — Navigation

When introducing a new destination:

Question 1

Will users visit it multiple times during every session?

↓

YES

↓

Consider Bottom Navigation.

↓

NO

↓

Continue.

---

Question 2

Is it context-specific?

↓

YES

↓

Place it inside the current page.

↓

NO

↓

Continue.

---

Question 3

Is it temporary?

↓

YES

↓

Dialog.

Bottom Sheet.

Popover.

↓

NO

↓

Continue.

---

Question 4

Does it deserve its own route?

↓

YES

↓

Create a Page.

↓

NO

↓

Integrate it into an existing workflow.

---

# Decision Tree — Actions

When introducing a new action:

Is it destructive?

↓

Require confirmation.

---

Is it reversible?

↓

Snackbar.

Undo.

---

Is it frequently used?

↓

Expose directly.

---

Is it rarely used?

↓

Overflow menu.

---

Is it contextual?

↓

Keep it close to related content.

---

Is it global?

↓

Do not duplicate it on multiple pages.

---

# Decision Tree — New Screens

Before creating a new screen ask:

Can this become a collapsible section?

↓

Can this become a Bottom Sheet?

↓

Can this become a dialog?

↓

Can this become another state of the current page?

↓

Only then create a new page.

Pages are expensive.

State changes are cheap.

---

# Navigation Consistency

Every screen should expose navigation in the same way.

Headers.

Back buttons.

Titles.

Overflow menus.

Search.

Primary actions.

The user should never relearn navigation.

---

# Page Entry

Every page should immediately answer:

What is this?

What can I do?

What information matters first?

No page should require scrolling before users understand where they are.

---

# Entity Navigation

Entity pages represent the end of most navigation flows.

They should therefore minimize additional navigation.

Information should expand.

Not branch.

Prefer:

Collapsible Sections.

Anchors.

Sticky navigation.

Instead of creating multiple entity subpages.

---

# Navigation Feedback

Every navigation action should provide immediate feedback.

State changes should appear responsive.

Navigation should never feel delayed.

Users should always know that their action has been registered.

---

# Error Recovery

Navigation errors should always be recoverable.

Users should never become trapped.

There should always be an obvious path back.

---

# Future Scalability

Future modules such as:

Campaigns.

Characters.

Notes.

NPCs.

Maps.

World Building.

Should integrate into the existing navigation model.

The redesign should avoid introducing alternative navigation systems.

One product.

One navigation language.

---

# Examples

## Good Navigation

Bottom Navigation

↓

Party

↓

Character

↓

Equipment

↓

Item Details

Simple.

Predictable.

Four levels.

---

## Bad Navigation

Home

↓

Campaign

↓

Party

↓

Character

↓

Inventory

↓

Equipment

↓

Item

↓

Properties

↓

Details

Too deep.

Too slow.

Too much context switching.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Consolidate duplicated navigation logic.

• Remove unnecessary intermediate screens.

• Flatten navigation whenever possible.

• Promote frequently used destinations.

• Demote rarely used actions.

• Keep navigation behaviour identical across every page.

• Preserve routing while simplifying presentation.

Whenever multiple navigation solutions appear valid,

choose the one requiring fewer interactions.

---

# Anti-patterns

The following are explicitly forbidden:

• Hamburger menus.

• Hidden primary navigation.

• Deep navigation trees.

• Multiple navigation paradigms.

• Different headers on different pages.

• Page-specific navigation rules.

• Modal chains.

• Dead-end screens.

• Navigation requiring explanation.

• More than four navigation levels.

---

# Acceptance Criteria

The Navigation System is considered complete only if:

- [ ] Users can reach any major feature within four navigation levels.
- [ ] Bottom Navigation contains only permanent destinations.
- [ ] Search is clearly established as the primary workflow.
- [ ] Navigation behaves consistently across the application.
- [ ] Back navigation always preserves user context.
- [ ] Frequently used actions remain easily accessible.
- [ ] Rare actions are progressively disclosed.
- [ ] No screen becomes a navigation dead end.
- [ ] Navigation feels predictable after only a few minutes of use.
- [ ] The application behaves as a single coherent workspace rather than a collection of independent pages.

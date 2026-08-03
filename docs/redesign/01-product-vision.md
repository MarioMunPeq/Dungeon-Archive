# 01 — Product Vision

## Purpose

Dungeon Archive exists to solve one problem exceptionally well:

Help Dungeon Masters retrieve the information they need during a live Dungeons & Dragons session in the shortest possible time.

The application is not designed to entertain.

It is not designed to showcase artwork.

It is not designed to replace official books.

It is designed to eliminate friction.

Every design decision, interaction, component and screen must contribute towards reducing the time required to answer a question.

The user should never fight against the interface.

The interface should become invisible.

---

# Vision

Dungeon Archive should become the reference productivity application for Dungeon Masters.

The long-term goal is to build the "Obsidian for Dungeons & Dragons".

Not because of similar features.

Because of a similar philosophy.

Professional.

Minimal.

Reliable.

Focused.

Fast.

The application should feel like a serious productivity tool that happens to work with Dungeons & Dragons.

It should never feel like a fantasy-themed application.

---

# Product Identity

Dungeon Archive is:

• A mobile-first workspace.

• A reference application.

• A productivity tool.

• A fast lookup engine.

• A session companion.

Dungeon Archive is NOT:

• A digital rulebook.

• A fantasy website.

• A medieval interface.

• A game launcher.

• A decorative application.

• A marketing landing page.

Whenever uncertainty exists, always choose the solution that reinforces the first list rather than the second.

---

# Primary Goal

The primary goal of every interaction is reducing lookup time.

Everything else is secondary.

Beauty exists only to improve readability.

Animations exist only to clarify interaction.

Components exist only to organize information.

Nothing should exist purely for decoration.

---

# Target Experience

Imagine the following situation.

A player asks:

"How does Counterspell work?"

The Dungeon Master:

• unlocks their phone

• opens Dungeon Archive

• finds Counterspell

• reads the important information

• returns to the table

The entire interaction should comfortably fit inside thirty seconds.

That is the primary KPI of the application.

---

# Product Philosophy

Dungeon Archive follows a productivity-first philosophy.

The application assumes the user already knows what they are looking for.

Therefore:

Searching is more important than browsing.

Finding is more important than exploring.

Reading is more important than scrolling.

Clarity is more important than decoration.

Consistency is more important than originality.

Speed is more important than animation.

Information is more important than interface.

Whenever two possible solutions satisfy the same requirement, always choose the one that requires less thinking.

---

# Target Audience

Dungeon Archive is built primarily for Dungeon Masters actively running a session.

It is not optimized for casual reading.

It is not optimized for discovering rules.

It is optimized for answering questions under time pressure.

Every page should support that workflow.

---

# Long-Term Vision

The current application focuses on compendium lookup, parties and adventures.

In the future the product may expand into:

- Characters
- Campaigns
- Session Notes
- Maps
- NPCs
- Encounters
- Timelines
- Initiative
- Quests
- Worldbuilding

The redesign must create a design system capable of supporting these future features without requiring another visual redesign.

The objective is to create a scalable visual foundation rather than a collection of isolated screens.

---

# Scope

This redesign intentionally focuses on the presentation layer.

The following systems are considered stable and should not be redesigned unless required by presentation improvements:

- Business logic
- State management
- Routing
- Persistence
- Repository pattern
- Firebase integration
- Data pipeline
- Compendium generation

The objective is to dramatically improve usability without changing how the application fundamentally works.

---

# Product Success

The redesign succeeds when users naturally describe the application using phrases such as:

"This is incredibly fast."

"I found the information immediately."

"It feels professional."

"It gets out of my way."

"I would genuinely use this during every session."

"It doesn't look like a hobby project."

The redesign fails when users primarily comment about:

- animations
- fancy visuals
- fantasy styling
- decorative elements
- artistic details

The interface should not become memorable.

The experience should.

---

# Engineering Philosophy

Dungeon Archive already has a solid technical foundation.

The redesign should respect that investment.

Avoid rewriting architecture.

Avoid introducing unnecessary complexity.

Avoid replacing stable systems.

Whenever possible:

Improve.

Refine.

Simplify.

Standardize.

Only replace existing implementations when doing so significantly improves consistency or maintainability.

---

# Principles Summary

Everything implemented during this redesign should reinforce the following principles:

1. Speed over everything.

2. Information over interface.

3. Workspace over landing page.

4. Mobile over desktop.

5. One-hand usability.

6. Consistency over originality.

7. Simplicity over complexity.

8. Reading over scrolling.

9. Components over page-specific implementations.

10. Long-term maintainability over short-term visual impact.

---

# Anti-patterns

The redesign must actively avoid:

• Fantasy aesthetics.

• Decorative UI.

• Large hero sections.

• Empty space without purpose.

• Oversized illustrations.

• Website-like layouts.

• Desktop-first thinking.

• Visual effects without functional value.

• Inconsistent spacing.

• Inconsistent typography.

• Duplicate components.

• Page-specific styling.

• Component proliferation.

• Unnecessary animations.

If any existing implementation exhibits one of these anti-patterns, it should be redesigned or removed.

---

# Acceptance Criteria

The Product Vision is considered implemented only if:

- [ ] Every screen supports rapid information retrieval.

- [ ] Every interaction reduces friction.

- [ ] No screen feels like a desktop website.

- [ ] No visual element exists purely for decoration.

- [ ] The interface never competes with the information.

- [ ] Existing functionality remains intact.

- [ ] The application feels like a professional productivity tool.

- [ ] The redesign creates a scalable foundation for future features.

- [ ] The application clearly communicates its purpose within the first few seconds of use.

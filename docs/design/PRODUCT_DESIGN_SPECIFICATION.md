# AI Implementation Notice

This document is intentionally written for autonomous coding agents.

Every section contains mandatory rules.

Do not interpret recommendations as optional.

If existing code conflicts with this specification,
the specification always takes precedence.

Do not preserve outdated UI decisions for backwards compatibility.

Backwards compatibility applies only to functionality,
never to presentation.

# Dungeon Archive

# Product Design Specification

Version: 0.9.9

Status: Living Document

Last Updated: August 2026

---

This document defines the official product vision, visual identity,
design system, interaction philosophy and implementation rules
for Dungeon Archive.

This specification is the single source of truth for every
future UI/UX decision.

If any implementation contradicts this document,
the document takes precedence.

Business logic is intentionally excluded.

This document governs only the presentation layer.

# Contents

01. Product Vision

02. Design Constitution

03. Core Principles

04. Non-Negotiable Rules

05. Product Identity

06. Design Tokens

07. Typography System

08. Color System

09. Spacing System

10. Layout Architecture

11. Navigation System

12. Component Library

13. Interaction Patterns

14. Motion System

15. Screen Specifications

16. Responsive Design

17. Performance Principles

18. Accessibility

19. Code & UI Architecture

20. Documentation Requirements

21. Migration Strategy

22. Definition of Done

23. Final Acceptance Criteria

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

# 02 — Design Constitution

## Purpose

This constitution defines the immutable principles that govern every UI, UX and visual implementation within Dungeon Archive.

These are not recommendations.

They are mandatory constraints.

If any implementation conflicts with these principles, the implementation is wrong.

If existing code contradicts this constitution, the code must be refactored.

The constitution always takes precedence over historical design decisions.

---

# Article I — The User Comes First

The user is always running a live session.

Every interaction must respect that context.

The application should never demand unnecessary attention.

The interface should reduce cognitive load, not increase it.

Users should spend their attention on the game, not on the application.

---

# Article II — Speed Above Everything

Speed is the highest priority.

Whenever two implementations satisfy the same requirement, always choose the faster one.

Visual polish must never reduce responsiveness.

Animations must never delay interaction.

Beautiful delays are still delays.

Fast always wins.

---

# Article III — Information Over Interface

The interface exists only to expose information.

The interface is never the product.

Information is the product.

If a visual element competes with the content for attention, remove or redesign it.

Users should remember what they found.

Never how they found it.

---

# Article IV — Every Pixel Must Earn Its Place

No visual element may exist purely for decoration.

Every pixel must justify itself.

Every icon must communicate meaning.

Every border must improve hierarchy.

Every shadow must improve depth perception.

Every color must improve understanding.

If an element has no functional purpose, remove it.

---

# Article V — Simplicity Before Originality

Dungeon Archive does not seek visual originality.

It seeks clarity.

Predictability is more valuable than surprise.

Consistency is more valuable than uniqueness.

Users should instantly understand how every screen works.

---

# Article VI — Never Make the User Think

The best interface requires no explanation.

Navigation should feel obvious.

Interactions should feel predictable.

Labels should be explicit.

Buttons should communicate intent.

Users should never wonder:

"What does this do?"

"Where is this?"

"How do I go back?"

If those questions appear, the design has failed.

---

# Article VII — Mobile Is The Primary Platform

Dungeon Archive is designed for phones.

Desktop is secondary.

Tablet is incidental.

Every decision should be validated on a phone first.

Never sacrifice the mobile experience to improve desktop aesthetics.

The mobile layout defines the product.

Desktop merely adapts it.

---

# Article VIII — One-Hand Usability

The application should comfortably operate using one hand.

Primary actions should remain within thumb reach whenever possible.

Interactive elements must provide generous touch targets.

The interface should minimize unnecessary finger movement.

---

# Article IX — Workspace Before Homepage

The first screen is not a landing page.

It is a workspace.

The user has already chosen Dungeon Archive.

The application should immediately provide useful tools rather than introducing itself.

Avoid marketing patterns.

Avoid hero sections.

Avoid decorative welcome screens.

---

# Article X — Search Is The Fastest Path

Search is the primary workflow.

Browsing is secondary.

Navigation exists only to support search.

Whenever possible, reduce the number of interactions required to reach an entity.

Searching should feel instantaneous.

---

# Article XI — Progressive Disclosure

Never overwhelm users.

Show the most important information first.

Reveal secondary information only when needed.

Critical metadata belongs above descriptions.

Descriptions belong above advanced details.

Advanced details belong inside collapsible sections whenever appropriate.

---

# Article XII — Readability Before Density

The goal is not to display the maximum amount of information.

The goal is to display the maximum amount of useful information.

Whitespace is valuable.

Empty space without purpose is not.

Typography should breathe.

Content should remain compact.

The interface should feel information-rich, never crowded.

---

# Article XIII — Consistency Is Mandatory

Every screen should follow the same visual language.

Typography.

Spacing.

Buttons.

Cards.

Lists.

Headers.

Inputs.

Navigation.

No screen may invent new rules.

Consistency reduces cognitive load.

---

# Article XIV — Reuse Before Creation

Before creating a new component:

Ask whether an existing component can be improved.

If a component cannot reasonably be reused elsewhere, it probably should not exist.

Avoid component proliferation.

Prefer evolving shared primitives.

---

# Article XV — Delete Before Adding

The best redesign often removes more than it adds.

Before introducing:

- a new component
- a new animation
- a new color
- a new layout
- a new interaction

Ask whether something existing can simply be simplified.

Complexity requires justification.

Simplicity does not.

---

# Article XVI — Design Systems Over Pages

Pages do not define components.

Components define pages.

Every page should be assembled from reusable building blocks.

Page-specific styling should become exceptional rather than common.

---

# Article XVII — Long-Term Thinking

Every visual decision should support future expansion.

The design system should comfortably scale to:

- Characters
- Campaigns
- Notes
- Maps
- NPCs
- Encounters
- Future features

Avoid solutions that only solve today's problem.

---

# Article XVIII — Respect Existing Engineering

Business logic already exists.

Repositories already exist.

State management already exists.

Firebase already exists.

The redesign should respect those systems.

Presentation may evolve.

Architecture should remain stable.

---

# Article XIX — Refactor Without Fear

Visual backwards compatibility is not required.

Functional backwards compatibility is.

If an old implementation contradicts this specification:

Refactor it.

Replace it.

Remove it.

Do not preserve technical or visual debt simply because it already exists.

---

# Article XX — The Interface Should Disappear

The highest compliment Dungeon Archive can receive is not:

"This looks beautiful."

It is:

"I forgot the interface was there."

The user should focus entirely on the information.

The interface succeeds when it becomes invisible.

---

# Constitutional Laws

These laws are absolute.

Never break them.

1. Speed over beauty.

2. Information over decoration.

3. Simplicity over complexity.

4. Consistency over originality.

5. Mobile over desktop.

6. Reading over scrolling.

7. Components over custom pages.

8. Reuse over duplication.

9. Clarity over cleverness.

10. Function over nostalgia.

11. Remove before adding.

12. Every pixel earns its place.

13. Never make the user think.

14. Search before browsing.

15. The workspace comes before the homepage.

---

# Acceptance Criteria

This constitution is considered respected only if:

- [ ] Every redesign decision can be justified using at least one constitutional article.
- [ ] No component violates the core laws.
- [ ] No page introduces its own design language.
- [ ] Existing visual debt has been actively removed.
- [ ] The application behaves as a coherent productivity tool.
- [ ] The interface consistently prioritizes information over decoration.
- [ ] Every new UI decision strengthens, rather than weakens, the overall design system.

# 03 — Decision Framework

## Purpose

No specification can describe every possible implementation scenario.

During the redesign, situations will arise where multiple valid solutions appear possible.

This chapter defines the decision-making framework that must be used whenever the specification does not explicitly dictate an implementation.

These rules are hierarchical.

When two rules conflict, the one with the highest priority always wins.

---

# Decision Hierarchy

Whenever a design decision must be made, evaluate the options using the following order of priority.

Priority 1 always overrides Priority 2.

Priority 2 overrides Priority 3.

And so on.

---

## Priority 1 — Preserve Functionality

Never break existing functionality.

Visual implementations may change.

Architecture may evolve.

Components may be replaced.

Layouts may change completely.

However:

User capabilities must remain intact.

Every existing feature should continue working unless this specification explicitly states otherwise.

---

## Priority 2 — Improve Speed

If two implementations are functionally equivalent,

always choose the one that allows users to reach information faster.

Examples:

Fewer taps.

Less scrolling.

Faster scanning.

Lower cognitive load.

Lower interaction cost.

---

## Priority 3 — Improve Readability

If two layouts expose the same information,

choose the one that can be understood more quickly.

Users should recognize hierarchy immediately.

Important information should require no interpretation.

Reading should feel effortless.

---

## Priority 4 — Improve Consistency

If multiple visual solutions are acceptable,

prefer the one that matches existing design patterns.

Avoid introducing exceptions.

Avoid inventing page-specific behaviors.

The application should feel as though it was designed at once by one team.

---

## Priority 5 — Reduce Complexity

Whenever multiple implementations satisfy the previous priorities,

choose the simplest one.

The simplest implementation is usually the correct implementation.

Complexity always requires justification.

---

# Conflict Resolution

Whenever two design goals conflict,

use the following precedence.

Speed beats animation.

Readability beats density.

Consistency beats originality.

Information beats decoration.

Mobile beats desktop.

Shared components beat custom implementations.

Reuse beats duplication.

Deletion beats addition.

Functionality beats aesthetics.

---

# Refactoring Philosophy

Refactoring is encouraged.

Rewriting is not.

Improve existing code before replacing it.

Extract reusable patterns.

Consolidate duplicate implementations.

Standardize inconsistent behavior.

Do not rewrite stable systems merely because they could be cleaner.

---

# Component Decisions

Before creating a new component, answer these questions:

Can an existing component be reused?

Can an existing component be extended?

Can two existing components be merged?

Can the layout be simplified instead?

Only if every answer is "No" should a new component be created.

---

# Styling Decisions

Before introducing:

- a new spacing value
- a new color
- a new typography size
- a new shadow
- a new border radius
- a new transition

verify that an equivalent token does not already exist.

Custom values should become extremely rare.

The design system should become increasingly small, not increasingly large.

---

# Layout Decisions

Before introducing a new page layout,

verify whether an existing page structure can be reused.

The application should feel like one product,

not twenty independent screens.

Layouts should differ because content differs,

never because designers preferred different styles.

---

# Interaction Decisions

Every interaction should answer at least one of these questions:

Does this reduce taps?

Does this reduce scrolling?

Does this reduce reading effort?

Does this improve discoverability?

Does this reduce cognitive load?

If the answer is "No" to all,

the interaction probably should not exist.

---

# Animation Decisions

Animations are never decorative.

Animations may only exist if they:

Improve orientation.

Clarify state changes.

Provide meaningful feedback.

Improve perceived responsiveness.

Animations must never exist purely because they look pleasant.

---

# Visual Decisions

Whenever uncertainty exists,

prefer the solution that feels:

Cleaner.

Calmer.

More predictable.

More restrained.

More timeless.

Avoid trends.

Avoid visual gimmicks.

Avoid fashionable UI patterns that do not improve usability.

Dungeon Archive should still feel modern five years from now.

---

# Information Hierarchy

Every screen should expose information in the following order.

Critical.

↓

Important.

↓

Useful.

↓

Optional.

↓

Advanced.

↓

Technical.

Never expose advanced information before critical information.

Never make users search for essential metadata.

---

# Empty Space

Whitespace should improve comprehension.

Whitespace should never exist simply because there was nothing else to place.

Empty space must communicate hierarchy,

never emptiness.

---

# Density

The application should feel information-rich,

not information-heavy.

Avoid both extremes.

Do not compress content until readability suffers.

Do not expand layouts until scrolling becomes unnecessary work.

The correct density is achieved when users immediately locate the desired information without feeling overwhelmed.

---

# Future Decisions

Whenever implementing a solution,

ask:

"Would this still work if the application doubled in size?"

If the answer is no,

choose another implementation.

Scalability should influence every decision.

---

# Self Validation

Before considering any redesign task complete,

ask:

Is it faster?

Is it clearer?

Is it simpler?

Is it more consistent?

Is it easier to maintain?

If any answer is "No",

the implementation probably requires another iteration.

---

# Decision Checklist

Every significant implementation should satisfy the following questions.

- [ ] Does this preserve existing functionality?

- [ ] Does this reduce lookup time?

- [ ] Does this improve readability?

- [ ] Does this reduce cognitive load?

- [ ] Does this follow the design system?

- [ ] Does this reuse existing components?

- [ ] Does this avoid duplication?

- [ ] Does this improve maintainability?

- [ ] Would another developer immediately understand this implementation?

- [ ] Would this still feel correct two years from now?

Only after every question can reasonably be answered with "Yes" should the implementation be considered complete.

# 04 — Non-Negotiable Rules

## Purpose

This chapter defines the mandatory implementation rules for the entire presentation layer.

Unlike previous chapters, these are not philosophical principles.

These rules are objectively verifiable.

Every implementation must comply with them.

Breaking one of these rules is considered a defect.

---

# Rule 1 — The Design System Is The Single Source Of Truth

No visual value may be invented inside individual components.

Colors.

Spacing.

Typography.

Radius.

Elevation.

Motion.

Borders.

Transitions.

Everything must come from the official design system.

Hardcoded visual values should become exceptional.

---

# Rule 2 — No Arbitrary Values

Avoid arbitrary values whenever possible.

Examples that should disappear:

px-[13px]

rounded-[18px]

mt-[22px]

text-[17px]

h-[51px]

w-[73px]

Instead,

create or reuse official design tokens.

The design system should become increasingly predictable.

---

# Rule 3 — Shared Components First

Every reusable interaction must be implemented using shared components.

Buttons.

Inputs.

Cards.

Headers.

Lists.

Rows.

Badges.

Dialogs.

Bottom sheets.

Search fields.

Tags.

Chips.

No page should recreate these independently.

---

# Rule 4 — Never Duplicate UI

If two components look almost identical,

they should probably become one component.

If two layouts differ only slightly,

they should probably share the same implementation.

Duplication increases maintenance cost.

Consistency reduces it.

---

# Rule 5 — One Official Implementation

Every UI pattern should have exactly one canonical implementation.

Examples:

Primary Button

Secondary Button

Surface

Section Header

List Item

Search Input

Entity Metadata Row

Tag

Badge

Divider

If multiple implementations already exist,

consolidate them.

---

# Rule 6 — Pages Assemble Components

Pages are compositions.

They are not design systems.

Pages should contain almost no page-specific styling.

They should compose reusable building blocks.

---

# Rule 7 — Remove Visual Debt

The redesign is expected to actively remove:

Duplicate buttons.

Duplicate spacing.

Duplicate colors.

Duplicate typography.

Duplicate shadows.

Duplicate border radius values.

Duplicate layouts.

Duplicate interaction patterns.

Visual debt should decrease,

never increase.

---

# Rule 8 — No Decorative Elements

Every visual element must have a functional purpose.

Avoid:

Decorative separators.

Large illustrations.

Fantasy ornaments.

Decorative icons.

Decorative backgrounds.

Decorative gradients.

Decorative textures.

Decorative shadows.

If removing an element does not reduce usability,

remove it.

---

# Rule 9 — Mobile Defines Every Layout

Every screen should be designed for a phone first.

Desktop adaptations should naturally emerge from the mobile implementation.

Never create desktop-specific layouts that compromise the mobile experience.

---

# Rule 10 — One-Hand Reachability

Primary interactions should remain comfortably reachable using one hand.

Avoid placing frequently used actions near the extreme top of long screens whenever reasonable.

Touch targets must be generous.

Interactions should require minimal finger travel.

---

# Rule 11 — Predictability Over Novelty

Never invent interaction patterns simply because they appear modern.

Use familiar behaviours.

Users should immediately understand every interaction.

Novel interactions require strong justification.

---

# Rule 12 — Search Is A First-Class Citizen

Search must never feel like a secondary feature.

Search should always receive enough visual prominence.

Search should remain fast.

Search should remain accessible.

Search should remain predictable.

---

# Rule 13 — Information Hierarchy Is Mandatory

Every screen must expose information using a consistent hierarchy.

Critical

↓

Important

↓

Useful

↓

Advanced

↓

Technical

Never reverse this order.

---

# Rule 14 — Above The Fold Matters

The first screen should answer the user's most common question.

Avoid wasting vertical space.

Essential information should appear before scrolling.

Target approximately 80% of the critical information above the fold whenever realistically possible.

---

# Rule 15 — Progressive Disclosure

Advanced information should not compete with essential information.

Collapsible sections are encouraged.

Users should progressively discover complexity.

Never expose every possible detail immediately.

---

# Rule 16 — One Layout System

Every screen should follow the same structural rhythm.

Safe Area

↓

Page Header

↓

Primary Content

↓

Secondary Sections

↓

Bottom Navigation

Exceptions should be extremely rare.

---

# Rule 17 — Consistent Spacing

Spacing must follow the official spacing scale.

No page-specific spacing systems.

No arbitrary margins.

No arbitrary padding.

Rhythm should become immediately recognizable across the application.

---

# Rule 18 — Consistent Typography

Typography must follow the official typography scale.

No component may define its own hierarchy.

Titles.

Headings.

Body.

Caption.

Metadata.

Everything should belong to the typography system.

---

# Rule 19 — Consistent Color Usage

Colors communicate meaning.

Not decoration.

The accent color exists for emphasis.

Not for branding.

Not for aesthetics.

Not every component deserves an accent.

---

# Rule 20 — Motion Is Functional

Animations exist only to improve usability.

They may:

Clarify transitions.

Confirm actions.

Provide feedback.

Orient users.

They may not:

Decorate.

Impress.

Delay.

Distract.

---

# Rule 21 — Remove Before Adding

Whenever a problem appears,

attempt these solutions in order:

1. Remove.

2. Simplify.

3. Reuse.

4. Refactor.

5. Create something new.

Creation should always be the final option.

---

# Rule 22 — Future Scalability

Every implementation should comfortably support future modules.

Characters.

Campaigns.

Notes.

Maps.

NPCs.

Encounters.

Session management.

If an implementation only works for today's screens,

it is not complete.

---

# Rule 23 — Clean Code Is Product Quality

UI quality is code quality.

Readable code produces maintainable interfaces.

Component names should be obvious.

Folder structures should remain logical.

Styling should remain centralized.

The design system should become easier to understand over time.

---

# Rule 24 — Refactor Without Fear

Visual backwards compatibility is not a goal.

Maintainability is.

Refactor aggressively whenever it improves:

Consistency.

Readability.

Reusability.

Scalability.

Never preserve poor implementations purely because they already exist.

---

# Rule 25 — Documentation Is Part Of The Product

Every significant visual change should be reflected in the documentation.

The specification and the implementation must evolve together.

Outdated documentation is considered technical debt.

---

# Compliance Checklist

Every implementation should satisfy all of the following:

- [ ] No arbitrary visual values introduced.
- [ ] No duplicated UI patterns introduced.
- [ ] Shared components reused whenever possible.
- [ ] Existing visual debt reduced.
- [ ] Mobile experience remains the primary target.
- [ ] Information hierarchy respected.
- [ ] Design tokens consistently applied.
- [ ] New code improves maintainability.
- [ ] Documentation remains synchronized.
- [ ] Existing functionality preserved.

Only after every item is satisfied may an implementation be considered complete.

# 05 — Product Identity & Visual Language

## Purpose

This chapter defines the visual identity of Dungeon Archive.

It explains not only how the application should look, but how it should feel.

This identity must remain consistent across every screen, every interaction and every future feature.

The goal is to create a timeless product rather than a fashionable interface.

---

# Product Personality

Dungeon Archive should communicate the following qualities:

• Professional

• Reliable

• Fast

• Focused

• Calm

• Confident

• Dense

• Minimal

It should never communicate:

• Fantasy

• Playfulness

• Excess

• Decoration

• Experimental UI

• Visual noise

• Artificial complexity

The interface should feel serious without becoming cold.

Minimal without becoming empty.

Dense without becoming overwhelming.

Professional without becoming corporate.

---

# Emotional Goal

The application should make the user feel:

"I trust this application."

"It will help me immediately."

"It won't waste my time."

"It feels extremely polished."

"It feels intentionally designed."

"It feels mature."

The user should never think:

"This is flashy."

"This is trying too hard."

"This looks like a game."

"This is full of unnecessary decoration."

---

# Visual Inspiration

Dungeon Archive should draw inspiration from productivity software rather than fantasy applications.

Primary references include:

• Linear

• Obsidian

• GitHub Mobile

• Raycast

• Arc Browser

These references should influence:

Visual hierarchy.

Restraint.

Consistency.

Typography.

Density.

Interaction quality.

Not visual imitation.

The objective is to capture their philosophy rather than their appearance.

---

# Fantasy Without Fantasy

Dungeon Archive is about Dungeons & Dragons.

The interface is not.

The fantasy belongs to the content.

The interface belongs to the user.

Magic should appear inside spell descriptions.

Not inside buttons.

Monsters should appear inside entity pages.

Not inside the navigation.

The visual language should remain neutral.

The content provides the atmosphere.

The interface provides the clarity.

---

# Visual Tone

The application should feel dark, elegant and restrained.

Dark mode is not a feature.

Dark mode is the product.

No light theme exists.

Every visual decision should assume a permanent dark environment.

The objective is long reading sessions with minimal eye fatigue.

---

# Density Philosophy

Dungeon Archive should communicate abundance of information without visual overload.

Content should feel close.

Not cramped.

Whitespace should separate ideas.

Not create emptiness.

Large empty sections should almost never exist.

Users should immediately feel that every screen is useful.

Every centimeter of the display should contribute towards solving a problem.

---

# Surface Philosophy

Surfaces should almost blend into the background.

Cards exist only to group information.

Not to become visual objects.

Borders should remain subtle.

Elevation should remain restrained.

The user should perceive hierarchy,

not decoration.

---

# Color Philosophy

Color is reserved for communication.

Never for entertainment.

The accent color should appear only when emphasis is required.

Examples include:

Primary actions.

Selected navigation.

Interactive elements.

Focus states.

Important metadata.

Success.

Warning.

Error.

Large colorful interfaces should never appear.

The application should remain predominantly neutral.

Color should attract attention only when attention is required.

---

# Typography Philosophy

Typography is the primary design tool.

Not color.

Not illustrations.

Not effects.

Hierarchy should emerge through typography first.

Spacing second.

Color third.

Everything else afterwards.

If typography alone cannot communicate hierarchy,

the layout should be reconsidered.

---

# Iconography Philosophy

Icons support text.

They do not replace it.

Every icon should communicate meaning.

Decorative icons should never exist.

Lucide is the official icon library.

No additional icon libraries should be introduced unless absolutely necessary.

Consistency is more valuable than icon variety.

---

# Motion Philosophy

Motion should almost disappear.

Users should perceive responsiveness,

not animation.

Interactions should feel immediate.

Animations should be short.

Subtle.

Predictable.

Never theatrical.

The application should never feel animated.

It should simply feel alive.

---

# Layout Philosophy

Every page should immediately communicate structure.

Users should instantly understand:

Where they are.

What is important.

What they can do.

Layouts should feel familiar after only a few screens.

Learning one page should help users understand every other page.

---

# Product Maturity

Dungeon Archive should feel like software that has evolved over many years.

Nothing should feel experimental.

Nothing should feel temporary.

Nothing should feel unfinished.

The interface should communicate confidence.

Every component should appear intentional.

Every spacing decision should appear deliberate.

Every interaction should feel refined.

---

# Visual Consistency

Visual consistency is more important than visual beauty.

Users forgive simplicity.

They rarely forgive inconsistency.

A simple interface with perfect consistency feels premium.

A beautiful interface with inconsistent rules feels amateur.

Consistency should therefore become the defining characteristic of the product.

---

# What Premium Means

Premium does not mean expensive.

Premium does not mean luxurious.

Premium means:

Nothing feels accidental.

Nothing feels unfinished.

Nothing feels inconsistent.

Nothing feels unnecessary.

Premium is achieved through discipline rather than decoration.

---

# Anti-patterns

The following visual directions are explicitly forbidden:

• Medieval styling.

• Stone textures.

• Wooden panels.

• Gold ornamental borders.

• Decorative gradients.

• Fantasy typography.

• 3D icons.

• Decorative backgrounds.

• Glassmorphism.

• Neumorphism.

• Oversized shadows.

• Excessive blur.

• Decorative animations.

• Artificial depth.

• Empty hero sections.

• Marketing-inspired layouts.

Dungeon Archive should never resemble a fantasy website.

It should resemble an exceptional productivity application.

---

# Identity Statement

If someone sees a screenshot of Dungeon Archive without knowing what it is,

they should think:

"This looks like a professional productivity app."

Only after opening an entity should they realize:

"Oh.

This is for Dungeons & Dragons."

That moment defines the identity of the product.

---

# Acceptance Criteria

The visual identity is considered successfully implemented only if:

- [ ] Every screen communicates professionalism.
- [ ] The interface feels calm and restrained.
- [ ] The content provides the fantasy, not the UI.
- [ ] Color is used intentionally rather than decoratively.
- [ ] Typography is the primary source of hierarchy.
- [ ] Cards blend naturally with the background.
- [ ] Motion remains subtle and functional.
- [ ] Every page feels like part of the same product.
- [ ] The application could plausibly be mistaken for software built by a professional product team.

# 06 — Foundation Design System

## Purpose

This chapter defines the technical foundation of the Dungeon Archive design system.

Every visual decision made during the redesign must originate from this foundation.

The objective is not simply visual consistency.

The objective is creating a system that scales indefinitely while remaining easy to understand, easy to maintain and easy to extend.

The Design System is the single source of truth for the presentation layer.

Pages do not define styles.

Components do not define styles.

The Design System defines styles.

---

# Philosophy

The Design System exists to eliminate decisions.

Developers should rarely ask themselves questions such as:

- Which radius should I use?
- Which spacing looks better?
- Which shadow feels right?
- Which transition should I choose?
- Which typography size fits here?

Those decisions should already be answered by this specification.

The fewer visual decisions required during implementation,
the more consistent the application becomes.

---

# Design Priorities

Every design token should satisfy these priorities.

1. Predictability
2. Reusability
3. Readability
4. Simplicity
5. Scalability

Never introduce a new token simply because it looks slightly better.

A smaller design system is almost always a better design system.

---

# Foundation Principles

The entire visual language is built from a small number of primitives.

Color.

Typography.

Spacing.

Radius.

Elevation.

Motion.

Layout.

Everything else is composed from these primitives.

No component should define its own visual language.

---

# Token Philosophy

Tokens represent meaning.

Never appearance.

Good examples:

surface-primary

surface-secondary

text-primary

text-secondary

accent

danger

success

spacing-md

radius-lg

Bad examples:

darkGray2

buttonBlue

monsterRed

spellPurple

Tokens should describe purpose rather than color.

This allows the system to evolve without changing component implementations.

---

# Primitive Layers

The visual system is organized into four layers.

Layer 1

Foundation Tokens

↓

Layer 2

Primitive Components

↓

Layer 3

Composite Components

↓

Layer 4

Pages

No page should bypass lower layers.

Pages compose.

They never invent.

---

# Foundation Tokens

The following categories should become official tokens.

## Colors

Semantic only.

No hardcoded colors.

---

## Typography

Shared scale.

Shared weights.

Shared hierarchy.

---

## Spacing

Single spacing scale.

No arbitrary spacing.

---

## Radius

Single radius scale.

Prefer consistency over variation.

16px should become the default large radius.

---

## Elevation

Very limited elevation system.

Cards should almost merge with the background.

Shadows communicate hierarchy.

Not decoration.

---

## Motion

Shared durations.

Shared easing.

Shared interaction feedback.

Motion should feel invisible.

---

## Layout

Shared page widths.

Shared padding.

Shared vertical rhythm.

Shared safe areas.

Shared content rhythm.

---

# Component Hierarchy

Every reusable component belongs to one of four categories.

Foundation

Button

Surface

Typography

Icon

Spacer

Divider

Primitive

Input

Card

Chip

Badge

Row

List Item

Composite

Search Bar

Section Header

Entity Header

Metadata Grid

Entity Card

Page

Home

Search

Party

Entity

Settings

Pages should never directly style Foundation elements.

Everything flows through shared components.

---

# Naming Convention

Names should describe responsibility.

Not appearance.

Examples:

Surface

Button

TextField

SearchBar

MetadataRow

SectionHeader

EntityCard

Avoid names such as:

BlueButton

RoundedCard

LargeSurface

DarkContainer

Appearance should remain configurable.

Responsibility should remain constant.

---

# Density Rules

The interface should maximize useful information.

Never maximize the number of pixels occupied.

Large empty spaces are discouraged.

Cramped layouts are discouraged.

Aim for visual efficiency rather than visual compression.

Every screen should immediately communicate value.

---

# Visual Rhythm

The application should establish a recognizable rhythm.

Header

↓

Summary

↓

Primary Content

↓

Secondary Content

↓

Actions

Users should begin recognizing this rhythm after only a few screens.

---

# Surface Rules

Surfaces should subtly separate information.

They should never dominate the interface.

Background first.

Surface second.

Content first.

Container second.

The user should remember the information.

Not the card.

---

# Border Rules

Borders exist only when they improve hierarchy.

Avoid decorative borders.

Avoid thick borders.

Avoid multiple nested borders.

When in doubt,

prefer spacing over borders.

---

# Shadow Rules

Shadows should remain minimal.

Large shadows are forbidden.

Heavy elevation is forbidden.

The objective is quiet separation.

Not floating windows.

---

# Radius Rules

Rounded corners communicate friendliness.

Not decoration.

Use as few radius values as possible.

Consistency is significantly more important than precision.

If two radius values appear visually identical,

merge them.

---

# Layout Grid

Every screen should align to the same structural grid.

Content should naturally align vertically.

Margins should create rhythm.

Not randomness.

Misalignment should become rare.

---

# Responsive Philosophy

Responsive behaviour should emerge naturally.

The layout should expand.

Not transform.

Desktop should feel like a larger mobile application.

Not a different product.

---

# Future Scalability

Adding a future feature should require composing existing primitives.

Not inventing new ones.

The Design System should become richer by refinement,

not by multiplication.

---

# Forbidden Practices

Never introduce:

Hardcoded spacing.

Hardcoded radius.

Hardcoded typography.

Hardcoded shadows.

Hardcoded colors.

Page-specific design tokens.

Duplicate primitives.

Alternative button implementations.

Alternative card implementations.

Alternative spacing systems.

Alternative typography hierarchies.

The Design System must remain singular.

---

# Engineering Expectations

During the redesign the agent is expected to:

Extract duplicated primitives.

Consolidate shared behaviour.

Rename components when necessary.

Reorganize folders if this improves clarity.

Delete obsolete implementations.

Reduce visual debt.

Increase reuse.

Improve readability.

Improve maintainability.

Preserve business logic.

---

# Acceptance Criteria

The Foundation Design System is considered complete only if:

- [ ] Every visual value originates from the Design System.
- [ ] No arbitrary styling remains.
- [ ] Pages compose reusable components instead of defining styles.
- [ ] Component hierarchy is respected.
- [ ] Naming conventions remain consistent.
- [ ] Duplicate primitives have been removed.
- [ ] Future features can be implemented without expanding the visual language.
- [ ] The Design System has become smaller, clearer and more reusable than before.

# 07 — Design Tokens Specification

## Purpose

This chapter defines every foundational design token used throughout Dungeon Archive.

Design Tokens are the lowest level of the visual language.

Every component, layout and page must be built exclusively using these tokens.

No visual value should exist outside this specification unless explicitly justified.

The objective is to eliminate arbitrary design decisions and ensure long-term consistency.

---

# Token Philosophy

Every token represents intent.

Never appearance.

Tokens should describe **what something means**, never **how it looks**.

Examples:

✓ surface-primary

✓ text-secondary

✓ spacing-lg

✓ radius-md

✗ dark-gray

✗ blue-button

✗ card-radius

✗ monster-green

The implementation may evolve.

The meaning must remain stable.

---

# Base Unit

The entire Design System is built around a **4px grid**.

Every spacing, sizing and rhythm decision should derive from multiples of four.

This guarantees visual alignment across the application.

Exceptions should be extremely rare.

---

# Spacing Scale

Only the following spacing values are considered official.

| Token | Value | Usage |
|--------|------:|-------|
| xs | 4px | Tight internal spacing |
| sm | 8px | Compact spacing |
| md | 12px | Default internal spacing |
| lg | 16px | Default layout spacing |
| xl | 24px | Section spacing |
| 2xl | 32px | Large separation |
| 3xl | 48px | Rare page separation |

No other spacing values should normally exist.

Spacing should communicate hierarchy.

Not decoration.

---

# Padding Philosophy

Padding should remain compact.

Dungeon Archive is information-dense.

Padding exists to improve readability,

not to create empty space.

Internal component padding should generally use:

8px

12px

16px

Page padding should generally use:

16px

Rarely 24px.

Never create oversized empty margins.

---

# Margin Philosophy

Prefer layout composition over manual margins.

Use:

Gap

Flex

Grid

Stack

Before introducing individual margins.

Margin should become the exception.

Gap should become the rule.

---

# Border Radius Scale

The application intentionally uses a very small radius system.

| Token | Value |
|--------|------:|
| sm | 8px |
| md | 12px |
| lg | 16px |

Guidelines:

8px

Small UI controls.

12px

Inputs.

Compact surfaces.

16px

Cards.

Dialogs.

Bottom Sheets.

Primary surfaces.

Avoid introducing additional radius values.

Consistency matters more than precision.

---

# Elevation Scale

Elevation should remain extremely subtle.

Dungeon Archive is not Material Design.

Cards should almost merge with the background.

Official elevation levels:

Level 0

Background.

Level 1

Cards.

Level 2

Dialogs.

No additional elevation levels should exist.

Avoid "floating UI".

---

# Border Thickness

Only two border widths are normally allowed.

0px

or

1px

Thicker borders should require explicit justification.

Hierarchy should primarily come from spacing,

not borders.

---

# Opacity Tokens

Opacity communicates state.

Never decoration.

Recommended values:

100%

90%

70%

50%

30%

Avoid arbitrary opacity percentages.

---

# Icon Scale

Lucide icons are the official icon library.

Official icon sizes:

16px

Secondary metadata.

20px

Default.

24px

Primary actions.

32px

Exceptional.

Avoid oversized icons.

Icons support text.

They do not replace it.

---

# Touch Targets

Minimum touch target:

44px

Preferred:

48px

Large actions:

56px

Never sacrifice usability for compactness.

Interactive comfort is mandatory.

---

# Typography Tokens

Typography will be formally defined in the next chapter.

However,

all typography should reference named tokens.

Never raw font sizes.

Examples:

display

title

heading

body

caption

metadata

Typography hierarchy must remain centralized.

---

# Motion Tokens

Official transition durations:

Fast

120ms

Normal

180ms

Slow

200ms

No transition should exceed 200ms.

Dungeon Archive should feel immediate.

Not animated.

---

# Easing

Use a single easing curve throughout the application.

Avoid mixing easing functions.

Motion consistency is more important than motion expressiveness.

---

# Z-Index Scale

The application should maintain a minimal stacking hierarchy.

Base

Content

Sticky Header

Bottom Navigation

Dialogs

Toasts

Avoid arbitrary z-index values.

Use semantic layers only.

---

# Container Width

Dungeon Archive is mobile-first.

Layouts should naturally fill the available mobile width.

Desktop should not introduce artificial layouts.

Content may grow naturally,

but should always preserve mobile proportions.

---

# Safe Areas

Respect safe areas on every page.

Top spacing.

Bottom navigation.

Bottom sheets.

Dialogs.

No interactive element should become difficult to reach because safe areas were ignored.

---

# Surface Tokens

Surfaces should be semantic.

Examples:

surface-background

surface-primary

surface-secondary

surface-overlay

Never create page-specific surfaces.

---

# Text Tokens

Typography color should remain semantic.

Examples:

text-primary

text-secondary

text-muted

text-disabled

text-accent

Avoid defining colors directly inside components.

---

# Semantic Colors

Colors communicate meaning.

Never aesthetics.

Official semantic groups:

Accent

Success

Warning

Danger

Information

Disabled

Everything else should derive from neutral surfaces.

---

# Shadows

Shadow should communicate separation,

never depth.

Keep shadows soft,

small,

almost invisible.

Large dramatic shadows are forbidden.

---

# Blur

Blur should be exceptional.

Only use blur when it improves readability,

such as dialogs or overlays.

Never blur backgrounds for decoration.

---

# Forbidden Tokens

The following should never appear in the codebase:

Hardcoded pixel values.

Magic spacing numbers.

Magic radius numbers.

Magic opacity values.

Magic transition durations.

Page-specific visual constants.

Every reusable visual value should become an official token.

---

# Token Evolution

The Design System should evolve by:

Removing tokens.

Merging tokens.

Simplifying tokens.

Standardizing tokens.

It should almost never evolve by adding more tokens.

A smaller Design System is generally a better Design System.

---

# Acceptance Criteria

The Design Token Specification is considered complete only if:

- [ ] Every spacing value belongs to the official spacing scale.
- [ ] Every radius belongs to the official radius scale.
- [ ] Every elevation belongs to the official elevation system.
- [ ] Every color is semantic.
- [ ] Every typography style references shared typography tokens.
- [ ] Every icon follows the official sizing scale.
- [ ] Every animation uses shared motion tokens.
- [ ] Every component consumes tokens instead of defining visual values.
- [ ] No arbitrary visual constants remain in the codebase.

# 08 — Typography System

## Purpose

Typography is the primary communication tool of Dungeon Archive.

It is the foundation of the visual hierarchy.

It replaces decoration.

It replaces excessive color.

It replaces unnecessary visual effects.

Users should understand the structure of every screen through typography alone.

If typography cannot communicate hierarchy correctly, the layout should be redesigned.

Typography is therefore considered one of the most important parts of the Design System.

---

# Typography Philosophy

Dungeon Archive is an information-first application.

Typography should prioritize:

Speed of reading.

Scanning.

Recognition.

Hierarchy.

Consistency.

Not personality.

Not artistic expression.

The typography should disappear behind the content.

Users should remember what they read.

Never how it was rendered.

---

# Font Selection

The application uses two font families.

## Display Font

Used only for high-level page titles.

Characteristics:

• Modern

• Professional

• Clean

• Slight personality

• Excellent readability

Never decorative.

Never fantasy.

Never serif.

---

## Interface Font

Used everywhere else.

Including:

Body text.

Metadata.

Cards.

Buttons.

Forms.

Lists.

Dialogs.

Search.

Long-form content.

The interface font should optimize readability above everything else.

---

# Font Loading

Typography should never delay rendering.

Use efficient loading strategies.

Avoid loading unnecessary weights.

Only include weights actually used by the application.

Performance is part of typography.

---

# Typography Hierarchy

The hierarchy should remain intentionally small.

Every new typography style increases complexity.

Prefer reusing existing styles.

Never create a typography variant for a single page.

---

# Official Typography Scale

The application defines the following hierarchy.

## Display

Purpose:

Large page titles.

Used only once per screen.

Characteristics:

High emphasis.

Very rare.

---

## Title

Purpose:

Section titles.

Primary card titles.

Important dialogs.

---

## Heading

Purpose:

Content sections.

Collapsible groups.

Lists.

---

## Subheading

Purpose:

Secondary grouping.

Supporting headings.

---

## Body

Purpose:

The default reading experience.

Most text in the application belongs here.

This style should become visually invisible.

---

## Body Small

Purpose:

Supporting information.

Descriptions.

Long metadata.

Compact layouts.

---

## Caption

Purpose:

Metadata.

Secondary labels.

Dates.

Sources.

Version information.

Supportive information only.

Never primary information.

---

## Label

Purpose:

Buttons.

Inputs.

Filters.

Tabs.

Navigation.

Labels should prioritize clarity over style.

---

## Overline

Purpose:

Rare category labels.

Small grouping elements.

Use sparingly.

---

# Font Weight

Use as few font weights as possible.

Recommended philosophy:

Regular

Medium

Semibold

Avoid excessive bold text.

Hierarchy should emerge primarily from:

Spacing.

Position.

Size.

Only then weight.

---

# Line Height

Text should breathe.

But never become loose.

Large paragraphs should remain comfortable to read.

Compact metadata should remain dense.

Line height should reinforce reading rhythm.

Never randomly change line-height inside components.

---

# Letter Spacing

Use default font spacing whenever possible.

Avoid custom tracking.

Only adjust letter spacing when required by the typography system.

Consistency is preferred over micro-optimization.

---

# Reading Rhythm

Every page should establish a natural reading flow.

The user's eye should naturally move:

Title

↓

Summary

↓

Metadata

↓

Content

↓

Advanced Information

Never force users to search for important information.

Hierarchy should feel automatic.

---

# Information Density

Typography should maximize readable information.

Not character count.

Not font size reduction.

Large text is acceptable.

Excessively large text is not.

The interface should feel comfortable after long reading sessions.

---

# Entity Page Example

Correct hierarchy:

```
Fireball

Level 3 • Evocation

Action • 150 ft • V,S,M

────────────────────

Description

────────────────────

At Higher Levels

────────────────────

Source
```

Incorrect hierarchy:

```
Fireball

Description

Action

Source

Level

Casting Time

Components

Range
```

Critical metadata must always appear before descriptive content.

---

# Card Example

Correct

```
Spell Name

Level 3 • Evocation

Small supporting description
```

Incorrect

```
Spell Name

Very large empty gap

Description

Level

School
```

Typography should reduce unnecessary eye movement.

---

# Search Result Example

Correct

```
Fireball

Spell

Level 3

PHB
```

Incorrect

```
🔥 Fireball Spell

A powerful spell...

Several lines...

Long preview...
```

Search exists for recognition.

Not reading.

---

# Buttons

Buttons should never become typography showcases.

Text should remain:

Short.

Direct.

Predictable.

Avoid creative wording.

Prefer:

Save

Delete

Cancel

Create

Continue

Search

Import

Export

Rather than:

Let's Go

Begin Adventure

Start Journey

Magic Save

---

# Metadata

Metadata should always feel secondary.

Never compete with titles.

Never dominate cards.

Never become visually heavy.

Users should find metadata instantly,

but focus on primary information first.

---

# Long Text

Long descriptions should optimize readability.

Prefer:

Short paragraphs.

Logical spacing.

Collapsible advanced sections.

Avoid:

Walls of text.

Massive uninterrupted paragraphs.

Users should comfortably scan before reading.

---

# Anti-patterns

Avoid:

More than two font families.

Decorative fonts.

Fantasy fonts.

Excessive uppercase.

Multiple bold weights.

Tiny metadata.

Huge titles everywhere.

Inconsistent hierarchy.

Different heading systems between pages.

Typography created inside components.

Typography created inside pages.

Magic font sizes.

Typography should remain centralized.

---

# Acceptance Criteria

The Typography System is considered complete only if:

- [ ] Every text style belongs to the official hierarchy.
- [ ] No page defines its own typography.
- [ ] Typography alone communicates hierarchy.
- [ ] Metadata remains visually secondary.
- [ ] Reading order is immediately obvious.
- [ ] Entity pages expose critical information before descriptive content.
- [ ] Search results prioritize recognition over reading.
- [ ] Long reading sessions remain comfortable.
- [ ] The application feels typographically consistent from every screen.

# 09 — Color System

## Purpose

Color is a communication tool.

It is not decoration.

It is not branding.

It is not personality.

The Color System exists to communicate hierarchy, state and interaction while remaining almost invisible during normal usage.

A successful color system is one the user rarely notices.

Instead, the user simply understands the interface instinctively.

---

# Color Philosophy

Dungeon Archive intentionally uses a restrained color palette.

Most of the interface should be built from neutral tones.

Color should only appear when the interface wants to communicate something important.

The application should feel calm.

Quiet.

Professional.

Purposeful.

Never loud.

Never saturated.

Never visually exhausting.

---

# The Rule of Neutrality

Approximately 85–90% of the interface should consist of neutral colors.

Only 10–15% should contain accent or semantic colors.

This creates visual contrast where it matters.

If every element is colorful,

nothing is important.

---

# Semantic Meaning

Every color must communicate meaning.

Never aesthetics.

The same semantic meaning must always use the same color.

Examples:

Primary Action

↓

Accent

Success

↓

Green

Warning

↓

Amber

Danger

↓

Red

Information

↓

Blue

Disabled

↓

Muted Neutral

These meanings must never change between pages.

---

# Accent Color Philosophy

Dungeon Archive has exactly one primary accent color.

The accent exists to attract attention.

Not to decorate the interface.

The accent should appear only on:

Primary actions.

Selected navigation items.

Interactive controls.

Focused inputs.

Active filters.

Important links.

Selected chips.

Progress indicators.

Everything else should remain neutral.

---

# Accent Discipline

The accent color should never be applied to:

Cards.

Page backgrounds.

Decorative icons.

Large blocks of text.

Entire sections.

Decorative borders.

Visual ornaments.

If an entire screen appears colorful,

too much accent is being used.

---

# Neutral Palette

Neutral colors define the personality of the application.

They should communicate:

Professionalism.

Reliability.

Focus.

Calmness.

The neutral palette should contain enough variation to clearly distinguish:

Application Background

↓

Primary Surface

↓

Secondary Surface

↓

Interactive Surface

↓

Overlay

Without relying on excessive borders.

Hierarchy should emerge naturally.

---

# Surface Hierarchy

The interface should clearly communicate depth using surfaces.

Example:

Level 0

Application background.

↓

Level 1

Primary cards.

↓

Level 2

Dialogs.

↓

Level 3

Bottom sheets.

No additional visual layers should normally exist.

The application should remain visually flat.

---

# Text Colors

Text should follow semantic hierarchy.

Primary

Highest emphasis.

Secondary

Supporting information.

Muted

Metadata.

Disabled

Unavailable information.

Links

Interactive information.

Avoid introducing additional text colors.

Typography hierarchy should primarily rely on weight and spacing,

not color.

---

# Status Colors

Every status color must communicate only one meaning.

Success

Completed.

Valid.

Available.

Warning

Attention required.

Potential issue.

Danger

Destructive action.

Critical error.

Information

Neutral guidance.

Never reuse these colors for decoration.

---

# Interactive States

Interactive elements should communicate state primarily through subtle color changes.

States include:

Default

Hover

Pressed

Focused

Disabled

Selected

Loading

Transitions between these states should remain subtle.

Users should notice the interaction,

not the animation.

---

# Selection

Selection should always be obvious.

Selection should never require interpretation.

The selected state should use:

Accent color.

Higher contrast.

Clear visual distinction.

Never rely exclusively on tiny indicators.

---

# Disabled State

Disabled controls should remain readable.

They should clearly communicate:

Unavailable.

Not broken.

Never reduce contrast so aggressively that users cannot understand the interface.

Accessibility takes priority over visual subtlety.

---

# Error Presentation

Errors should remain calm.

Avoid alarming visual language.

Avoid excessive red.

Avoid blinking.

Avoid shaking.

Avoid dramatic feedback.

Communicate clearly.

Then help the user recover.

---

# Success Feedback

Success should be acknowledged,

not celebrated.

A subtle confirmation is preferable to dramatic animations.

The application should maintain the same calm personality after success as before.

---

# Background Philosophy

The background should almost disappear.

It exists to support content.

Never to become visually interesting.

Avoid:

Textures.

Patterns.

Illustrations.

Decorative gradients.

Noise overlays.

Large glowing effects.

Backgrounds should remain visually quiet.

---

# Border Colors

Borders should be barely visible.

They should define structure,

not become visual elements.

If a border immediately attracts attention,

it is probably too strong.

---

# Color Balance

Every screen should naturally guide the eye.

The visual order should approximately become:

Content

↓

Primary Actions

↓

Secondary Actions

↓

Metadata

↓

Background

Never allow background colors to compete with information.

---

# Accessibility

Contrast is mandatory.

Every text element must remain comfortably readable.

Never sacrifice readability for aesthetics.

Dark mode does not justify poor contrast.

Accessibility is considered a core design requirement,

not an optional improvement.

---

# Examples

## Good Example

Dark background.

Subtle cards.

White primary text.

Muted metadata.

One visible accent button.

Selected navigation highlighted.

The user's attention immediately goes to meaningful actions.

---

## Bad Example

Bright cards.

Colored backgrounds.

Several accent buttons.

Multiple colored icons.

Gradient headers.

Strong shadows.

The interface feels noisy.

Users no longer know where to look.

---

# Implementation Notes for Autonomous Agents

When refactoring the existing application:

• Consolidate duplicate neutral colors.

• Replace hardcoded hex values with semantic tokens.

• Remove decorative color usage.

• Merge similar surface colors.

• Minimize accent usage.

• Ensure every semantic meaning maps to exactly one token.

• Prefer deleting colors over introducing new ones.

• Reduce palette complexity whenever possible.

The redesign should finish with fewer colors than the current implementation.

Not more.

---

# Anti-patterns

The following are explicitly forbidden:

• Rainbow interfaces.

• Decorative gradients.

• Saturated fantasy palettes.

• Colored cards.

• Colored page backgrounds.

• Random accent usage.

• Page-specific color systems.

• Multiple accent colors.

• Decorative glows.

• Neon effects.

• Color-only hierarchy.

• Hardcoded color values inside components.

---

# Acceptance Criteria

The Color System is considered complete only if:

- [ ] Every color has a semantic meaning.
- [ ] Neutral tones dominate the interface.
- [ ] Exactly one primary accent color exists.
- [ ] Accent usage remains restrained and intentional.
- [ ] Status colors are used consistently.
- [ ] Surface hierarchy is immediately understandable.
- [ ] Typography does not rely on color for hierarchy.
- [ ] Accessibility contrast requirements are respected.
- [ ] Hardcoded colors have been eliminated.
- [ ] The application feels calm, professional and visually disciplined.

# 10 — Spacing & Layout System

## Purpose

Spacing is the invisible structure of the interface.

Users rarely notice spacing directly.

Instead, they perceive order.

Calmness.

Professionalism.

Consistency.

A well-designed spacing system reduces cognitive load because users subconsciously learn the rhythm of the interface.

Spacing is therefore considered a structural component rather than a decorative one.

---

# Design Rationale

Dungeon Archive is designed for rapid information retrieval on mobile devices.

The interface must expose a large amount of information without becoming visually overwhelming.

This balance cannot be achieved through typography alone.

Spacing creates rhythm.

Rhythm creates predictability.

Predictability reduces cognitive effort.

Every spacing decision therefore exists to improve scanning speed.

Never to "make things prettier."

---

# Core Philosophy

Whitespace is not empty space.

Whitespace is structure.

Whitespace separates concepts.

Whitespace communicates relationships.

Whitespace improves scanning.

Whitespace reduces mistakes.

Good spacing is almost invisible.

Poor spacing immediately feels wrong.

---

# Vertical Rhythm

Every page should establish a consistent reading rhythm.

The user should subconsciously predict where the next piece of information will appear.

A typical page should naturally flow:

Page Header

↓

Primary Metadata

↓

Primary Content

↓

Secondary Sections

↓

Advanced Information

↓

Actions

No section should feel randomly positioned.

---

# Horizontal Rhythm

Content should align vertically whenever possible.

Avoid unnecessary indentation.

Avoid arbitrary left offsets.

Text should create clean visual columns.

Users should immediately recognize alignment.

Misalignment should become exceptional.

---

# Spacing Hierarchy

Spacing communicates hierarchy.

The greater the conceptual separation,

the greater the physical separation.

Small spacing

↓

Elements belonging together.

Medium spacing

↓

Different pieces of the same section.

Large spacing

↓

Different sections.

Very large spacing should be extremely rare.

---

# Page Padding

Every page should use the same horizontal padding.

The application should feel like one continuous workspace.

Changing horizontal padding between pages is forbidden.

Vertical padding should also remain consistent.

Safe Areas should integrate naturally into the layout rather than creating excessive empty space.

---

# Section Spacing

Sections should breathe.

They should never float.

Sections should feel intentionally grouped.

Avoid:

Large unexplained gaps.

Tiny compressed sections.

Random spacing variations.

The spacing between sections should become one of the most recognizable characteristics of the application.

---

# Internal Component Spacing

Every reusable component should establish its own internal rhythm.

Cards.

Buttons.

Inputs.

Dialogs.

Lists.

Search Results.

Metadata Blocks.

Once defined,

their internal spacing should never vary between pages.

Consistency is more valuable than visual experimentation.

---

# List Rhythm

Lists are one of the most common interface patterns.

Every list should feel rhythmically identical.

Spacing between items.

Padding.

Interaction areas.

Separators.

Everything should become predictable.

Users should instinctively understand list behaviour after interacting with only one screen.

---

# Card Rhythm

Cards should never feel like isolated objects.

They should feel like natural extensions of the page.

Cards require:

Consistent internal padding.

Consistent spacing between cards.

Consistent title placement.

Consistent metadata positioning.

Cards should create flow,

not interruption.

---

# Grid Philosophy

The application should use as few layout systems as possible.

Prefer:

Single-column layouts.

Simple grids.

Flexible stacks.

Avoid unnecessarily complex responsive grids.

Mobile simplicity always wins.

---

# Content Density

Dungeon Archive intentionally targets a high information density.

However,

high density does not mean compression.

Users should never feel that the interface is trying to fit everything onto one screen.

The objective is efficiency.

Not overcrowding.

---

# Scroll Philosophy

Scrolling is expected.

Excessive scrolling is not.

The objective is not eliminating scrolling.

The objective is ensuring that every scroll reveals valuable information.

Users should rarely scroll through empty space.

---

# Fold Philosophy

The first visible screen should expose approximately 80% of the information required to make the next decision.

Critical information belongs above the fold.

Supporting information belongs below.

Decorative content belongs nowhere.

---

# Alignment Rules

Alignment should be mathematically consistent.

Not visually improvised.

Titles should align.

Cards should align.

Buttons should align.

Metadata should align.

Inputs should align.

Navigation should align.

Misalignment should require explicit justification.

---

# Grouping

Elements should be grouped by meaning.

Never by convenience.

If two elements are frequently interpreted together,

they should appear close together.

If they belong to different concepts,

they should be visually separated.

Spacing should communicate relationships before typography does.

---

# Empty Space

Empty space is valuable.

Unused space is waste.

Before introducing additional whitespace,

ask:

Does this improve readability?

Does this improve grouping?

Does this improve scanning?

If not,

remove it.

---

# Mobile Thumb Zones

Frequently used interactions should naturally appear inside comfortable thumb zones.

Long reaches should become uncommon.

Bottom navigation.

Search interactions.

Primary actions.

Bottom sheets.

These elements should respect natural hand movement.

---

# Examples

## Good Example

```
Character

Level 5 Fighter

──────────────

Hit Points

Armor Class

Speed

──────────────

Equipment

──────────────

Abilities
```

The spacing clearly communicates three conceptual groups.

---

## Bad Example

```
Character


Level 5 Fighter



Hit Points



Armor Class


Speed




Equipment
```

Large inconsistent gaps destroy reading rhythm and force unnecessary scrolling.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Eliminate arbitrary margins.

• Prefer layout primitives over manual spacing.

• Replace repeated spacing values with spacing tokens.

• Merge similar layouts.

• Remove unnecessary wrappers.

• Reduce nested containers.

• Simplify page structures.

• Ensure spacing communicates hierarchy rather than decoration.

Whenever multiple spacing values appear visually identical,

standardize them.

The redesign should reduce the total number of unique spacing values across the codebase.

---

# Anti-patterns

The following are explicitly forbidden:

• Random margins.

• Page-specific spacing systems.

• Oversized hero spacing.

• Decorative empty space.

• Nested padding without purpose.

• Different horizontal padding on different pages.

• Inconsistent card spacing.

• Uneven list rhythm.

• Misaligned content.

• Excessive visual separation.

• Layouts created through trial and error rather than the spacing system.

---

# Acceptance Criteria

The Spacing & Layout System is considered complete only if:

- [ ] Every page follows a consistent vertical rhythm.
- [ ] Horizontal alignment remains consistent throughout the application.
- [ ] Section spacing communicates hierarchy.
- [ ] Components use standardized internal spacing.
- [ ] Cards and lists follow shared spacing rules.
- [ ] Empty space always has a functional purpose.
- [ ] The first screen exposes the most valuable information.
- [ ] Mobile layouts feel dense without feeling cramped.
- [ ] Arbitrary spacing has been removed.
- [ ] The application feels visually calm, predictable and structurally coherent.

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

# 12 — Component Architecture

## Purpose

Components are the building blocks of Dungeon Archive.

Every screen in the application is composed from reusable components.

The purpose of the Component Architecture is to ensure that every component has a clear responsibility, predictable behaviour and well-defined place within the Design System.

The application should evolve by composing existing components rather than creating new ones.

Whenever possible, complexity should emerge from composition rather than inheritance.

---

# Design Rationale

Large front-end applications rarely become difficult because individual components are complex.

They become difficult because there are too many components that solve the same problem.

Component Architecture exists to eliminate duplication.

It creates a shared visual language.

It reduces implementation decisions.

It lowers maintenance costs.

It increases consistency.

Every new component increases the complexity of the Design System.

Therefore, creating a component is considered a significant design decision rather than a convenience.

---

# Component Philosophy

Every component must answer three questions.

What responsibility does it have?

Why does it exist?

Why can't an existing component solve the same problem?

If these questions cannot be answered clearly,

the component probably should not exist.

---

# The Component Pyramid

The entire application should be organized into five architectural layers.

```
Pages
│
Feature Components
│
Composite Components
│
Primitive Components
│
Foundation Components
```

Dependencies always point downward.

Lower layers never depend on higher ones.

---

# Foundation Components

Foundation Components are the smallest reusable visual primitives.

They contain almost no business logic.

Examples include:

Button

Surface

Typography

Icon

Divider

Spinner

Skeleton

Stack

Inline

Grid

Container

Spacer

ScrollArea

These components define visual language.

Nothing else.

---

# Primitive Components

Primitive Components combine Foundation Components into reusable interface elements.

Examples include:

Card

Badge

Chip

Avatar

Input

TextField

SearchField

Select

Checkbox

Radio

Switch

Tabs

Progress

Toast

Snackbar

Dialog

BottomSheet

Primitive Components remain generic.

They should never know anything about Dungeons & Dragons.

---

# Composite Components

Composite Components understand product concepts.

Examples include:

EntityCard

SpellCard

MonsterCard

MetadataGrid

SearchResult

SectionHeader

EntityHeader

StatBlock

QuickActionBar

PropertyList

EntityPreview

Composite Components compose Primitive Components.

They should not duplicate behaviour already solved elsewhere.

---

# Feature Components

Feature Components belong to a specific feature module.

Examples:

PartySidebar

CharacterEquipment

SpellPreparation

CloudBackupCard

CampaignOverview

SearchSuggestions

They understand business rules.

They may use stores.

They may fetch data.

They may coordinate workflows.

However,

they should still reuse lower-level UI components.

---

# Pages

Pages orchestrate everything.

Pages should contain almost no visual implementation.

Their responsibility is:

Routing.

State coordination.

Composition.

Nothing else.

A page should feel like an arrangement of existing building blocks.

---

# Responsibility Rules

Each component should have exactly one primary responsibility.

Examples:

Button

Handles interaction.

Not layout.

Card

Groups related information.

Not navigation.

SearchField

Captures queries.

Not search results.

SectionHeader

Introduces content.

Not the content itself.

If a component performs multiple unrelated responsibilities,

split it.

---

# Composition Over Configuration

Prefer composing simple components.

Avoid creating components with dozens of optional props.

Example.

Good:

```
<Card>
    <SectionHeader />
    <MetadataGrid />
</Card>
```

Poor:

```
<Card
    compact
    outlined
    elevated
    rounded
    bordered
    condensed
    shadow="lg"
    variant="secondary"
    ...
/>
```

Simple composition scales better than endless configuration.

---

# API Design

Component APIs should be predictable.

Property names should remain consistent.

Prefer:

variant

size

disabled

selected

loading

children

Avoid:

isPrimary

big

blue

customPadding

visualMode

magicNumber

APIs should describe behaviour,

not appearance.

---

# Styling Rules

Visual styling belongs inside components.

Pages should never override component appearance.

Avoid:

Inline styles.

Arbitrary utility classes.

One-off variants.

Visual hacks.

Every improvement should strengthen the Design System.

Not bypass it.

---

# State Ownership

Components should own only the state they truly require.

Temporary UI state:

Inside the component.

Application state:

Feature layer.

Global state:

Dedicated stores.

Avoid unnecessary prop drilling.

Avoid unnecessary global state.

Ownership should remain obvious.

---

# Folder Organization

Organize components by architectural responsibility.

Never by size.

Example:

```
components/

    foundation/

    primitives/

    composite/

features/

    search/

    party/

    compendium/

        components/

        hooks/

        pages/

```

The folder structure should explain the architecture without documentation.

---

# Naming Rules

Names describe purpose.

Never appearance.

Good:

EntityCard

MetadataRow

SearchField

QuickActions

Bad:

RoundedCard

BlueButton

LargeContainer

SmallList

Appearance changes.

Responsibilities remain.

---

# Reuse Decision Tree

Before creating a new component:

Can an existing component solve this?

↓

Yes

Reuse it.

↓

No

Can an existing component be extended?

↓

Yes

Extend it.

↓

No

Can two existing components be composed?

↓

Yes

Compose them.

↓

No

Create a new component.

Creating a component is always the final option.

---

# Refactoring Rules

Whenever duplicated UI appears:

Extract.

Rename.

Merge.

Delete.

Never leave duplicated implementations because "they already work."

The redesign exists to reduce technical debt.

---

# Component Lifecycle

Every component should pass through four stages.

Creation

↓

Adoption

↓

Stabilization

↓

Simplification

The final stage of a mature component is simplicity.

Not feature accumulation.

---

# Performance

Components should render only what is necessary.

Avoid unnecessary rerenders.

Avoid unnecessary effects.

Avoid expensive computations inside render functions.

Performance improvements should never compromise readability.

Readable code remains the priority.

---

# Accessibility

Every interactive component must support:

Keyboard navigation (where applicable).

Screen readers.

Focus states.

Touch accessibility.

Disabled states.

Loading states.

Accessibility belongs inside the component,

not inside pages.

---

# Documentation

Every reusable component should document:

Purpose.

Responsibilities.

Supported variants.

Composition examples.

Accessibility considerations.

Components should become easier to reuse over time.

---

# Good Example

```
<Page>

    <PageHeader />

    <SearchField />

    <SectionHeader />

    <EntityCard />

    <BottomNavigation />

</Page>
```

Every responsibility is obvious.

Every element belongs to the Design System.

---

# Bad Example

```
<div className="rounded-xl bg-zinc-900 p-[17px]">

    <h2 className="...">

        ...

```

Arbitrary styling.

Unknown hierarchy.

No reusable architecture.

Impossible to maintain consistently.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Merge visually identical components.

• Delete obsolete components.

• Extract duplicated layouts.

• Standardize component APIs.

• Replace page-specific styling with shared primitives.

• Flatten unnecessary abstractions.

• Remove dead variants.

• Consolidate folder structure.

• Prefer composition over inheritance.

• Improve readability even if it requires large refactors.

When uncertain,

prefer fewer components with clearer responsibilities.

Never increase the total number of components unless doing so significantly improves architecture.

---

# Anti-patterns

The following are explicitly forbidden:

• God Components.

• Components with multiple unrelated responsibilities.

• Page-specific visual components.

• Copy-pasted UI.

• Deep inheritance hierarchies.

• Variant explosions.

• Inline visual constants.

• Feature logic inside Foundation Components.

• Business logic inside Primitive Components.

• Styling implemented directly in Pages.

• Components created "just in case."

---

# Acceptance Criteria

The Component Architecture is considered complete only if:

- [ ] Every component belongs to exactly one architectural layer.
- [ ] Responsibilities are clear and singular.
- [ ] Pages compose existing components rather than implementing UI.
- [ ] Duplicate components have been eliminated.
- [ ] Component APIs remain small and predictable.
- [ ] Business logic is isolated from presentation.
- [ ] Folder structure reflects architectural responsibility.
- [ ] Composition is preferred over configuration.
- [ ] The Design System becomes easier to extend over time.
- [ ] Future features can be built primarily by reusing existing components rather than inventing new ones.

# 13 — Interaction System

## Purpose

The Interaction System defines how users interact with Dungeon Archive.

It governs every tap, press, swipe, transition, state change and piece of feedback throughout the application.

Users should never need to learn how interactions work.

After only a few minutes of use, every interaction should become predictable.

The interaction language should feel calm, immediate and reliable.

---

# Design Rationale

Dungeon Archive is used during active tabletop sessions.

Users are often interrupted.

Players are waiting.

The Dungeon Master has little available attention.

Interactions must therefore optimize:

Speed.

Confidence.

Recognition.

Predictability.

The application should always feel like it reacts immediately.

Users should never question whether an interaction has been registered.

---

# Interaction Philosophy

Every interaction should satisfy four principles.

Immediate.

Predictable.

Forgiving.

Consistent.

Every interaction should answer the user's action within milliseconds.

The interface should never feel hesitant.

---

# The Cost of Interaction

Every interaction has a cognitive cost.

The redesign should minimize:

Number of taps.

Number of confirmations.

Number of choices.

Number of navigation changes.

The fastest interaction is the one that never becomes necessary.

---

# Primary Actions

Primary actions represent the most important task on a screen.

Each screen should normally expose one primary action.

Examples:

Create Character

Save

Import

Continue

Search

Primary actions should immediately attract attention through placement,

not through excessive color.

---

# Secondary Actions

Secondary actions support the workflow.

They should remain visible,

but never compete with the primary action.

Examples:

Cancel

Duplicate

Share

Copy

Rename

---

# Destructive Actions

Destructive actions require special treatment.

Delete.

Reset.

Remove.

Erase.

These actions should:

Require deliberate interaction.

Clearly communicate consequences.

Offer recovery whenever technically possible.

Avoid accidental activation.

---

# Decision Tree — Confirmations

Before adding a confirmation dialog ask:

Is the action reversible?

↓

YES

↓

Do not ask for confirmation.

Offer Undo instead.

↓

NO

↓

Continue.

Does the action permanently destroy data?

↓

YES

↓

Require confirmation.

↓

NO

↓

Execute immediately.

Users should not fight confirmation dialogs.

---

# Feedback Philosophy

Every interaction must generate feedback.

Feedback should be immediate.

Subtle.

Clear.

Never theatrical.

The interface should acknowledge actions,

not celebrate them.

---

# Feedback Types

Use feedback appropriate to the action.

Micro interaction

↓

Color change.

Button state.

Loading indicator.

Short-lived operation

↓

Spinner.

Skeleton.

Progress indicator.

Completed operation

↓

Snackbar.

Toast.

Error

↓

Inline message whenever possible.

Dialog only when absolutely necessary.

---

# Loading Behaviour

Loading should communicate progress.

Never uncertainty.

Whenever possible:

Use Skeletons.

Avoid global spinners.

Avoid blocking the interface.

Users should continue interacting whenever technically possible.

---

# Button States

Every interactive button should support:

Default.

Pressed.

Focused.

Loading.

Disabled.

Selected.

These states must behave consistently across the application.

---

# Touch Feedback

Touch feedback should be immediate.

Prefer:

Subtle background changes.

Elevation changes.

Color transitions.

Avoid:

Bounce effects.

Oversized animations.

Elastic movement.

Particle effects.

The application should feel responsive,

not playful.

---

# Gestures

Gestures should enhance productivity.

Never replace discoverability.

Supported gestures may include:

Swipe to dismiss.

Swipe between tabs.

Pull to refresh.

Long press for contextual actions.

Every gesture should have a visible alternative.

No functionality should depend exclusively on gestures.

---

# Long Press

Long press should expose advanced functionality.

Never primary functionality.

Users should never need to guess that a long press exists.

---

# Swipe Actions

Swipe actions should remain conservative.

Suitable examples:

Delete.

Archive.

Favorite.

Reveal actions.

Avoid introducing multiple swipe directions with different meanings.

---

# Navigation Feedback

Navigation should begin immediately.

Avoid blank screens.

Avoid visible route delays.

Whenever possible,

render placeholders instantly.

Perceived performance is as important as actual performance.

---

# Search Interaction

Search should begin responding immediately.

Results should appear while typing.

No explicit search button should be required.

Search should tolerate mistakes.

Search should feel conversational.

Typing should never feel delayed.

---

# Error Recovery

Every recoverable error should include a recovery path.

Never present:

"Something went wrong."

Instead explain:

What happened.

Why.

What users can do next.

Errors should reduce uncertainty,

not increase it.

---

# Notifications

Notifications should remain rare.

Prefer:

Snackbar.

Toast.

Inline confirmation.

Avoid modal interruptions.

Only interrupt the user when interruption is genuinely necessary.

---

# Undo Philosophy

Undo is preferred over confirmation.

Whenever technically feasible,

allow users to recover rather than asking permission beforehand.

This creates faster workflows.

---

# Empty States

Empty states should always provide direction.

Explain:

Why nothing appears.

What users can do.

What happens next.

Never leave users facing an empty screen without guidance.

---

# Offline Behaviour

Offline should not feel like failure.

The application is offline-first.

Users should continue working naturally.

Connectivity problems should remain secondary to the experience.

---

# Good Example

User deletes a character.

↓

Character disappears immediately.

↓

Snackbar appears.

"Character deleted."

Undo.

↓

Five seconds later,

the deletion becomes permanent.

Fast.

Recoverable.

No confirmation dialog required.

---

# Bad Example

Delete.

↓

Confirmation dialog.

↓

Confirmation.

↓

Loading spinner.

↓

Success dialog.

↓

Close dialog.

↓

Return to page.

Too many interruptions.

Too much friction.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Standardize every interaction state.

• Remove inconsistent feedback patterns.

• Replace confirmation dialogs with Undo whenever possible.

• Replace blocking spinners with Skeletons.

• Consolidate loading behaviour.

• Ensure all buttons expose identical interaction states.

• Minimize interaction latency.

• Remove unnecessary animations.

• Prioritize perceived responsiveness over decorative effects.

Whenever multiple interaction models appear valid,

choose the one requiring the fewest cognitive steps.

---

# Anti-patterns

The following are explicitly forbidden:

• Double confirmations.

• Success dialogs.

• Decorative animations.

• Inconsistent button behaviour.

• Hidden gestures.

• Blocking spinners.

• Random loading indicators.

• Long transitions.

• Ambiguous error messages.

• Interactions requiring explanation.

• Multiple interaction languages across different features.

---

# Acceptance Criteria

The Interaction System is considered complete only if:

- [ ] Every interaction receives immediate feedback.
- [ ] Button behaviour is consistent across the application.
- [ ] Undo replaces confirmation whenever appropriate.
- [ ] Loading states communicate progress without blocking the interface.
- [ ] Gestures remain optional enhancements.
- [ ] Search feels instantaneous.
- [ ] Errors always include a recovery path.
- [ ] Notifications remain subtle and non-disruptive.
- [ ] The application feels responsive even during slow operations.
- [ ] Users can confidently predict the result of every interaction.

# 14 — Search Experience

## Purpose

Search is the heart of Dungeon Archive.

It is not a feature.

It is the primary way users interact with the application.

Every design decision related to Search should optimize one objective:

Allow users to find the information they need in the shortest possible time.

Everything else is secondary.

---

# Design Rationale

Dungeon Masters rarely know exactly where information is located.

They remember fragments.

A spell name.

A monster type.

A condition.

A weapon.

A class feature.

Search should therefore prioritize recognition over navigation.

Users should think:

"I remember part of it."

Never:

"I remember which category it belongs to."

Browsing supports Search.

Search does not support Browsing.

---

# Search Philosophy

Search should feel instantaneous.

It should behave as though the entire Compendium already exists inside the user's device.

Every interaction should reinforce this perception.

The user should never consciously wait.

---

# The Golden Rule

If users know approximately what they are looking for,

Search must always be faster than browsing.

If browsing becomes faster,

Search has failed.

---

# Search is Always Available

Search should remain continuously accessible.

Users should never need to navigate multiple screens before searching.

Whenever practical,

Search should be one interaction away.

Search is considered global functionality.

Not page functionality.

---

# Search Input

The Search Field is one of the most important components in the application.

It should:

Immediately receive focus when appropriate.

Open the keyboard without delay.

Remain visually prominent.

Occupy the available width.

Use concise placeholder text.

Avoid unnecessary decoration.

The Search Field should communicate:

"Start typing."

Nothing more.

---

# Typing Behaviour

Every keystroke should immediately update results.

Never require pressing Enter.

Never require tapping a Search button.

Results should evolve continuously while typing.

The interface should feel alive.

---

# Result Latency

Perceived latency should approach zero.

If technical latency exists,

mask it using:

Instant local filtering.

Skeleton placeholders.

Progressive rendering.

The user should always feel that Search is responding immediately.

---

# Predictive Search

Search should assist users before they finish typing.

Suggestions should appear naturally.

Suggestions should never interrupt typing.

Suggestions should improve confidence,

not create visual noise.

---

# Fuzzy Matching

Search should tolerate small typing mistakes.

Minor spelling differences should not prevent discovery.

Users should succeed even when imperfect.

Precision is important.

Forgiveness is equally important.

---

# Search Ranking

Results should prioritize usefulness over strict matching.

General priority:

Exact match.

↓

Starts with.

↓

Contains.

↓

Related result.

↓

Partial match.

↓

Everything else.

Users should almost always find the expected result within the first few entries.

---

# Result Presentation

Results exist for recognition.

Not reading.

Each result should expose only the information required to identify it.

Typical result:

Entity Name

↓

Entity Type

↓

Essential Metadata

Avoid long descriptions.

Avoid paragraphs.

Avoid preview walls.

Recognition should happen in less than one second.

---

# Visual Hierarchy

The eye should immediately find:

Entity Name.

↓

Entity Category.

↓

Supporting Metadata.

Everything else is secondary.

---

# Search Results Layout

Results should appear directly beneath the Search Field.

No intermediate screen.

No dedicated loading page.

No unnecessary transitions.

Typing and reading should feel like a single interaction.

---

# Sticky Search

Once Search is active,

the Search Field should remain accessible.

Users should refine queries without scrolling back to the top.

The Search Field should become part of the navigation experience.

---

# Keyboard Behaviour

Opening Search should naturally open the keyboard.

Closing Search should restore previous context.

The keyboard should never hide important information unnecessarily.

Users should comfortably search using one hand.

---

# Recent Searches

Recent searches improve speed.

Only store meaningful searches.

Recent searches should disappear naturally as new searches replace them.

Never require manual management.

The feature should remain invisible until useful.

---

# Empty Queries

An empty Search Field should not feel empty.

Instead,

display:

Recent searches.

Recently viewed entities.

Popular categories.

Quick entry points.

Users should immediately know how to begin.

---

# Empty Results

No results should never become a dead end.

Explain:

Nothing matches.

Offer:

Suggested spelling.

Alternative queries.

Browse categories.

The interface should always help users recover.

---

# Filters

Filters refine Search.

They never replace it.

Filtering should remain optional.

Users should always begin by typing.

Filters should reduce result sets,

not become navigation.

---

# Search Context

Search should understand every searchable entity equally.

The experience should feel identical whether users search for:

Spells.

Monsters.

Equipment.

Conditions.

Magic Items.

Actions.

Future content types.

The search experience should remain universal.

---

# Result Selection

Opening a result should feel immediate.

Returning should preserve:

Search query.

Scroll position.

Result ordering.

Keyboard state whenever practical.

Users should never lose context accidentally.

---

# Search Persistence

Search should remember where the user was.

Leaving an entity page should restore the exact previous Search experience.

The user should never need to repeat work.

---

# Offline Search

Search must behave identically offline.

No online dependency should exist.

The user should never notice whether connectivity exists.

Offline-first is a product requirement.

Not an enhancement.

---

# Search Performance

The application should prioritize perceived speed.

Small rendering improvements often matter more than algorithmic optimizations.

Users evaluate Search emotionally.

Not technically.

---

# Search Decision Tree

When adding new searchable content:

Can users reasonably remember its name?

↓

YES

↓

Index it.

↓

NO

↓

Can users remember metadata?

↓

YES

↓

Index metadata.

↓

NO

↓

Should it appear in Search?

↓

Probably not.

Search quality is more valuable than Search quantity.

---

# Examples

## Good Search

User types:

```
fire
```

Results immediately become:

```
Fireball

Spell

Level 3

────────────

Fire Bolt

Cantrip

────────────

Wall of Fire

Spell

Level 4
```

Recognition happens instantly.

---

## Bad Search

User types:

```
fire
```

↓

Spinner

↓

Loading

↓

Three large cards

↓

Paragraph previews

↓

Images

↓

Descriptions

The user spends more time reading than identifying.

Search has failed.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Make Search visually central.

• Eliminate unnecessary search flows.

• Preserve query state whenever possible.

• Standardize search result layouts.

• Reduce visual noise.

• Improve perceived responsiveness.

• Keep results directly beneath the Search Field.

• Ensure Search behaves identically across every searchable entity.

• Avoid introducing page-specific search implementations.

Whenever uncertain,

choose the interaction requiring the least cognitive effort.

Search should always feel like the fastest feature in the application.

---

# Anti-patterns

The following are explicitly forbidden:

• Search buttons.

• Dedicated search submission.

• Long loading screens.

• Search pages disconnected from results.

• Large preview cards.

• Image-heavy results.

• Category-first search.

• Losing search state.

• Requiring repeated typing.

• Search behaviour that differs between entity types.

• Online-only search.

---

# Acceptance Criteria

The Search Experience is considered complete only if:

- [ ] Search is the fastest way to reach any entity.
- [ ] Results update continuously while typing.
- [ ] Search feels instantaneous.
- [ ] Result ranking prioritizes user expectation.
- [ ] Result cards maximize recognition speed.
- [ ] Returning from an entity restores previous search context.
- [ ] Search behaves identically offline.
- [ ] Empty searches remain useful.
- [ ] Empty results always provide recovery paths.
- [ ] Users naturally prefer Search over browsing because it is genuinely faster.

# 15 — Home Workspace

## Purpose

The Home Workspace is the operational center of Dungeon Archive.

It is not a landing page.

It is not a dashboard.

It is not a marketing screen.

It is the place users return to between every task.

The Home Workspace should immediately answer one question:

"What do I need right now?"

Every element that does not contribute to answering this question should be removed.

---

# Design Rationale

Dungeon Archive is opened repeatedly during a tabletop session.

Users rarely stay on the Home screen for long.

Instead, they use it as an orientation point between actions.

The Home Workspace therefore exists to:

Restore context.

Provide quick access.

Expose current progress.

Reduce navigation.

The Home Workspace should feel like returning to a familiar desk.

Everything is exactly where users expect it to be.

---

# Product Philosophy

Opening Dungeon Archive should feel like sitting down behind the Dungeon Master's screen.

Everything important is already visible.

Nothing asks for attention unnecessarily.

Nothing feels promotional.

Nothing competes for focus.

The application quietly waits until needed.

---

# Core Principles

The Home Workspace should be:

Useful.

Calm.

Dense.

Immediate.

Predictable.

Professional.

Every block should solve a problem.

No block should exist because "dashboards usually have one."

---

# Information Priority

Content should appear in the following order.

1.

Current Character

↓

2.

Current Party

↓

3.

Continue Working

↓

4.

Quick Search

↓

5.

Recent Entities

↓

6.

Categories

↓

7.

Cloud Backup Status

Everything else is secondary.

---

# Above the Fold

The first visible screen should expose the majority of the user's workflow.

Without scrolling,

users should immediately see:

Their current character.

Party summary.

Quick Search.

Continue where they left off.

The first screen should feel complete.

---

# Character Section

The Character Card is the most important element on the Home Workspace.

It should immediately communicate:

Character Name.

Class.

Level.

Hit Points.

Armor Class.

Current status.

Opening the application should instantly reconnect the user with their character.

---

# Party Section

Immediately below the Character appears the current Party.

The Party should expose:

Portrait.

Name.

Level.

Health status.

Quick access.

The Party exists for recognition.

Not management.

Management belongs inside the Party feature.

---

# Continue Working

Dungeon Archive should remember context.

If the user recently viewed:

Fireball

The Home Workspace should offer:

Continue reading Fireball.

If the user was editing a character,

offer:

Continue editing.

The application should feel persistent.

---

# Quick Search

Search should remain permanently visible.

The Search Field should appear naturally inside the Home Workspace.

Searching should require exactly one interaction.

Users should never need to "go to Search."

Home already contains Search.

---

# Recent Entities

Recently viewed entities reduce repeated searching.

Display only a small number.

The objective is recognition,

not history management.

Recent items should naturally expire.

No manual cleanup should be required.

---

# Categories

Categories provide browsing,

not navigation.

Categories exist for discovery.

Not for users who already know what they need.

Categories should therefore appear below Search.

Never above it.

---

# Cloud Backup

Cloud Backup communicates trust.

Not functionality.

Its purpose is reassuring users that their information is safe.

The component should remain visually quiet.

Only attract attention when intervention is required.

Healthy systems should almost disappear.

---

# Visual Hierarchy

The eye should naturally travel:

Character

↓

Party

↓

Search

↓

Continue

↓

Recent

↓

Categories

↓

Everything else

The Home Workspace should never require users to wonder where to look first.

---

# Density

The Home Workspace should expose meaningful information.

Not decorative information.

Large banners are forbidden.

Hero sections are forbidden.

Illustrations are forbidden.

Welcome messages are forbidden.

The first screen should solve problems immediately.

---

# Scroll Behaviour

Scrolling should reveal additional utilities.

Not primary functionality.

Critical actions belong above the fold.

Supporting tools belong below.

The user should never scroll just to begin using the application.

---

# Empty State

A brand-new installation should still feel useful.

When no character exists:

Guide users toward creating one.

When no Party exists:

Offer creating or importing one.

When no Recent Entities exist:

Suggest exploring categories.

The Home Workspace should never appear unfinished.

---

# Future Scalability

Future modules may integrate naturally.

Campaigns.

Notes.

Maps.

NPCs.

Initiative.

However,

they should respect the established information hierarchy.

The Home Workspace should become richer,

not busier.

---

# Decision Tree — New Home Modules

Before adding anything to the Home Workspace ask:

Will users interact with this almost every session?

↓

YES

↓

Consider Home.

↓

NO

↓

Keep it inside its feature.

Home should remain intentionally selective.

---

# Good Example

```
Current Character

──────────────

Current Party

──────────────

Search

──────────────

Continue Reading

──────────────

Recent Entities

──────────────

Categories

──────────────

Cloud Backup
```

Every section contributes directly to gameplay.

---

# Bad Example

```
Welcome!

──────────────

Statistics

──────────────

Large Illustration

──────────────

Version News

──────────────

Tips

──────────────

Character
```

The user must work through irrelevant content before reaching useful information.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Remove every decorative element.

• Prioritize gameplay over presentation.

• Reduce vertical scrolling.

• Keep Search permanently accessible.

• Ensure Character and Party dominate the first screen.

• Minimize visual competition.

• Reuse existing Design System components.

• Avoid introducing Home-specific UI components unless absolutely necessary.

When uncertain,

remove content rather than adding more.

The Home Workspace should become smaller,

clearer,

and more useful.

---

# Anti-patterns

The following are explicitly forbidden:

• Hero banners.

• Welcome messages.

• Marketing sections.

• Feature announcements.

• Decorative illustrations.

• Empty whitespace.

• Statistics without actionable value.

• Large promotional cards.

• Multiple competing focal points.

• Content that users see every day but rarely use.

---

# Acceptance Criteria

The Home Workspace is considered complete only if:

- [ ] Users understand the application within three seconds.
- [ ] Current Character dominates the experience.
- [ ] Party is immediately accessible.
- [ ] Search is always one interaction away.
- [ ] Continue Working restores previous context.
- [ ] Recent Entities reduce repeated searching.
- [ ] Categories remain secondary to Search.
- [ ] Cloud Backup communicates trust without creating distraction.
- [ ] Above-the-fold content contains the majority of daily workflows.
- [ ] The Home Workspace feels like the operational center of the application rather than a traditional homepage.

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

# 17 — Entity Pages

## Purpose

Entity Pages are the final destination of most user journeys.

Their purpose is simple:

Allow users to understand an entity as quickly as possible.

Everything on the page should help answer questions.

Nothing should distract from the content.

---

## Design Rationale

Users do not browse Entity Pages.

They consult them.

Reading speed is therefore more important than visual impact.

The page should feel like opening a well-designed rulebook.

---

## Core Principles

Every Entity Page should be:

- Fast to scan
- Easy to read
- Consistent
- Information-first
- Mobile-first

All entity types should feel like variations of the same page.

---

## Page Structure

Every entity should follow the same structure whenever possible.

1. Header
2. Metadata
3. Primary content
4. Secondary information
5. Related entities

Users should never relearn a page because the entity type changed.

---

## Header

The header should contain only the essential identity.

Examples:

- Name
- Type
- Level / CR (when applicable)
- Short subtitle

Avoid oversized headers.

---

## Metadata

Important metadata should appear immediately below the header.

Examples:

- School
- Casting Time
- Range
- Duration
- Size
- Creature Type
- Source

Metadata should be scannable.

Avoid long sentences.

---

## Primary Content

Rules text is the most important part of the page.

Typography should maximize readability.

Paragraphs should remain compact.

Tables should be responsive.

Lists should remain easy to scan.

---

## Progressive Disclosure

Advanced information should remain collapsed until needed.

Examples:

- Lore
- Variants
- Optional rules
- Developer notes

The first screen should prioritize gameplay.

---

## Related Entities

Whenever possible, related entities should appear at the bottom.

Examples:

- Similar spells
- Conditions
- Monsters
- Equipment

Relationships should encourage exploration without interrupting reading.

---

## Navigation

Returning from an Entity Page should always restore:

- Previous page
- Scroll position
- Search query (if applicable)

Users should never lose context.

---

## Performance

Entity Pages should appear instantly.

Content should render progressively if necessary.

Scrolling should remain perfectly smooth.

---

## Implementation Notes

During the redesign:

- Unify all entity layouts.
- Remove duplicated page implementations.
- Standardize metadata blocks.
- Reuse shared components.
- Keep content width consistent.
- Prioritize readability over decoration.

---

## Anti-patterns

Avoid:

- Different layouts for each entity type.
- Huge headers.
- Decorative banners.
- Excessive spacing.
- Hidden metadata.
- Long walls of text without hierarchy.

---

## Acceptance Criteria

- [ ] Every entity follows the same layout.
- [ ] Metadata is visible immediately.
- [ ] Primary content is easy to read.
- [ ] Related entities encourage navigation.
- [ ] Returning preserves context.
- [ ] All entity types feel like one unified system.

# 18 — Category Pages

## Purpose

Category Pages allow users to browse content when they do not know the exact entity they are looking for.

Browsing should complement Search.

It should never replace it.

---

## Design Rationale

Users arrive here to explore.

The interface should help them progressively narrow down large collections without feeling overwhelmed.

The objective is efficient discovery.

---

## Core Principles

Category Pages should be:

- Fast
- Predictable
- Search-first
- Filter-friendly
- Easy to scan

---

## Page Structure

Every Category Page should follow the same layout.

1. Sticky Search
2. Sticky Filters
3. Result Counter
4. Entity List

No additional sections should appear above the search tools.

---

## Sticky Search

The Search Field remains visible while scrolling.

Users should always be able to refine their query without returning to the top.

---

## Filters

Filters should refine.

Never dominate.

Only expose filters that genuinely reduce the result set.

Frequently used filters remain visible.

Advanced filters belong inside a collapsible panel.

---

## Sorting

Sorting should remain simple.

Prefer options such as:

- Alphabetical
- Recently Added
- Level
- Challenge Rating

Avoid excessive sorting options.

---

## Result Count

Always display the number of visible results.

The counter should update instantly when searching or filtering.

---

## Entity List

Results should use the shared Entity Card component.

All categories should reuse the same list behaviour.

Avoid creating category-specific layouts.

---

## Empty Results

When no entities match:

- Explain why.
- Suggest removing filters.
- Suggest clearing the search.

Never leave an empty screen.

---

## Performance

Large collections should remain smooth.

Filtering and searching should appear instantaneous.

Scrolling performance must remain stable regardless of collection size.

---

## Implementation Notes

During the redesign:

- Standardize every Category Page.
- Reuse Search components.
- Reuse Filter components.
- Preserve scroll position.
- Keep Search and Filters sticky.
- Avoid duplicated layouts.

---

## Anti-patterns

Avoid:

- Different layouts per category.
- Filters hidden behind multiple taps.
- Search separated from results.
- Long explanatory text.
- Decorative banners.
- Inconsistent sorting options.

---

## Acceptance Criteria

- [ ] Every category follows the same layout.
- [ ] Search remains permanently accessible.
- [ ] Filters are simple and easy to understand.
- [ ] Result counts update instantly.
- [ ] Entity lists remain consistent.
- [ ] Browsing feels like a natural extension of Search.

# 19 — Forms & Editing Experience

## Purpose

Forms allow users to create, edit and manage their personal data.

They should feel effortless.

The interface should help users complete tasks rather than presenting large collections of fields.

---

## Design Rationale

Dungeon Archive is primarily a reference application.

Editing is secondary.

When users edit information, they usually want to make a small change quickly.

The editing experience should minimize friction and allow users to return to gameplay as soon as possible.

---

## Core Principles

Forms should be:

- Simple
- Fast
- Predictable
- Forgiving
- Mobile-first

---

## Form Structure

Forms should be divided into logical sections.

Avoid presenting long uninterrupted lists of fields.

Group related information together.

Examples:

- Identity
- Statistics
- Equipment
- Abilities
- Notes

---

## Progressive Disclosure

Only show information when it becomes relevant.

Advanced options should remain collapsed until needed.

The default experience should remain focused.

---

## Input Components

Use a single implementation for each input type.

Examples:

- Text Input
- Number Input
- Select
- Checkbox
- Switch
- Text Area

Avoid feature-specific input implementations.

---

## Labels

Every field must have a clear label.

Avoid relying on placeholders as labels.

Placeholders provide examples.

Labels identify the field.

---

## Validation

Validation should happen as early as possible.

Errors should appear close to the affected field.

Explain:

- What is wrong.
- How to fix it.

Never display generic validation messages.

---

## Required Fields

Only require information that is genuinely necessary.

Optional information should remain optional.

The fastest form is the shortest one.

---

## Save Behaviour

Saving should feel immediate.

Users should always know whether their changes have been stored.

Whenever possible:

- Save automatically.
- Otherwise provide a clear Save action.

Never leave users wondering if their work was lost.

---

## Unsaved Changes

Warn users only when data would actually be lost.

Avoid unnecessary confirmation dialogs.

Whenever possible, recover unfinished work automatically.

---

## Editing Existing Data

Editing should preload existing values.

Users should modify information rather than recreate it.

---

## Keyboard Behaviour

The keyboard should never cover the active field.

Navigation between inputs should feel natural.

Scrolling should automatically keep the focused field visible.

---

## Error Recovery

Errors should never force users to restart the form.

Preserve entered information whenever possible.

Only invalid fields should require correction.

---

## Empty States

When no data exists:

Explain what can be created.

Provide a clear primary action.

Avoid empty pages without guidance.

---

## Performance

Forms should respond immediately.

Typing must remain perfectly smooth.

Saving should provide immediate visual feedback.

---

## Implementation Notes

During the redesign:

- Standardize every form layout.
- Reuse shared input components.
- Remove duplicated validation logic.
- Minimize required fields.
- Keep primary actions visible.
- Preserve partially completed work whenever possible.

---

## Anti-patterns

Avoid:

- Giant forms.
- Multiple-column layouts on mobile.
- Placeholder-only labels.
- Generic validation messages.
- Hidden required fields.
- Losing entered information.
- Different form styles across features.

---

## Acceptance Criteria

- [ ] Every form follows the same structure.
- [ ] Validation is immediate and understandable.
- [ ] Forms remain comfortable on mobile.
- [ ] Existing data is easy to edit.
- [ ] Saving is always obvious.
- [ ] Users never lose work accidentally.

# 20 — Feedback & System States

## Purpose

System Feedback communicates the current state of the application.

Users should always understand what the application is doing.

No interaction should leave users wondering whether something happened.

---

## Design Rationale

Dungeon Archive is designed to feel reliable.

Reliability is built through clear feedback.

The application should communicate state changes naturally without interrupting the user's workflow.

Feedback should increase confidence.

Never steal attention.

---

## Core Principles

Feedback should be:

- Immediate
- Clear
- Calm
- Consistent
- Contextual

---

## Feedback Hierarchy

Use the least intrusive feedback possible.

Priority:

1. Inline feedback
2. Button state
3. Snackbar
4. Bottom Sheet
5. Dialog

Dialogs should be exceptional.

---

## Loading States

Every loading operation should communicate progress.

Prefer:

- Skeletons
- Progressive rendering
- Placeholder content

Avoid full-screen spinners whenever possible.

The interface should remain usable while data loads.

---

## Skeleton Screens

Skeletons should closely resemble the final layout.

Avoid generic grey rectangles.

The transition from Skeleton to content should feel seamless.

---

## Progress Indicators

Only display progress indicators when users benefit from understanding progress.

Avoid showing progress for operations that complete almost instantly.

---

## Success Feedback

Successful actions should be acknowledged briefly.

Preferred:

- Snackbar
- Inline confirmation

Avoid:

- Success dialogs
- Celebration animations
- Confetti
- Sound effects

Success should feel calm.

---

## Error Feedback

Errors should explain:

- What happened.
- Why it happened (when possible).
- How to recover.

Every recoverable error should suggest the next action.

---

## Offline State

Offline is a normal operating mode.

The interface should continue working naturally.

Only cloud-related features should communicate connectivity issues.

Never imply that the application is unusable.

---

## Empty States

Every empty state should answer:

Why is this empty?

What can I do next?

Provide one clear primary action.

---

## Disabled States

Disabled controls should remain understandable.

Users should know:

- What the control does.
- Why it is currently unavailable.

Avoid making disabled controls disappear.

---

## Saving State

Whenever user data is being saved, clearly communicate the current state.

Examples:

- Saving...
- Saved
- Sync pending
- Cloud backup complete

The user should never wonder whether changes were stored.

---

## Snackbar

Snackbars communicate short-lived information.

Use them for:

- Save completed
- Item deleted
- Undo available
- Import completed

Snackbars should disappear automatically.

---

## Toasts

Use Toasts sparingly.

Only for global information that is not tied to a specific screen.

Avoid stacking multiple Toasts.

---

## Dialogs

Dialogs interrupt the workflow.

Only use them for:

- Irreversible actions
- Critical errors
- Important confirmations

Never use dialogs for routine success messages.

---

## Implementation Notes

During the redesign:

- Standardize all loading states.
- Replace spinners with Skeletons where possible.
- Unify Snackbar behavior.
- Remove unnecessary dialogs.
- Standardize error messages.
- Ensure every async action provides feedback.

---

## Anti-patterns

Avoid:

- Infinite loading indicators.
- Blank screens.
- Silent failures.
- Success dialogs.
- Decorative loading animations.
- Multiple simultaneous notifications.
- Error messages without recovery.

---

## Acceptance Criteria

- [ ] Every asynchronous action provides immediate feedback.
- [ ] Skeletons replace most loading spinners.
- [ ] Errors explain recovery.
- [ ] Success feedback is subtle.
- [ ] Offline mode remains fully usable.
- [ ] Empty states always guide the user.
- [ ] Notifications remain consistent throughout the application.

# 21 — Performance & Perceived Performance

## Purpose

Performance is a feature.

Users should perceive Dungeon Archive as instantaneous.

The application should feel lightweight, responsive and reliable on every supported device.

Perceived performance is as important as measured performance.

---

## Design Rationale

Dungeon Archive is used during active tabletop sessions.

Every delay interrupts the game.

Users should never wait for information that already exists on their device.

The interface should always feel one step ahead of the user.

---

## Core Principles

Performance should prioritize:

- Responsiveness
- Predictability
- Stability
- Smoothness
- Battery efficiency

Raw benchmark numbers are secondary to perceived responsiveness.

---

## Perceived Performance

Whenever possible:

- Render immediately.
- Load progressively.
- Show Skeletons instead of blank space.
- Preserve previous state during navigation.

Users should always feel that something is happening.

---

## Rendering

Render only what is necessary.

Avoid unnecessary component updates.

Avoid expensive calculations during rendering.

Memoize only when it clearly improves performance.

Readable code remains the priority.

---

## Navigation

Navigation should feel immediate.

Transitions should never delay interaction.

Returning to previous screens should restore:

- Scroll position
- Search query
- Previous state

Navigation should feel continuous rather than page-based.

---

## Scrolling

Scrolling must remain smooth at all times.

Lists should not stutter.

Sticky elements should remain stable.

No layout shifts should occur during scrolling.

---

## Search Performance

Search is the highest performance priority.

Typing should never introduce visible latency.

Filtering should happen instantly.

Results should update continuously while typing.

Search performance always takes precedence over visual polish.

---

## Loading Strategy

Prefer:

- Local data
- Cached data
- Progressive rendering
- Skeleton placeholders

Avoid unnecessary loading indicators.

---

## Network Usage

Cloud synchronization should happen quietly.

Users should not wait for network operations unless absolutely necessary.

The application should remain fully usable offline.

---

## Bundle Quality

Keep the application lightweight.

Avoid unnecessary dependencies.

Remove dead code.

Prefer existing utilities over introducing new libraries.

Every dependency should justify its existence.

---

## Animations

Animations should never reduce responsiveness.

If an animation competes with responsiveness,

responsiveness wins.

Subtle color transitions are preferred over movement.

---

## Memory Usage

Avoid retaining unnecessary state.

Dispose temporary objects correctly.

Prevent unnecessary rerenders.

Maintain predictable memory usage during long sessions.

---

## Implementation Notes

During the redesign:

- Reduce duplicated rendering logic.
- Standardize loading behavior.
- Eliminate unnecessary rerenders.
- Preserve UI state during navigation.
- Optimize search before optimizing secondary features.
- Keep the interface responsive under all normal workloads.

---

## Anti-patterns

Avoid:

- Heavy animations.
- Layout shifts.
- Blank loading screens.
- Unnecessary rerenders.
- Blocking UI during background operations.
- Large unused dependencies.
- Recomputing identical data.

---

## Acceptance Criteria

- [ ] Search feels instantaneous.
- [ ] Navigation restores previous context.
- [ ] Scrolling remains perfectly smooth.
- [ ] Skeletons replace blank loading states.
- [ ] Offline usage behaves naturally.
- [ ] The application feels consistently responsive throughout every primary workflow.

# 22 — Accessibility & Quality Standards

## Purpose

Dungeon Archive should be usable by everyone.

Accessibility is not an optional feature.

It is part of good software engineering.

At the same time, every screen should maintain the same level of visual and interaction quality.

This chapter defines the minimum quality bar for the entire application.

---

## Core Principles

Every interface should be:

- Accessible
- Readable
- Predictable
- Consistent
- Robust

No feature is considered complete until it satisfies these principles.

---

# Accessibility

## Touch Targets

Every interactive element should provide a touch target of at least **44×44 px**.

Visual size may be smaller,

but the interactive area must remain comfortable.

---

## Contrast

Text should always maintain sufficient contrast against its background.

Primary information should remain readable in every supported state.

Never sacrifice readability for aesthetics.

---

## Typography

Typography should remain readable on small mobile devices.

Avoid tiny fonts.

Avoid extremely long line lengths.

Body text should prioritize comfortable reading over visual density.

---

## Icons

Icons should never communicate meaning on their own.

Whenever necessary,

combine icons with labels or surrounding context.

Users should never guess what an action does.

---

## Focus States

Every interactive component should expose a visible focus state.

Keyboard navigation should remain fully usable wherever applicable.

Focus indicators should be consistent across the application.

---

## Screen Readers

Interactive controls should expose meaningful labels.

Avoid unlabeled buttons.

Avoid generic accessibility descriptions.

Navigation should remain understandable without visual context.

---

## Motion

Animations should never be required to understand the interface.

Users should obtain the same information regardless of animation.

Motion should reinforce interaction,

never replace it.

---

# Quality Standards

## Visual Consistency

The same problem should always have the same visual solution.

Buttons.

Cards.

Lists.

Dialogs.

Search.

Every shared pattern should behave identically throughout the application.

---

## Component Reuse

Never duplicate an existing component because of small visual differences.

Improve the shared component instead.

Consistency is more valuable than local optimization.

---

## Layout Consistency

Spacing should follow the Design System.

Avoid arbitrary padding.

Avoid arbitrary margins.

Visual rhythm should remain predictable across every page.

---

## Naming

Component names should describe responsibility.

Not appearance.

Good:

EntityCard

MetadataGrid

QuickActions

Bad:

BlueCard

RoundedButton

LargeList

Appearance changes.

Responsibilities do not.

---

## Simplicity

When two implementations solve the same problem,

prefer the simpler one.

Complexity must always justify itself.

---

## Maintainability

Future contributors should immediately understand:

- Why a component exists.
- Where it belongs.
- When it should be reused.

Readable code is part of product quality.

---

## Scalability

New features should naturally fit into the existing Design System.

Adding functionality should require composition,

not rewriting existing components.

---

## Technical Debt

The redesign is an opportunity to remove technical debt.

Do not preserve unnecessary abstractions.

Do not preserve duplicated implementations.

Do not preserve obsolete components.

Improving architecture is part of the redesign.

---

## Implementation Notes

During the redesign:

- Standardize spacing.
- Standardize typography.
- Merge duplicate components.
- Improve accessibility labels.
- Remove inconsistent layouts.
- Simplify complex implementations.
- Prefer clarity over cleverness.

Every change should improve both user experience and maintainability.

---

## Anti-patterns

Avoid:

- Tiny touch targets.
- Low-contrast text.
- Hidden actions.
- Duplicate components.
- Arbitrary spacing.
- Inconsistent naming.
- Complex APIs.
- Decorative accessibility violations.

---

## Acceptance Criteria

- [ ] Touch targets are comfortable on mobile.
- [ ] Typography remains readable on every screen.
- [ ] Contrast is sufficient throughout the application.
- [ ] Interactive elements expose consistent states.
- [ ] Shared components are reused instead of duplicated.
- [ ] Layout follows the Design System.
- [ ] Accessibility is considered during implementation rather than afterwards.
- [ ] Code readability matches UI quality.
- [ ] Technical debt has been reduced rather than preserved.
- [ ] The application feels like a coherent product built from one unified Design System.

# 23 — Autonomous Refactoring Protocol & Definition of Done

## Purpose

This chapter defines how autonomous agents must approach the redesign of Dungeon Archive.

It is not a style guide.

It is an engineering protocol.

Following the previous chapters is mandatory.

Following this protocol determines *how* those chapters are implemented.

The objective is not simply to finish the redesign.

The objective is to leave the codebase in a better state than it was found.

---

# Core Mission

The mission is to transform Dungeon Archive into a professional, mobile-first application without changing its product vision.

Every decision must reinforce:

- Simplicity
- Consistency
- Performance
- Maintainability
- Readability

Never optimize one at the expense of the others without a compelling reason.

---

# Refactoring Philosophy

Do not decorate.

Improve.

Do not add.

Simplify.

Do not preserve code because it already works.

Preserve it because it is the best implementation.

Every change should reduce future complexity.

---

# Working Order

Every task should follow the same sequence.

1. Understand the current implementation.
2. Identify duplicated patterns.
3. Compare against the Design System.
4. Refactor shared components first.
5. Update feature implementations.
6. Remove obsolete code.
7. Verify functionality.
8. Verify visual consistency.
9. Verify mobile usability.
10. Commit only when the feature is complete.

Never begin implementation before understanding the existing architecture.

---

# Design System First

Whenever a visual inconsistency is discovered:

Do not patch the page.

Improve the shared component.

Pages should consume the Design System.

Pages should not redefine it.

---

# Decision Hierarchy

When several solutions appear valid, follow this priority:

1. Simplicity
2. Consistency
3. Readability
4. Maintainability
5. Performance
6. Flexibility

Do not optimize for hypothetical future requirements.

Solve today's problem cleanly.

---

# Code Quality Rules

Every modified file should be cleaner than before.

Whenever touching a file:

- Remove dead code.
- Remove unused imports.
- Simplify conditions.
- Improve naming.
- Reduce duplication.
- Delete obsolete comments.

Leave the file in a better state.

---

# Component Rules

Before creating a new component:

Can an existing one be reused?

↓

Can an existing one be extended?

↓

Can composition solve the problem?

↓

Only then create a new component.

New components are expensive.

Reuse is preferred.

---

# Refactoring Rules

When duplicated logic appears:

Extract.

When duplicated components appear:

Merge.

When unused code appears:

Delete.

When abstractions no longer provide value:

Flatten them.

Prefer fewer concepts over more concepts.

---

# Mobile Validation

Every completed change must be evaluated from a mobile perspective.

Ask:

Can this be comfortably used with one hand?

Does it require unnecessary scrolling?

Are touch targets comfortable?

Is the important information visible immediately?

If the answer is "No",

the task is not complete.

---

# Performance Validation

Every feature should feel instantaneous.

Whenever performance and decoration compete,

performance wins.

Whenever animation delays interaction,

remove the animation.

Users should always feel that the application reacts immediately.

---

# Search Validation

Every modification must preserve Search as the fastest workflow.

Never introduce navigation that is faster than Search.

Never move Search away from the center of the experience.

---

# Consistency Validation

Before considering any feature complete, compare it against every similar feature.

If two screens solve the same problem differently,

one of them is wrong.

Consistency is mandatory.

---

# Accessibility Validation

Every interaction must verify:

- Touch targets
- Contrast
- Readability
- Focus states
- Screen reader labels (where applicable)

Accessibility is validated continuously.

Not afterwards.

---

# Dependency Policy

Do not introduce new dependencies unless they provide substantial long-term value.

Prefer improving existing utilities.

Avoid solving architectural problems with libraries.

Every dependency increases maintenance cost.

---

# Documentation

Whenever architecture changes significantly,

update the documentation.

Documentation should always describe the current implementation.

Never leave documentation behind.

---

# Testing

Every completed feature should verify:

- Existing functionality still works.
- No regression has been introduced.
- Layout remains correct.
- Mobile behavior remains correct.

The redesign must never sacrifice stability.

---

# When to Stop

Stop refactoring when:

The implementation becomes simple.

Further changes only increase complexity.

Do not chase perfection.

Aim for clarity.

---

# Forbidden Behaviors

Never:

- Duplicate components.
- Introduce page-specific design systems.
- Add decorative features without purpose.
- Leave TODOs as permanent solutions.
- Preserve technical debt intentionally.
- Add configuration for hypothetical needs.
- Break existing functionality.
- Introduce inconsistent interaction patterns.
- Increase abstraction without measurable benefit.

---

# Definition of Done

A task is complete only if all of the following are true:

## Product

- [ ] The implementation matches the product vision.
- [ ] Mobile-first principles have been respected.
- [ ] Search remains the fastest workflow.
- [ ] The interface feels calm, dense and professional.
- [ ] No unnecessary visual elements have been introduced.

---

## Design System

- [ ] Shared components were reused whenever possible.
- [ ] No duplicated UI patterns exist.
- [ ] Spacing follows the Design System.
- [ ] Typography follows the Design System.
- [ ] Colors follow the Design System.
- [ ] Interaction states are consistent.

---

## User Experience

- [ ] Navigation preserves context.
- [ ] Scroll position is restored.
- [ ] Feedback is immediate.
- [ ] Empty states remain useful.
- [ ] Error recovery is clear.

---

## Performance

- [ ] Search feels instantaneous.
- [ ] Scrolling remains smooth.
- [ ] No unnecessary rerenders were introduced.
- [ ] Loading behavior follows the project standards.

---

## Accessibility

- [ ] Touch targets are comfortable.
- [ ] Contrast is sufficient.
- [ ] Focus states are visible.
- [ ] Typography remains readable.

---

## Code Quality

- [ ] Modified files are cleaner than before.
- [ ] Dead code has been removed.
- [ ] Naming is consistent.
- [ ] Duplication has been reduced.
- [ ] Component responsibilities remain clear.
- [ ] Folder organization still reflects the architecture.

---

## Maintainability

- [ ] The solution is easy to understand.
- [ ] Future contributors can extend it naturally.
- [ ] Documentation reflects the implementation.
- [ ] No unnecessary dependencies were introduced.

---

## Final Verification

Before considering the redesign complete, perform one final review.

Do not ask:

"Does it work?"

Ask:

"Does this feel like software built by a disciplined product team?"

If the answer is uncertain,

continue refining.

If the answer is confidently yes,

the redesign is complete.

---

## Final Principle

Dungeon Archive is not trying to impress users.

It is trying to disappear.

The best interface is the one that allows players and Dungeon Masters to stop thinking about the application and return to their game.

Every design decision should move the product closer to that goal.
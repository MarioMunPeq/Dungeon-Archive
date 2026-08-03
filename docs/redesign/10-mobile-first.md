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

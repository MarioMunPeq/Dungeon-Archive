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

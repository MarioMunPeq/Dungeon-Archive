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

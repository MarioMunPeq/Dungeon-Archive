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

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

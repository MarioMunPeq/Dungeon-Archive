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

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

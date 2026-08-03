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

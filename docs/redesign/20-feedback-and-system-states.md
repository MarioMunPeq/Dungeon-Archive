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

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

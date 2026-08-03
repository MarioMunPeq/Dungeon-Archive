# 23 — Autonomous Refactoring Protocol & Definition of Done

## Purpose

This chapter defines how autonomous agents must approach the redesign of Dungeon Archive.

It is not a style guide.

It is an engineering protocol.

Following the previous chapters is mandatory.

Following this protocol determines *how* those chapters are implemented.

The objective is not simply to finish the redesign.

The objective is to leave the codebase in a better state than it was found.

---

# Core Mission

The mission is to transform Dungeon Archive into a professional, mobile-first application without changing its product vision.

Every decision must reinforce:

- Simplicity
- Consistency
- Performance
- Maintainability
- Readability

Never optimize one at the expense of the others without a compelling reason.

---

# Refactoring Philosophy

Do not decorate.

Improve.

Do not add.

Simplify.

Do not preserve code because it already works.

Preserve it because it is the best implementation.

Every change should reduce future complexity.

---

# Working Order

Every task should follow the same sequence.

1. Understand the current implementation.
2. Identify duplicated patterns.
3. Compare against the Design System.
4. Refactor shared components first.
5. Update feature implementations.
6. Remove obsolete code.
7. Verify functionality.
8. Verify visual consistency.
9. Verify mobile usability.
10. Commit only when the feature is complete.

Never begin implementation before understanding the existing architecture.

---

# Design System First

Whenever a visual inconsistency is discovered:

Do not patch the page.

Improve the shared component.

Pages should consume the Design System.

Pages should not redefine it.

---

# Decision Hierarchy

When several solutions appear valid, follow this priority:

1. Simplicity
2. Consistency
3. Readability
4. Maintainability
5. Performance
6. Flexibility

Do not optimize for hypothetical future requirements.

Solve today's problem cleanly.

---

# Code Quality Rules

Every modified file should be cleaner than before.

Whenever touching a file:

- Remove dead code.
- Remove unused imports.
- Simplify conditions.
- Improve naming.
- Reduce duplication.
- Delete obsolete comments.

Leave the file in a better state.

---

# Component Rules

Before creating a new component:

Can an existing one be reused?

↓

Can an existing one be extended?

↓

Can composition solve the problem?

↓

Only then create a new component.

New components are expensive.

Reuse is preferred.

---

# Refactoring Rules

When duplicated logic appears:

Extract.

When duplicated components appear:

Merge.

When unused code appears:

Delete.

When abstractions no longer provide value:

Flatten them.

Prefer fewer concepts over more concepts.

---

# Mobile Validation

Every completed change must be evaluated from a mobile perspective.

Ask:

Can this be comfortably used with one hand?

Does it require unnecessary scrolling?

Are touch targets comfortable?

Is the important information visible immediately?

If the answer is "No",

the task is not complete.

---

# Performance Validation

Every feature should feel instantaneous.

Whenever performance and decoration compete,

performance wins.

Whenever animation delays interaction,

remove the animation.

Users should always feel that the application reacts immediately.

---

# Search Validation

Every modification must preserve Search as the fastest workflow.

Never introduce navigation that is faster than Search.

Never move Search away from the center of the experience.

---

# Consistency Validation

Before considering any feature complete, compare it against every similar feature.

If two screens solve the same problem differently,

one of them is wrong.

Consistency is mandatory.

---

# Accessibility Validation

Every interaction must verify:

- Touch targets
- Contrast
- Readability
- Focus states
- Screen reader labels (where applicable)

Accessibility is validated continuously.

Not afterwards.

---

# Dependency Policy

Do not introduce new dependencies unless they provide substantial long-term value.

Prefer improving existing utilities.

Avoid solving architectural problems with libraries.

Every dependency increases maintenance cost.

---

# Documentation

Whenever architecture changes significantly,

update the documentation.

Documentation should always describe the current implementation.

Never leave documentation behind.

---

# Testing

Every completed feature should verify:

- Existing functionality still works.
- No regression has been introduced.
- Layout remains correct.
- Mobile behavior remains correct.

The redesign must never sacrifice stability.

---

# When to Stop

Stop refactoring when:

The implementation becomes simple.

Further changes only increase complexity.

Do not chase perfection.

Aim for clarity.

---

# Forbidden Behaviors

Never:

- Duplicate components.
- Introduce page-specific design systems.
- Add decorative features without purpose.
- Leave TODOs as permanent solutions.
- Preserve technical debt intentionally.
- Add configuration for hypothetical needs.
- Break existing functionality.
- Introduce inconsistent interaction patterns.
- Increase abstraction without measurable benefit.

---

# Definition of Done

A task is complete only if all of the following are true:

## Product

- [ ] The implementation matches the product vision.
- [ ] Mobile-first principles have been respected.
- [ ] Search remains the fastest workflow.
- [ ] The interface feels calm, dense and professional.
- [ ] No unnecessary visual elements have been introduced.

---

## Design System

- [ ] Shared components were reused whenever possible.
- [ ] No duplicated UI patterns exist.
- [ ] Spacing follows the Design System.
- [ ] Typography follows the Design System.
- [ ] Colors follow the Design System.
- [ ] Interaction states are consistent.

---

## User Experience

- [ ] Navigation preserves context.
- [ ] Scroll position is restored.
- [ ] Feedback is immediate.
- [ ] Empty states remain useful.
- [ ] Error recovery is clear.

---

## Performance

- [ ] Search feels instantaneous.
- [ ] Scrolling remains smooth.
- [ ] No unnecessary rerenders were introduced.
- [ ] Loading behavior follows the project standards.

---

## Accessibility

- [ ] Touch targets are comfortable.
- [ ] Contrast is sufficient.
- [ ] Focus states are visible.
- [ ] Typography remains readable.

---

## Code Quality

- [ ] Modified files are cleaner than before.
- [ ] Dead code has been removed.
- [ ] Naming is consistent.
- [ ] Duplication has been reduced.
- [ ] Component responsibilities remain clear.
- [ ] Folder organization still reflects the architecture.

---

## Maintainability

- [ ] The solution is easy to understand.
- [ ] Future contributors can extend it naturally.
- [ ] Documentation reflects the implementation.
- [ ] No unnecessary dependencies were introduced.

---

## Final Verification

Before considering the redesign complete, perform one final review.

Do not ask:

"Does it work?"

Ask:

"Does this feel like software built by a disciplined product team?"

If the answer is uncertain,

continue refining.

If the answer is confidently yes,

the redesign is complete.

---

## Final Principle

Dungeon Archive is not trying to impress users.

It is trying to disappear.

The best interface is the one that allows players and Dungeon Masters to stop thinking about the application and return to their game.

Every design decision should move the product closer to that goal.

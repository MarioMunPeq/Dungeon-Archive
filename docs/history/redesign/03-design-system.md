# 03 — Decision Framework

## Purpose

No specification can describe every possible implementation scenario.

During the redesign, situations will arise where multiple valid solutions appear possible.

This chapter defines the decision-making framework that must be used whenever the specification does not explicitly dictate an implementation.

These rules are hierarchical.

When two rules conflict, the one with the highest priority always wins.

---

# Decision Hierarchy

Whenever a design decision must be made, evaluate the options using the following order of priority.

Priority 1 always overrides Priority 2.

Priority 2 overrides Priority 3.

And so on.

---

## Priority 1 — Preserve Functionality

Never break existing functionality.

Visual implementations may change.

Architecture may evolve.

Components may be replaced.

Layouts may change completely.

However:

User capabilities must remain intact.

Every existing feature should continue working unless this specification explicitly states otherwise.

---

## Priority 2 — Improve Speed

If two implementations are functionally equivalent,

always choose the one that allows users to reach information faster.

Examples:

Fewer taps.

Less scrolling.

Faster scanning.

Lower cognitive load.

Lower interaction cost.

---

## Priority 3 — Improve Readability

If two layouts expose the same information,

choose the one that can be understood more quickly.

Users should recognize hierarchy immediately.

Important information should require no interpretation.

Reading should feel effortless.

---

## Priority 4 — Improve Consistency

If multiple visual solutions are acceptable,

prefer the one that matches existing design patterns.

Avoid introducing exceptions.

Avoid inventing page-specific behaviors.

The application should feel as though it was designed at once by one team.

---

## Priority 5 — Reduce Complexity

Whenever multiple implementations satisfy the previous priorities,

choose the simplest one.

The simplest implementation is usually the correct implementation.

Complexity always requires justification.

---

# Conflict Resolution

Whenever two design goals conflict,

use the following precedence.

Speed beats animation.

Readability beats density.

Consistency beats originality.

Information beats decoration.

Mobile beats desktop.

Shared components beat custom implementations.

Reuse beats duplication.

Deletion beats addition.

Functionality beats aesthetics.

---

# Refactoring Philosophy

Refactoring is encouraged.

Rewriting is not.

Improve existing code before replacing it.

Extract reusable patterns.

Consolidate duplicate implementations.

Standardize inconsistent behavior.

Do not rewrite stable systems merely because they could be cleaner.

---

# Component Decisions

Before creating a new component, answer these questions:

Can an existing component be reused?

Can an existing component be extended?

Can two existing components be merged?

Can the layout be simplified instead?

Only if every answer is "No" should a new component be created.

---

# Styling Decisions

Before introducing:

- a new spacing value
- a new color
- a new typography size
- a new shadow
- a new border radius
- a new transition

verify that an equivalent token does not already exist.

Custom values should become extremely rare.

The design system should become increasingly small, not increasingly large.

---

# Layout Decisions

Before introducing a new page layout,

verify whether an existing page structure can be reused.

The application should feel like one product,

not twenty independent screens.

Layouts should differ because content differs,

never because designers preferred different styles.

---

# Interaction Decisions

Every interaction should answer at least one of these questions:

Does this reduce taps?

Does this reduce scrolling?

Does this reduce reading effort?

Does this improve discoverability?

Does this reduce cognitive load?

If the answer is "No" to all,

the interaction probably should not exist.

---

# Animation Decisions

Animations are never decorative.

Animations may only exist if they:

Improve orientation.

Clarify state changes.

Provide meaningful feedback.

Improve perceived responsiveness.

Animations must never exist purely because they look pleasant.

---

# Visual Decisions

Whenever uncertainty exists,

prefer the solution that feels:

Cleaner.

Calmer.

More predictable.

More restrained.

More timeless.

Avoid trends.

Avoid visual gimmicks.

Avoid fashionable UI patterns that do not improve usability.

Dungeon Archive should still feel modern five years from now.

---

# Information Hierarchy

Every screen should expose information in the following order.

Critical.

↓

Important.

↓

Useful.

↓

Optional.

↓

Advanced.

↓

Technical.

Never expose advanced information before critical information.

Never make users search for essential metadata.

---

# Empty Space

Whitespace should improve comprehension.

Whitespace should never exist simply because there was nothing else to place.

Empty space must communicate hierarchy,

never emptiness.

---

# Density

The application should feel information-rich,

not information-heavy.

Avoid both extremes.

Do not compress content until readability suffers.

Do not expand layouts until scrolling becomes unnecessary work.

The correct density is achieved when users immediately locate the desired information without feeling overwhelmed.

---

# Future Decisions

Whenever implementing a solution,

ask:

"Would this still work if the application doubled in size?"

If the answer is no,

choose another implementation.

Scalability should influence every decision.

---

# Self Validation

Before considering any redesign task complete,

ask:

Is it faster?

Is it clearer?

Is it simpler?

Is it more consistent?

Is it easier to maintain?

If any answer is "No",

the implementation probably requires another iteration.

---

# Decision Checklist

Every significant implementation should satisfy the following questions.

- [ ] Does this preserve existing functionality?

- [ ] Does this reduce lookup time?

- [ ] Does this improve readability?

- [ ] Does this reduce cognitive load?

- [ ] Does this follow the design system?

- [ ] Does this reuse existing components?

- [ ] Does this avoid duplication?

- [ ] Does this improve maintainability?

- [ ] Would another developer immediately understand this implementation?

- [ ] Would this still feel correct two years from now?

Only after every question can reasonably be answered with "Yes" should the implementation be considered complete.

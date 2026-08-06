# 02 — Design Constitution

## Purpose

This constitution defines the immutable principles that govern every UI, UX and visual implementation within Dungeon Archive.

These are not recommendations.

They are mandatory constraints.

If any implementation conflicts with these principles, the implementation is wrong.

If existing code contradicts this constitution, the code must be refactored.

The constitution always takes precedence over historical design decisions.

---

# Article I — The User Comes First

The user is always running a live session.

Every interaction must respect that context.

The application should never demand unnecessary attention.

The interface should reduce cognitive load, not increase it.

Users should spend their attention on the game, not on the application.

---

# Article II — Speed Above Everything

Speed is the highest priority.

Whenever two implementations satisfy the same requirement, always choose the faster one.

Visual polish must never reduce responsiveness.

Animations must never delay interaction.

Beautiful delays are still delays.

Fast always wins.

---

# Article III — Information Over Interface

The interface exists only to expose information.

The interface is never the product.

Information is the product.

If a visual element competes with the content for attention, remove or redesign it.

Users should remember what they found.

Never how they found it.

---

# Article IV — Every Pixel Must Earn Its Place

No visual element may exist purely for decoration.

Every pixel must justify itself.

Every icon must communicate meaning.

Every border must improve hierarchy.

Every shadow must improve depth perception.

Every color must improve understanding.

If an element has no functional purpose, remove it.

---

# Article V — Simplicity Before Originality

Dungeon Archive does not seek visual originality.

It seeks clarity.

Predictability is more valuable than surprise.

Consistency is more valuable than uniqueness.

Users should instantly understand how every screen works.

---

# Article VI — Never Make the User Think

The best interface requires no explanation.

Navigation should feel obvious.

Interactions should feel predictable.

Labels should be explicit.

Buttons should communicate intent.

Users should never wonder:

"What does this do?"

"Where is this?"

"How do I go back?"

If those questions appear, the design has failed.

---

# Article VII — Mobile Is The Primary Platform

Dungeon Archive is designed for phones.

Desktop is secondary.

Tablet is incidental.

Every decision should be validated on a phone first.

Never sacrifice the mobile experience to improve desktop aesthetics.

The mobile layout defines the product.

Desktop merely adapts it.

---

# Article VIII — One-Hand Usability

The application should comfortably operate using one hand.

Primary actions should remain within thumb reach whenever possible.

Interactive elements must provide generous touch targets.

The interface should minimize unnecessary finger movement.

---

# Article IX — Workspace Before Homepage

The first screen is not a landing page.

It is a workspace.

The user has already chosen Dungeon Archive.

The application should immediately provide useful tools rather than introducing itself.

Avoid marketing patterns.

Avoid hero sections.

Avoid decorative welcome screens.

---

# Article X — Search Is The Fastest Path

Search is the primary workflow.

Browsing is secondary.

Navigation exists only to support search.

Whenever possible, reduce the number of interactions required to reach an entity.

Searching should feel instantaneous.

---

# Article XI — Progressive Disclosure

Never overwhelm users.

Show the most important information first.

Reveal secondary information only when needed.

Critical metadata belongs above descriptions.

Descriptions belong above advanced details.

Advanced details belong inside collapsible sections whenever appropriate.

---

# Article XII — Readability Before Density

The goal is not to display the maximum amount of information.

The goal is to display the maximum amount of useful information.

Whitespace is valuable.

Empty space without purpose is not.

Typography should breathe.

Content should remain compact.

The interface should feel information-rich, never crowded.

---

# Article XIII — Consistency Is Mandatory

Every screen should follow the same visual language.

Typography.

Spacing.

Buttons.

Cards.

Lists.

Headers.

Inputs.

Navigation.

No screen may invent new rules.

Consistency reduces cognitive load.

---

# Article XIV — Reuse Before Creation

Before creating a new component:

Ask whether an existing component can be improved.

If a component cannot reasonably be reused elsewhere, it probably should not exist.

Avoid component proliferation.

Prefer evolving shared primitives.

---

# Article XV — Delete Before Adding

The best redesign often removes more than it adds.

Before introducing:

- a new component
- a new animation
- a new color
- a new layout
- a new interaction

Ask whether something existing can simply be simplified.

Complexity requires justification.

Simplicity does not.

---

# Article XVI — Design Systems Over Pages

Pages do not define components.

Components define pages.

Every page should be assembled from reusable building blocks.

Page-specific styling should become exceptional rather than common.

---

# Article XVII — Long-Term Thinking

Every visual decision should support future expansion.

The design system should comfortably scale to:

- Characters
- Campaigns
- Notes
- Maps
- NPCs
- Encounters
- Future features

Avoid solutions that only solve today's problem.

---

# Article XVIII — Respect Existing Engineering

Business logic already exists.

Repositories already exist.

State management already exists.

Firebase already exists.

The redesign should respect those systems.

Presentation may evolve.

Architecture should remain stable.

---

# Article XIX — Refactor Without Fear

Visual backwards compatibility is not required.

Functional backwards compatibility is.

If an old implementation contradicts this specification:

Refactor it.

Replace it.

Remove it.

Do not preserve technical or visual debt simply because it already exists.

---

# Article XX — The Interface Should Disappear

The highest compliment Dungeon Archive can receive is not:

"This looks beautiful."

It is:

"I forgot the interface was there."

The user should focus entirely on the information.

The interface succeeds when it becomes invisible.

---

# Constitutional Laws

These laws are absolute.

Never break them.

1. Speed over beauty.

2. Information over decoration.

3. Simplicity over complexity.

4. Consistency over originality.

5. Mobile over desktop.

6. Reading over scrolling.

7. Components over custom pages.

8. Reuse over duplication.

9. Clarity over cleverness.

10. Function over nostalgia.

11. Remove before adding.

12. Every pixel earns its place.

13. Never make the user think.

14. Search before browsing.

15. The workspace comes before the homepage.

---

# Acceptance Criteria

This constitution is considered respected only if:

- [ ] Every redesign decision can be justified using at least one constitutional article.
- [ ] No component violates the core laws.
- [ ] No page introduces its own design language.
- [ ] Existing visual debt has been actively removed.
- [ ] The application behaves as a coherent productivity tool.
- [ ] The interface consistently prioritizes information over decoration.
- [ ] Every new UI decision strengthens, rather than weakens, the overall design system.

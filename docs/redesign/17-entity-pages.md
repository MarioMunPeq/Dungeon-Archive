# 17 — Entity Pages

## Purpose

Entity Pages are the final destination of most user journeys.

Their purpose is simple:

Allow users to understand an entity as quickly as possible.

Everything on the page should help answer questions.

Nothing should distract from the content.

---

## Design Rationale

Users do not browse Entity Pages.

They consult them.

Reading speed is therefore more important than visual impact.

The page should feel like opening a well-designed rulebook.

---

## Core Principles

Every Entity Page should be:

- Fast to scan
- Easy to read
- Consistent
- Information-first
- Mobile-first

All entity types should feel like variations of the same page.

---

## Page Structure

Every entity should follow the same structure whenever possible.

1. Header
2. Metadata
3. Primary content
4. Secondary information
5. Related entities

Users should never relearn a page because the entity type changed.

---

## Header

The header should contain only the essential identity.

Examples:

- Name
- Type
- Level / CR (when applicable)
- Short subtitle

Avoid oversized headers.

---

## Metadata

Important metadata should appear immediately below the header.

Examples:

- School
- Casting Time
- Range
- Duration
- Size
- Creature Type
- Source

Metadata should be scannable.

Avoid long sentences.

---

## Primary Content

Rules text is the most important part of the page.

Typography should maximize readability.

Paragraphs should remain compact.

Tables should be responsive.

Lists should remain easy to scan.

---

## Progressive Disclosure

Advanced information should remain collapsed until needed.

Examples:

- Lore
- Variants
- Optional rules
- Developer notes

The first screen should prioritize gameplay.

---

## Related Entities

Whenever possible, related entities should appear at the bottom.

Examples:

- Similar spells
- Conditions
- Monsters
- Equipment

Relationships should encourage exploration without interrupting reading.

---

## Navigation

Returning from an Entity Page should always restore:

- Previous page
- Scroll position
- Search query (if applicable)

Users should never lose context.

---

## Performance

Entity Pages should appear instantly.

Content should render progressively if necessary.

Scrolling should remain perfectly smooth.

---

## Implementation Notes

During the redesign:

- Unify all entity layouts.
- Remove duplicated page implementations.
- Standardize metadata blocks.
- Reuse shared components.
- Keep content width consistent.
- Prioritize readability over decoration.

---

## Anti-patterns

Avoid:

- Different layouts for each entity type.
- Huge headers.
- Decorative banners.
- Excessive spacing.
- Hidden metadata.
- Long walls of text without hierarchy.

---

## Acceptance Criteria

- [ ] Every entity follows the same layout.
- [ ] Metadata is visible immediately.
- [ ] Primary content is easy to read.
- [ ] Related entities encourage navigation.
- [ ] Returning preserves context.
- [ ] All entity types feel like one unified system.

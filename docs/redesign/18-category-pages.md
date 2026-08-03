# 18 — Category Pages

## Purpose

Category Pages allow users to browse content when they do not know the exact entity they are looking for.

Browsing should complement Search.

It should never replace it.

---

## Design Rationale

Users arrive here to explore.

The interface should help them progressively narrow down large collections without feeling overwhelmed.

The objective is efficient discovery.

---

## Core Principles

Category Pages should be:

- Fast
- Predictable
- Search-first
- Filter-friendly
- Easy to scan

---

## Page Structure

Every Category Page should follow the same layout.

1. Sticky Search
2. Sticky Filters
3. Result Counter
4. Entity List

No additional sections should appear above the search tools.

---

## Sticky Search

The Search Field remains visible while scrolling.

Users should always be able to refine their query without returning to the top.

---

## Filters

Filters should refine.

Never dominate.

Only expose filters that genuinely reduce the result set.

Frequently used filters remain visible.

Advanced filters belong inside a collapsible panel.

---

## Sorting

Sorting should remain simple.

Prefer options such as:

- Alphabetical
- Recently Added
- Level
- Challenge Rating

Avoid excessive sorting options.

---

## Result Count

Always display the number of visible results.

The counter should update instantly when searching or filtering.

---

## Entity List

Results should use the shared Entity Card component.

All categories should reuse the same list behaviour.

Avoid creating category-specific layouts.

---

## Empty Results

When no entities match:

- Explain why.
- Suggest removing filters.
- Suggest clearing the search.

Never leave an empty screen.

---

## Performance

Large collections should remain smooth.

Filtering and searching should appear instantaneous.

Scrolling performance must remain stable regardless of collection size.

---

## Implementation Notes

During the redesign:

- Standardize every Category Page.
- Reuse Search components.
- Reuse Filter components.
- Preserve scroll position.
- Keep Search and Filters sticky.
- Avoid duplicated layouts.

---

## Anti-patterns

Avoid:

- Different layouts per category.
- Filters hidden behind multiple taps.
- Search separated from results.
- Long explanatory text.
- Decorative banners.
- Inconsistent sorting options.

---

## Acceptance Criteria

- [ ] Every category follows the same layout.
- [ ] Search remains permanently accessible.
- [ ] Filters are simple and easy to understand.
- [ ] Result counts update instantly.
- [ ] Entity lists remain consistent.
- [ ] Browsing feels like a natural extension of Search.

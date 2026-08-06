# 14 — Search Experience

## Purpose

Search is the heart of Dungeon Archive.

It is not a feature.

It is the primary way users interact with the application.

Every design decision related to Search should optimize one objective:

Allow users to find the information they need in the shortest possible time.

Everything else is secondary.

---

# Design Rationale

Dungeon Masters rarely know exactly where information is located.

They remember fragments.

A spell name.

A monster type.

A condition.

A weapon.

A class feature.

Search should therefore prioritize recognition over navigation.

Users should think:

"I remember part of it."

Never:

"I remember which category it belongs to."

Browsing supports Search.

Search does not support Browsing.

---

# Search Philosophy

Search should feel instantaneous.

It should behave as though the entire Compendium already exists inside the user's device.

Every interaction should reinforce this perception.

The user should never consciously wait.

---

# The Golden Rule

If users know approximately what they are looking for,

Search must always be faster than browsing.

If browsing becomes faster,

Search has failed.

---

# Search is Always Available

Search should remain continuously accessible.

Users should never need to navigate multiple screens before searching.

Whenever practical,

Search should be one interaction away.

Search is considered global functionality.

Not page functionality.

---

# Search Input

The Search Field is one of the most important components in the application.

It should:

Immediately receive focus when appropriate.

Open the keyboard without delay.

Remain visually prominent.

Occupy the available width.

Use concise placeholder text.

Avoid unnecessary decoration.

The Search Field should communicate:

"Start typing."

Nothing more.

---

# Typing Behaviour

Every keystroke should immediately update results.

Never require pressing Enter.

Never require tapping a Search button.

Results should evolve continuously while typing.

The interface should feel alive.

---

# Result Latency

Perceived latency should approach zero.

If technical latency exists,

mask it using:

Instant local filtering.

Skeleton placeholders.

Progressive rendering.

The user should always feel that Search is responding immediately.

---

# Predictive Search

Search should assist users before they finish typing.

Suggestions should appear naturally.

Suggestions should never interrupt typing.

Suggestions should improve confidence,

not create visual noise.

---

# Fuzzy Matching

Search should tolerate small typing mistakes.

Minor spelling differences should not prevent discovery.

Users should succeed even when imperfect.

Precision is important.

Forgiveness is equally important.

---

# Search Ranking

Results should prioritize usefulness over strict matching.

General priority:

Exact match.

↓

Starts with.

↓

Contains.

↓

Related result.

↓

Partial match.

↓

Everything else.

Users should almost always find the expected result within the first few entries.

---

# Result Presentation

Results exist for recognition.

Not reading.

Each result should expose only the information required to identify it.

Typical result:

Entity Name

↓

Entity Type

↓

Essential Metadata

Avoid long descriptions.

Avoid paragraphs.

Avoid preview walls.

Recognition should happen in less than one second.

---

# Visual Hierarchy

The eye should immediately find:

Entity Name.

↓

Entity Category.

↓

Supporting Metadata.

Everything else is secondary.

---

# Search Results Layout

Results should appear directly beneath the Search Field.

No intermediate screen.

No dedicated loading page.

No unnecessary transitions.

Typing and reading should feel like a single interaction.

---

# Sticky Search

Once Search is active,

the Search Field should remain accessible.

Users should refine queries without scrolling back to the top.

The Search Field should become part of the navigation experience.

---

# Keyboard Behaviour

Opening Search should naturally open the keyboard.

Closing Search should restore previous context.

The keyboard should never hide important information unnecessarily.

Users should comfortably search using one hand.

---

# Recent Searches

Recent searches improve speed.

Only store meaningful searches.

Recent searches should disappear naturally as new searches replace them.

Never require manual management.

The feature should remain invisible until useful.

---

# Empty Queries

An empty Search Field should not feel empty.

Instead,

display:

Recent searches.

Recently viewed entities.

Popular categories.

Quick entry points.

Users should immediately know how to begin.

---

# Empty Results

No results should never become a dead end.

Explain:

Nothing matches.

Offer:

Suggested spelling.

Alternative queries.

Browse categories.

The interface should always help users recover.

---

# Filters

Filters refine Search.

They never replace it.

Filtering should remain optional.

Users should always begin by typing.

Filters should reduce result sets,

not become navigation.

---

# Search Context

Search should understand every searchable entity equally.

The experience should feel identical whether users search for:

Spells.

Monsters.

Equipment.

Conditions.

Magic Items.

Actions.

Future content types.

The search experience should remain universal.

---

# Result Selection

Opening a result should feel immediate.

Returning should preserve:

Search query.

Scroll position.

Result ordering.

Keyboard state whenever practical.

Users should never lose context accidentally.

---

# Search Persistence

Search should remember where the user was.

Leaving an entity page should restore the exact previous Search experience.

The user should never need to repeat work.

---

# Offline Search

Search must behave identically offline.

No online dependency should exist.

The user should never notice whether connectivity exists.

Offline-first is a product requirement.

Not an enhancement.

---

# Search Performance

The application should prioritize perceived speed.

Small rendering improvements often matter more than algorithmic optimizations.

Users evaluate Search emotionally.

Not technically.

---

# Search Decision Tree

When adding new searchable content:

Can users reasonably remember its name?

↓

YES

↓

Index it.

↓

NO

↓

Can users remember metadata?

↓

YES

↓

Index metadata.

↓

NO

↓

Should it appear in Search?

↓

Probably not.

Search quality is more valuable than Search quantity.

---

# Examples

## Good Search

User types:

```
fire
```

Results immediately become:

```
Fireball

Spell

Level 3

────────────

Fire Bolt

Cantrip

────────────

Wall of Fire

Spell

Level 4
```

Recognition happens instantly.

---

## Bad Search

User types:

```
fire
```

↓

Spinner

↓

Loading

↓

Three large cards

↓

Paragraph previews

↓

Images

↓

Descriptions

The user spends more time reading than identifying.

Search has failed.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Make Search visually central.

• Eliminate unnecessary search flows.

• Preserve query state whenever possible.

• Standardize search result layouts.

• Reduce visual noise.

• Improve perceived responsiveness.

• Keep results directly beneath the Search Field.

• Ensure Search behaves identically across every searchable entity.

• Avoid introducing page-specific search implementations.

Whenever uncertain,

choose the interaction requiring the least cognitive effort.

Search should always feel like the fastest feature in the application.

---

# Anti-patterns

The following are explicitly forbidden:

• Search buttons.

• Dedicated search submission.

• Long loading screens.

• Search pages disconnected from results.

• Large preview cards.

• Image-heavy results.

• Category-first search.

• Losing search state.

• Requiring repeated typing.

• Search behaviour that differs between entity types.

• Online-only search.

---

# Acceptance Criteria

The Search Experience is considered complete only if:

- [ ] Search is the fastest way to reach any entity.
- [ ] Results update continuously while typing.
- [ ] Search feels instantaneous.
- [ ] Result ranking prioritizes user expectation.
- [ ] Result cards maximize recognition speed.
- [ ] Returning from an entity restores previous search context.
- [ ] Search behaves identically offline.
- [ ] Empty searches remain useful.
- [ ] Empty results always provide recovery paths.
- [ ] Users naturally prefer Search over browsing because it is genuinely faster.

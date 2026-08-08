# Dungeon Archive — Design DNA

> **This document is binding for all future visual work on the app.** Any new screen or component must be checked against this document before it is considered done. If a decision contradicts a rule here, update this document explicitly rather than silently diverging.

---

## Purpose & Audience

1. This app is a cheat sheet for D&D **players**, not the DM — every design decision should optimize for a brand-new player understanding something in seconds, not for information density for its own sake.
2. Mobile-only, portrait-only. Every layout decision assumes a thumb on a small screen, never a mouse or a wide viewport.
3. Performance and simplicity outrank visual fidelity whenever they conflict. If unsure, choose the cheaper option.

## Color

4. Base background: warm near-black (`#12100E`), never cool/blue-tinted black.
5. Card background: `#1C1917` (flat) for ordinary content cards; protagonist stat/readout cards get a subtle radial-gradient depth treatment instead of flat color.
6. Primary accent (themeable, default Arcane Teal `#4A90B8`; Amber `#D97B29` and Jade `#3AB492` are selectable) is reserved for interactive elements ONLY: buttons, toggles, active nav tab, focus states, active/selected states. Never decorative.
7. Secondary accent (themeable, default Arcane Teal `#86AFC7`; Amber `#C9A26B`; Jade `#7FBFAA`) is for non-interactive secondary/metadata content: badges (level/CR/type), inactive nav icons, zero-value modifiers. Never used for primary interactive elements.
8. `?` help-badge color is a fixed semantic info color (blue), deliberately theme-independent — it does not change when the accent theme switches (Jade/Amber/Arcane Teal). This keeps "interactive/brand accent" visually distinct from "neutral help affordance", and stops the badge blending into the accent in themes where both would otherwise be green-ish. Do not make it theme-dependent.
9. Modifier/signed-value color coding is fixed: positive = success green, negative = danger red, zero = muted gold. This exact three-way rule applies everywhere a signed modifier renders.
10. Text hierarchy: primary text `#F5F1EC`, secondary `#A39C93`, muted `#6B645C`. Never introduce a fourth text tone without updating this document.
11. Borders on ordinary cards: neutral gray hairline (`rgba(255,255,255,0.08)`-ish). Borders on protagonist stat cards: accent-tinted (`var(--theme-accent-border)`, the active theme's accent at ~15%). This distinction is deliberate — don't apply the accent tint everywhere or it stops meaning anything.
12. The app shell background (root level, once) carries a subtle radial vignette + diagonal grain texture, pure CSS, no image assets. Never re-implement this per-screen.
13. Never introduce a new color without adding it to this document and stating its exact usage rule.

## Typography

14. UI font: Inter, everywhere except numeric stat values.
15. Numeric stat/readout values (HP, AC, ability scores, modifiers, DC, CR, etc.) use a monospace font (JetBrains Mono / Space Mono) for a "dice/terminal readout" feel — this is the one deliberate typographic accent of the app.
16. Never introduce a third font family.
17. Typography carries hierarchy before color does — the reader should know what's important from size/weight, not just from an accent color.
18. Titles: large, confident. Body text: always readable, never compressed to fit.

## Radius System (by element type, not uniform)

19. Protagonist stat/readout cards (AC, HP, ability scores, etc.): near-rectangular, ~2-4px radius — "instrument panel" feel.
20. Buttons, toggles, badges, pills, chips: more rounded, ~8-10px — radius signals "interactive/soft."
21. Ordinary content cards (list rows, rule cards, empty states): ~6px, between the two above.
22. Never collapse this three-tier system back to one shared radius value.

## Cards & Surfaces

23. Every card has a hairline border in addition to background contrast — cards are never distinguished by background shade alone.
24. No page repeats its title as a large in-page heading below the top bar — the top bar's title is the only title.
25. Section headers get a left accent-border (2-3px, amber) with the label indented — this is the one recurring low-cost decorative motif. Don't invent a second decorative pattern per screen.
26. Gradient/tinted-border depth treatment is reserved for protagonist stat cards only — never applied blanket across every card on a screen.

## Iconography & Badges

27. Stats, ability scores, items, and conditions use long-press (hold ~500ms) to show an info popover — never a per-item `?` badge. Long-press is purely additive: a short tap still performs its normal action.
28. Section-level help stays as a small `?` badge on the section header (short taps there aren't claimed by another action). Per-item `?` badges are removed app-wide — never mix per-item and section-level help on the same screen.
29. A top-bar help button (icon order: Help → Palette → Cloud) explains the long-press interaction in one sentence. It is persistent, not gated on the "beginner mode" toggle.
30. Any popover/tooltip must clamp to stay fully within the viewport — never allowed to render off-screen, regardless of trigger position.
31. Favorite (heart) and session-pin icons are not used on list/search result rows or entity detail pages — removed app-wide as of the search/list redesign pass.

## Layout & Density

32. No duplicated navigation: if the bottom nav already reaches a destination, don't add a second way to reach it elsewhere in the top bar (e.g. no search icon in the top bar).
33. Group 4+ equal-weight items into a 2-column grid rather than stacking them full-width, when they're conceptually equal (e.g. Action/Bonus Action/Movement/Reaction).
34. Prefer single-line compact rows over two-tier card+control layouts when the same information can be conveyed in less vertical height without losing legibility (e.g. ability score rows: label + modifier + score + adjust buttons in one row).
35. Buttons are normal button-sized — never full-width colored slabs, even for primary actions.
36. Empty states are compact and left-aligned (title + one-line description + normal button) — never centered, never oversized.
37. Utility/secondary elements (e.g. cloud sync status) must visually read as lighter/lower-priority than the primary content on the same screen (e.g. character identity). Exception (theme-following pass): the top-bar cloud sync icon uses the active theme's accent token when signed in — never a fixed green — while failure stays fixed warning amber; it stays small and unanimated so it never out-ranks primary content.

## Content & Voice

38. No placeholder/dev-note text ever ships to a rendered screen — if real copy isn't ready, use clearly-fake Lorem Ipsum, never an internal instruction or TODO string.
39. Technical filter/type codes from underlying data sources (e.g. rulebook abbreviations) must be translated to human-readable labels before rendering as filter chips — never expose raw internal codes to the player.
40. Any stat label must be fully readable, never truncated with an ellipsis inside its card — if it doesn't fit, abbreviate deliberately and consistently, don't let the browser cut it off.

## Motion (principles — implementation happens in a separate, later pass)

41. Motion exists to make state changes feel continuous, never to draw attention to itself. If a person consciously notices "that was an animation," it's too much.
42. Duration ceiling: nothing above 300ms. Primary interactions ~180-220ms, secondary ~120-160ms, screen-level transitions ~220-260ms.
43. Prefer subtle easing (soft/spring-like), never cartoonish bounce.
44. State changes animate opacity + translate together, never opacity alone or scale alone.
45. Hover-only interactions are not implemented — this app has no mouse users in practice; motion budget goes to touch feedback (press/release/toggle) instead.
46. Every animated interaction of the same type (e.g. every expand/collapse, every checklist toggle) must use the same duration/easing — no per-screen reinvention of the same interaction.
47. When in doubt, don't animate — an un-animated instant change is always preferable to a janky or inconsistent one.

## Constraints (apply to every future prompt)

48. No new dependencies unless a specific need can't be met with what's already in the project.
49. No gradients/decoration beyond what's explicitly defined in this document (the protagonist-card gradient, the app-shell vignette+grain, the section-header left border) — don't add a fourth decorative pattern without updating this document first.
50. Every future visual prompt should be checked against this document before being written — if a new decision contradicts a rule here, update this document explicitly rather than silently diverging.
51. This document should be revised (not silently ignored) whenever a genuinely new pattern is needed — treat additions as deliberate amendments, not exceptions.
52. Accent theme system (added with the theme picker pass): only the primary + secondary accent pair vary per theme — default Arcane Teal `#4A90B8`/`#86AFC7`, Amber `#D97B29`/`#C9A26B`, Jade `#3AB492`/`#7FBFAA` — selectable from the top-bar palette popover and persisted in user state. Jade and Amber remain fully selectable, but Arcane Teal is the default for new users and the fallback for any existing user without a persisted theme. Backgrounds, surfaces, typography, radius, and the fixed success/danger/neutral modifier colors never change. Theme swaps cross-fade at ~220ms (under the rule 42 ceiling) via a temporary whole-tree transition; the stored theme applies instantly on first load, and the reduced-motion block zeroes the cross-fade.

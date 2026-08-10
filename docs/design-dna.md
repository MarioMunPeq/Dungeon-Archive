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
6. Primary accent (themeable, default Arcane Teal `#4A90B8`; selectable themes: Jade, Amber, Gold Sovereign, Wine Grimoire, Void Plum, Storm Steel) is reserved for interactive elements ONLY: buttons, toggles, active nav tab, focus states, active/selected states. Never decorative.
7. Secondary accent (themeable, default Arcane Teal `#86AFC7`; the same 6 other themes each carry their own secondary accent) is for non-interactive secondary/metadata content: badges (level/CR/type), inactive nav icons, zero-value modifiers. Never used for primary interactive elements.
8. `?` help-badge color is a fixed semantic info color (blue), deliberately theme-independent — it does not change when the accent theme switches (Jade/Amber/Arcane Teal). This keeps "interactive/brand accent" visually distinct from "neutral help affordance", and stops the badge blending into the accent in themes where both would otherwise be green-ish. Do not make it theme-dependent.
9. Modifier/signed-value color coding is fixed: positive = success green, negative = danger red, zero = muted gold. This exact three-way rule applies everywhere a signed modifier renders.
10. Text hierarchy: primary text `#F5F1EC`, secondary `#A39C93`, muted `#928A81`. Never introduce a fourth text tone without updating this document. (The muted tone was lifted from `#6B645C` to `#928A81` to meet WCAG AA 4.5:1 on `#26221E` elevated surfaces; keep the tier ordering primary > secondary > muted.)
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
29. A top-bar help button (icon order: Help → Palette → Cloud) navigates to the Help page, which explains the long-press interaction (and "Beginner tips") in a short Quick help section alongside an About this project section. It is persistent, not gated on the "beginner mode" toggle.
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

## Motion (principles — implemented in the "Alive Interactions" pass)

> **Amendment — supersedes the prior stricter version of these rules.** This is a
> deliberate, explicit widening of the motion philosophy, not a silent drift:
> breadth expanded (micro-interactions now apply to nearly every interactive
> element; the theme switch became a named "signature moment"), while the
> per-interaction duration ceilings stayed low. Rules 41-47 below replace the
> earlier versions; rule 48 (dependencies) and rule 52 (theme swap) were amended
> in place.

41. Motion exists to make state changes feel continuous, never to draw attention
    to itself. If a person consciously notices "that was an animation," it's too
    much — **except for the named "signature moments" below**, which are allowed
    to be noticed (that is their point). Everything else should still feel
    invisible/natural, just more consistently present than before.
42. Duration ceiling: nothing above 300ms for ordinary motion. Primary
    interactions ~180-220ms; secondary micro-interactions ~120-180ms; route/tab
    transitions ~250-300ms (raised from the previous 220-260ms to accommodate a
    slightly richer transition). **Signature moments** (currently: the theme-switch
    wave, and the Dice Roller's 3D physics dice roll) may exceed the 300ms ceiling,
    capped at ~600-700ms (the dice roll runs on a physics simulation, so its exact
    duration is not CSS-controlled; it stays short enough to not stall the table).
    This is an explicit, limited exception — not a general loosening. Any future
    addition to the signature-moments list must be added here deliberately, never
    assumed.
43. Prefer subtle easing (soft/spring-like), never cartoonish bounce.
44. State changes animate opacity + translate together, never opacity alone or
    scale alone. The signature-moment theme wave may additionally animate
    clip-path (its circular reveal shape) — that is its defining, deliberate
    exception.
45. Hover-only interactions are not implemented — this app has no mouse users in
    practice; motion budget goes to touch feedback (press/release/toggle) instead.
    **This rule is unchanged by the "Alive Interactions" pass**: the expanded
    budget goes entirely to touch feedback, not hover.
46. Every animated interaction of the same type (e.g. every expand/collapse, every
    checklist toggle, every chip toggle) must use the same duration/easing — no
    per-screen reinvention of the same interaction. **Micro-interactions now apply
    almost everywhere**: every button, card, checkbox, chip, toggle, and input has
    press/release/focus feedback. Individual durations stay in the ~120-180ms
    secondary budget — breadth expanded, durations did NOT get slower.
47. When in doubt, don't animate — an un-animated instant change is always
    preferable to a janky or inconsistent one.

## Constraints (apply to every future prompt)

48. No new dependencies unless a specific need can't be met with what's already in the project. **Exception ("Alive Interactions" pass): a single lightweight animation library is approved — Framer Motion is the designated choice.** It was not installed during the approving pass: the theme wave, route transitions, and micro-interactions were all implemented with native CSS + the View Transitions API, which is cheaper and lower-jank on the target mid-tier mobile hardware (rule 3). If richer multi-property animation is ever needed, Framer Motion is the one approved library — do not introduce a second animation library without amending this rule first. **Exception (Dice Roller pass): `@3d-dice/dice-box` is approved for real 3D physics dice on the Dice Roller screen only** — the one interaction the design system cannot express with native CSS (rule 47's "when in doubt, don't animate" falls away for this deliberate signature moment). It must remain lazy-loaded to `/dice` so it never enters the main bundle, and users on reduced motion (or without WebGL) get the instant numeric result instead of the physics simulation. Do not reuse it for other surfaces without amending this rule first.
49. No gradients/decoration beyond what's explicitly defined in this document (the protagonist-card gradient, the app-shell vignette+grain, the section-header left border) — don't add a fourth decorative pattern without updating this document first.
50. Every future visual prompt should be checked against this document before being written — if a new decision contradicts a rule here, update this document explicitly rather than silently diverging.
51. This document should be revised (not silently ignored) whenever a genuinely new pattern is needed — treat additions as deliberate amendments, not exceptions.
52. Accent theme system (added with the theme picker pass; expanded to 7 themes in the picker redesign pass): only the primary + secondary accent pair vary per theme. Seven themes are selectable from the top-bar palette popover and persisted in user state:

    | Theme | Accent | Secondary accent |
    |---|---|---|
    | Jade | `#3AB492` | `#7FBFAA` |
    | Gold Sovereign | `#C9A227` | `#DFC97A` |
    | Amber | `#D97B29` | `#C9A26B` |
    | Wine Grimoire | `#B0473F` | `#C98A85` |
    | Void Plum | `#8B5FBF` | `#B79ED9` |
    | Arcane Teal | `#4A90B8` | `#86AFC7` |
    | Storm Steel | `#5B7C99` | `#8FAEC2` |

    Arcane Teal remains the default for new users and the fallback for any existing user without a persisted theme; every other theme is a selectable override, never a default change. Backgrounds, surfaces, typography, radius, and the fixed success/danger/neutral modifier colors never change. Theme switches play the signature-moment "wave" (~500-700ms, per rule 42): an expanding circular clip-path reveal originating from the tapped preview card's actual screen position, using the native View Transitions API (`document.startViewTransition`) — independent of the router. Browsers without View Transitions (and users on reduced-motion) fall back to the previous ~220ms whole-tree cross-fade / instant swap. The stored theme applies instantly on first load. The picker renders the 7 themes as accent-tinted preview cards in a 4+3 grid (per rule 26's protagonist-card gradient treatment, tinted with each theme's own accent); the currently active card is ringed in its own accent and carries `aria-pressed`. The popover remains viewport-clamped (rule 30) at its larger size.

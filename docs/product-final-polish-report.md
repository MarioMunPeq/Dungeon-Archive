# Phase 15 — Product Final Polish

Scope: a verification-driven polish pass across 12 audit areas (alignment, visual weight,
typography, density, empty states, interactions, icons, consistency, microcopy, product feel,
decorative removal, performance). No features, no refactoring, no data-structure changes, no new
dependencies, no redesign.

Baseline verification (green before and after every change): `pnpm typecheck`, `pnpm lint`
(0 errors, 11 pre-existing warnings), `pnpm test` (13 suites), `pnpm build`, `pnpm verify` (exit 0).

---

## Change 1 — Microcopy: removed the banned word "Browse"

- **Before** — Home section header: `Browse the Compendium`; Search empty state: `Browse the
  Compendium`; Search no-results: `Try a different search term or browse categories`.
- **After** — Home: `Compendium`; Search empty state: `Categories`; Search no-results: `Try a
  different search term, or look through the Compendium`.
- **Why it improves usability** — "Browse" implies passive window-shopping; "Categories" and
  "look through the Compendium" state the actual affordance (jump into a category) in the action
  vocabulary the rest of the app uses. The no-results link now reads as a concrete suggestion
  instead of a vague verb.
- **Why it strengthens identity** — The app's voice is calm, direct, and DM-facing. It never
  "manages" or "browses"; it searches, pins, and plays. Consistent verb discipline makes the whole
  surface feel like one product written by one person.

## Change 2 — Empty-state family: SearchNoResults aligned to the shared pattern

- **Before** — `flex flex-col items-center gap-4 px-4 py-16 text-center` with a bare body line.
- **After** — `flex flex-col items-center gap-4 px-4 py-10 text-center`, body wrapped in
  `p.w-full.max-w-md` like every other empty state (Party, Session, Adventure, Home workspace).
- **Why it improves usability** — Matches the vertical rhythm and text-measure of its siblings, so
  the "no results" moment feels like part of the same system instead of a one-off layout.
- **Why it strengthens identity** — Repeating the same centered, constrained, action-first shape for
  every empty moment is the product's signature; consistency here reads as deliberate craft.

## Change 3 — Consistency: the two category grids now share one pattern

- **Before** — Home grid: left-aligned label + chevron (`justify-between`, `px-3 py-3`, chevron
  icon). Search empty state grid: centered label only (`p-3 text-center`).
- **After** — Search empty state grid uses the identical Home pattern (label + chevron,
  `justify-between`, `px-3 py-3`).
- **Why it improves usability** — The chevron communicates "this navigates somewhere" at a glance,
  and both grids now behave and look identical, so users build one mental model for category links.
- **Why it strengthens identity** — Two screens rendering the same concept differently is the
  clearest signal of an unpolished app; one canonical pattern reinforces the Compendium as a
  single, coherent destination.

## Change 4 — Consistency: picker search input matches the main search field

- **Before** — Main search input: `bg-surface`. ReferencePicker search input: `bg-background`.
- **After** — Both use `bg-surface`.
- **Why it improves usability** — Two identical "type to find something" fields now have the same
  visual affordance; a raised input reads as the primary text-entry point in both contexts.
- **Why it strengthens identity** — The search surface token becomes "the place you type to find
  things," a small but real signature of the app.

## Change 5 — Interactions: symmetric pop feedback on Favorite and Adventure buttons

- **Before** — Tapping Pin shows a "Pinned/Removed" toast + pop animation; tapping the heart or
  flag just changes color silently.
- **After** — Favorite and Adventure buttons replay the same `animate-pop` on toggle (the pin keeps
  its toast; all three share the pop).
- **Why it improves usability** — Every tap now gives instant, visible confirmation that the action
  landed, even on fast repeated taps; color alone is easy to miss.
- **Why it strengthens identity** — The three-way action family (pin / heart / flag) now feels
  like a designed set rather than one polished control and two afterthoughts.

## Change 6 — Typography scale: removed off-scale 10px type

- **Before** — `text-[10px]` in three places (Party `ValueLabel` stat labels, `SpellPreview`
  flag chips, SessionButton toast).
- **After** — All three use `text-xs` (12px), the smallest token in the design system.
- **Why it improves usability** — 10px is below comfortable reading size for stat labels that are
  consulted mid-game; 12px keeps the grid tight while staying legible.
- **Why it strengthens identity** — A strict, finite type scale (xs→2xl, no arbitrary sizes) is
  what makes the UI feel systematically designed rather than accumulated.

## Change 7 — Decorative removal: tamed the 404 page

- **Before** — A `text-6xl` bold `404` watermark at `text-muted-foreground/30` dominating the page.
- **After** — A subtle `text-xs` uppercase eyebrow `404` above "Page not found".
- **Why it improves usability** — The message, not the number, is the information; the oversized
  ghost digit added noise without answering "what do I do now."
- **Why it strengthens identity** — The eyebrow matches the app's section-header typography, so even
  an error page belongs to the same voice.

## Change 8 — Decorative removal: deleted dead `MetadataGrid` / `MetadataItem`

- **Before** — Two unused components (`src/components/entity/metadata-grid.tsx`,
  `metadata-item.tsx`) duplicating `EntityMetadataGrid` / `EntityProperty`, exported from the public
  barrel but imported nowhere.
- **After** — Files and barrel exports removed; `EntityProperty`/`EntityMetadataGrid` is the single
  metadata primitive.
- **Why it improves usability** — No user-visible change today, but removing the duplicate removes
  the risk of the two variants silently drifting apart again (they already had once).
- **Why it strengthens identity** — One canonical implementation per concept is the discipline that
  keeps a codebase — and the product it produces — feeling hand-finished.

---

## If I downloaded this from the Play Store today…

I would keep it installed. It does one thing — a fast, offline, searchable D&D reference with a
light touch of campaign tracking — and it does it with unusual restraint: a consistent type scale,
one empty-state pattern, one category grid, one pill system, a coherent three-action pin/favorite/
flag family, and voice discipline in every label. For a reference app, that internal consistency is
the whole ballgame.

I would, however, notice it is clearly a "version 1" in polish, not a "release candidate":

- The two heaviest data chunks (`monsters`, `spells`) ship large — the build warns on chunks over
  500 kB (largest ~1.8 MB / 265 kB gzip). It's a static offline app so cold-start is the only real
  cost, and splitting the data behind lazy routes is the natural next step — but it's a perf pass,
  not a polish pass.
- The home screen can get long: workspace card, current adventure card, session rail, recently
  viewed, favorites, and the category grid stack into a fairly tall scroll on first populated use.
- An entity page's three icon buttons sit in a row with the title on mobile; on very narrow
  screens the name can wrap under them.
- There is no light theme. Dark-only is a defensible, identity-forward choice for a game-night app,
  but it will be polarizing.

None of these are blockers. It feels like an app whose author cared about the last 2%, which is
exactly what a store listing should promise.

## Remaining imperfections (accepted, tracked)

1. Build chunk-size warnings (largest assets `monsters` 1.8 MB, `spells` 1.0 MB, `magic-items`
   0.96 MB) — offline static app, no new dependency, deferred as a perf pass.
2. `SearchHighlight` marks use `bg-accent`; on the keyboard-selected row (also `bg-accent`) the
   highlight disappears — low-impact, only affects keyboard navigation on a selected row.
3. `EntityCard` keeps name + three icon buttons on one row; dense on narrow screens by design.
4. Favorite/Adventure pop on every toggle, while the pin only pops when *adding* — a minor
   asymmetry left to match the pin's semantic ("added" is the moment that matters).
5. The search no-results link routes to Home (the Compendium grid) rather than a category page —
   correct content, one extra tap.
6. Session button toast, stepper repeat timings, and dialog animations are tuned but not
   motion-spec'd; they rely on consistent 150ms/900ms defaults rather than a documented motion
   scale.
7. `Heading` / `Body` / `Caption` typography components exist and are pinned by tests but are not
   yet used in product screens — kept as the vocabulary for future screens, not dead weight.
8. Search keyboard nav covers ArrowUp/Down, Enter, Escape, but no Home/End for large result sets.
9. Backup page is gated behind cloud config; when no cloud is configured there is no surface for it
   at all — correct, but the feature is invisible unless configured.
10. Phase 13/14 working-tree changes remain uncommitted alongside this pass (25 files); they were
    already verified as a set and are ready to commit as one Phase 14 + 15 batch.

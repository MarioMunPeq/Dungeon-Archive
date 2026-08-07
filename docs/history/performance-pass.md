# Performance Pass (P10)

Point-in-time record of the native-performance pass shipped on top of
`Visual Overhaul 0.6.3`. Everything here is about responsiveness and perceived
speed only — no visual design, layout, navigation, or behavior changes.

The pass splits into two parts:

1. Work that landed inside `745fae6` (list virtualization, Zustand selector
   discipline, stable references, rAF-throttled scroll restoration).
2. The fixes that complete that work and are recorded by this report.

---

## 1. List Virtualization

### Where

- **Category pages** (`src/features/compendium/components/entity-list.tsx`)
  render their card grid through `VirtualGrid` (2-column, `estimateRowHeight`
  96, `overscan` 8).
- **Search results** (`src/features/search/components/search-results.tsx`)
  render through `VirtualList` (1-column, `estimateRowHeight` 56, `overscan` 8,
  `divide`).
- Infrastructure lives in `src/components/virtual/`: `VirtualGrid`/`VirtualList`,
  `ScrollElementProvider`, `ScrollElementContext`. The app `<main>` element is
  the single scroll container, wired in `src/app/layouts/app-layout.tsx`.

Both lists virtualize against the real scroll element, so only the visible rows
plus an overscan margin exist in the DOM at any time.

### DOM reduction (estimated)

Compendium sizes (from `src/generated/compendium/*.json`):

| Category | Entries |
|----------|---------|
| monsters | 1248 |
| magic-items | 939 |
| spells | 868 |
| equipment | 777 |
| feats | 149 |
| conditions | 30 |
| actions | 13 |
| search index (all) | 4024 |

With a 2-column grid and ~96px rows, a phone viewport shows ~6–7 rows; with
overscan 8 the DOM keeps ~22–23 rows ≈ **44–46 cards** instead of the full list.

- Monsters: 1248 → ~46 cards in the DOM (**~96% reduction**).
- Magic items / spells / equipment: 939 / 868 / 777 → ~46 (**~94–95%**).
- Search "All categories": up to 4024 rows → ~26 rows in the DOM (**~99%**).

Each `EntityCard` is roughly 15–20 DOM nodes, so the monsters page drops from
~22,000 nodes to ~800 at rest.

### Key fix in this pass

`VirtualGrid` read the scroll element from a ref. Refs are attached during
commit — *after* the first render — and ref writes never trigger a re-render.
The first render therefore always fell back to rendering **every** item, and
without any later state change the component stayed in the fallback forever.
Category pages (whose data is available on first render) never virtualized;
only search (results appear after typing, which re-renders) did.

`src/components/virtual/virtual-grid.tsx` now runs a `useLayoutEffect` on mount
that forces one re-render once the scroll element ref resolves. Layout effects
run after refs are attached, so the switch to virtual mode happens before the
browser paints — no fallback flash, and the initial scroll restoration is read
at virtualizer init, so deep links / restored scroll positions render the right
rows.

---

## 2. Render Audit

Memoized (with justification):

- **`EntityCard`** (`src/components/entity/entity-card.tsx`) — memo. Its props
  are referentially stable (cards come from a `useMemo`'d array in
  `category-page`, and from a module-level `cardCache` on Home), so during
  virtualizer scroll re-renders reconciliation skips every unchanged card.
- **`SearchResultRow`** (`src/features/search/components/search-result-row.tsx`)
  — memo, **added in this pass**. Result objects come from a `useMemo`'d
  `filtered` array, and `query`/`isSelected`/`id` are stable between scrolls, so
  the ~10–15 visible rows skip re-rendering on every scroll frame.
- **`QuickTiles`**, **`CharacterCard`** — memo (already present).

Not memoized, deliberately:

- Home lists are capped at 10 items (`useRecentEntities(10)`,
  `useSessionIds(10)`), so memoization would only add indirection.
- No `useMemo`/`useCallback` around `renderItem` closures — `VirtualGrid` calls
  them only for visible rows, and the rows themselves are memoized.

---

## 3. Zustand Subscriptions & Selectors

Verified by audit (no code changed here — work landed earlier):

- No `useStore()` whole-store subscriptions remain anywhere in `src/`.
- Membership checks use `Set`s: `useIsFavorite` / `useIsInSession` /
  `useIsInAdventure` select `favoritesSet.has(id)` — O(1) and no allocation.
- Object selectors return stable references (`usePrimaryPlayer`,
  `useActivePlayer` use `find`, so the subscriber only re-renders when the
  featured object actually changes, thanks to Zustand's default `Object.is`).
- Derived slices are memoized with `useMemo` (`useFavoriteIds`,
  `useSessionIds`, `useRecentEntities`, `useRecentSearches`), so a `slice(0, n)`
  returns the same array reference between store changes.
- `replaceState` guards against no-op hydration writes, and persistence is
  debounced 150 ms (`schedulePersist`).

Result: a favorite toggle, session pin, or HP change re-renders only the
components subscribed to that slice.

---

## 4. Other Verified Areas

- **Scrolling**: scroll restoration is rAF-throttled
  (`src/app/layouts/use-scroll-restoration.ts`), saving ~1 sessionStorage write
  per frame instead of one per scroll event; virtual rows are GPU-friendly
  (`position:absolute` + `transform: translateY`).
- **Animations**: all keyframes animate `opacity`/`transform` only; the route
  transition and `theme-switching` cross-fade stay within the 240–300 ms
  window, and `prefers-reduced-motion` zeroes them.
- **Lazy loading**: compendium JSON is already per-category dynamic-imported
  (monsters, spells, magic-items, equipment, feats, search-index, related-index
  are separate build chunks), so the 1.8 MB monsters data never blocks first
  paint.
- **Skeletons**: category pages show `CategorySkeleton` until the compendium
  chunk resolves.

---

## 5. Estimated Gains & Bottlenecks

Biggest wins:

1. Category-page virtualization actually engaging (the fallback fix) — the
   monsters page alone goes from ~22,000 DOM nodes to ~800 at rest.
2. Search results virtualized (4024-row worst case → ~26 rows).
3. `SearchResultRow` memo — cheaper scroll frames on the most frequently
   re-rendered list.
4. Zustand selector discipline — re-renders are scoped to the changed slice.

Remaining bottlenecks (accepted):

- The large chunks are raw generated data. Compressing the generated JSON would
  be the next real win but touches the data pipeline, not app code.
- `search()` allocates a scored copy per query; at ~4k entries it is a few
  milliseconds and debounced, so it is not felt.

---

## 6. Technical Debt Intentionally Left

- **`startTransition` on search** — considered and skipped. The 200 ms debounce
  already defers the heavy work off keystrokes; a transition would need
  pending-state guards to avoid a "No results" flash for ~5 ms of work. Not
  worth the behavior risk.
- **Keyboard navigation does not auto-scroll the selected virtual row into
  view** — pre-existing behavior (the selection was never scrolled before
  virtualization either). Arrow navigation moves by one row, so the selection
  always lands inside the rendered overscan and stays in the DOM. Changing it
  would alter interaction behavior.
- **`estimateRowHeight` is a fixed guess** (96/56) — `measureElement` corrects
  the real height on first pass; the estimate is close, so any initial scroll
  correction is negligible.
- **Virtualized `listbox` only exposes visible options to screen readers** —
  standard virtualization tradeoff; `aria-activedescendant` navigation stays
  within the rendered range, so announcements remain correct.
- **Fixed `overscan` of 8** — tuned for smooth scroll; could be lowered to 4
  for further DOM savings at a slight scroll-paint cost. Left as-is.

---

## 7. Verification

`pnpm typecheck` && `pnpm lint` && `pnpm test` && `pnpm build` — all green.

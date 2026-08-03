# Layout Root-Cause Report — Party empty state & ConfirmDialog

Date: 2026-08-03

## Root cause

A single defect in `src/index.css` caused **both** broken layouts.

The `@theme` block declared a custom spacing scale with **named** keys:

```css
--spacing-sm: 0.5rem;  /* 8px */
--spacing-md: 1rem;    /* 16px */
```

Tailwind CSS v4 resolves the named `max-w-*` utilities (`max-w-sm`, `max-w-md`, …)
through the `--spacing-*` namespace *before* falling back to the `--container-*`
namespace. Because these two named spacing tokens existed, the generated CSS was:

```css
.max-w-sm{max-width:var(--spacing-sm)}  /* → max-width: 8px  */
.max-w-md{max-width:var(--spacing-md)}  /* → max-width: 16px */
```

This was verified directly in the built stylesheet. Utilities that did **not**
collide (`max-w-xl`, `max-w-2xl`) resolved correctly because `--spacing-xl` /
`--spacing-2xl` are not defined, so they fell through to the container namespace.

### Why this produced each symptom

**Problem 1 — Party empty state (vertical column of words)**

`party-page.tsx:918` (and the identical blocks in Session, Adventure, and Home)
render the description as:

```jsx
<p className="w-full max-w-md text-sm text-muted-foreground">…</p>
```

`w-full` correctly fills the flex container, but `max-w-md` was resolving to
`1rem` (16px). The paragraph was capped at 16px wide, forcing every word onto
its own line. The flex/`items-center`/`w-full` chain was never the problem —
the paragraph's own `max-width` was poisoned.

**Problem 2 — ConfirmDialog (tiny vertical strip)**

`ConfirmDialog.tsx:34` renders the card as:

```jsx
<div className="w-full max-w-sm space-y-4 … p-5 …">
```

`max-w-sm` was resolving to `0.5rem` (8px). The card was capped at 8px wide —
a "tiny vertical strip". The overlay (`fixed inset-0 … flex items-center
justify-center`) and all dialog plumbing (`useDialog`, focus/Escape/tab-trap,
no portal) are correct; the card's own `max-width` was poisoned.

## Files modified

- `src/index.css` — removed the four unused named spacing tokens
  (`--spacing-xs/sm/md/lg`) from the `@theme` block.

Nothing else. No component markup changed.

## Why the fix is correct

With the shadowing tokens gone, Tailwind resolves the named `max-w-*` utilities
through the standard container namespace, confirmed in the rebuilt stylesheet:

```css
.max-w-sm{max-width:var(--container-sm)}  /* 24rem = 384px */
.max-w-md{max-width:var(--container-md)}  /* 28rem = 448px */
```

- **Party/Session/Adventure/Home empty states**: description renders at a normal
  readable width (~448px, roughly the requested 40–60 characters at `text-sm`),
  centered, title → description → button below. The four pages already share
  byte-identical layout classes, so behaviour is identical by construction —
  no duplicated layout code was introduced.
- **ConfirmDialog**: `w-full max-w-sm` yields a centered rounded card, ≈90vw on
  mobile (e.g. 358px on a 390px viewport after the `p-4` overlay padding) and
  capped at 384px (within the ~420px target). Title, description, and
  horizontally-aligned buttons via `Inline … justify-end` render normally.
- The intended values (`--container-sm: 24rem`, `--container-md: 28rem`) are the
  Tailwind v4 defaults, so the design system is unchanged — this restores what
  the markup always assumed.

## Why this cannot regress

- The offending tokens were **unused by every other rule in the app** (verified
  by searching the source: no `p-sm`, `gap-md`, `w-md`, `space-y-md`, etc.
  exist), so their removal has zero side effects.
- The numeric spacing scale the app actually uses (`p-4`, `gap-2`, `h-8`, …) is
  driven by the base `--spacing` token and is untouched.
- Named `max-w-sm`/`max-w-md` now resolve from the standard `--container-*`
  namespace. Re-introducing named `--spacing-*` tokens would be the only way to
  re-break this, and the full `pnpm verify` gate (which rebuilds the CSS) would
  make any regression visible immediately.
- The design-system test suite pins component class strings (`Surface`, `Badge`,
  `Section`, `Stack`, `Inline`, `Typography`) — none of which use the removed
  tokens or the affected utilities — and all 13 suites still pass.

## Why no hacks were introduced

The fix is a single deletion of four dead theme tokens. It introduces none of the
forbidden patterns: no `overflow-hidden`, no arbitrary `max-width`, no
`word-break`/`overflow-wrap`, no `line-clamp`/`truncate`, no `transform`/`scale`,
no fixed pixel widths, and no per-component CSS band-aids. The JSX in
`party-page.tsx`, `ConfirmDialog.tsx`, and every sibling page is untouched.

## Verification

All commands ran green:

- `pnpm typecheck` — pass
- `pnpm lint` — 0 errors (11 pre-existing console warnings, unchanged)
- `pnpm test` — all 13 suites pass
- `pnpm build` — pass; generated CSS inspected: `.max-w-sm` → `--container-sm`,
  `.max-w-md` → `--container-md`
- `pnpm verify` — pass

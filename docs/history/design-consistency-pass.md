# Design Consistency Pass — Report

Phase 13 objective: a visual-identity and design-language consistency pass. No features, no behavior changes, no architecture changes, no new dependencies. Every change is a class-string edit; the only logic change is a test assertion that mirrors a deliberate token change.

Verification: `pnpm verify` green (typecheck, lint — 0 errors, 11 pre-existing console warnings, 13 test suites, production build).

---

## Radius System (before and after)

Before, radii were arbitrary: cards and controls used `rounded-lg` (0.75rem), but SelectField, Stepper buttons, inset blocks, party-page internals used `rounded-md` (0.5rem), dice chips used `rounded` (0.25rem), and the tooltip used `rounded-md`. Four different radii with no governing rule.

After, there is one governing scheme with three tiers:

| Tier | Radius | Purpose | Examples |
|------|--------|---------|----------|
| Full | `rounded-lg` | Every interactive control, card, surface, input | Buttons, SelectField, Stepper, Surface, inset blocks, inline editors, hand-rolled CTAs |
| Mid | `rounded-md` | Text-embedded chips (non-interactive, at text scale) | Dice chips, party quick-stats chip |
| Small | `rounded-sm` | Ephemeral overlays and text highlights | SessionButton tooltip, search `<mark>` |

### Changes

**Badge — `src/components/ui/Badge.tsx`**
- Inconsistent: category pills were `px-3 py-1` at text-xs (~26px tall), ballooning inside dense list rows and competing with the title column.
- Changed: `px-2 py-0.5` (~20px tall).
- Usability: in search/party/session rows the badge now reads as a small label; the eye lands on the row title first, then the badge confirms category.
- Identity: a badge is metadata; it should be the quietest element in the row, not a competing chip.

**SelectField — `src/components/ui/SelectField.tsx`**
- Inconsistent: the only control using `rounded-md` and the only element using `duration-100`.
- Changed: `rounded-lg`, `duration-150`.
- Usability: filters now scan as the same control family as buttons and inputs; identical 150ms timing everywhere.
- Identity: no random deviations — an engineered system tolerates exceptions only when a reason exists.

**Stepper — `src/components/ui/Stepper.tsx`**
- Inconsistent: all four stepper parts (step-down, value cell, text value, step-up) used `rounded-md`.
- Changed: all four to `rounded-lg`.
- Usability: stat steppers now match the button family they sit beside (HP/AC edits on Party), so interaction affordance is consistent.
- Identity: one control language.

**Inset block — `src/components/content/blocks/inset-block.tsx`**
- Inconsistent: rules boxes inside descriptions were the only card-like element using `rounded-md`.
- Changed: `rounded-lg`.
- Usability: inset rules now read as proper sub-cards inside the description, matching how cards behave everywhere else.
- Identity: the card radius is reserved for anything that contains and delineates content.

**Dice chip — `src/components/content/blocks/dice-block.tsx`**
- Inconsistent: `rounded` (0.25rem) — a radius with no place in any system.
- Changed: `rounded-md`, placing it in the text-embedded-chip tier alongside the party quick-stats chip.
- Usability: chip proportions sit comfortably around the inline mono text.
- Identity: the two-tier rule is now explicit: full controls are `lg`, inline text chips are `md`.

**SessionButton tooltip — `src/components/ui/SessionButton.tsx`**
- Inconsistent: an ephemeral floating overlay used the control radius (`md`), implying it was interactive.
- Changed: `rounded-sm`.
- Usability: tooltips now read as non-interactive overlays, never as buttons.
- Identity: shape communicates interactivity — overlays are visually distinct from controls.

**Party page — `src/features/party/party-page.tsx`**
- Inconsistent: four interactive controls used `rounded-md` (stat-row stepper, level editor, two note rows).
- Changed: all to `rounded-lg`.
- Usability: every tappable element on the Party screen matches the shared control shape.
- Identity: interactivity is communicated consistently screen-to-screen.

The party quick-stats chip (line 516) intentionally remains `rounded-md`: it is read-only text-level metadata, exactly the mid-tier case.

---

## Motion Consistency

- Inconsistent: one element (`SelectField`) used `duration-100` while everything else used `duration-150` (`ANIMATION_DURATION_MS = 150` in `src/config/constants.ts`).
- Changed: all transitions are `duration-150`.
- Usability: uniform feedback timing — a press feels the same everywhere.
- Identity: motion is a system, not per-component taste. No new animations were added; nothing bounces, scales up, or overshoots.

---

## Label Emphasis (metadata hierarchy)

- Inconsistent: two label styles for the same role — `MetadataItem` used `text-xs font-medium text-muted-foreground` while `EntityProperty` used plain `text-xs text-muted-foreground`. Competing weights within the same metadata grid (spell/monster headers).
- Changed: dropped `font-medium` from `MetadataItem` (`src/components/entity/metadata-item.tsx`).
- Usability: metadata labels recede uniformly; the values — the numbers the DM actually wants (level, range, CR) — carry the weight.
- Identity: "secondary quieter" is now literally true; emphasis is reserved for data, not for labels pointing at data.

---

## Search — the primary workflow

- Inconsistent: the search field used `bg-background`, the same color as the page, so it sat flat against the screen and did not read as the primary control, while the results cards around it were clearly raised (`bg-card`).
- Changed: field surface is `bg-surface` (`src/features/search/components/search-input.tsx`) — one step above the page, one below cards.
- Usability: the field is now the first thing the eye finds on the Search tab; the affordance to type is unambiguous without any color or glow.
- Identity: search gets the primary-field treatment not through size or color but through surface elevation — a quiet, precise signal that this is where work starts.

---

## Page rhythm

- Inconsistent: Home and Backup used `gap-8` between sections; the entity detail and other pages use `space-y-6`. Section rhythm differed per page with no reason.
- Changed: Home and Backup to `gap-6` (`src/features/home/home-page.tsx`, `src/features/backup/backup-page.tsx`).
- Usability: consistent vertical cadence moving between Home → Session → Adventure → Backup removes layout surprises when scanning.
- Identity: one spacing language across every screen; spacing is structural, never decorative.

---

## CTA consistency

- Inconsistent: the two hand-rolled primary CTAs ("Search the Compendium" on Home, "Search the Compendium" on empty Session) replicated the primary Button's classes but omitted `touch-target`, rendering them shorter than the guaranteed 44px.
- Changed: added `touch-target` to both.
- Usability: guaranteed thumb-sized tap targets per the design contract (44×44 minimum).
- Identity: hand-rolled CTAs now match the button family exactly — no near-misses.

---

## Pressed-state feedback

- Inconsistent: the outline `danger` Button variant had `hover:` feedback but no `active:` state, so a destructive press gave no immediate confirmation while every other variant did.
- Changed: `active:bg-destructive/20` (`src/components/ui/Button.tsx`).
- Usability: destructive presses now confirm immediately, preventing the "did it register?" double-tap on a high-stakes action.
- Identity: uniform feedback rules — every interactive element responds the same way to the same states.

---

## Test update

- `scripts/tests/design-system.test.tsx`: Badge assertions updated `px-3 py-1` → `px-2 py-0.5` to match the intentional token change. Assertions are a mirror of the design system; when the system changes deliberately, the mirror must follow. All other pinned class strings are unchanged.

---

## What did not change

- Fonts, palette tokens, semantic tokens: untouched — identity comes from hierarchy, not new colors.
- Icons (stroke width, sizes): audited, found already consistent (`strokeWidth={2}` throughout, nav 20px / inline 16px / chevrons 12–14px as intended).
- No new radii were invented; no element moved from one intentional tier to a random value.
- No behavior, architecture, dependencies, or runtime cost. The entire pass is static Tailwind classes; the production CSS bundle is unchanged in approach.

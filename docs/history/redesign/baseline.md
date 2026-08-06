# Redesign Baseline

Snapshot of the implementation state before the PDS-aligned refactoring begins.
Reference checkpoint: git tag `redesign-baseline` (commit `bb8117a`).

## Verification baseline

| Check | Result |
| --- | --- |
| `pnpm typecheck` | pass |
| `pnpm lint` | pass (0 errors, 12 pre-existing `no-console` warnings) |
| `pnpm build` | pass (pre-existing large-chunk warnings only) |
| Test suites (13) | 12 pass; `test:firebase-adapter` fails **environmentally** (real Firebase SDK, no env config → "Firebase is not configured", 15 fails / 3 passes) |

Notes:
- `pnpm verify` short-circuits at the test gate, so the full verify cannot be green in this environment without Firebase env vars. This is a pre-existing, out-of-scope condition.
- Per-phase gate during refactoring: `pnpm typecheck` + `pnpm lint` + `pnpm build` + all test suites except `test:firebase-adapter`, unless Firebase env is provided.

## Routes (src/app/router.tsx)

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Home workspace | Party, Current Adventure, Session (pinned), Recently Viewed, Favorites, Compendium grid, conditional Cloud Backup link |
| `/search` | Search | URL `q` param sync, category filter chips, keyboard navigation, combobox/listbox a11y |
| `/session` | Session | pinned entity list, End Session (ConfirmDialog) |
| `/adventure` | Adventure | active adventure, inline title/description/notes, objectives, entity references |
| `/party` | Party | player references with inline stat editing (HP/AC), pickers, steppers |
| `/backup` | Cloud Backup | conditional on `isFirebaseConfigured`; sign in/out, upload/restore, preview counts |
| `/:category` | Category browse | filters via URL params; FilterBar (non-sticky) + EntityList |
| `/:category/:canonicalId` | Entity page | breadcrumbs, header, metadata grid, content, related entities |
| debug | Debug pages | `/debug/content`, `/debug/spell` (no PDS counterpart) |
| * | NotFound | |

## Shell & navigation

- `AppLayout`: `max-w-xl` centered column; sticky `TopBar` (h-14, static `APP_NAME` title only — no back, no search); `main` scroll container with `useScrollRestoration` (sessionStorage per `location.key`); fixed BottomNav (Home / Search / Adventure / Party); Onboarding overlay gate.
- Breadcrumbs present on category and entity pages.

## Design-token baseline (src/index.css @theme, dark-first)

- Colors: semantic palette; single indigo accent `#6366f1`; success/warning/destructive/info/focus/disabled mapped.
- Radii: sm .25 / md .375 / lg .5 / xl .75 / 2xl 1rem / full.
- Fonts: Inter (interface) + JetBrains Mono (mono). No Display family.
- Touch sizes: `--size-touch-min: 44px`, `--size-touch-comfortable: 48px` (utilities `touch-target`, `touch-comfortable`, `hitbox-expand`).
- **No spacing scale tokens defined** — Tailwind base `--spacing: 0.25rem`. Known off-grid values: `gap-1.5`, `space-y-0.5`, `py-0.5`, `p-1.5`, `py-2.5`, `h-3.5`/`w-3.5`, `h-9`.
- `src/config/tokens.ts` is dormant (only `SurfaceVariant` type consumed); its `RADIUS md=.5` conflicts with `@theme` `md=.375`.

## State & data

- `user-state` v8 (localStorage `dungeon:userState:v1`): favorites, recentEntities (50), recentSearches (20), session (100), adventures (20), playerReferences (12); migrate/normalize pipeline; `_hasHydrated`.
- Compendium: synchronous in-memory index (`loadCompendium` at `main.tsx`), source-version grouping via canonical IDs, relationship index (max 8 related).
- Firebase: single source in `src/lib/firebase/`; sync service + adapters; optional (no env → cloud features hidden).

## Out of scope / parked

- `toCloudUser` esbuild strip-types warning on `src/sync/firebase.ts:11` — kept as future technical-debt cleanup (excluded from this refactor).
- `dist/` output and `dist/index.html` (inline app-shell script) are never edited.
- Firebase-adapter test environment failures.

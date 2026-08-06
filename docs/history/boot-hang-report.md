# Boot Hang Report — "Stuck on Loading Screen"

## Summary

The app can stay forever on the boot splash ("Dungeon Archive" + spinner). The
initialization pipeline is **not** the blocker. Instrumentation proves every
boot step completes in a clean browser (dev, prod, service-worker-controlled,
offline, and after a redeploy). The permanent splash is caused by the browser
loading a **stale `index.html` (app shell) whose entry chunk no longer exists**
on the server. The module script then 404s, `main()` never runs, and nothing
ever replaces the static `#boot` splash — silently, with no diagnostics.

## Boot timeline (healthy runs, instrumented)

Timing from `console.time` markers added temporarily to `src/main.tsx` and
`src/compendium/loader.ts` (all removed after the investigation):

| Step | Time |
| --- | --- |
| Static module graph evaluated (`main.tsx` body reached) | always |
| `loadCompendium()` — 9 JSON chunks (`Promise.all`) | ~10–96 ms |
| `buildRegistry()` | ~2–3 ms |
| `setSearchIndex` + `setRelatedIndex` | ~1 ms |
| `hydrate()` (zustand + localStorage, fully synchronous) | ~0.5–1 ms |
| `createRoot(...).render(<App/>)` commits (splash removed, `<nav>` present) | ~0.5–1 ms |

This held in four independent environments:

1. Production build (`vite preview`), fresh profile — booted in ~12 ms.
2. Dev server (`vite`), fresh profile — booted in ~31 ms.
3. Service-worker-controlled reload (online) — booted in ~88 ms.
4. **Offline** (server stopped, SW serving from precache) — booted in ~68 ms.

Every awaited promise in the boot path resolves. The user-state path
(`store.ts`, `persistence.ts`, `migrations.ts`) is synchronous and
try/catch-guarded; there is no Suspense, no `lazy()`, no awaited render, and no
async gate in `App` (`src/app/index.tsx`).

## Root cause — proven failure mechanism

The built `index.html` bakes in content-hashed asset URLs, e.g.
`/dungeon-archive/assets/index-CQyfiGIj.js`. The `#boot` splash is static HTML;
it is removed only when React commits, which happens only after `main()` runs,
which happens only if that module script loads.

If a browser receives an `index.html` from a **previous build** while the
chunk it references has been **purged from the server** (and is also absent
from the browser's caches), the module script fetch 404s and every boot step is
skipped. Reproduction (headless Chrome, CDP, real stale HTML + real purged
chunk):

```
[REQ]          http://localhost:4173/dungeon-archive/assets/index-CQyfiGIj.js
[RESPONSE 404] http://localhost:4173/dungeon-archive/assets/index-CQyfiGIj.js
[LOAD FAILED]  errorText=net::ERR_ABORTED
boot step logs seen: 0              <- main() never executed
FINAL after 8s: bootSplash=true appRendered=false
```

**Exactly which step never completes:** step 0 — the entry module
`assets/index-<hash>.js` fails to load (HTTP 404 / `ERR_ABORTED`). All
subsequent steps (`loadCompendium`, `hydrate`, `render`) never start.

**Why this happens in a real browser:** `index.html` can be served stale from
two sources while its chunk is gone:

- A previously-installed service worker (vite-plugin-pwa `generateSW`,
  `registerType: "autoUpdate"`) serves its precached navigation-fallback
  `index.html` from the old build. If the old SW's precache is incomplete or
  evicted (interrupted install, storage pressure), the old chunk is missing
  from both the SW cache and the server.
- An HTTP-cached old `index.html` (long-lived cache on the hosting layer)
  referencing chunk hashes purged after a rebuild.

A healthy lifecycle self-heals: I verified that installing the SW from build v1,
rebuilding to v2 (new hashes, old chunks removed), and reloading the same
profile serves a self-consistent old app from the old SW precache and then
updates. The hang only occurs in the mixed state (stale shell + missing chunk),
which the app currently handles by spinning forever with zero feedback.

## Why the existing tests did not catch this

The test suite (13 suites) covers data transforms, registry/resolver logic,
relationships, design-system primitives, user-state, and sync. It never loads
the browser bootstrap graph or exercises module-loading from a cache; it cannot
simulate a stale `index.html` + purged chunk. The design-system suite imports
isolated components and `renderToString`s them — it never runs `main()`.

## Confirmed configuration defects (found during the investigation)

1. **Duplicate, broken manifest link.** `index.html` has
   `<link rel="manifest" href="/manifest.webmanifest" />`; with
   `base: "/dungeon-archive/"` this URL 404s in dev and prod, and
   vite-plugin-pwa injects a second, correct link
   (`/dungeon-archive/manifest.webmanifest`). Chrome uses the first → the PWA
   manifest never loads.
2. **No boot failure detection.** A failed module script leaves the spinner
   spinning silently; the browser console shows the 404, but the UI gives no
   indication, and there is no recovery path.

## Recommendation (not yet implemented)

Root cause is demonstrated; per the investigation constraints, no fallback was
added until this was confirmed. Options:

1. **One-time cache-busting retry on module-script failure** (recommended): an
   inline boot script listens for the module-script load error and performs a
   single `location.replace()` with a fresh query string so the server's
   current `index.html`/chunks load; if the retry fails, the failing asset URL
   is shown on the splash instead of a silent spinner.
2. **Detection only**: surface the exact failing asset URL on the splash, no
   automatic reload.
3. **Fix the manifest link** (independent, low-risk) in either case.

## Artifacts / state

- All temporary instrumentation removed; `git status` clean.
- `pnpm verify` passes (typecheck, lint 0 errors / 11 pre-existing warnings,
  all 13 test suites, production build).
- Reproduction harnesses kept in the temp workspace
  (`C:\Users\Mario\AppData\Local\Temp\opencode\cdp-*-test.mjs`) for
  re-running the proof if needed.

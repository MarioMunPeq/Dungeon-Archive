# Phase 20 — Architecture Review Report

> **Date:** 2026-08-01
> **Scope:** Documentation-only product-vision reset. No runtime code changes.
> **Mandate:** Every philosophy, roadmap, architecture, and technical doc must accurately describe the current codebase and the new long-term direction.

---

## 1. What Changed

### Product Philosophy Reset

The core philosophy was redefined from "a compendium optimized for fast consultation" into a sharper statement:

> **Dungeon Archive is a mobile-first table companion for D&D 5e. Its sole purpose is reducing dead time during play. Fast information retrieval is always prioritized over feature richness. The Compendium is the single source of truth for rules. User data only stores lightweight context. It is NOT a campaign manager, VTT, character builder, combat tracker, or worldbuilding tool.**

The guiding test for every feature is now explicit:

> **Does this reduce the time players spend waiting because someone is looking for information?**

### Files Rewritten (17 of 17 docs + README + 5 ADRs)

| File | Change |
|------|--------|
| `README.md` | Rewritten: describes today's product, real stack, actual structure, current status |
| `docs/product-philosophy.md` | Rewritten: North Star, core problem, primary users (DM/Player), mental model, 7 principles |
| `docs/roadmap.md` | Rewritten: removed Phase 3-6 fiction (Reveal System, NPC, loot); re-prioritized (Player Reference Sheets, Session History, Compendium/Search/Perf/Offline/Nav HIGH; campaign polish LOW) |
| `docs/anti-features.md` | Rewritten: 18 explicit non-goals, no "Obsidian for planning" framing, permanent exclusions |
| `docs/navigation.md` | Rewritten: actual 4-tab bottom nav (Home/Search/Adventure/Party), Session reachable from Home/entity, real routes |
| `docs/glossary.md` | Rewritten: removed Reveal/IndexedDB/Dexie fiction; added reference-sheet vocabulary |
| `docs/success-metrics.md` | Rewritten: aligned targets to 7 categories; added non-goals (engagement is failure) |
| `docs/user-questions.md` | Rewritten: removed NPC/loot/world questions; added "explicitly not answered" section |
| `docs/architecture.md` | Rewritten: removed Dexie/IndexedDB/TanStack-Query-as-server-state fiction; documented localStorage + in-memory compendium + import boundaries |
| `docs/folder-structure.md` | Rewritten: reflects actual `src/` layout (features, compendium, user-state, adapter, generated) |
| `docs/mobile-first.md` | Rewritten: search-as-tab (not persistent bar), dark-first (not dark-mode toggle), single column |
| `docs/engineering-contract.md` | Rewritten: added reference-not-copy, adapter, generated-data and anti-feature rules; 16 rules |
| `docs/coding-guidelines.md` | Rewritten: removed Dexie/vitest/useQuery fiction; real scripts, real boundaries, dark-first |
| `docs/design-principles.md` | Rewritten: 11 principles aligned with dark-first design system; anti-patterns updated |
| `docs/compendium-architecture.md` | Rewritten: real 7 categories, real pipeline, runtime Map API, source/edition handling |
| `docs/search-architecture.md` | Rewritten: real substring scoring (100/80/60), single scope, no reveal filtering |
| `docs/architecture-decisions/README.md` | Updated ADR-004 index row |
| `docs/architecture-decisions/ADR-001..005` | Updated to reality (see §3) |
| `docs/architecture-review-iteration3.md` | **Replaced** by this report |

---

## 2. Philosophy Changes

1. **From "compendium app" to "dead-time reducer".** The primary-user model is now explicit: the **DM** (compendium, session history, adventure notes/objectives/references — never planning) and the **Player** (own reference sheet, compendium search — nothing more).
2. **"Campaign management" removed as a concept.** The app holds one lightweight **adventure** container. It is a reference companion, not a project-management tool.
3. **"Disappearing software" is the stated outcome.** The app should be opened for a question, used, and set aside. Time spent inside the app is now a failure metric.
4. **Anti-features are permanent exclusions**, not "later phases". The list grew to 18 items, including character-sheet replacement and spell-slot tracking.
5. **Search is a dedicated tab**, not a persistent global bar; category pages are fallbacks, not the primary path.

---

## 3. ADR Corrections (fiction → reality)

| ADR | Was (fiction) | Is (reality) |
|-----|---------------|--------------|
| ADR-002 Offline-first | "Campaign data stored in IndexedDB via Dexie.js"; lazy-load mitigation | User state in versioned `localStorage`; whole Compendium loaded once at startup; PWA caches assets |
| ADR-003 Adapter layer | Structure `src/adapter/5etools/` | `src/adapter/5etools-raw-types.ts` + `index.ts`; adapter owns external types; build scripts also read 5etools at build time |
| ADR-004 Single campaign | "Campaign" framing, read-only archives | "Single active **adventure**"; archive + `restoreAdventure` |
| ADR-005 Search-first | "Search bar always visible"; "every screen has contextual search"; fuzzy matching as implemented | Search is a tab; no contextual search; strict substring scoring (typo tolerance is future work) |
| ADR-001 React 19 | Server Components/Actions context | Client-only SPA context; pinned `^19.2.7` |

---

## 4. Contradictions Found and Resolved

1. **Docs claimed Dexie.js/IndexedDB** everywhere; code uses `localStorage` + in-memory Maps. → All docs now describe the real storage.
2. **Docs claimed Tailwind "dark mode"** with light-first `dark:` classes; code is Tailwind v4 dark-first with `@theme` tokens. → Docs now describe dark-first.
3. **Docs described a 4-tab bar as Home/Adventure/Search/Party**; actual order is Home/Search/Adventure/Party. → navigation.md, mobile-first.md, glossary.md now match `bottom-nav.tsx`.
4. **Docs claimed fictional `src/screens/`** (CharacterDetailScreen, SpellDetailScreen, ...); actual layout is `src/features/` + `src/user-state/`. → folder-structure.md rewritten.
5. **Docs described "Reveal System", "NPC roster", "Loot", "Quest Log", "worldbuilding", "campaign planning"** as features; all are removed or excluded. → Removed everywhere; anti-features expanded.
6. **Docs said Compendium MVP was 4 categories** (spells/conditions/actions/equipment) with monsters/feats/magic-items "later"; code ships **7 categories**. → All docs updated.
7. **Docs referenced React 18** in one spot; ADR-001 and package.json say React 19. → architecture.md now says React 19.
8. **Docs described "immutable official content"** with user data in a database; reality is references stored in user state. → engineering-contract rule 1 and compendium-architecture now state reference-not-copy.

---

## 5. Remnants (code-level, outside this phase's scope)

Docs now describe the code accurately. These code realities remain flagged for future cleanup (none touched in Phase 20 — docs-only):

1. **`dexie@^4.0.11` is a devDependency but unused** in `src/`. It is a leftover from the pre-reset architecture. **Recommendation:** remove from `package.json` and the lockfile when a code change is next permitted.
2. **TanStack Query** is installed and wired as a provider baseline in `src/app/index.tsx`, but no `useQuery` is called anywhere. It is documented as a non-participating baseline. **Recommendation:** either adopt it for a real async need or remove it; do not leave it ambiguous forever.
3. **`src/hooks/`** contains only a `.gitkeep`. Documented as reserved.
4. **Migration v6** exists solely to strip the legacy `scenes` field — historical residue handled correctly by `migrations.ts`. No action needed.
5. **Debug routes** (`/debug/content`, `/debug/spell`) exist in `src/features/debug/`. Documented as dev-only.

---

## 6. Verification

- `pnpm typecheck` — pending
- `pnpm lint` — pending
- `pnpm test` — pending (11 suites)
- `pnpm build` — pending

No runtime changes were made, so these are regression checks only.

---

## 7. Recommendations

1. **Treat anti-features as a hard gate** in PR review: any change adding a category from `anti-features.md` must be rejected.
2. **Keep docs truthful to code.** When a code change lands, update `folder-structure.md` and `architecture.md` in the same PR (both documents now assert "keep in sync with the code").
3. **Remove `dexie`** and decide the fate of TanStack Query in the next code-change phase.
4. **Session history** is the highest-value next feature: it answers "what happened last week?" with data the app already collects (pinned entities + end-of-session recording).
5. **Player Reference Sheets** are the second priority: present the stored combat-critical information (passive senses, known spells, equipped items) as one-tap reference, not as an editor.

# Product Cohesion Report — Phase 14

Scope: a product cohesion pass, not a redesign. No tokens, palette, spacing, animation, typography, component APIs, state, architecture, or dependencies were touched. Every change removes a behavior/appearance that revealed the app had been built in stages, or contradicts an established convention. Verification: `pnpm verify` green (typecheck, lint — 0 errors / 11 pre-existing console warnings, 13 test suites, production build).

---

## 1. Vocabulary: three words were used for one concept

### What felt inconsistent
The Session and Adventure screens both hold the same kind of thing — compendium entities a DM has linked into their workspace — but called it three different names:

- Session subtitle: `"No entities in session"` and `"{N} entries"`
- Adventure header: `"{N} references"`, section `"Important References"`
- Home adventure card: `"{N} entries"`

### Why it broke cohesion
The app already had an established, accurate term for this concept: *reference*. It is the data concept (`entityRefFromCanonicalId`, `EntityReferenceRow`), the Adventure section title, and the Party page's own framing ("Quick-access references"). A user who sees "entries" on Session and Home, "references" on Adventure, and "entities" on the empty Session state is hearing three different products.

### What was changed
- Session subtitle: `"No references in session"` / `"{N} reference{s}"` (`session-page.tsx`)
- Home adventure card count: `"{N} reference{s}"` (`home-page.tsx`)

### Why it matches the design language
Dungeon Archive is precise and consistent by design. One concept, one word. Session and Adventure rows now count the same way Adventure's own header does, so every screen speaks the same noun.

---

## 2. Vocabulary: "pin" was used for the wrong action

### What felt inconsistent
The flag button's label is `"Add to adventure"` / `"Remove from adventure"`, but the Adventure empty state told the DM to *"pin entities to this adventure."* The Session pin icon is the *pin*; the Adventure flag is an *add* — two different metaphors in the product (temporary pinned tray vs. organized collection).

### Why it broke cohesion
"Pin" is a loaded, specific word in this app (Session = pin). Telling a new DM to "pin entities" with the flag both contradicts the button's own label and muddies the pin/adventure distinction the onboarding carefully draws.

### What was changed
- Adventure empty state: `"Use the flag icon on entity pages or search results to add them to this adventure."` (`adventure-page.tsx`)
- Home session empty hint now matches the Session page's voice and verb: `"Nothing pinned yet. Search the Compendium and pin what you need."` instead of `"Pin entities with the pin icon while browsing to keep them one tap away."` (`home-page.tsx`)

### Why it matches the design language
Every screen now uses the same verb for the same action: pin → Session, add → Adventure/Party. The flag hint keeps the genuinely useful guidance (which icon it is) without the wrong verb.

---

## 3. Vocabulary: "Compendium" was sometimes a proper noun, sometimes not

### What felt inconsistent
- Home CTA and section header: `"Search the Compendium"`, `"Browse the Compendium"` (capitalized)
- Home paragraph, Session empty state, Onboarding: `"Search the compendium"` (lowercase)

### Why it broke cohesion
"Compendium" is the proper name of the library in this product (the `@/compendium` domain). Capitalizing it in some places and not others reads as two authors.

### What was changed
- Home first-run paragraph, Session empty state, Onboarding step 1: `"compendium"` → `"Compendium"`
- Onboarding step 1 body: `"in your library"` → `"in the Compendium"` (removed a second, competing name for the same thing)
- Onboarding step 2: `"Pin anything into your Session."` → `"Pin anything to your Session."` (matches the button's "Pin to session")
- Search empty state: `"Browse Categories"` → `"Browse the Compendium"` (the same category grid on Home is titled "Browse the Compendium" — two names for one grid)

### Why it matches the design language
Calm, precise, consistent. The library has one name, the primary action has one preposition, and the same grid has one label wherever it appears.

---

## 4. Ellipsis punctuation

### What felt inconsistent
Every in-app placeholder uses the Unicode ellipsis (`"Add objective…"`, `"Add notes…"`, `"One quick reminder…"`), but the ReferencePicker used three periods (`"Search known spells..."`).

### What was changed
`ReferencePicker.tsx` placeholder now uses `…`.

### Why it matches the design language
A single typographic convention. Text details like this are exactly what makes a product feel hand-finished.

---

## 5. Backup page value punctuation

### What felt inconsistent
`"No backup found."` — a label/value row value ending in a sentence period, while every other value in the app (counts, dates, "None") is punctuation-free.

### What was changed
`"No backup found"` (`backup-page.tsx`).

### Why it matches the design language
In a dense label/value UI, values are data, not sentences. The period made the empty value read like prose.

---

## 6. Interaction philosophy: Session confirmed destruction differently

### What felt inconsistent
Ending a session clears every reference — a destructive, hard-to-miss action — but Session confirmed it with an inline swap of header buttons (End Session → Cancel / End). Every other destructive confirmation in the app — Adventure "Remove all references?", Party "Remove player?", Backup upload/restore — uses the shared `ConfirmDialog`.

### Why it broke cohesion
The brief calls this out directly: "Different interaction philosophy... This dialog feels different." A modal is the app's single confirmation language; the inline swap was a one-off interaction pattern only Session had. It also risked accidental taps — the destructive button sat in the header where the non-destructive "End Session" had been.

### What was changed
Session now opens the standard `ConfirmDialog`: title `"End Session?"`, message `"This will remove every reference from your session. You can re-add them anytime."`, `"End Session"` destructive confirm. Same action, same two-step flow, standard presentation. The now-unused inline swap code and `handleCancelConfirm` were removed.

### Why it matches the design language
One confirmation pattern for every destructive decision. The DM gets the same predictable, recoverable ("You can re-add them anytime.") dialog they already know from the other three screens.

---

## 7. Radius: the icon-button family was the last `rounded` holdout

### What felt inconsistent
Phase 13 established one radius language (controls/cards = `rounded-lg`, text chips = `rounded-md`, overlays = `rounded-sm`). The entire icon-button family — FavoriteButton, SessionButton, AdventureButton, RowRemoveButton, ReferencePicker close, Adventure edit-title/remove-objective, Party remove-player/clear-value — still used bare `rounded` (0.25rem), a radius that exists nowhere else in the system.

### Why it broke cohesion
These buttons sit directly beside `rounded-lg` cards and rows. Their sharp corners read as older, off-system geometry, exactly the "visually older" artifact the brief asks to remove. Small Stepper buttons already used `rounded-lg`, so there was precedent for small controls with the full control radius.

### What was changed
`rounded` → `rounded-lg` in 9 spots across 6 files (`SessionButton`, `FavoriteButton`, `AdventureButton`, `entity-reference-row.tsx`, `ReferencePicker.tsx`, `adventure-page.tsx` ×2, `party-page.tsx` ×2).

### Why it matches the design language
Now every interactive control in the app — large or small — shares one corner radius. Shape again means interactivity, uniformly, at every density.

---

## 8. Icon stroke weight

### What felt inconsistent
Every icon in the app draws at `strokeWidth={2}` (nav icons, action buttons, chevrons, row controls). Two icons on the Party screen drew at 2.5 — the clear-value × and the "set value" plus.

### Why it broke cohesion
At the same 24px viewBox, a 2.5 stroke is visibly bolder. Inside a screen where all other icons are hairline-consistent, these two felt heavier and mismatched.

### What was changed
Both `strokeWidth={2.5}` → `strokeWidth={2}` (`party-page.tsx`).

### Why it matches the design language
One icon weight across the whole product. The icon system disappears — which is its job.

---

## 9. Renderer structure: five ways to say `space-y-6`

### What felt inconsistent
The seven entity renderers expressed the same vertical rhythm three different ways:
- Spell, Monster: `<Stack gap="lg">`
- Equipment, Condition, Action: `<div className="space-y-6">`
- Magic Item, Feat: `<div className="flex flex-col gap-6">`

And `Section` was imported from two different module paths.

### Why it broke cohesion
Invisible to users, but it reveals the pages were built at different times, and it is exactly the kind of drift that makes future visual changes land unevenly. The brief's "component quality" clause — bring everything up to the current standard — applies here.

### What was changed
All five divergent renderers now use `<Stack gap="lg">` (which is `space-y-6`, so the rendered output is identical), and all renderers import `Section` from the same `@/components/entity` barrel.

### Why it matches the design language
The reference screen has one structural identity regardless of category. No visual change, but the code now reads as one product.

---

## 10. Page rhythm: the Category page was the only 16px page

### What felt inconsistent
Every screen spaces header → content at 24px (Session/Party/Backup use `mb-6`; Adventure/Home use `gap-6`; the entity page uses `Stack gap="lg"`). The Category page used `space-y-4` — 16px everywhere.

### Why it broke cohesion
A first-time user browsing Home → Category → Entity sees the vertical cadence tighten on exactly one screen, then loosen again on the entity. It's the kind of subtle rhythm change that makes a page feel "off" without an obvious reason.

### What was changed
Category page container `space-y-4` → `space-y-6` (`category-page.tsx`).

### Why it matches the design language
One cadence for the whole app. The header → explanation → content → actions rhythm now holds on every screen.

---

## Things deliberately left unchanged

A cohesion pass that churns everything isn't a cohesion pass. These survived the audit on purpose:

- **SessionButton's "Pinned"/"Removed" status tooltip** (AdventureButton and FavoriteButton have none). It is live interaction feedback for the single most important in-session action, and removing it would change behavior, which this phase does not do. It is a feature, not an inconsistency.
- **`active:scale-90` on icon buttons vs `active:scale-95` on `Button`.** Stepper's small buttons also press at 90. There is a working hierarchy: full-size primary/outline buttons press at 95, small icon/stepper controls at 90. Unifying them would flatten that.
- **Icon-button sizes (`h-5`, `h-6`, `h-8`, `p-1.5`).** Sizes scale with context (dense value cells, list rows, page headers). That's density with intent, not drift.
- **Onboarding's capitalized `Session` / `Adventures`.** Onboarding uses feature-name emphasis to teach the model; it's a deliberate pedagogical voice, not an accident.
- **Search empty-state footer `"Search spells, monsters, equipment, and more"`.** Helpful microcopy, not marketing; nothing else competes with it.
- **Debug routes** (`/debug/*`) — developer tools, not product screens; not reachable from navigation.
- **TopBar showing the app name on every page.** The brand bar stays constant; each page's `h1` answers "where am I". That's the intended composition.
- **Divider** — used only as the content separator block; no second, conflicting divider pattern exists to reconcile.

---

## Result

Any five random screens now share: one noun for references, one name for the Compendium, one verb per action, one confirmation dialog, one icon weight, one control radius, and one 24px vertical cadence. The goal — a user who cannot guess which page was built first, and who never thinks "this screen behaves differently" — is the measure of success, and it no longer depends on which five screens they open.

# Navigation

## Mental Model

The application is a **second screen that sits next to the table**. Navigation exists only to reach information quickly. Users should never think about where something lives — they tap a tab or type a search.

There are five destinations:

1. **Home** — the landing screen: current character, session pins, recently viewed, learn-the-basics.
2. **Archive** — the canonical reference surface: global search plus the game rules.
3. **Combat** — the lightweight combat tracker for the active player.
4. **Dice** — the dice roller, reachable in one tap from anywhere.
5. **Character** — the active player's reference sheet.

## The Tab Bar

The app uses a **5-tab bottom navigation bar**, always visible and thumb-reachable:

```
┌───────────────────────────────────────────┐
│                                           │
│           [Main content area]             │
│                                           │
├────────┬────────┬────────┬────────┬───────┤
│  ⌂     │  🗄     │  ⚔     │  ⚄     │  👤   │
│ Home   │Archive │ Combat │  Dice  │Character│
└────────┴────────┴────────┴────────┴───────┘
```

- **Home** (`/`) — Current Character (links to Combat), the session's pinned entities, Recently Viewed, and quick links into the Archive.
- **Archive** (`/archive`) — the single reference surface. The default **Search** tab is global search across the entire Compendium (instant results, category filter, recent searches). The **How to Play**, **Rules**, and **Glossary** tabs are the built-in rules reference (with the Beginner tips toggle). Tab state lives in the URL (`/archive?tab=rules`, `/archive?q=fireball`).
- **Combat** (`/combat`) — Hit points, conditions, a turn checklist, and combat stats for the active player.
- **Dice** (`/dice`) — the dice roller. Rolls any die (d4–d100), any number of dice, with an optional modifier. Spell damage shown in the Character sheet and Compendium rolls inline on tap.
- **Character** (`/character`) — the active player's reference sheet with pickers for spells, weapons, and magic items.

## Top Bar

A sticky header on every screen:

- Shows the current screen title (app name on Home).
- Shows a **Back** button on screens reached from elsewhere (entity detail, Session, Backup).
- Shows a **Cloud Backup** icon button on the right. The entry is hidden in production builds where Cloud Backup is not configured.

## Redirects

- `/search` → `/archive` (the search screen is now the Archive's Search tab).
- `/rules` → `/archive?tab=rules` (the rules screen is now the Archive's Rules tab).

## Other Routes

- **Session** (`/session`) — has no tab. Reached from Home's Session section and from the pin button on any entity. Holds the pinned entities for the current encounter and the End Session action.
- **Compendium categories** — every category has a browsable list page (`/spell`, `/monster`, `/equipment`, `/condition`, `/action`, `/magicitem`, `/feat`) with filters and sorting, linked from entity detail breadcrumbs.
- **Entity detail** — `/:category/:canonicalId` (e.g. `/spell/fireball`) — full entity view with Favorite and Session pin actions, related entities, and edition/source selection.
- **Backup** (`/backup`) — Cloud Backup. Shows a "not available" state when disabled.
- **Debug** (`/debug/*`) — dev-only routes, never shipped.
- **Fallback** — any unknown path renders the Not Found screen.

## Navigation Patterns

### One-Handed Navigation

All navigation is designed for one thumb:

- **Bottom tab bar** — primary navigation, thumb-reachable (56px target minimum).
- **Back navigation** — browser/back-button behavior plus a top-bar back button.
- **Scroll** — single-finger swipe.
- **No hover states** — touch-first; active/pressed states via scale and color.

### Archive Navigation

- **Tap the Archive tab** — opens the Search tab, keyboard appears.
- **Type** — results appear instantly (200ms debounce, synchronous scoring).
- **Arrow keys / Enter** — keyboard navigation through results (also usable with external keyboards).
- **Escape** — clear the query.
- **Tap result** — open entity detail.
- **Category filter** — narrow results to one category.
- **Recent searches** — shown as chips when the query is empty.
- **Rules tabs** — How to Play, Rules, and Glossary share the Archive surface; the selected tab is reflected in the URL so it survives reloads and back navigation.

### Quick Actions (Entity Detail)

Every entity detail offers two one-tap actions:

- **Favorite** — mark the entity as a favorite.
- **Session** — pin the entity to the current encounter's session list.

## Rules

- Every screen answers at least one question (see [user-questions.md](./user-questions.md)). If a screen doesn't, it doesn't exist.
- Search is the primary path; category pages are fallbacks.
- Never add navigation depth that requires more than two taps to reach an answer.
- The tab bar is fixed at five tabs. Adding a destination means removing one.

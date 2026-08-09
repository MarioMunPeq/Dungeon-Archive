# Navigation

## Mental Model

The application is a **second screen that sits next to the table**. Navigation exists only to reach information quickly. Users should never think about where something lives — they tap a tab or type a search.

There are five destinations:

1. **Home** — the landing screen: current character, session pins, recently viewed, learn-the-basics.
2. **Search** — the primary interface, available everywhere.
3. **Rules** — quick reference for the game rules, for newcomers and veterans alike.
4. **Combat** — the lightweight combat tracker for the active player.
5. **Party** — the group's lightweight reference sheets.

## The Tab Bar

The app uses a **5-tab bottom navigation bar**, always visible and thumb-reachable:

```
┌───────────────────────────────────────────┐
│                                           │
│           [Main content area]             │
│                                           │
├────────┬────────┬────────┬────────┬───────┤
│  ⌂     │  🔍    │  📜    │  ⚔     │  👥   │
│ Home   │ Search │ Rules  │ Combat │ Party │
└────────┴────────┴────────┴────────┴───────┘
```

- **Home** (`/`) — Current Character (links to Combat), the session's pinned entities, Recently Viewed, and a link to the rules for newcomers.
- **Search** (`/search`) — Global search across the entire Compendium. Instant results, category filter, recent searches. The top bar is hidden here so the query input is the focus.
- **Rules** (`/rules`) — Three tabs: Rules, How to Play, and Glossary, plus the Beginner Mode toggle.
- **Combat** (`/combat`) — Hit points, conditions, a turn checklist, and combat stats for the active player. The **Roll Dice** button opens the Dice Roller (`/dice`), where attack and damage rolls happen.
- **Party** (`/party`) — Player reference sheets with pickers for spells, weapons, and magic items.

## Top Bar

A sticky header on every screen except Search:

- Shows the current screen title (app name on Home).
- Shows a **Back** button on screens reached from elsewhere (entity detail, Session, Backup).
- Shows a **Cloud Backup** icon button on the right. The entry is hidden in production builds where Cloud Backup is not configured.

## Other Routes

- **Session** (`/session`) — has no tab. Reached from Home's Session section and from the pin button on any entity. Holds the pinned entities for the current encounter and the End Session action.
- **Dice Roller** (`/dice`) — has no tab. Reached from the **Roll Dice** button on Combat. Rolls any die (d4–d100), any number of dice, with an optional modifier. Spell damage shown in the Character sheet and Compendium rolls inline on tap.
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

### Search Navigation

- **Tap the Search tab** — opens search, keyboard appears.
- **Type** — results appear instantly (200ms debounce, synchronous scoring).
- **Arrow keys / Enter** — keyboard navigation through results (also usable with external keyboards).
- **Escape** — clear the query.
- **Tap result** — open entity detail.
- **Category filter** — narrow results to one category.
- **Recent searches** — shown as chips when the query is empty.

### Quick Actions (Entity Detail)

Every entity detail offers two one-tap actions:

- **Favorite** — mark the entity as a favorite.
- **Session** — pin the entity to the current encounter's session list.

## Rules

- Every screen answers at least one question (see [user-questions.md](./user-questions.md)). If a screen doesn't, it doesn't exist.
- Search is the primary path; category pages are fallbacks.
- Never add navigation depth that requires more than two taps to reach an answer.
- The tab bar is fixed at five tabs. Adding a destination means removing one.

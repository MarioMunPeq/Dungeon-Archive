# Mobile-First Design

## Overview

Dungeon Archive is a **mobile-first** application. The phone is the primary platform. Desktop exists only for development and testing.

> **Designed for people sitting around a table with a phone in one hand and dice in the other.**

---

## One-Handed First

### The Scenario

A player or DM is sitting at a table with:

- One hand holding the phone
- The other hand holding dice, a pencil, or a character sheet
- Limited attention (watching the game)

The app must work with **one thumb** on a phone screen.

### Thumb Reach Zones

```
┌─────────────────────────────┐
│  ████████████████████████   │ ← Difficult (avoid)
│  ████████████████████████   │
│  ████████████████████████   │
│  ████████░░░░░░░░████████   │ ← OK (occasional)
│  ████████░░░░░░░░████████   │
│  ████████░░░░░░░░████████   │ ← Comfortable (primary)
│  ████████░░░░░░░░████████   │
│  ████████░░░░░░░░████████   │ ← Thumb resting zone
└─────────────────────────────┘
     Bottom tab bar (always reachable)
```

### Design Implications

- **Primary navigation** in the bottom tab bar (thumb-reachable).
- **Primary actions** in the bottom two-thirds of the screen.
- **Content** scrolls; navigation never scrolls away.
- **No hover states** — touch-first; feedback via color and scale on press.
- **Layout constrained** to a single column, centered, capped at `max-w-screen-xl` — the app never renders wide multi-panel layouts.

---

## Screen Layout

```
┌─────────────────────────────┐
│ TopBar (title, back, cloud) │ ← Context + one global action
├─────────────────────────────┤
│                             │
│ Content Area                │ ← Middle (scroll)
│ (scrollable)                │
│                             │
├─────────────────────────────┤
│ ⌂  🔍  📜  ⚔  👥           │ ← Bottom (thumb zone)
│ Home Search Rules Combat Party│
└─────────────────────────────┘
```

### Key Principles

- **TopBar:** Minimal. Shows the app name (home), breadcrumbs/title (entity detail), a back button on nested screens, and the Cloud Backup entry (hidden when the feature is disabled). Search hides the top bar entirely.
- **Content:** Scrollable, single column, primary content.
- **BottomNav:** Always visible, five tabs (Home, Search, Rules, Combat, Party), minimum 56px target height.
- **Session and Backup** have no tabs: Session is reached from Home and from pin buttons on entity detail; Backup from the top bar.

---

## Touch Interactions

### Primary (One-Handed)

| Interaction | Zone | Result |
|-------------|------|--------|
| **Tap tab** | Bottom tab bar | Switch section |
| **Tap item** | Middle screen | Open entity / edit |
| **Swipe up/down** | Anywhere | Scroll |
| **Tap quick action** | Entity detail | Favorite / pin to Session |

### Search Interactions

| Interaction | Result |
|-------------|--------|
| **Tap Search tab** | Open search, focus input |
| **Type** | Instant results (200ms debounce) |
| **Arrow keys / Enter** | Keyboard navigation through results |
| **Escape** | Clear the query |
| **Tap result** | Open entity detail |
| **Category filter** | Narrow results to one category |

---

## Search UX

### A Dedicated Tab, Not a Persistent Bar

Search is the **primary interface**, not a decorative bar. It lives in the bottom navigation as its own tab and is one tap away from every screen. There is no always-visible search input in the layout; the Search tab is the entry point.

### Instant Results

- No loading spinner.
- Results appear as the user types.
- 200ms debounce, synchronous in-memory scoring.
- Search latency target < 150ms.

### Keyboard

- Keyboard opens automatically on search focus.
- Keyboard dismisses on result tap.
- Arrow/Enter/Escape shortcuts work with external keyboards too.

---

## Dark-First Theming

- The app is dark-first: dark surfaces, high-contrast text.
- Semantic color tokens (`primary`, `background`, `surface`, `card`, ...) live in the Tailwind `@theme` block in `src/index.css`.
- Fonts: Inter Variable for UI, JetBrains Mono Variable for data/code-like content.
- No reliance on color alone for meaning.

---

## Accessibility

### Touch Targets

- Tab bar items: minimum 56px height.
- Interactive elements: minimum 44x44px.
- Clear visual feedback on tap (color + scale).

### Visual Hierarchy

- High contrast text (WCAG AA).
- Clear focus states.
- Readable font sizes.
- No reliance on color alone.

### Screen Reader

- Semantic HTML.
- ARIA labels for interactive elements.
- Logical tab order.
- Meaningful text alternatives.

---

## Performance

### Mobile Optimizations

- The Compendium loads once at startup; navigation after that is synchronous.
- Search is computed in memory — no network, no async flicker.
- Minimal animation.
- Service worker (PWA) caches assets for offline use and installability.

### Battery Considerations

- No continuous background processes.
- No network requests (Cloud Backup is user-initiated only).
- Minimal DOM churn.

---

## Testing

### Device Testing

- Test on real devices (not just simulators).
- Test with one hand.
- Test in low light (typical gaming environment).

### Interaction Testing

- Verify all actions work with one thumb.
- Verify search is one tap away from every screen.
- Verify back navigation works consistently.
- Verify the layout never exceeds single-column width.

---

## Desktop (Development Only)

Desktop is used only for:

- Code editing
- Running tests
- Building the application
- Debugging

**Not a product platform.** No keyboard shortcuts as product features (search keyboard navigation is for hardware keyboards on phones).

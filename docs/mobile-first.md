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

- **Primary actions** in bottom third of screen
- **Navigation** in bottom tab bar (thumb-reachable)
- **Secondary actions** in middle third
- **Avoid** top third for interactive elements
- **Scroll** for content, not navigation

---

## Touch Interactions

### Primary (One-Handed)

| Interaction | Zone | Result |
|-------------|------|--------|
| **Tap** | Bottom tab bar | Switch sections |
| **Tap** | Middle screen | Select item |
| **Swipe up** | Anywhere | Scroll down |
| **Swipe down** | Top edge | Pull to refresh |
| **Swipe left** | List item | Quick action |
| **Swipe right** | List item | Quick action |

### Secondary (Two-Handed)

| Interaction | Zone | Result |
|-------------|------|--------|
| **Long-press** | Anywhere | Context menu |
| **Pinch** | Map/image | Zoom |
| **Two-finger scroll** | List | Fast scroll |

### Search Interactions

| Interaction | Result |
|-------------|--------|
| **Tap search bar** | Open search, show keyboard |
| **Type** | Instant results |
| **Tap result** | Open detail |
| **Swipe back** | Return to search |
| **Tap clear** | Clear search |

---

## Screen Layout

### Mobile Layout

```
┌─────────────────────────────┐
│ Header (back, title, menu)  │ ← Top (avoid for actions)
├─────────────────────────────┤
│                             │
│ Content Area                │ ← Middle (scroll)
│ (scrollable)                │
│                             │
│                             │
├─────────────────────────────┤
│ Search Bar (persistent)     │ ← Bottom middle
├─────────────────────────────┤
│ 🏠  🗺️  🔍  👥            │ ← Bottom (thumb zone)
│ Tab Bar                     │
└─────────────────────────────┘
```

### Key Principles

- **Header:** Minimal, back button + title
- **Content:** Scrollable, primary content
- **Search bar:** Persistent, always accessible
- **Tab bar:** Always visible, thumb-reachable

---

## Mobile-Specific Patterns

### Pull to Refresh

```
┌─────────────────────────────┐
│ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ │ ← Pull down
│ ┌─────────────────────────┐ │
│ │ Refreshing...           │ │
│ └─────────────────────────┘ │
│                             │
│ Content                     │
└─────────────────────────────┘
```

### Swipe Actions

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ Item content  ← swipe  │ │
│ │ [Action revealed]       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Modal Sheet

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ ▬ (drag handle)         │ │
│ │                         │ │
│ │ Modal Content           │ │
│ │                         │ │
│ │ [Actions]               │ │
│ └─────────────────────────┘ │
│                             │
│ (dimmed background)         │
└─────────────────────────────┘
```

### Bottom Sheet

```
┌─────────────────────────────┐
│                             │
│ Content                     │
│                             │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ▬ (drag handle)         │ │
│ │ Bottom Sheet Content    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## Search UX

### Always Accessible

Search is available from every screen:
- **Global search bar** at top
- **Search tab** in bottom navigation
- **Contextual search** within sections

### Instant Results

- No loading spinner
- Results appear as user types
- 150ms debounce
- < 200ms response time

### Keyboard Management

- Keyboard opens automatically on search focus
- Keyboard dismisses on result tap
- Search results adjust keyboard height
- No keyboard shortcuts (mobile doesn't have a keyboard)

---

## Accessibility

### Touch Targets

- Minimum 44x44px touch targets
- Adequate spacing between interactive elements
- Clear visual feedback on tap

### Visual Hierarchy

- High contrast text (WCAG AA)
- Clear focus states
- Readable font sizes (16px minimum for body)
- No reliance on color alone

### Screen Reader

- Semantic HTML
- ARIA labels for interactive elements
- Logical tab order
- Descriptive alt text

---

## Performance

### Mobile Optimizations

- **Lazy loading** — Load content as needed
- **Virtual scrolling** — For long lists
- **Image optimization** — WebP, appropriate sizes
- **Minimal re-renders** — Use React.memo, useMemo
- **Efficient queries** — IndexedDB queries, not full scans

### Battery Considerations

- No continuous background processes
- No frequent network requests
- Efficient DOM updates
- Minimal animation

---

## Testing

### Device Testing

- Test on real devices (not just simulators)
- Test with one hand
- Test with dirty/wet hands (tabletop environment)
- Test in low light (typical gaming environment)

### Interaction Testing

- Verify all actions work with one thumb
- Verify search is accessible from every screen
- Verify back navigation works consistently
- Verify modal dismissal works (tap outside, swipe down)

---

## Desktop (Development Only)

Desktop is used only for:
- Code editing
- Running tests
- Building the application
- Debugging

**Not a product platform.** No keyboard shortcuts as product features.

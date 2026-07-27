# Design Principles

## Purpose

These principles guide every visual and interaction decision in Dungeon Archive. They prioritize function over form, speed over beauty, and invisibility over engagement.

---

## Core Philosophy

> **The interface should disappear.**

The best Dungeon Archive interaction is the one the user forgets they had. The app is not entertainment. It is a tool that serves gameplay and then gets out of the way.

---

## Principles

### 1. Prefer One Tap Over Two

Every extra tap costs time. If a user can reach the same result with one tap instead of two, choose one tap.

- Search bar is always visible (no "tap to reveal")
- Tab bar provides instant section switching
- Quick actions reduce navigation depth

### 2. Prefer Search Over Navigation

Searching is faster than browsing. If a user can find something by typing its name, don't make them navigate through menus.

- Search is the primary interface
- Every screen has a search bar
- Results appear instantly
- Categories are secondary to search

### 3. Prefer Reading Over Clicking

Reading is faster than clicking through menus. If a user can get the answer by reading a screen, don't make them click through multiple pages.

- Show relevant information upfront
- Avoid "click to expand" for essential data
- Keep descriptions concise but complete

### 4. Prefer Whitespace Over Decoration

Whitespace improves readability. Decoration adds visual noise. Choose readability.

- Generous padding around text
- Clear visual hierarchy
- No decorative elements
- Content is the interface

### 5. Text Is More Important Than Illustrations

Text conveys information faster than images. Illustrations add personality but slow comprehension for reference material.

- Text-first design
- Icons for navigation, not illustration
- No decorative images
- Emojis used sparingly for category identification

### 6. Information Hierarchy Is More Important Than Visual Style

How information is organized matters more than how it looks. A clear hierarchy with poor styling beats a beautiful hierarchy that's hard to scan.

- Clear heading levels
- Consistent spacing
- Logical grouping
- Progressive disclosure

### 7. Avoid Decorative UI

Every pixel should serve a purpose. If a UI element doesn't help the user accomplish a task, remove it.

- No decorative borders
- No ornamental backgrounds
- No unnecessary shadows
- No purely aesthetic elements

### 8. Avoid Unnecessary Animations

Animations slow interactions. If an animation doesn't communicate state change or provide feedback, skip it.

- No loading spinners for instant operations
- No page transitions for simple navigation
- No hover effects on mobile
- No decorative motion

### 9. Fast Interactions Are More Valuable Than Beautiful Transitions

A 50ms response feels better than a 500ms animation, no matter how smooth. Speed is beauty.

- Instant feedback on tap
- Results appear immediately
- No transition animations for core flows
- Performance over polish

### 10. The Application Should Feel Invisible During Play

The best tool is the one you don't notice. Dungeon Archive should serve gameplay without interrupting it.

- No notifications during sessions
- No prompts or interruptions
- No "tips" or "suggestions"
- No gamification

---

## Visual Design Rules

### Color

- High contrast text (WCAG AA minimum)
- Minimal color palette
- Color for meaning, not decoration
- Dark mode support

### Typography

- 16px minimum for body text
- Clear heading hierarchy
- Consistent font sizes
- Readable line lengths

### Layout

- Mobile-first responsive design
- Thumb-reachable interaction zones
- Bottom navigation bar
- Minimal header complexity

### Components

- Large touch targets (44x44px minimum)
- Clear visual feedback on tap
- Consistent spacing
- Predictable behavior

---

## Interaction Rules

### Search

- Instant results (< 150ms)
- No loading states for search
- Keyboard appears automatically
- Clear button always visible

### Navigation

- Bottom tab bar for primary navigation
- Back button always available
- No deep nesting (max 3 levels)
- Swipe to go back

### Data Entry

- Minimal typing required
- Smart defaults
- Auto-save
- Validation feedback

---

## Anti-Patterns

### Don't Do This

- ❌ Loading spinners for cached data
- ❌ Page transitions for tab switches
- ❌ "Pull to refresh" for static content
- ❌ Tooltips for essential information
- ❌ Modal dialogs for non-critical actions
- ❌ Confirmation dialogs for reversible actions
- ❌ Empty states with illustrations
- ❌ Onboarding tutorials
- ❌ Feature announcements
- ❌ Progress bars for instant operations

### Do This Instead

- ✅ Instant display of cached data
- ✅ Immediate tab content swap
- ✅ Auto-refresh in background
- ✅ Inline help text
- ✅ Inline actions
- ✅ Direct action with undo
- ✅ Empty states with clear next steps
- ✅ Learn by doing
- ✅ Quiet updates
- ✅ No progress indication needed

---

## Summary

Dungeon Archive's design is defined by what it removes, not what it adds. Every element must justify its existence by reducing the time between question and answer. The interface disappears into gameplay.

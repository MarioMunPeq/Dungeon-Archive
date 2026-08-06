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

- The bottom tab bar provides instant section switching.
- Search is one tap away (a dedicated tab).
- Quick actions (Favorite, Session) are one tap on entity detail.

### 2. Prefer Search Over Navigation

Searching is faster than browsing. If a user can find something by typing its name, don't make them navigate through menus.

- Search is the primary interface and a dedicated tab.
- Results appear instantly.
- Category pages are fallbacks, not the primary path.

### 3. Prefer Reading Over Clicking

Reading is faster than clicking through menus. If a user can get the answer by reading a screen, don't make them click through multiple pages.

- Show the answer on the entity detail directly.
- Avoid "click to expand" for essential data.
- Keep content complete but scannable.

### 4. Prefer Whitespace Over Decoration

Whitespace improves readability. Decoration adds visual noise. Choose readability.

- Generous padding around text.
- Clear visual hierarchy.
- No decorative elements.
- Content is the interface.

### 5. Text Is More Important Than Illustration

Text conveys information faster than images. Illustrations add personality but slow comprehension for reference material.

- Text-first design.
- Icons for navigation, not illustration.
- No decorative images.
- Minimal emoji usage (category identification only, and only where the codebase already does).

### 6. Information Hierarchy Is More Important Than Visual Style

How information is organized matters more than how it looks.

- Clear heading levels.
- Consistent spacing (design tokens).
- Logical grouping (metadata grid, sections).
- Progressive disclosure for secondary detail.

### 7. Avoid Decorative UI

Every pixel should serve a purpose. If a UI element doesn't help the user accomplish a task, remove it.

- No decorative borders.
- No ornamental backgrounds.
- No unnecessary shadows.
- No purely aesthetic elements.

### 8. Avoid Unnecessary Animations

Animations slow interactions. If an animation doesn't communicate state change or provide feedback, skip it.

- No loading spinners for instant operations.
- No page transitions for simple navigation.
- No decorative motion.
- Press feedback via color and scale only.

### 9. Fast Interactions Are More Valuable Than Beautiful Transitions

A 50ms response feels better than a 500ms animation, no matter how smooth. Speed is beauty.

- Instant feedback on tap.
- Results appear immediately.
- No transition animations for core flows.
- Performance over polish.

### 10. The Application Should Feel Invisible During Play

The best tool is the one you don't notice.

- No notifications during sessions.
- No prompts or interruptions.
- No "tips" or "suggestions".
- No gamification.

### 11. Dark-First by Default

The app ships dark: dark surfaces, high-contrast text. Darkness suits low-light table environments and makes the reference content the brightest thing on screen.

- Semantic color tokens defined once in the theme.
- No per-component color decisions.

---

## Visual Design Rules

### Color

- High contrast text (WCAG AA minimum).
- Minimal, semantic palette (primary, background, surface, card).
- Color for meaning, not decoration.
- Dark by default; no separate "dark mode" toggle.

### Typography

- Inter for UI, JetBrains Mono for data-like content.
- Clear heading hierarchy.
- Consistent font sizes.
- Readable line lengths within the single-column layout.

### Layout

- Mobile-first, single column, `max-w-screen-xl`.
- Thumb-reachable interaction zones.
- Bottom navigation bar (Home, Search, Rules, Combat, Party).
- Minimal header complexity (TopBar: title or breadcrumbs).

### Components

- Large touch targets (44x44px minimum; tab bar 56px).
- Clear visual feedback on tap.
- Consistent spacing (design tokens).
- Predictable behavior.

---

## Interaction Rules

### Search

- Instant results (200ms debounce).
- No loading states for search.
- Keyboard appears automatically on focus.
- Clear button always visible.
- Arrow keys / Enter / Escape for keyboard navigation.

### Navigation

- Bottom tab bar for primary navigation.
- Back always available (breadcrumbs on entity detail).
- No deep nesting (max 3 levels).
- Session reached from Home and entity quick actions, not a tab.

### Data Entry

- Minimal typing required (reference pickers instead of free text where possible).
- Smart defaults.
- Auto-save on change.
- Inline editing for player reference fields.

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
- ❌ Light-theme-first styles with `dark:` overrides

### Do This Instead

- ✅ Instant display of in-memory data
- ✅ Immediate tab content swap
- ✅ Quiet updates (no refresh mechanics)
- ✅ Inline help text
- ✅ Inline actions
- ✅ Direct action with undo
- ✅ Empty states with clear next steps
- ✅ Learn by doing
- ✅ Quiet updates
- ✅ Semantic tokens applied directly

---

## Summary

Dungeon Archive's design is defined by what it removes, not what it adds. Every element must justify its existence by reducing the time between question and answer. The interface disappears into gameplay.

# Coding Guidelines

## Overview

Development standards for Dungeon Archive. These guidelines ensure consistency, maintainability, and alignment with product principles.

---

## Core Principles

1. **Mobile-first** — All code must work on mobile devices
2. **Offline-first** — No network dependencies for core features
3. **Performance** — 200ms search debounce, < 150ms search latency, < 1.5s initial load
4. **Simplicity** — Prefer simple solutions over clever ones
5. **Type safety** — TypeScript strict mode, no `any` types
6. **Read-only Compendium** — Application code never writes official data

---

## TypeScript

### Configuration

The project runs TypeScript in strict mode across three configs:

- `tsconfig.app.json` — application code
- `tsconfig.scripts.json` — build scripts
- `tsconfig.node.json` — tooling

Verified with `pnpm typecheck`.

### Type Definitions

```typescript
// Prefer interfaces for object shapes
interface PlayerReference {
  id: string;
  name: string;
  level: number;
}

// Use type aliases for unions
type CategoryKey = 'spell' | 'monster' | 'equipment' | 'condition' | 'action' | 'magicitem' | 'feat';
```

### Naming

- **PascalCase** for types, interfaces, components
- **camelCase** for variables, functions, methods
- **UPPER_SNAKE_CASE** for module-level constants (`ROUTES`, `APP_NAME`)
- **kebab-case** for most files (`home-page.tsx`, `category-registry.ts`); PascalCase for UI atoms (`FavoriteButton.tsx`, `Badge.tsx`)

---

## React

### Components

```typescript
// Functional components only. Explicit return types for exported components.
function SearchInput({ value, onChange }: SearchInputProps): JSX.Element {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

// Props interface defined in the same file
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}
```

### Hooks

Custom hooks are prefixed with `use` and live in `src/hooks/` (e.g. `useDebouncedValue`). State access is done directly through the Zustand store (`useUserState`).

### State Management

All user state lives in the Zustand store in `src/user-state/`. Components never write to `localStorage` directly; they call store actions.

```typescript
import { useUserState } from '@/user-state';

const toggleFavorite = useUserState((s) => s.toggleFavorite);
```

There is no async state layer. There are no server queries. All reads are synchronous against in-memory data or the Zustand store.

---

## Styling

### Tailwind CSS v4 with Design Tokens

Design tokens (colors, spacing, fonts, radii) are defined once in the `@theme` block of `src/index.css`.

```tsx
function EntityCard() {
  return (
    <div className="rounded-card bg-card border-card p-md">
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
}
```

### Dark-First, Not Dark Mode

The app is **dark by default**. Do not write light-first styles with `dark:` variants. Use the semantic tokens (`background`, `surface`, `card`, `primary`, `text-...`) directly.

### Responsive

Layout is a single column, constrained to `max-w-screen-xl` in the app shell. Do not design multi-column desktop layouts.

---

## Data Patterns

### Accessing the Compendium

Use the public API in `src/compendium/`:

```typescript
import { getEntity, search } from '@/compendium';

const spell = getEntity('spell', 'fireball');
const results = search('fireball');
```

Never import `src/generated/` files outside `src/compendium/loader.ts`.

### User State

```typescript
// Always go through the store
const setBeginnerMode = useUserState((s) => s.setBeginnerMode);
setBeginnerMode(false);
```

Persisted shape changes require a **version bump and a migration** in `src/user-state/migrations.ts`. Never silently change the persisted shape.

---

## Performance

### Search

- Search is synchronous and in-memory. Do not introduce async or debounced network calls.
- The 200ms input debounce and result cap live in the search page; scoring lives in `src/compendium/search.ts`.

### Rendering

- Memoize derived data with `useMemo` where recomputation is measurable.
- Avoid re-rendering the whole list on every keystroke; keep search results computed from the query, not from state mutations.
- No virtual scrolling is used today; long category lists render plainly. Only add it if profiling shows it necessary.

---

## Code Organization

### File Structure

See [folder-structure.md](./folder-structure.md) for the canonical layout:

```
src/
├── app/           # Router, layout, shell
├── features/      # Pages by area (home, search, rules, combat, party, session, compendium, backup, auth, debug)
├── components/    # Shared UI (layout/, search/, entity/, content/, ui/)
├── compendium/    # Read-only Compendium API
├── user-state/    # Zustand store + persistence + migrations
├── sync/          # Cloud sync adapter (gateway, disabled/fake gateways, service)
├── adapter/       # External-source types boundary
├── generated/     # Build output (never hand-edited)
├── types/         # Domain types
├── config/        # Constants
├── lib/           # Utilities (incl. firebase/)
├── hooks/         # Custom hooks
└── assets/        # Static assets
```

### Imports

Import order: external libraries, then internal modules.

```typescript
import { useState } from 'react';

import { search } from '@/compendium';
import { useUserState } from '@/user-state';
```

Prefer path aliases (`@/...`) over deep relative imports where the project already uses them.

---

## Testing

### Test Scripts

The project runs script-based tests via `pnpm test` (16 suites covering compendium building, search, ids, identity, migrations, cloud sync, and utilities). Each script is registered in `package.json`.

### Writing Tests

- Tests are node scripts (no vitest/jsdom) that assert on generated data, compendium behavior, and pure functions.
- Pure logic (search scoring, slug/id generation, migrations) should be covered.
- Component rendering is not unit-tested today; keep logic extractable so it stays testable.

---

## Git

### Commit Messages

```
feat: add spell search functionality
fix: resolve search performance issue
docs: update architecture documentation
refactor: extract search service
test: add spell search tests
```

### Branch Naming

```
feature/spell-search
fix/search-performance
docs/architecture-update
```

---

## Review Checklist

Before merging:

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] All tests pass (`pnpm test`)
- [ ] ESLint shows no warnings (`pnpm lint`)
- [ ] No `console.log` statements
- [ ] No commented-out code
- [ ] Mobile-first, single-column layout
- [ ] Touch targets are 44x44px minimum
- [ ] Search works offline
- [ ] No network dependencies for core features
- [ ] No new Compendium data duplication
- [ ] No direct access to 5etools or generated data outside the allowed boundaries

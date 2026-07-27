# Coding Guidelines

## Overview

Development standards for Dungeon Archive. These guidelines ensure consistency, maintainability, and alignment with product principles.

---

## Core Principles

1. **Mobile-first** — All code must work on mobile devices
2. **Offline-first** — No network dependencies for core features
3. **Performance** — < 200ms search, < 1.5s initial load
4. **Simplicity** — Prefer simple solutions over clever ones
5. **Type safety** — TypeScript strict mode, no `any` types

---

## TypeScript

### Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Definitions

```typescript
// Prefer interfaces over types
interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
}

// Use type aliases for unions
type SpellSchool = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment';

// Use enums sparingly (prefer const objects)
const SpellSchool = {
  Abjuration: 'Abjuration',
  Conjuration: 'Conjuration',
} as const;
```

### Naming

- **PascalCase** for types, interfaces, classes
- **camelCase** for variables, functions, methods
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names

---

## React

### Components

```typescript
// Functional components only (no class components)
// Use explicit return type for exported components
function SearchBar({ onSearch }: SearchBarProps): JSX.Element {
  return (
    <div>
      <input onChange={(e) => onSearch(e.target.value)} />
    </div>
  );
}

// Props interface defined in same file
interface SearchBarProps {
  onSearch: (query: string) => void;
}
```

### Hooks

```typescript
// Custom hooks prefixed with 'use'
function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // ... implementation
  
  return { query, setQuery, results };
}
```

### State Management

```typescript
// Zustand for client state
const useAppStore = create<AppState>((set) => ({
  currentCampaignId: null,
  setCurrentCampaign: (id) => set({ currentCampaignId: id }),
}));

// TanStack Query for async state
function useSpells() {
  return useQuery({
    queryKey: ['spells'],
    queryFn: () => fetchSpells(),
  });
}
```

---

## Styling

### Tailwind CSS

```typescript
// Prefer Tailwind classes over custom CSS
function SearchResultCard({ result }: Props) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50">
      <h3 className="text-lg font-semibold">{result.name}</h3>
      <p className="text-sm text-gray-600">{result.description}</p>
    </div>
  );
}
```

### Responsive Design

```typescript
// Mobile-first responsive classes
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile: full width, Tablet: 640px, Desktop: 1024px */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
      </div>
    </div>
  );
}
```

### Dark Mode

```typescript
// Use Tailwind's dark mode
function Component() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Content */}
    </div>
  );
}
```

---

## Testing

### Unit Tests

```typescript
// Use Vitest for unit tests
import { describe, it, expect } from 'vitest';
import { formatSpellLevel } from './formatters';

describe('formatSpellLevel', () => {
  it('formats cantrip correctly', () => {
    expect(formatSpellLevel(0)).toBe('Cantrip');
  });

  it('formats spell level correctly', () => {
    expect(formatSpellLevel(3)).toBe('3rd Level');
  });
});
```

### Component Tests

```typescript
// Use React Testing Library
import { render, screen } from '@testing-library/react';
import { SpellCard } from './SpellCard';

it('renders spell name', () => {
  const spell = { id: '1', name: 'Fireball', level: 3 };
  render(<SpellCard spell={spell} />);
  expect(screen.getByText('Fireball')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
// Test search functionality
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchScreen } from './SearchScreen';

it('searches for spells', async () => {
  render(<SearchScreen />);
  fireEvent.change(screen.getByPlaceholderText('Search'), {
    target: { value: 'fireball' },
  });
  expect(await screen.findByText('Fireball')).toBeInTheDocument();
});
```

---

## Data Patterns

### IndexedDB (Dexie.js)

```typescript
// Define schema clearly
const db = new Dexie('DungeonArchive');
db.version(1).stores({
  spells: 'id, name, level, school',
  conditions: 'id, name',
  actions: 'id, name, type',
  equipment: 'id, name, type',
});

// Use typed queries
async function searchSpells(query: string): Promise<Spell[]> {
  return db.spells
    .where('name')
    .startsWithIgnoreCase(query)
    .toArray();
}
```

### Static JSON

```typescript
// Import compendium data
import spellsData from '../data/compendium/spells.json';

// Type-safe access
const spells: Spell[] = spellsData;
```

---

## Performance

### Lazy Loading

```typescript
// Lazy load non-critical components
const CharacterEditor = lazy(() => import('./CharacterEditor'));

// Use Suspense
<Suspense fallback={<Loading />}>
  <CharacterEditor />
</Suspense>
```

### Memoization

```typescript
// Memoize expensive calculations
const filteredSpells = useMemo(() => {
  return spells.filter(spell => spell.level <= maxLevel);
}, [spells, maxLevel]);

// Memoize callbacks
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query);
}, []);
```

### Virtual Scrolling

```typescript
// For long lists, use virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function SpellList({ spells }: { spells: Spell[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: spells.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      {/* Virtual list */}
    </div>
  );
}
```

---

## Code Organization

### File Structure

```
src/
├── components/     # Reusable UI
├── hooks/          # Custom React hooks
├── screens/        # Page components
├── services/       # Business logic
├── stores/         # State management
├── types/          # TypeScript types
└── utils/          # Utility functions
```

### Imports

```typescript
// Group imports: external, internal, types
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { SearchBar } from '../components/search/SearchBar';
import { useSearch } from '../hooks/useSearch';

import type { SearchResult } from '../types/search';
```

---

## Naming Conventions

### Files

- **Components:** `PascalCase.tsx` (e.g., `SearchBar.tsx`)
- **Hooks:** `camelCase.ts` (e.g., `useSearch.ts`)
- **Services:** `camelCase.ts` (e.g., `searchService.ts`)
- **Types:** `PascalCase.ts` (e.g., `SearchResult.ts`)
- **Utils:** `camelCase.ts` (e.g., `formatters.ts`)

### Variables

```typescript
// camelCase for variables and functions
const searchQuery = '';
const performSearch = () => {};

// PascalCase for components and types
function SearchBar() {}
interface SearchResult {}

// UPPER_SNAKE_CASE for constants
const MAX_SEARCH_RESULTS = 20;
```

### Feature Modules

```
src/
├── screens/
│   ├── Adventure/        # Adventure module (not Journal)
│   ├── Party/            # Party module (not Character)
│   ├── Search/           # Search module
│   └── Compendium/       # Compendium module
├── components/
│   ├── adventure/        # Adventure components
│   ├── party/            # Party components
│   ├── search/           # Search components
│   ├── compendium/       # Compendium components
│   └── reveal/           # Reveal System components
└── hooks/
    ├── useAdventure.ts   # Adventure hook
    ├── useParty.ts       # Party hook
    ├── useSearch.ts      # Search hook
    ├── useReveal.ts      # Reveal System hook
    └── useCompendium.ts  # Compendium hook
```

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

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] ESLint shows no warnings
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Mobile-first responsive design
- [ ] Touch targets are 44x44px minimum
- [ ] Search works offline
- [ ] No network dependencies for core features

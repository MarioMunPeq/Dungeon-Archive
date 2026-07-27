# Folder Structure

## Project Root

```
dungeon-archive/
├── public/                    # Static assets
│   ├── favicon.ico
│   └── manifest.json
├── src/                       # Application source code
├── scripts/                   # Build scripts
├── external/                  # External dependencies (read-only)
├── docs/                      # Architecture documentation
├── data/                      # Generated data
├── index.html                 # Entry HTML
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Dependencies and scripts
└── pnpm-lock.yaml             # Lock file
```

---

## Source Code Structure

```
src/
├── main.tsx                   # Application entry point
├── App.tsx                    # Root component
├── routes/                    # Route definitions
│   └── index.tsx
├── screens/                   # Page-level components
│   ├── Home/
│   │   └── HomeScreen.tsx
│   ├── Adventure/
│   │   ├── AdventureListScreen.tsx
│   │   ├── AdventureDetailScreen.tsx
│   │   └── SessionEditorScreen.tsx
│   ├── Search/
│   │   └── SearchScreen.tsx
│   ├── Party/
│   │   ├── CharacterListScreen.tsx
│   │   ├── CharacterDetailScreen.tsx
│   │   └── CharacterEditorScreen.tsx
│   ├── Compendium/
│   │   ├── SpellDetailScreen.tsx
│   │   ├── MonsterDetailScreen.tsx
│   │   ├── EquipmentDetailScreen.tsx
│   │   ├── ConditionDetailScreen.tsx
│   │   └── RulesDetailScreen.tsx
│   └── Settings/
│       └── SettingsScreen.tsx
├── components/                # Reusable UI components
│   ├── layout/
│   │   ├── TabBar.tsx
│   │   ├── Header.tsx
│   │   └── ScreenContainer.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchResultCard.tsx
│   ├── compendium/
│   │   ├── SpellCard.tsx
│   │   ├── MonsterCard.tsx
│   │   ├── EquipmentCard.tsx
│   │   └── ConditionCard.tsx
│   ├── adventure/
│   │   ├── SessionNoteCard.tsx
│   │   ├── NPCCard.tsx
│   │   └── LootCard.tsx
│   ├── party/
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterSheet.tsx
│   │   └── PartyRoster.tsx
│   ├── reveal/
│   │   ├── RevealToggle.tsx
│   │   ├── RevealGate.tsx
│   │   └── SpoilerBlur.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Loading.tsx
├── hooks/                     # Custom React hooks
│   ├── useSearch.ts
│   ├── useCampaign.ts
│   ├── useCharacter.ts
│   ├── useReveal.ts
│   └── useCompendium.ts
├── stores/                    # Zustand state stores
│   ├── appStore.ts
│   ├── campaignStore.ts
│   └── searchStore.ts
├── services/                  # Business logic services
│   ├── searchService.ts
│   ├── compendiumService.ts
│   ├── campaignService.ts
│   └── revealService.ts
├── db/                        # Database layer
│   ├── index.ts
│   ├── schema.ts
│   └── migrations/
├── utils/                     # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── types/                     # TypeScript type definitions
│   ├── index.ts
│   ├── compendium.ts
│   ├── campaign.ts
│   └── character.ts
└── styles/                    # Global styles
    └── globals.css
```

---

## Scripts Structure

```
scripts/
├── compendium/
│   ├── fetch-data.ts          # Read from 5etools
│   ├── transform-data.ts      # Normalize data structure
│   ├── generate-json.ts       # Output static JSON
│   ├── generate-index.ts      # Build search index
│   └── validate.ts            # Verify data integrity
├── build/
│   ├── build.ts               # Production build script
│   └── optimize.ts            # Asset optimization
└── utils/
    └── logger.ts              # Build logging utilities
```

---

## External Dependencies

```
external/
└── 5etools/                   # Read-only D&D 5e data source
    ├── data/
    │   ├── spells.json
    │   ├── monsters.json
    │   ├── equipment.json
    │   ├── conditions.json
    │   └── ...
    └── ...
```

**Important:** Never modify files in `external/`. This directory is read-only.

---

## Generated Data

```
data/
├── compendium/
│   ├── spells.json            # Processed spell data
│   ├── conditions.json        # Processed condition data
│   ├── actions.json           # Processed action data
│   ├── equipment.json         # Processed equipment data
│   └── index.json             # Search index
└── build/
    └── manifest.json          # Build metadata
```

---

## Documentation

```
docs/
├── architecture.md            # Technical architecture
├── product-philosophy.md      # Product principles and values
├── navigation.md              # Navigation patterns
├── search-architecture.md     # Search system design
├── compendium-architecture.md # Compendium system design
├── data-architecture.md       # Database schema and patterns
├── coding-guidelines.md       # Development standards
├── mobile-first.md            # Mobile-specific patterns
├── anti-features.md           # Excluded product categories
├── folder-structure.md        # This document
└── roadmap.md                 # Development phases
```

---

## Feature Modules

Feature modules are organized by product area:

### Compendium Module
```
src/
├── screens/Compendium/
├── components/compendium/
├── hooks/useCompendium.ts
├── services/compendiumService.ts
└── types/compendium.ts
```

### Adventure Module
```
src/
├── screens/Adventure/
├── components/adventure/
├── hooks/useAdventure.ts
├── services/adventureService.ts
└── types/adventure.ts
```

### Party Module
```
src/
├── screens/Party/
├── components/party/
├── hooks/useParty.ts
├── services/partyService.ts
└── types/party.ts
```

### Search Module
```
src/
├── screens/Search/
├── components/search/
├── hooks/useSearch.ts
├── services/searchService.ts
└── types/search.ts
```

### Reveal Module
```
src/
├── components/reveal/
├── hooks/useReveal.ts
├── services/revealService.ts
└── types/reveal.ts
```

---

## Naming Conventions

### Files
- **Components:** PascalCase (`SearchBar.tsx`)
- **Hooks:** camelCase (`useSearch.ts`)
- **Services:** camelCase (`searchService.ts`)
- **Types:** PascalCase (`SearchResult.ts`)
- **Utilities:** camelCase (`formatters.ts`)

### Directories
- **Screens:** PascalCase (`Search/`)
- **Components:** kebab-case (`search/`)
- **Hooks:** camelCase (`hooks/`)
- **Services:** camelCase (`services/`)
- **Types:** camelCase (`types/`)

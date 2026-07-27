# Compendium Architecture

## Overview

The compendium is the read-only reference system for D&D 5e official content. It is **immutable** — user-generated content never mixes with official data.

---

## Data Source

**5etools** is the source of truth for D&D 5e compendium data. It lives in `external/5etools/` as an immutable read-only dependency.

**Important:** 5etools data is never used directly at runtime. It is processed at build time into optimized static JSON.

---

## Build-Time Processing

### Pipeline

```
5etools/ (external dependency)
    ↓
scripts/compendium/
    ├── fetch-data.ts        # Read from 5etools
    ├── transform-data.ts    # Normalize data structure
    ├── generate-json.ts     # Output static JSON
    └── validate.ts          # Verify data integrity
    ↓
data/compendium/
    ├── spells.json
    ├── conditions.json
    ├── actions.json
    ├── equipment.json
    └── index.json
```

### Data Transformation

**5etools raw data → Normalized format:**

```typescript
interface CompendiumEntry {
  id: string;           // Unique identifier
  category: string;     // 'spell' | 'condition' | 'action' | 'equipment'
  name: string;         // Display name
  source: string;       // 'PHB', 'DMG', 'XGtE', etc.
  tags: string[];       // Searchable tags
  data: unknown;        // Category-specific data
  searchText: string;   // Pre-built search text (lowercase, normalized)
}
```

### Search Index Generation

During build, a search index is generated:
- Lowercase all text
- Tokenize names and descriptions
- Build prefix trees for fast lookup
- Generate fuzzy match data (for typo tolerance)

---

## MVP Categories

### 1. Spells

**Why first:** Most frequently looked up during sessions. Players and DMs both need quick access.

**Data structure:**
```typescript
interface Spell extends CompendiumEntry {
  category: 'spell';
  data: {
    level: number;           // 0 = cantrip
    school: string;          // 'Evocation', 'Illusion', etc.
    castingTime: string;     // '1 action', '1 bonus action', etc.
    range: string;           // 'Touch', '120 feet', etc.
    components: string[];    // ['V', 'S', 'M']
    duration: string;        // 'Instantaneous', '1 minute', etc.
    description: string;     // Full spell description
    higherLevels?: string;   // Scaling text
    classes: string[];       // Available classes
    ritual: boolean;
    concentration: boolean;
  };
}
```

**Display priority:**
- Name + level
- School + casting time
- Range + components
- Duration + concentration
- Description

---

### 2. Conditions

**Why second:** Frequently referenced during combat. Players often forget what conditions do.

**Data structure:**
```typescript
interface Condition extends CompendiumEntry {
  category: 'condition';
  data: {
    description: string;     // Full condition description
    effects: string[];       // Mechanical effects
    source: string;          // 'PHB', 'DMG', etc.
  };
}
```

**Common conditions to include:**
- Blinded
- Charmed
- Deafened
- Frightened
- Grappled
- Incapacitated
- Invisible
- Paralyzed
- Petrified
- Poisoned
- Prone
- Restrained
- Stunned
- Unconscious

---

### 3. Actions

**Why third:** Combat actions are frequently referenced. Helps new players understand options.

**Data structure:**
```typescript
interface Action extends CompendiumEntry {
  category: 'action';
  data: {
    description: string;     // Full action description
    type: string;            // 'action', 'bonus_action', 'reaction'
    combatOnly: boolean;     // Whether this is combat-specific
  };
}
```

**Common actions to include:**
- Attack
- Cast a Spell
- Dash
- Disengage
- Dodge
- Help
- Hide
- Ready
- Search
- Use an Object
- Improvised actions
- Grapple
- Shove

---

### 4. Equipment

**Why fourth:** Players frequently check equipment stats, prices, and properties.

**Data structure:**
```typescript
interface Equipment extends CompendiumEntry {
  category: 'equipment';
  data: {
    type: string;            // 'weapon', 'armor', 'adventuring gear', etc.
    cost?: string;           // '25 gp', '5 sp', etc.
    weight?: string;         // '1 lb', '10 lb', etc.
    properties?: string[];   // ['finesse', 'light', 'thrown']
    damage?: string;         // '1d6 slashing'
    damageType?: string;     // 'slashing', 'piercing', etc.
    ac?: number;             // Armor class bonus
    strength?: string;       // Strength requirement
    stealth?: string;        // 'Disadvantage' or null
    description: string;     // Full equipment description
  };
}
```

**Equipment types:**
- Simple weapons
- Martial weapons
- Light armor
- Medium armor
- Heavy armor
- Shields
- Adventuring gear
- Tools
- Mounts and vehicles

---

## Later Categories (Post-MVP)

### Monsters
**Status:** Delayed to later phase
**Why delayed:** Complex data structure, DM-only content, requires Reveal System
**DM-only by default:** Players should not see monster stats unless DM reveals them

### Races
**Status:** Future phase
**Data:** Racial traits, ability score improvements, languages

### Classes
**Status:** Future phase
**Data:** Class features, spell lists, proficiencies

### Feats
**Status:** Future phase
**Data:** Feat prerequisites, benefits, descriptions

### Magic Items
**Status:** Future phase
**Data:** Rarity, attunement, properties

### Rules
**Status:** Future phase
**Data:** Core rules, optional rules, variant rules

---

## IndexedDB Storage

### Dexie.js Schema

```typescript
interface DungeonArchiveDB {
  spells: Table<Spell>;
  conditions: Table<Condition>;
  actions: Table<Action>;
  equipment: Table<Equipment>;
  searchIndex: Table<SearchIndexEntry>;
}
```

### Data Loading

1. **Startup:** Load static JSON files into IndexedDB
2. **First run:** Full import from static JSON
3. **Subsequent runs:** Check version, update if needed
4. **Runtime:** Query IndexedDB via Dexie.js

### Query Patterns

```typescript
// Get all spells
const spells = await db.spells.toArray();

// Get spell by ID
const spell = await db.spells.get(id);

// Search spells by name
const results = await db.spells
  .where('name')
  .startsWithIgnoreCase(query)
  .toArray();

// Get all equipment of type
const weapons = await db.equipment
  .where('type')
  .equals('weapon')
  .toArray();
```

---

## Data Validation

### Build-Time Validation

During build, validate:
- All required fields present
- Data types correct
- No duplicate IDs
- Search text properly normalized
- Index integrity

### Runtime Validation

At application startup:
- Verify IndexedDB schema matches expected version
- Check data integrity
- Log warnings for missing data
- Graceful fallback for corrupted data

---

## Future Enhancements

- **Cloud sync:** Optional sync across devices
- **Custom entries:** User-created compendium entries (kept separate from official)
- **Community content:** Optional third-party content packs
- **Offline updates:** Background data updates when online

# Navigation Architecture

## Primary Navigation

The app uses a **4-tab bottom navigation bar** with one additional entry point (search) that doesn't occupy a tab slot.

### Tab Bar

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [Main content area — full screen]                  │
│                                                     │
├──────┬──────┬──────────────┬────────────────────────┤
│ 🏠   │ 🗺️  │    🔍       │  👥                     │
│ Home │Adventure│ Search    │  Party                  │
└──────┴──────┴──────────────┴────────────────────────┘
```

- **Home** — Dashboard, recent activity, quick access
- **Adventure** — Session journal, DM notes, session tracking
- **Search** — Global search with contextual results
- **Party** — Character management

### Search: Always Accessible

Search is not confined to a single tab. It's accessible from:

- **Tab bar** — Dedicated search entry point
- **Global search bar** — Persistent at the top of every screen (collapsible)
- **Contextual search** — Each section has its own search scope
- **Long-press on tab** — Quick search within that tab's context

Search always shows **heterogeneous results** — mixed types in relevance order, never grouped by category.

---

## Section Architecture

### Home

The landing screen. Shows:

- **Active campaign indicator** — Which campaign is live
- **Recent activity** — Last viewed spells, monsters, items
- **Quick actions** — Frequently used tools
- **Campaign status** — Current session state (if in session)

**One question answered:** "What's happening right now?"

---

### Adventure (Session Journal)

**Previously called: Journal**

The session tracking and DM preparation area. Two modes:

#### DM Mode
- Session notes
- Encounter tracker (non-combat logging)
- NPC roster
- Location map links
- Loot tracking

#### Player Mode
- Session summaries
- Personal notes
- Quest log

**One question answered:** "What happened last session?" or "What's prepared for tonight?"

---

### Search

The core interface of the application. Not a feature — the application itself.

#### Global Search
- Searches across all categories simultaneously
- Returns heterogeneous results (spells, monsters, equipment, conditions, actions — mixed)
- Results ordered by relevance, not type
- Instant results as user types (< 200ms)

#### Contextual Search
Each section provides its own search scope:

- **Home search** — Searches across everything
- **Adventure search** — Searches within current adventure notes and session data
- **Compendium search** — Searches official D&D content only
- **Party search** — Searches within party characters and notes

**One question answered:** "What am I looking for?"

---

### Party (Character Management)

**Previously called: Character**

Party and character management. Two sub-sections:

#### Characters
- Active character sheets
- Inventory tracking
- Spell slots / resources
- Notes and background

#### Party
- Party roster
- Shared resources
- Party notes
- Session attendance

#### NPCs (Independent)
NPCs are managed as a separate concept from characters:
- NPC roster (independent of party)
- NPC details and notes
- NPC relationships

**One question answered:** "What do I have?" or "Who's in the party?"

---

## Navigation Patterns

### One-Handed Navigation

All navigation is designed for one-handed thumb use:

- **Bottom tab bar** — Thumb-reachable zone
- **Back navigation** — Swipe from left edge OR back button in top-left
- **Scroll** — Single finger swipe
- **Pull-to-refresh** — Swipe down from top

### Search Navigation

- **Tap search bar** — Opens full search with keyboard
- **Type to search** — Results appear instantly
- **Tap result** — Opens entity detail
- **Back** — Returns to search results
- **Escape/Clear** — Returns to previous screen

### Modal Sheets

Used for quick actions and temporary states:
- Swipe up to open
- Swipe down or tap outside to dismiss
- Never blocks full screen

### Contextual Actions

- **Long-press** — Opens context menu for entity
- **Swipe left/right** — Quick actions on list items
- **Double-tap** — Quick favoriting (configurable)

---

## Information Architecture

```
Home
├── Active Campaign
├── Recent Activity
└── Quick Actions

Adventure
├── DM Mode
│   ├── Session Notes
│   ├── Encounter Tracker
│   ├── NPC Roster
│   └── Loot Log
└── Player Mode
    ├── Session Summaries
    ├── Personal Notes
    └── Quest Log

Search
├── Global Search (searches everything)
├── Contextual Search (section-specific)
└── Results (heterogeneous, relevance-ordered)

Party
├── Characters
│   ├── Active Character Sheets
│   ├── Inventory
│   └── Resources
├── Party
│   ├── Roster
│   ├── Shared Resources
│   └── Notes
└── NPCs (Independent)
    ├── NPC Roster
    └── NPC Details

Compendium (accessible via Search)
├── Spells
├── Conditions
├── Actions
├── Equipment
└── Rules
```

---

## Screen Inventory

### Global
- **Home** — Dashboard
- **Search** — Global search
- **Settings** — App configuration

### Adventure
- **Adventure List** — List of adventures
- **Adventure Detail** — Single adventure view
- **Session Editor** — Create/edit session notes
- **NPC List** — List of NPCs
- **NPC Editor** — Create/edit NPC

### Party
- **Character List** — List of party characters
- **Character Sheet** — Full character view
- **Character Editor** — Create/edit character
- **Party View** — Party overview
- **Inventory View** — Character inventory

### Compendium (via Search)
- **Spell Detail** — Full spell view
- **Monster Detail** — Full monster view (DM only)
- **Equipment Detail** — Full equipment view
- **Condition Detail** — Full condition view
- **Rules Detail** — Full rules view

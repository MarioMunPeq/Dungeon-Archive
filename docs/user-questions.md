# User Questions

## Purpose

Dungeon Archive answers questions. Every feature exists to respond to something a player or DM asks during a session. This document catalogs those questions.

When implementing a feature, always ask: **"What question does this feature answer?"**

Never: "What CRUD does this implement?"

---

## Player Questions

### Compendium

- What does this spell do?
- How long does this spell last?
- What is the range of this spell?
- Does this spell require concentration?
- What components does this spell need?
- Can I cast this spell as a bonus action?
- What classes can cast this spell?
- What happens at higher levels?
- Is this spell a ritual?
- What does this condition do?
- What am I unable to do while affected?
- How does this condition end?
- What actions can I take?
- What does the Help action do?
- How does grappling work?
- What is the Dodge action?
- What does this item do?
- What properties does this weapon have?
- What is the damage of this weapon?
- Do I have proficiency with this?
- What armor class does this armor provide?

### Rules

- How does the d20 work?
- What is an ability check? Which ability applies?
- How do saving throws work?
- What can I do on my turn in combat?
- How do attacks and damage work? What is a critical hit?
- How do hit points and rests work?

These are answered by Quick Rules (with Beginner Mode toggled on for newcomers) and the built-in glossary.

### Own Reference Sheet (Party)

- What spells do I know?
- What am I carrying / wearing (as references)?
- What is my passive Perception?
- What is my level and class?
- What is my AC? My spell save DC?

These are answered from the player's own lightweight reference sheet — never from a full character sheet (see [anti-features.md](./anti-features.md)).

### Combat

- How much HP do I have left? (hit points with quick +/- deltas)
- What conditions am I under? (condition tray)
- What can I do on my turn? (Action / Bonus Action / Movement / Reaction checklist)

---

## DM Questions

### Compendium

- What does this monster's ability do?
- What is this monster's CR?
- What spells does this monster have?
- What does this magic item do?

### Sessions

- What did I pin for this encounter? (session list)
- Is my session empty? (empty state points back to Search)

### Party

- What does each player character have (spells, items, passive senses)?
- Who is the active player right now? (combat/party selector)

---

## Session Flow Questions

### Before Session

- What do we need at hand tonight? (build the session by pinning entities in advance)

### During Session

- What does this spell do? (most common)
- What is this condition?
- How much damage does this deal?
- What is the range of this attack?
- Can I do this?
- What did I pin for this encounter?
- Whose HP is where? (combat tab, per player)

### After Session

- Clear the session for next time? (End Session)

---

## Question Categories

### Reference Questions (Compendium)

"What does the rules say about X?"

Answered by the Compendium: spells, conditions, actions, equipment, monsters, magic items, feats.

### Context Questions (Party + Session)

"What is going on in our game?"

Answered by the party's reference sheets and the session's pinned entities.

### Lookup Questions (Search)

"Where is that thing I need?"

Answered by Search: finding any entity across all categories.

---

## Explicitly Not Answered

These questions are deliberately out of scope:

- "What encounters should I plan?" — no encounter builder.
- "What does the NPC know?" — no NPC roster.
- "Who owns this loot?" — no loot system.
- "What is the history of this world?" — no worldbuilding.
- "How many spell slots do I have left?" — no full character sheet.
- "Whose turn is it / what's the initiative order?" — no initiative tracker.

These are answered by other tools or by the table itself (see [anti-features.md](./anti-features.md)).

---

## Design Implication

Every screen must answer at least one of these questions. If a screen doesn't answer a question, it doesn't exist.

If a feature doesn't help answer these questions, it doesn't belong in Dungeon Archive.

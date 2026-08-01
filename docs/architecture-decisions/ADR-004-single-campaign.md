# ADR-004: Single Active Adventure

## Status

Accepted

## Context

Dungeon Archive stores lightweight campaign context. The question is whether to support multiple simultaneous campaigns or a single active one.

Multiple simultaneous campaigns add complexity:
- Campaign switching UI
- Cross-campaign data isolation
- Increased storage requirements
- Confusing UX for the primary use case

The product is a reference companion, not a campaign manager. The campaign container ("adventure") exists to give context — title, objectives, notes, pinned references — not to administer multiple campaigns.

## Decision

One active adventure at a time. Previous adventures are archived and can be restored.

- No "campaign selector" in the UI
- Archive the current adventure, then create or restore another
- Archived adventures remain accessible; `restoreAdventure` makes one active again
- No multi-campaign abstractions

## Consequences

**Positive:**
- Simpler UI (no campaign switching)
- Clear data model (one active, rest archived)
- Reduced cognitive load
- Matches the product's lightweight-context role

**Negative:**
- DMs running several campaigns must switch the active adventure
- No cross-adventure data sharing

**Mitigation:**
- Switching is fast (archive → create, or archive → restore)
- Cross-campaign sharing is not the product's purpose; user state stays small

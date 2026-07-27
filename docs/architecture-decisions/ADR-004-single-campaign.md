# ADR-004: Single Active Campaign

## Status

Accepted

## Context

Dungeon Archive manages campaign data. The question is whether to support multiple simultaneous campaigns or a single active campaign.

Multiple campaigns add complexity:
- Campaign switching UI
- Cross-campaign data isolation
- Increased storage requirements
- Confusing UX for the primary use case

## Decision

One active campaign at a time. Previous campaigns are archived (read-only).

- No "campaign selector" in the UI
- Archive current campaign → start new one
- Archived campaigns are accessible but not editable
- No multi-campaign abstractions

## Consequences

**Positive:**
- Simpler UI (no campaign switching)
- Clear data model (one active, rest archived)
- Reduced cognitive load
- Matches typical usage pattern

**Negative:**
- DMs running multiple campaigns must switch between them
- No cross-campaign data sharing
- Archive management requires future work

**Mitigation:**
- Campaign switching is fast (archive → create)
- Cross-campaign sharing is not a common use case
- Archive viewing is a read-only operation

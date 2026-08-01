# ADR-001: React 19 as Baseline

## Status

Accepted

## Context

Dungeon Archive is a client-side SPA (no server rendering). The UI framework is React. The question is which version to target as the minimum baseline.

## Decision

React 19 is the baseline (currently `^19.2.7`). No downgrading. No compatibility shims for React 18.

If any dependency is incompatible with React 19, the dependency is replaced — not React.

## Consequences

**Positive:**
- Access to current React features and performance improvements
- Consistent with the modern ecosystem
- Future-proof for ecosystem evolution

**Negative:**
- Some libraries may lag React 19 support
- Requires monitoring dependency compatibility

**Mitigation:**
- Check dependency compatibility before installation
- Replace incompatible dependencies, never downgrade React

# ADR-001: React 19 as Baseline

## Status

Accepted

## Context

Dungeon Archive needs a UI framework. React is the chosen framework. The question is which version to target as the minimum baseline.

React 19 introduces significant improvements: Server Components, Actions, `use()` hook, and improved ref handling. However, the project is a client-side SPA without server rendering.

## Decision

React 19 is the minimum baseline. No downgrading. No compatibility shims for React 18.

If any dependency is incompatible with React 19, the dependency is replaced — not React.

## Consequences

**Positive:**
- Access to latest React features and performance improvements
- Future-proof for ecosystem evolution
- Consistent with modern React patterns

**Negative:**
- Some libraries may not yet support React 19
- Requires monitoring dependency compatibility

**Mitigation:**
- Check dependency compatibility before installation
- Replace incompatible dependencies, never downgrade React

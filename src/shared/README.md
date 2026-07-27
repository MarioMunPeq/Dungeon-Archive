# Shared Primitives

Reusable UI primitives and common types. No business logic. No features. No application services.

## What Belongs Here

- Reusable UI primitives (not shadcn components)
- Common type definitions shared across features
- Shared constants

## What Does NOT Belong Here

- Feature-specific components
- Business logic
- Application state
- Services or API calls
- Anything that depends on a specific feature

## Import Boundary

Shared primitives can be imported by any feature. Features cannot import from each other.

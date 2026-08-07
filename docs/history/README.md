# Documentation History

This folder contains point-in-time records of completed work. The files here describe **what happened** during a specific period of the project's life, not the current product. They are preserved for context and future maintenance; they are not maintained alongside the code.

## Audit and Incident Reports

| File | What it records |
|------|-----------------|
| `architecture-review-iteration3.md` | Architecture and documentation review of the earlier product model |
| `design-consistency-pass.md` | Visual-consistency pass (radius tiers, motion, metadata hierarchy) |
| `product-cohesion-report.md` | Product-cohesion pass (terminology, dialog patterns, page rhythm) |
| `product-final-polish-report.md` | Verification-driven polish pass across twelve UI areas |
| `boot-hang-report.md` | Root-cause investigation of a stale-shell boot failure |
| `layout-root-cause-report.md` | Root-cause of a layout regression caused by shadowed theme tokens |
| `performance-pass.md` | Native-performance pass: list virtualization, render audit, Zustand selectors |

## The Redesign Campaign

`redesign/` is the design specification series written to guide a major UI overhaul. It includes the product vision, a design-system specification in 23 chapters, a pre-refactor baseline, and the working protocol that governed the effort.

The overhaul shipped (see the `Visual Overhaul 0.x` commit series), and the current design is documented in the living docs at the top of `docs/`:

- [../design-principles.md](../design-principles.md)
- [../mobile-first.md](../mobile-first.md)
- [../navigation.md](../navigation.md)

The `redesign/` chapters remain useful as the reasoning behind the design system, but they describe the campaign, not the finished product. Treat them as historical record.

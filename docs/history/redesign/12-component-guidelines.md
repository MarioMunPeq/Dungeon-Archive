# 12 — Component Architecture

## Purpose

Components are the building blocks of Dungeon Archive.

Every screen in the application is composed from reusable components.

The purpose of the Component Architecture is to ensure that every component has a clear responsibility, predictable behaviour and well-defined place within the Design System.

The application should evolve by composing existing components rather than creating new ones.

Whenever possible, complexity should emerge from composition rather than inheritance.

---

# Design Rationale

Large front-end applications rarely become difficult because individual components are complex.

They become difficult because there are too many components that solve the same problem.

Component Architecture exists to eliminate duplication.

It creates a shared visual language.

It reduces implementation decisions.

It lowers maintenance costs.

It increases consistency.

Every new component increases the complexity of the Design System.

Therefore, creating a component is considered a significant design decision rather than a convenience.

---

# Component Philosophy

Every component must answer three questions.

What responsibility does it have?

Why does it exist?

Why can't an existing component solve the same problem?

If these questions cannot be answered clearly,

the component probably should not exist.

---

# The Component Pyramid

The entire application should be organized into five architectural layers.

```
Pages
│
Feature Components
│
Composite Components
│
Primitive Components
│
Foundation Components
```

Dependencies always point downward.

Lower layers never depend on higher ones.

---

# Foundation Components

Foundation Components are the smallest reusable visual primitives.

They contain almost no business logic.

Examples include:

Button

Surface

Typography

Icon

Divider

Spinner

Skeleton

Stack

Inline

Grid

Container

Spacer

ScrollArea

These components define visual language.

Nothing else.

---

# Primitive Components

Primitive Components combine Foundation Components into reusable interface elements.

Examples include:

Card

Badge

Chip

Avatar

Input

TextField

SearchField

Select

Checkbox

Radio

Switch

Tabs

Progress

Toast

Snackbar

Dialog

BottomSheet

Primitive Components remain generic.

They should never know anything about Dungeons & Dragons.

---

# Composite Components

Composite Components understand product concepts.

Examples include:

EntityCard

SpellCard

MonsterCard

MetadataGrid

SearchResult

SectionHeader

EntityHeader

StatBlock

QuickActionBar

PropertyList

EntityPreview

Composite Components compose Primitive Components.

They should not duplicate behaviour already solved elsewhere.

---

# Feature Components

Feature Components belong to a specific feature module.

Examples:

PartySidebar

CharacterEquipment

SpellPreparation

CloudBackupCard

CampaignOverview

SearchSuggestions

They understand business rules.

They may use stores.

They may fetch data.

They may coordinate workflows.

However,

they should still reuse lower-level UI components.

---

# Pages

Pages orchestrate everything.

Pages should contain almost no visual implementation.

Their responsibility is:

Routing.

State coordination.

Composition.

Nothing else.

A page should feel like an arrangement of existing building blocks.

---

# Responsibility Rules

Each component should have exactly one primary responsibility.

Examples:

Button

Handles interaction.

Not layout.

Card

Groups related information.

Not navigation.

SearchField

Captures queries.

Not search results.

SectionHeader

Introduces content.

Not the content itself.

If a component performs multiple unrelated responsibilities,

split it.

---

# Composition Over Configuration

Prefer composing simple components.

Avoid creating components with dozens of optional props.

Example.

Good:

```
<Card>
    <SectionHeader />
    <MetadataGrid />
</Card>
```

Poor:

```
<Card
    compact
    outlined
    elevated
    rounded
    bordered
    condensed
    shadow="lg"
    variant="secondary"
    ...
/>
```

Simple composition scales better than endless configuration.

---

# API Design

Component APIs should be predictable.

Property names should remain consistent.

Prefer:

variant

size

disabled

selected

loading

children

Avoid:

isPrimary

big

blue

customPadding

visualMode

magicNumber

APIs should describe behaviour,

not appearance.

---

# Styling Rules

Visual styling belongs inside components.

Pages should never override component appearance.

Avoid:

Inline styles.

Arbitrary utility classes.

One-off variants.

Visual hacks.

Every improvement should strengthen the Design System.

Not bypass it.

---

# State Ownership

Components should own only the state they truly require.

Temporary UI state:

Inside the component.

Application state:

Feature layer.

Global state:

Dedicated stores.

Avoid unnecessary prop drilling.

Avoid unnecessary global state.

Ownership should remain obvious.

---

# Folder Organization

Organize components by architectural responsibility.

Never by size.

Example:

```
components/

    foundation/

    primitives/

    composite/

features/

    search/

    party/

    compendium/

        components/

        hooks/

        pages/

```

The folder structure should explain the architecture without documentation.

---

# Naming Rules

Names describe purpose.

Never appearance.

Good:

EntityCard

MetadataRow

SearchField

QuickActions

Bad:

RoundedCard

BlueButton

LargeContainer

SmallList

Appearance changes.

Responsibilities remain.

---

# Reuse Decision Tree

Before creating a new component:

Can an existing component solve this?

↓

Yes

Reuse it.

↓

No

Can an existing component be extended?

↓

Yes

Extend it.

↓

No

Can two existing components be composed?

↓

Yes

Compose them.

↓

No

Create a new component.

Creating a component is always the final option.

---

# Refactoring Rules

Whenever duplicated UI appears:

Extract.

Rename.

Merge.

Delete.

Never leave duplicated implementations because "they already work."

The redesign exists to reduce technical debt.

---

# Component Lifecycle

Every component should pass through four stages.

Creation

↓

Adoption

↓

Stabilization

↓

Simplification

The final stage of a mature component is simplicity.

Not feature accumulation.

---

# Performance

Components should render only what is necessary.

Avoid unnecessary rerenders.

Avoid unnecessary effects.

Avoid expensive computations inside render functions.

Performance improvements should never compromise readability.

Readable code remains the priority.

---

# Accessibility

Every interactive component must support:

Keyboard navigation (where applicable).

Screen readers.

Focus states.

Touch accessibility.

Disabled states.

Loading states.

Accessibility belongs inside the component,

not inside pages.

---

# Documentation

Every reusable component should document:

Purpose.

Responsibilities.

Supported variants.

Composition examples.

Accessibility considerations.

Components should become easier to reuse over time.

---

# Good Example

```
<Page>

    <PageHeader />

    <SearchField />

    <SectionHeader />

    <EntityCard />

    <BottomNavigation />

</Page>
```

Every responsibility is obvious.

Every element belongs to the Design System.

---

# Bad Example

```
<div className="rounded-xl bg-zinc-900 p-[17px]">

    <h2 className="...">

        ...

```

Arbitrary styling.

Unknown hierarchy.

No reusable architecture.

Impossible to maintain consistently.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Merge visually identical components.

• Delete obsolete components.

• Extract duplicated layouts.

• Standardize component APIs.

• Replace page-specific styling with shared primitives.

• Flatten unnecessary abstractions.

• Remove dead variants.

• Consolidate folder structure.

• Prefer composition over inheritance.

• Improve readability even if it requires large refactors.

When uncertain,

prefer fewer components with clearer responsibilities.

Never increase the total number of components unless doing so significantly improves architecture.

---

# Anti-patterns

The following are explicitly forbidden:

• God Components.

• Components with multiple unrelated responsibilities.

• Page-specific visual components.

• Copy-pasted UI.

• Deep inheritance hierarchies.

• Variant explosions.

• Inline visual constants.

• Feature logic inside Foundation Components.

• Business logic inside Primitive Components.

• Styling implemented directly in Pages.

• Components created "just in case."

---

# Acceptance Criteria

The Component Architecture is considered complete only if:

- [ ] Every component belongs to exactly one architectural layer.
- [ ] Responsibilities are clear and singular.
- [ ] Pages compose existing components rather than implementing UI.
- [ ] Duplicate components have been eliminated.
- [ ] Component APIs remain small and predictable.
- [ ] Business logic is isolated from presentation.
- [ ] Folder structure reflects architectural responsibility.
- [ ] Composition is preferred over configuration.
- [ ] The Design System becomes easier to extend over time.
- [ ] Future features can be built primarily by reusing existing components rather than inventing new ones.

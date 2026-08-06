# 15 — Home Workspace

## Purpose

The Home Workspace is the operational center of Dungeon Archive.

It is not a landing page.

It is not a dashboard.

It is not a marketing screen.

It is the place users return to between every task.

The Home Workspace should immediately answer one question:

"What do I need right now?"

Every element that does not contribute to answering this question should be removed.

---

# Design Rationale

Dungeon Archive is opened repeatedly during a tabletop session.

Users rarely stay on the Home screen for long.

Instead, they use it as an orientation point between actions.

The Home Workspace therefore exists to:

Restore context.

Provide quick access.

Expose current progress.

Reduce navigation.

The Home Workspace should feel like returning to a familiar desk.

Everything is exactly where users expect it to be.

---

# Product Philosophy

Opening Dungeon Archive should feel like sitting down behind the Dungeon Master's screen.

Everything important is already visible.

Nothing asks for attention unnecessarily.

Nothing feels promotional.

Nothing competes for focus.

The application quietly waits until needed.

---

# Core Principles

The Home Workspace should be:

Useful.

Calm.

Dense.

Immediate.

Predictable.

Professional.

Every block should solve a problem.

No block should exist because "dashboards usually have one."

---

# Information Priority

Content should appear in the following order.

1.

Current Character

↓

2.

Current Party

↓

3.

Continue Working

↓

4.

Quick Search

↓

5.

Recent Entities

↓

6.

Categories

↓

7.

Cloud Backup Status

Everything else is secondary.

---

# Above the Fold

The first visible screen should expose the majority of the user's workflow.

Without scrolling,

users should immediately see:

Their current character.

Party summary.

Quick Search.

Continue where they left off.

The first screen should feel complete.

---

# Character Section

The Character Card is the most important element on the Home Workspace.

It should immediately communicate:

Character Name.

Class.

Level.

Hit Points.

Armor Class.

Current status.

Opening the application should instantly reconnect the user with their character.

---

# Party Section

Immediately below the Character appears the current Party.

The Party should expose:

Portrait.

Name.

Level.

Health status.

Quick access.

The Party exists for recognition.

Not management.

Management belongs inside the Party feature.

---

# Continue Working

Dungeon Archive should remember context.

If the user recently viewed:

Fireball

The Home Workspace should offer:

Continue reading Fireball.

If the user was editing a character,

offer:

Continue editing.

The application should feel persistent.

---

# Quick Search

Search should remain permanently visible.

The Search Field should appear naturally inside the Home Workspace.

Searching should require exactly one interaction.

Users should never need to "go to Search."

Home already contains Search.

---

# Recent Entities

Recently viewed entities reduce repeated searching.

Display only a small number.

The objective is recognition,

not history management.

Recent items should naturally expire.

No manual cleanup should be required.

---

# Categories

Categories provide browsing,

not navigation.

Categories exist for discovery.

Not for users who already know what they need.

Categories should therefore appear below Search.

Never above it.

---

# Cloud Backup

Cloud Backup communicates trust.

Not functionality.

Its purpose is reassuring users that their information is safe.

The component should remain visually quiet.

Only attract attention when intervention is required.

Healthy systems should almost disappear.

---

# Visual Hierarchy

The eye should naturally travel:

Character

↓

Party

↓

Search

↓

Continue

↓

Recent

↓

Categories

↓

Everything else

The Home Workspace should never require users to wonder where to look first.

---

# Density

The Home Workspace should expose meaningful information.

Not decorative information.

Large banners are forbidden.

Hero sections are forbidden.

Illustrations are forbidden.

Welcome messages are forbidden.

The first screen should solve problems immediately.

---

# Scroll Behaviour

Scrolling should reveal additional utilities.

Not primary functionality.

Critical actions belong above the fold.

Supporting tools belong below.

The user should never scroll just to begin using the application.

---

# Empty State

A brand-new installation should still feel useful.

When no character exists:

Guide users toward creating one.

When no Party exists:

Offer creating or importing one.

When no Recent Entities exist:

Suggest exploring categories.

The Home Workspace should never appear unfinished.

---

# Future Scalability

Future modules may integrate naturally.

Campaigns.

Notes.

Maps.

NPCs.

Initiative.

However,

they should respect the established information hierarchy.

The Home Workspace should become richer,

not busier.

---

# Decision Tree — New Home Modules

Before adding anything to the Home Workspace ask:

Will users interact with this almost every session?

↓

YES

↓

Consider Home.

↓

NO

↓

Keep it inside its feature.

Home should remain intentionally selective.

---

# Good Example

```
Current Character

──────────────

Current Party

──────────────

Search

──────────────

Continue Reading

──────────────

Recent Entities

──────────────

Categories

──────────────

Cloud Backup
```

Every section contributes directly to gameplay.

---

# Bad Example

```
Welcome!

──────────────

Statistics

──────────────

Large Illustration

──────────────

Version News

──────────────

Tips

──────────────

Character
```

The user must work through irrelevant content before reaching useful information.

---

# Implementation Notes for Autonomous Agents

During the redesign:

• Remove every decorative element.

• Prioritize gameplay over presentation.

• Reduce vertical scrolling.

• Keep Search permanently accessible.

• Ensure Character and Party dominate the first screen.

• Minimize visual competition.

• Reuse existing Design System components.

• Avoid introducing Home-specific UI components unless absolutely necessary.

When uncertain,

remove content rather than adding more.

The Home Workspace should become smaller,

clearer,

and more useful.

---

# Anti-patterns

The following are explicitly forbidden:

• Hero banners.

• Welcome messages.

• Marketing sections.

• Feature announcements.

• Decorative illustrations.

• Empty whitespace.

• Statistics without actionable value.

• Large promotional cards.

• Multiple competing focal points.

• Content that users see every day but rarely use.

---

# Acceptance Criteria

The Home Workspace is considered complete only if:

- [ ] Users understand the application within three seconds.
- [ ] Current Character dominates the experience.
- [ ] Party is immediately accessible.
- [ ] Search is always one interaction away.
- [ ] Continue Working restores previous context.
- [ ] Recent Entities reduce repeated searching.
- [ ] Categories remain secondary to Search.
- [ ] Cloud Backup communicates trust without creating distraction.
- [ ] Above-the-fold content contains the majority of daily workflows.
- [ ] The Home Workspace feels like the operational center of the application rather than a traditional homepage.

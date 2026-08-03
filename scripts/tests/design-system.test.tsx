import * as React from "react";
import { ok } from "node:assert";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
// Make React available globally for JSX transform in imported components
(globalThis as Record<string, unknown>).React = React;

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  \u2713 ${description}`);
  } catch (e) {
    console.error(`  \u2717 ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// Surface
// ---------------------------------------------------------------------------

console.log("Surface\n");

import { Surface } from "../../src/components/ui/Surface";

test("renders default variant with correct classes", () => {
  const html = renderToString(createElement(Surface, null, "content"));
  ok(html.includes("rounded-lg"));
  ok(html.includes("border-border"));
  ok(html.includes("bg-background"));
  ok(html.includes("p-3"));
  ok(html.includes("content"));
});

test("renders outlined variant", () => {
  const html = renderToString(createElement(Surface, { variant: "outlined" }, "content"));
  ok(html.includes("rounded-lg"));
  ok(html.includes("border-border"));
  ok(!html.includes("bg-background"));
});

test("renders subtle variant", () => {
  const html = renderToString(createElement(Surface, { variant: "subtle" }, "content"));
  ok(html.includes("bg-muted/30"));
});

test("renders interactive variant", () => {
  const html = renderToString(createElement(Surface, { variant: "interactive" }, "content"));
  ok(html.includes("hover:bg-accent"));
  ok(html.includes("active:bg-accent/80"));
});

test("renders with custom className", () => {
  const html = renderToString(createElement(Surface, { className: "custom-class" }, "content"));
  ok(html.includes("custom-class"));
});

test("renders with custom element type", () => {
  const html = renderToString(createElement(Surface, { as: "article" }, "content"));
  ok(html.includes("<article"));
  ok(html.includes("</article"));
});

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

console.log("\nBadge\n");

import { Badge } from "../../src/components/ui/Badge";

test("renders with correct base classes", () => {
  const html = renderToString(createElement(Badge, null, "label"));
  ok(html.includes("rounded-full"));
  ok(html.includes("border"));
  ok(html.includes("px-2"));
  ok(html.includes("py-1"));
  ok(html.includes("label"));
});

test("renders accent variant", () => {
  const html = renderToString(createElement(Badge, { variant: "accent" }, "accent"));
  ok(html.includes("bg-accent/50"));
});

test("renders outline variant", () => {
  const html = renderToString(createElement(Badge, { variant: "outline" }, "outline"));
  ok(html.includes("text-muted-foreground"));
  ok(html.includes("border-border"));
});

test("renders subtle variant", () => {
  const html = renderToString(createElement(Badge, { variant: "subtle" }, "subtle"));
  ok(html.includes("bg-muted"));
});

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

console.log("\nSection\n");

import { Section } from "../../src/components/ui/Section";

test("renders title and children", () => {
  const html = renderToString(
    createElement(Section, { title: "My Title" }, createElement("p", null, "body")),
  );
  ok(html.includes("My Title"));
  ok(html.includes("body"));
  ok(html.includes("text-xs font-semibold uppercase tracking-wide text-muted-foreground"));
});

test("renders optional subtitle", () => {
  const html = renderToString(createElement(Section, { title: "T", subtitle: "sub" }, "c"));
  ok(html.includes("sub"));
});

test("renders without subtitle", () => {
  const html = renderToString(createElement(Section, { title: "T" }, "c"));
  ok(!html.includes("undefined"));
});

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

console.log("\nStack\n");

import { Stack } from "../../src/components/ui/Stack";

test("renders with default gap (md)", () => {
  const html = renderToString(
    createElement(Stack, null, createElement("p", null, "a"), createElement("p", null, "b")),
  );
  ok(html.includes("space-y-4"));
});

test("renders with specific gap", () => {
  const html = renderToString(createElement(Stack, { gap: "lg" }, createElement("p", null, "a")));
  ok(html.includes("space-y-6"));
});

test("renders as custom element", () => {
  const html = renderToString(createElement(Stack, { as: "article" }, "content"));
  ok(html.includes("<article"));
  ok(html.includes("</article"));
});

// ---------------------------------------------------------------------------
// Inline
// ---------------------------------------------------------------------------

console.log("\nInline\n");

import { Inline } from "../../src/components/ui/Inline";

test("renders with default props", () => {
  const html = renderToString(
    createElement(Inline, null, createElement("span", null, "a"), createElement("span", null, "b")),
  );
  ok(html.includes("flex"));
  ok(html.includes("gap-2"));
  ok(html.includes("items-center"));
  ok(html.includes("flex-wrap"));
});

test("renders without wrapping", () => {
  const html = renderToString(createElement(Inline, { wrap: false }, "content"));
  ok(!html.includes("flex-wrap"));
});

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

console.log("\nTypography\n");

import { Title, Subtitle, Heading, Body, Caption } from "../../src/components/ui/Typography";

test("Title renders as h1 with text-2xl font-bold", () => {
  const html = renderToString(createElement(Title, null, "Big"));
  ok(html.includes("<h1"));
  ok(html.includes("text-2xl font-bold"));
});

test("Subtitle renders as p with text-sm text-muted-foreground", () => {
  const html = renderToString(createElement(Subtitle, null, "sub"));
  ok(html.includes("<p"));
  ok(html.includes("text-sm text-muted-foreground"));
});

test("Heading renders as h3 with uppercase", () => {
  const html = renderToString(createElement(Heading, null, "Section"));
  ok(html.includes("<h3"));
  ok(html.includes("uppercase"));
});

test("Body renders as p with text-sm", () => {
  const html = renderToString(createElement(Body, null, "text"));
  ok(html.includes("<p"));
  ok(html.includes("text-sm text-foreground"));
});

test("Caption renders as span with text-xs", () => {
  const html = renderToString(createElement(Caption, null, "note"));
  ok(html.includes("<span"));
  ok(html.includes("text-xs"));
});

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

console.log("\nIcon\n");

import { Icon } from "../../src/components/ui/Icon";
import { ChevronRightIcon, CloseIcon } from "../../src/components/ui/icons";

test("renders a decorative svg by default", () => {
  const html = renderToString(createElement(Icon, null, createElement("path", null)));
  ok(html.includes("<svg"));
  ok(html.includes('viewBox="0 0 24 24"'));
  ok(html.includes('aria-hidden="true"'));
  ok(html.includes("h-4 w-4"));
});

test("renders an accessible svg when labelled", () => {
  const html = renderToString(
    createElement(Icon, { label: "Close", children: createElement("line", null) }),
  );
  ok(html.includes('role="img"'));
  ok(html.includes("<title>Close</title>"));
  ok(!html.includes('aria-hidden="true"'));
});

test("renders size variants", () => {
  const xs = renderToString(
    createElement(Icon, { size: "xs", children: createElement("path", null) }),
  );
  const lg = renderToString(
    createElement(Icon, { size: "lg", children: createElement("path", null) }),
  );
  ok(xs.includes("h-3 w-3"));
  ok(lg.includes("h-6 w-6"));
});

test("renders with custom className", () => {
  const html = renderToString(
    createElement(Icon, {
      className: "text-destructive",
      children: createElement("path", null),
    }),
  );
  ok(html.includes("text-destructive"));
});

test("ChevronRightIcon renders a chevron path", () => {
  const html = renderToString(createElement(ChevronRightIcon, null));
  ok(html.includes("m9 18 6-6-6-6"));
});

test("CloseIcon renders close lines", () => {
  const html = renderToString(createElement(CloseIcon, null));
  ok(html.includes("<line"));
});

// ---------------------------------------------------------------------------
// EntityIdentity
// ---------------------------------------------------------------------------

console.log("\nEntityIdentity\n");

import { EntityIdentity } from "../../src/components/entity/entity-identity";

test("renders category badge and name", () => {
  const html = renderToString(
    createElement(EntityIdentity, { category: "spell", name: "Fireball" }, null),
  );
  ok(html.includes("Spell"));
  ok(html.includes("Fireball"));
});

test("renders subtitle when provided", () => {
  const html = renderToString(
    createElement(EntityIdentity, { category: "monster", name: "Dragon", subtitle: "Large" }, null),
  );
  ok(html.includes("Dragon"));
  ok(html.includes("Large"));
});

test("hides badge when showBadge is false", () => {
  const html = renderToString(
    createElement(EntityIdentity, { category: "spell", name: "Fireball", showBadge: false }, null),
  );
  ok(!html.includes("Spell"));
  ok(html.includes("Fireball"));
});

test("omits subtitle when not provided", () => {
  const html = renderToString(
    createElement(EntityIdentity, { category: "feat", name: "Sharpshooter" }, null),
  );
  ok(!html.includes("undefined"));
});

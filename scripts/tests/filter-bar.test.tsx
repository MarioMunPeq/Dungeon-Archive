import * as React from "react";
import { ok, doesNotThrow } from "node:assert";
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

import type { FilterDefinition } from "../../src/compendium/types";
import { FilterBar } from "../../src/features/compendium/components/filter-bar";

const DEFS: readonly FilterDefinition[] = [
  {
    key: "level",
    label: "Level",
    options: [
      { value: "", label: "All" },
      { value: "0", label: "Cantrip" },
      { value: "1", label: "1" },
    ],
  },
  {
    key: "school",
    label: "School",
    options: [
      { value: "", label: "All" },
      { value: "V", label: "Evocation" },
    ],
  },
  {
    key: "class",
    label: "Class",
    options: [
      { value: "", label: "All" },
      { value: "Wizard", label: "Wizard" },
    ],
  },
];

function renderBar(values: Record<string, string>, onClearAll?: () => void): string {
  return renderToString(
    createElement(FilterBar, {
      filters: DEFS,
      values,
      onChange: () => undefined,
      onClearAll,
    }),
  );
}

console.log("FilterBar\n");

test("renders the primary filter chips inline", () => {
  const html = renderBar({});
  ok(html.includes("Level"), "primary filter label visible");
});

test("renders a More filters button when advanced filters exist", () => {
  const html = renderBar({});
  ok(html.includes("More filters"));
});

test("hides the More filters button when there are no advanced filters", () => {
  const html = renderToString(
    createElement(FilterBar, {
      filters: [DEFS[0]!],
      values: {},
      onChange: () => undefined,
    }),
  );
  ok(!html.includes("More filters"));
});

test("shows no active-filter row when nothing is selected", () => {
  const html = renderBar({});
  ok(!html.includes("Active filters"));
  ok(!html.includes("Clear all"));
});

test("lists every active filter with its human-readable value", () => {
  const html = renderBar({ level: "1", school: "V", class: "Wizard" });
  ok(html.includes('aria-label="Active filters"'));
  ok(html.includes("Remove Level filter: 1"));
  ok(html.includes("Remove School filter: Evocation"));
  ok(html.includes("Remove Class filter: Wizard"));
});

test("active filter chips expose remove affordances beyond color", () => {
  const html = renderBar({ school: "V" });
  ok(html.includes("Remove School filter: Evocation"));
});

test("renders a Clear all action when filters are active", () => {
  const html = renderBar({ level: "1" }, () => undefined);
  ok(html.includes("Clear all"));
});

test("badge shows the count of active advanced filters", () => {
  const none = renderBar({});
  ok(!none.includes('aria-label="1 active"'), "no badge without actives");
  const one = renderBar({ school: "V" });
  ok(one.includes('aria-label="1 active"'), "badge appears with one advanced filter");
  const two = renderBar({ school: "V", class: "Wizard" });
  ok(two.includes('aria-label="2 active"'), "badge counts both advanced filters");
});

test("primary filter selection does not inflate the advanced badge", () => {
  const html = renderBar({ level: "1" }, () => undefined);
  ok(!html.includes('aria-label="1 active"'), "primary selection stays out of badge");
  ok(html.includes("Clear all"), "but still surfaces in the active row");
});

test("renders without crashing when only source-like filters exist", () => {
  const single: readonly FilterDefinition[] = [
    {
      key: "source",
      label: "Source",
      options: [
        { value: "", label: "All" },
        { value: "PHB", label: "PHB (2014)" },
      ],
    },
  ];
  const html = renderToString(
    createElement(FilterBar, {
      filters: single,
      values: {},
      onChange: () => undefined,
    }),
  );
  doesNotThrow(() => html);
  ok(!html.includes("More filters"));
});

import * as React from "react";
import { strictEqual, ok } from "node:assert";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
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

import { LANGUAGES, languageCode, nextLanguage } from "../../src/features/language/language";
import { WAVE_DURATION_MS, prefersReducedMotion } from "../../src/features/motion/wave-reveal";
import { LanguageToggle } from "../../src/components/layout/language-toggle";

console.log("language switch\n");

test("the toggle always switches to the other language", () => {
  strictEqual(nextLanguage("en"), "es");
  strictEqual(nextLanguage("es"), "en");
  strictEqual(nextLanguage(nextLanguage("en")), "en", "round trip returns to the start");
});

test("both languages are always offered, in a fixed order", () => {
  strictEqual(LANGUAGES.join(), "en,es");
  strictEqual(LANGUAGES.length, 2);
});

test("codes render uppercase for the toggle badge", () => {
  strictEqual(languageCode("en"), "EN");
  strictEqual(languageCode("es"), "ES");
});

test("reduced motion is read defensively when matchMedia is missing", () => {
  const original = (globalThis as Record<string, unknown>).matchMedia;
  delete (globalThis as Record<string, unknown>).matchMedia;
  strictEqual(prefersReducedMotion(), false, "no matchMedia means assume motion is fine");

  (globalThis as Record<string, unknown>).matchMedia = (query: string) => ({
    matches: query.includes("reduce"),
    media: query,
  });
  strictEqual(prefersReducedMotion(), true);

  if (original === undefined) {
    delete (globalThis as Record<string, unknown>).matchMedia;
  } else {
    (globalThis as Record<string, unknown>).matchMedia = original;
  }
});

test("the wave stays inside the Design DNA signature-moment budget", () => {
  // Rule 42 caps signature moments at ~600-700ms.
  ok(WAVE_DURATION_MS <= 700, `wave runs ${WAVE_DURATION_MS}ms, over the 700ms ceiling`);
  ok(WAVE_DURATION_MS >= 300, "long enough to read as intentional motion");
});

test("toggle shows both codes so the current one is visible without tapping", () => {
  const html = renderToString(createElement(LanguageToggle));
  ok(html.includes(">EN<"), "English code rendered");
  ok(html.includes(">ES<"), "Spanish code rendered");
  ok(html.includes("|"), "the two codes are separated");
  // The accessible name must announce the target, not the current language.
  strictEqual(html.includes('aria-label="Switch to Spanish"'), true);
});

test("the globe glyph carries no baked-in language text", () => {
  const html = renderToString(createElement(LanguageToggle));
  ok(!html.includes("currentLanguage"), "icon no longer needs a language prop");
  strictEqual(html.includes("<text"), false, "no <text> node left inside the icon");
});

test("the switch shows no toast, so no notification copy is left behind", () => {
  // The wave reveal is the confirmation; a snackbar was removed as redundant.
  // Guard it so the strings (and the toast) don't quietly come back.
  const html = renderToString(createElement(LanguageToggle));
  ok(!html.includes('role="status"'), "no live region in the toggle");
});

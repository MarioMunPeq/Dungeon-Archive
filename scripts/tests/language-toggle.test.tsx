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
import {
  CROSS_FADE_LANGUAGE_MS,
  CROSS_FADE_THEME_MS,
  prefersReducedMotion,
} from "../../src/features/motion/cross-fade";
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

test("both cross-fades stay inside the ordinary interaction budget", () => {
  // Rule 42 caps ordinary interactions at 300ms and only allows longer for the
  // dice roll. A settings toggle is not a signature moment.
  ok(
    CROSS_FADE_LANGUAGE_MS <= 300,
    `language cross-fade runs ${CROSS_FADE_LANGUAGE_MS}ms, over the 300ms ceiling`,
  );
  ok(
    CROSS_FADE_THEME_MS <= 300,
    `theme cross-fade runs ${CROSS_FADE_THEME_MS}ms, over the 300ms ceiling`,
  );
});

test("the language switch gets a shorter fade than the theme", () => {
  // Recolouring every surface is a bigger change than swapping words, so the two
  // should not feel identical.
  ok(
    CROSS_FADE_LANGUAGE_MS < CROSS_FADE_THEME_MS,
    "the two changes must be proportional to what they actually change",
  );
});

test("toggle shows both codes so the current one is visible without tapping", () => {
  const html = renderToString(createElement(LanguageToggle));
  ok(html.includes(">EN<"), "English code rendered");
  ok(html.includes(">ES<"), "Spanish code rendered");
  ok(html.includes("|"), "the two codes are separated");
  // The accessible name must announce the target, not the current language.
  strictEqual(html.includes('aria-label="Switch to Spanish"'), true);
});

test("the toggle is the two codes and nothing else", () => {
  // The globe was removed: it carried no information the codes did not, and it
  // needed a spin animation to justify its width. Guard it so an icon does not
  // quietly creep back in.
  const html = renderToString(createElement(LanguageToggle));
  strictEqual(html.includes("<svg"), false, "no icon is rendered in the toggle");
});

test("only the active code is lit, and the inactive one is dimmed", () => {
  const html = renderToString(createElement(LanguageToggle));
  // Default language is English: EN carries the foreground tone, ES the muted one.
  ok(html.includes('text-foreground">EN<'), "the active code is the lit one");
  ok(html.includes('text-muted-foreground/50">ES<'), "the inactive code is dimmed");
});

test("the switch shows no toast, so no notification copy is left behind", () => {
  // The cross-fade plus the lit code is the confirmation; a snackbar was removed
  // as redundant. Guard it so the strings (and the toast) don't quietly return.
  const html = renderToString(createElement(LanguageToggle));
  ok(!html.includes('role="status"'), "no live region in the toggle");
});

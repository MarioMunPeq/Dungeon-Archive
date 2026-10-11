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

import {
  LANGUAGES,
  languageCode,
  languageName,
  nextLanguage,
  prefersReducedMotion,
} from "../../src/features/language/language";
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

test("codes render uppercase, names render as a speaker would write them", () => {
  strictEqual(languageCode("en"), "EN");
  strictEqual(languageCode("es"), "ES");
  strictEqual(languageName("es"), "Español");
  strictEqual(languageName("en"), "English");
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

test("undo snackbar strings are translated in both languages", async () => {
  const { t } = await import("../../src/i18n");
  const { userStore } = await import("../../src/user-state");

  userStore.getState().setLanguage("es");
  strictEqual(t("language.switched", { language: "Español" }), "Idioma cambiado a Español");
  strictEqual(t("language.undo"), "Deshacer");

  userStore.getState().setLanguage("en");
  strictEqual(t("language.switched", { language: "English" }), "Language changed to English");
  strictEqual(t("language.undo"), "Undo");
});
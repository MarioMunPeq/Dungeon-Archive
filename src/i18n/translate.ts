import type { Language } from "@/user-state";
import { DEFAULT_LANGUAGE, userStore } from "@/user-state";

import { en } from "./messages/en";
import type { TranslationKey } from "./messages/en";
import { es } from "./messages/es";

export type { TranslationKey };

/** Values substituted into `{placeholder}` slots in a message. */
export type TranslationVars = Readonly<Record<string, string | number>>;

export type Translate = (key: TranslationKey, vars?: TranslationVars) => string;

const MESSAGES: Readonly<Record<Language, Readonly<Record<TranslationKey, string>>>> = {
  en,
  es,
};

const PLACEHOLDER = /\{(\w+)\}/g;

function interpolate(template: string, vars: TranslationVars | undefined): string {
  if (!vars) return template;
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

/**
 * Looks a message up in a specific language. Unknown keys fall back to the
 * English message rather than rendering the raw key, so a partially translated
 * build is still readable.
 */
export function translate(language: Language, key: TranslationKey, vars?: TranslationVars): string {
  const messages = MESSAGES[language] ?? MESSAGES[DEFAULT_LANGUAGE];
  const template = messages[key] ?? MESSAGES[DEFAULT_LANGUAGE][key] ?? key;
  return interpolate(template, vars);
}

/** Builds a translator bound to one language — handy for tests and pure helpers. */
export function translateFor(language: Language): Translate {
  return (key, vars) => translate(language, key, vars);
}

/**
 * Translator bound to the user's current language, resolved from the store on
 * every call. There is no React context on purpose: `App` subscribes to the
 * language itself, so a change re-renders the whole tree and every `t()` call
 * recomputes. Keeping it context-free lets pure modules (`category-registry`,
 * `damage`, `source`) translate too.
 */
export function t(key: TranslationKey, vars?: TranslationVars): string {
  return translate(userStore.getState().language, key, vars);
}

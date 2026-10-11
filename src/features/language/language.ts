import type { Language } from "@/user-state";
import { LANGUAGES } from "@/user-state";

export { LANGUAGES };

/** The only other language the app ships; used for one-tap toggling. */
export function nextLanguage(language: Language): Language {
  return language === "en" ? "es" : "en";
}

/** Two-letter badge shown on the toggle. */
export function languageCode(language: Language): string {
  return language.toUpperCase();
}

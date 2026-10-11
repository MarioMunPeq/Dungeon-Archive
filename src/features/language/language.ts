import type { Language } from "@/user-state";

export const LANGUAGES: readonly Language[] = ["en", "es"] as const;

/** The only other language the app ships; used for one-tap toggling. */
export function nextLanguage(language: Language): Language {
  return language === "en" ? "es" : "en";
}

/** Two-letter badge shown on the toggle. */
export function languageCode(language: Language): string {
  return language.toUpperCase();
}

/** Full name in that language, the way a speaker of it would write it. */
export function languageName(language: Language): string {
  return language === "es" ? "Español" : "English";
}

/**
 * `true` when the user asked the OS for reduced motion.
 *
 * The global `* { animation: none }` rule in index.css already neutralises
 * ordinary CSS animations, but it cannot reach the ::view-transition-*
 * pseudo-elements that drive the content cross-fade. Checking here lets the
 * toggle skip starting the transition at all.
 */
export function prefersReducedMotion(): boolean {
  // `globalThis` rather than `window` so the helper stays callable (and testable)
  // in a non-DOM context.
  const mm = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
  if (typeof mm !== "function") return false;
  return mm("(prefers-reduced-motion: reduce)").matches;
}
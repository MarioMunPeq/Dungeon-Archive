import { useEffect, useRef } from "react";
import { useLanguage } from "@/user-state";

/**
 * Keeps `<html lang>` in sync with the chosen language so screen readers
 * announce Spanish content with a Spanish voice and browsers apply the right
 * hyphenation and spell-checking rules. index.html ships `lang="en"` to match
 * the default; this keeps it truthful once the user switches.
 *
 * Also plays the FALLBACK content fade for browsers without the View Transitions
 * API: `language-content-fade-in` on `main` fades the new language in over
 * ~200ms. When the cross-fade runs, language-toggle.tsx swaps the store inside
 * `document.startViewTransition`, so the DOM update is captured as the incoming
 * snapshot and this class would double up with it — the hook skips it in that
 * case. First run applies the persisted language instantly, no animation on load.
 */
export function useApplyLanguage(): void {
  const language = useLanguage();
  const firstRun = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    const content = root.querySelector<HTMLElement>(".language-content");

    root.lang = language;

    const isFirst = firstRun.current;
    firstRun.current = false;
    if (isFirst || content === null) return;
    if (root.classList.contains("language-transitioning")) return;

    content.classList.add("language-content-fade-in");
    const timer = setTimeout(() => {
      content.classList.remove("language-content-fade-in");
    }, 220);

    return () => {
      clearTimeout(timer);
      content.classList.remove("language-content-fade-in");
    };
  }, [language]);
}
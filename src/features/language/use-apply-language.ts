import { useEffect } from "react";
import { useLanguage } from "@/user-state";

/**
 * Keeps `<html lang>` in sync with the chosen language so screen readers
 * announce Spanish content with a Spanish voice and browsers apply the right
 * hyphenation and spell-checking rules. index.html ships `lang="en"` to match
 * the default; this keeps it truthful once the user switches.
 */
export function useApplyLanguage(): void {
  const language = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
}

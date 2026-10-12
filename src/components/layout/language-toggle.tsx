import { useCallback } from "react";
import { userStore, useLanguage } from "@/user-state";
import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { LANGUAGES, languageCode, nextLanguage } from "@/features/language/language";
import { CROSS_FADE_LANGUAGE_MS, runCrossFade } from "@/features/motion/cross-fade";

/**
 * One-tap language switch.
 *
 * The control is just the two codes with the current one lit; there is no icon.
 * A globe was tried here and removed — it carried no information the codes did
 * not already carry, and it needed its own spin animation to justify its width.
 * The cross-fade plus the lit code is the whole feedback: a language change is
 * unmistakable once it has happened, and it cannot be read as accidental.
 *
 * No toast and no confirmation dialog for the same reason.
 *
 * The fade is shorter than the theme's (160ms vs 240ms) on purpose. Recolouring
 * every surface is a large change; swapping words is a small one, and the
 * gesture should be proportional to what it does — Design DNA rule 41.
 */
export function LanguageToggle() {
  const language = useLanguage();
  const target = nextLanguage(language);

  const handleClick = useCallback(() => {
    void runCrossFade(() => userStore.getState().setLanguage(target), CROSS_FADE_LANGUAGE_MS);
  }, [target]);

  const switchLabel = target === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish");

  return (
    <Button
      variant="ghost"
      size="md"
      className="px-2"
      aria-label={switchLabel}
      title={switchLabel}
      onClick={handleClick}
    >
      <span aria-hidden="true" className="flex items-center text-xs font-semibold tracking-wide">
        {LANGUAGES.map((code, index) => {
          const active = code === language;
          return (
            <span key={code} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="mx-1 text-muted-foreground/40">
                  |
                </span>
              )}
              <span className={active ? "text-foreground" : "text-muted-foreground/50"}>
                {languageCode(code)}
              </span>
            </span>
          );
        })}
      </span>
    </Button>
  );
}

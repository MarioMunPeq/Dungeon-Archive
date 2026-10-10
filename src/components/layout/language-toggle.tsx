import { Button, LanguagesIcon } from "@/components/ui";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import { userStore, useLanguage } from "@/user-state";

/**
 * One-tap language toggle. Direct toggle without animation.
 * Shows current language on the icon; announces target language for a11y.
 */
export function LanguageToggle() {
  const language = useLanguage();
  const next: Language = language === "en" ? "es" : "en";

  return (
    <Button
      variant="ghost"
      size="md"
      className="px-2"
      aria-label={next === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish")}
      title={next === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish")}
      onClick={() => userStore.getState().setLanguage(next)}
    >
      <LanguagesIcon size="md" currentLanguage={language} />
    </Button>
  );
}

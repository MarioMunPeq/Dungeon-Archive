import { Button, LanguagesIcon } from "@/components/ui";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import { userStore, useLanguage } from "@/user-state";

/**
 * One-tap language toggle. Deliberately a direct toggle rather than a popover:
 * with only two languages the current state is unambiguous, and it keeps the
 * top bar to a single 44px target with no dialog to dismiss.
 *
 * The label announces the language the tap switches TO, so screen readers hear
 * "Cambiar a español" on the English app rather than the current language.
 */
export function LanguageToggle() {
  const language = useLanguage();
  const next: Language = language === "en" ? "es" : "en";
  const label = next === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish");

  return (
    <Button
      variant="ghost"
      size="md"
      className="px-2"
      aria-label={label}
      title={label}
      onClick={() => userStore.getState().setLanguage(next)}
    >
      <LanguagesIcon size="md" />
    </Button>
  );
}

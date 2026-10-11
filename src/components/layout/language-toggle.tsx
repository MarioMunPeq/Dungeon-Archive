import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "@/user-state";
import { userStore, useLanguage } from "@/user-state";
import { Button, LanguagesIcon } from "@/components/ui";
import { useOptionalSnackbar } from "@/components/ui/snackbar-context";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import { LANGUAGES, languageCode, languageName, nextLanguage, prefersReducedMotion } from "@/features/language/language";

/**
 * One-tap language switch.
 *
 * The globe spins a half turn while the page body cross-fades into the new
 * language; the top bar and bottom nav stay static so the control never moves
 * out from under the finger. The change is confirmed with an Undo snackbar
 * instead of a confirmation dialog, because a toggle should never be a
 * two-decision interaction.
 */
export function LanguageToggle() {
  const language = useLanguage();
  const snackbar = useOptionalSnackbar();
  const [spinning, setSpinning] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = nextLanguage(language);

  // The spin lasts 240ms; clearing the timer on unmount avoids setting state
  // on a component that is already gone.
  useEffect(() => {
    return () => {
      if (spinTimer.current !== null) clearTimeout(spinTimer.current);
    };
  }, []);

  const apply = useCallback((previous: Language) => {
    // Both strings resolve in the new language, since `setLanguage` already ran.
    snackbar?.show(t("language.switched", { language: languageName(target) }), {
      tone: "success",
      durationMs: 4000,
      action: {
        label: t("language.undo"),
        onPress: () => userStore.getState().setLanguage(previous),
      },
    });
  }, [snackbar, target]);

  const handleClick = useCallback(() => {
    const previous = language;
    const root = document.documentElement;

    setSpinning(true);
    if (spinTimer.current !== null) clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => setSpinning(false), 260);

    const canTransition =
      typeof document.startViewTransition === "function" && !prefersReducedMotion();

    const commit = () => {
      userStore.getState().setLanguage(target);
      apply(previous);
    };

    if (!canTransition) {
      commit();
      return;
    }

    root.classList.add("language-transitioning");
    try {
      const transition = document.startViewTransition!(commit);
      transition.finished.finally(() => {
        root.classList.remove("language-transitioning");
      });
    } catch {
      root.classList.remove("language-transitioning");
      commit();
    }
  }, [apply, language, target]);

  return (
    <Button
      variant="ghost"
      size="md"
      className="gap-1.5 px-2"
      aria-label={target === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish")}
      title={target === "es" ? t("a11y.switchToSpanish") : t("a11y.switchToEnglish")}
      onClick={handleClick}
    >
      <LanguagesIcon size="md" className={cn(spinning && "animate-lang-spin")} />
      <span aria-hidden="true" className="flex items-center text-xs font-semibold tracking-wide">
        {LANGUAGES.map((code, index) => {
          const active = code === language;
          return (
            <span key={code} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="mx-0.5 text-muted-foreground/50">
                  |
                </span>
              )}
              <span className={active ? "text-foreground" : "text-muted-foreground/60"}>
                {languageCode(code)}
              </span>
            </span>
          );
        })}
      </span>
    </Button>
  );
}
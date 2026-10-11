import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { userStore, useLanguage } from "@/user-state";
import { Button, LanguagesIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import { LANGUAGES, languageCode, nextLanguage } from "@/features/language/language";
import { runWaveReveal } from "@/features/motion/wave-reveal";

/**
 * One-tap language switch.
 *
 * The globe spins a half turn while the wave reveal opens from the button and
 * carries the new language in. No toast and no confirmation dialog: the wave
 * *is* the confirmation — a full-screen change of language cannot read as
 * accidental, and anything on top of it only delays the result.
 */
export function LanguageToggle() {
  const language = useLanguage();
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

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setSpinning(true);
      if (spinTimer.current !== null) clearTimeout(spinTimer.current);
      spinTimer.current = setTimeout(() => setSpinning(false), 260);

      // Same wave as the theme switch, originating from the button that was
      // tapped — the app transitions the same way wherever the state changes.
      void runWaveReveal(() => userStore.getState().setLanguage(target), {
        x: event.clientX,
        y: event.clientY,
      });
    },
    [target],
  );

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

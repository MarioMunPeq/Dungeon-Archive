import { useCallback, useEffect, useRef, useState } from "react";
import { useOnboardingComplete, userStore } from "@/user-state";
import { Button } from "@/components/ui/Button";
import { useDialog } from "@/components/ui/use-dialog";
import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";

interface OnboardingStep {
  readonly title: TranslationKey;
  readonly body: TranslationKey;
}

const STEPS: readonly OnboardingStep[] = [
  {
    title: "onboarding.step1.title",
    body: "onboarding.step1.body",
  },
  {
    title: "onboarding.step2.title",
    body: "onboarding.step2.body",
  },
  {
    title: "onboarding.step3.title",
    body: "onboarding.step3.body",
  },
  {
    title: "onboarding.step4.title",
    body: "onboarding.step4.body",
  },
];

export function Onboarding() {
  const hydrated = userStore((s) => s._hasHydrated);
  const complete = useOnboardingComplete();
  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => userStore.getState().completeOnboarding(), []);

  // Reuses the shared dialog hook, which traps Tab inside the overlay and
  // restores focus to whatever had it before. The hand-rolled version let Tab
  // escape to the page behind the modal.
  useDialog({
    onClose: close,
    open: hydrated && !complete,
    containerRef: panelRef,
    focusFirst: false,
  });

  useEffect(() => {
    if (!hydrated || complete) return;
    const primary = document.querySelector<HTMLButtonElement>("[data-onboarding-primary]");
    primary?.focus();
  }, [hydrated, complete, step]);

  if (!hydrated || complete) return null;

  const isLast = step === STEPS.length - 1;
  const next = () => setStep((s) => (isLast ? s : s + 1));

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("onboarding.welcome")}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <div className="flex flex-1 flex-col justify-center px-6">
        <div key={step} className="flex flex-col gap-3 animate-slide-up">
          <h2 className="text-2xl font-bold text-foreground">{t(STEPS[step]!.title)}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{t(STEPS[step]!.body)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-border px-6 py-5">
        <div className="flex justify-center gap-2" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-150 ${
                i === step ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={close}>
            {t("onboarding.skip")}
          </Button>
          <Button data-onboarding-primary onClick={isLast ? close : next}>
            {isLast ? t("onboarding.start") : t("onboarding.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

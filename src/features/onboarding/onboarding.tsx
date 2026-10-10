import { useEffect, useState } from "react";
import { useOnboardingComplete, userStore } from "@/user-state";
import { Button } from "@/components/ui/Button";
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

  useEffect(() => {
    if (!hydrated || complete) return;
    const primary = document.querySelector<HTMLButtonElement>("[data-onboarding-primary]");
    primary?.focus();
  }, [hydrated, complete, step]);

  useEffect(() => {
    if (!hydrated || complete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        userStore.getState().completeOnboarding();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, complete]);

  if (!hydrated || complete) return null;

  const isLast = step === STEPS.length - 1;
  const finish = () => userStore.getState().completeOnboarding();
  const next = () => setStep((s) => (isLast ? s : s + 1));

  return (
    <div
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
          <Button variant="ghost" onClick={finish}>
            {t("onboarding.skip")}
          </Button>
          <Button data-onboarding-primary onClick={isLast ? finish : next}>
            {isLast ? t("onboarding.start") : t("onboarding.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

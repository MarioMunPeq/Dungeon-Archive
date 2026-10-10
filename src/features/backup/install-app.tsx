import { Button, Section, Surface } from "@/components/ui";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { t } from "@/i18n";

export function InstallAppSection() {
  const { canPrompt, showIosHint, install } = useInstallPrompt();

  if (!canPrompt && !showIosHint) return null;

  return (
    <Section title={t("install.title")}>
      <Surface>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">{t("install.body")}</p>
          {canPrompt ? (
            <div className="flex flex-col gap-1">
              <Button onClick={() => void install()}>{t("install.action")}</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-foreground-subtle">
                {t("install.iosHint")}{" "}
                <span className="font-medium text-foreground">{t("install.iosAction")}</span>.
              </p>
            </div>
          )}
        </div>
      </Surface>
    </Section>
  );
}

import { Button, Section, Surface } from "@/components/ui";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

export function InstallAppSection() {
  const { canPrompt, showIosHint, install } = useInstallPrompt();

  if (!canPrompt && !showIosHint) return null;

  return (
    <Section title="Install">
      <Surface>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Add Dungeon Archive to your home screen to run it full-screen, offline, like a native
            app.
          </p>
          {canPrompt ? (
            <div className="flex flex-col gap-1">
              <Button onClick={() => void install()}>Install App</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-foreground-subtle">
                On iPhone or iPad: tap the Share button in Safari, then choose{" "}
                <span className="font-medium text-foreground">Add to Home Screen</span>.
              </p>
            </div>
          )}
        </div>
      </Surface>
    </Section>
  );
}

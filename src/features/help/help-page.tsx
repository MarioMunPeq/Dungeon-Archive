import type { ReactNode } from "react";
import { Inline, Section, Surface } from "@/components/ui";
import { t } from "@/i18n";

const GITHUB_URL = "https://github.com/MarioMunPeq";
const LINKEDIN_URL = "https://es.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o";

interface LinkButtonProps {
  readonly href: string;
  readonly children: ReactNode;
}

function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="touch-comfortable inline-flex items-center justify-center gap-2 rounded-control border border-border px-4 py-2 text-sm font-medium text-foreground transition-all duration-150 hover:bg-accent active:scale-95 active:bg-accent/80"
    >
      {children}
    </a>
  );
}

export function HelpPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <Section title={t("helpPage.quickHelp")}>
        <Surface>
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("helpPage.longPress")}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("helpPage.beginnerTips")}
            </p>
          </div>
        </Surface>
      </Section>

      <Section title={t("helpPage.aboutProject")}>
        <Surface>
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("helpPage.aboutBody")}
            </p>
            <Inline>
              <LinkButton href={GITHUB_URL}>GitHub</LinkButton>
              <LinkButton href={LINKEDIN_URL}>LinkedIn</LinkButton>
            </Inline>
          </div>
        </Surface>
      </Section>
    </div>
  );
}

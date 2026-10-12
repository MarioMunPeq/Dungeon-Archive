import type { ReactNode } from "react";
import { Inline, Section, Surface } from "@/components/ui";
import { t } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const GITHUB_URL = "https://github.com/MarioMunPeq";
const LINKEDIN_URL = "https://es.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o";

interface Explanation {
  readonly term: TranslationKey;
  readonly description: TranslationKey;
}

const NAV_EXPLANATIONS: readonly Explanation[] = [
  { term: "nav.home", description: "helpPage.nav.homeBody" },
  { term: "nav.archive", description: "helpPage.nav.archiveBody" },
  { term: "nav.combat", description: "helpPage.nav.combatBody" },
  { term: "nav.dice", description: "helpPage.nav.diceBody" },
  { term: "nav.character", description: "helpPage.nav.characterBody" },
];

const TOP_BAR_EXPLANATIONS: readonly Explanation[] = [
  { term: "helpPage.topBar.help", description: "helpPage.topBar.helpBody" },
  { term: "helpPage.topBar.theme", description: "helpPage.topBar.themeBody" },
  { term: "helpPage.topBar.language", description: "helpPage.topBar.languageBody" },
  { term: "helpPage.topBar.cloud", description: "helpPage.topBar.cloudBody" },
];

const NUMBER_EXPLANATIONS: readonly Explanation[] = [
  { term: "helpPage.numbers.modifier", description: "helpPage.numbers.modifierBody" },
  { term: "class.proficiencyBonus", description: "helpPage.numbers.proficiencyBody" },
  { term: "character.armorClass", description: "helpPage.numbers.armorClassBody" },
];

/** Term + one-line description, used by the three reference sections. */
function DefinitionList({ items }: { readonly items: readonly Explanation[] }) {
  return (
    <dl className="flex flex-col gap-2.5">
      {items.map(({ term, description }) => (
        <div key={term} className="space-y-0.5">
          <dt className="text-sm font-semibold text-foreground">{t(term)}</dt>
          <dd className="text-xs leading-relaxed text-muted-foreground">{t(description)}</dd>
        </div>
      ))}
    </dl>
  );
}

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
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("helpPage.keyboardTips")}
            </p>
          </div>
        </Surface>
      </Section>

      <Section title={t("helpPage.navigationTitle")}>
        <Surface>
          <div className="flex flex-col gap-3">
            <DefinitionList items={NAV_EXPLANATIONS} />
          </div>
        </Surface>
      </Section>

      <Section title={t("helpPage.topBarTitle")}>
        <Surface>
          <div className="flex flex-col gap-3">
            <DefinitionList items={TOP_BAR_EXPLANATIONS} />
          </div>
        </Surface>
      </Section>

      <Section title={t("helpPage.numbersTitle")}>
        <Surface>
          <div className="flex flex-col gap-3">
            <DefinitionList items={NUMBER_EXPLANATIONS} />
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

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBeginnerMode, useLanguage, userStore } from "@/user-state";
import { HelpTip } from "@/components/ui";

/**
 * The long-form Rules / How to Play / Glossary copy lives in the message
 * dictionaries, so these arrays only describe the shape of the content.
 * Everything user-facing below is a key.
 */
interface RuleSectionData {
  /** Stable React key; also disambiguates the section from its siblings. */
  readonly id: string;
  readonly title: TranslationKey;
  readonly titleHelp?: TranslationKey;
  readonly summary: TranslationKey;
  readonly points: readonly TranslationKey[];
  readonly help?: TranslationKey;
}

const RULE_SECTIONS: readonly RuleSectionData[] = [
  {
    id: "d20",
    title: "rules.d20.title",
    summary: "rules.d20.summary",
    points: ["rules.d20.point1", "rules.d20.point2", "rules.d20.point3"],
    help: "rules.d20.help",
  },
  {
    id: "checks",
    title: "rules.checks.title",
    titleHelp: "rules.checks.titleHelp",
    summary: "rules.checks.summary",
    points: [
      "rules.checks.point1",
      "rules.checks.point2",
      "rules.checks.point3",
      "rules.checks.point4",
      "rules.checks.point5",
      "rules.checks.point6",
    ],
    help: "rules.checks.help",
  },
  {
    id: "saves",
    title: "rules.saves.title",
    summary: "rules.saves.summary",
    points: ["rules.saves.point1", "rules.saves.point2", "rules.saves.point3"],
  },
  {
    id: "turn",
    title: "rules.turn.title",
    titleHelp: "rules.turn.titleHelp",
    summary: "rules.turn.summary",
    points: ["rules.turn.point1", "rules.turn.point2", "rules.turn.point3", "rules.turn.point4"],
    help: "rules.turn.help",
  },
  {
    id: "attacks",
    title: "rules.attacks.title",
    summary: "rules.attacks.summary",
    points: ["rules.attacks.point1", "rules.attacks.point2", "rules.attacks.point3"],
  },
  {
    id: "rest",
    title: "rules.rest.title",
    titleHelp: "rules.hitPoints.titleHelp",
    summary: "rules.rest.summary",
    points: ["rules.rest.point1", "rules.rest.point2", "rules.rest.point3"],
    help: "rules.rest.help",
  },
  {
    id: "spellcasting",
    title: "rules.spellcasting.title",
    summary: "rules.spellcasting.summary",
    points: ["rules.spellcasting.point1", "rules.spellcasting.point2", "rules.spellcasting.point3"],
    help: "rules.spellcasting.help",
  },
];

interface HowToPlayPointData {
  readonly id: string;
  readonly title: TranslationKey;
  readonly body: TranslationKey;
}

const HOW_TO_PLAY_POINTS: readonly HowToPlayPointData[] = [
  { id: "1", title: "howToPlay.1.title", body: "howToPlay.1.body" },
  { id: "2", title: "howToPlay.2.title", body: "howToPlay.2.body" },
  { id: "3", title: "howToPlay.3.title", body: "howToPlay.3.body" },
  { id: "4", title: "howToPlay.4.title", body: "howToPlay.4.body" },
];

interface GlossaryEntryData {
  readonly id: string;
  readonly term: TranslationKey;
  readonly definition: TranslationKey;
}

const GLOSSARY_TERMS: readonly GlossaryEntryData[] = [
  { id: "ac", term: "glossary.ac.term", definition: "glossary.ac.definition" },
  {
    id: "abilityCheck",
    term: "glossary.abilityCheck.term",
    definition: "glossary.abilityCheck.definition",
  },
  { id: "action", term: "glossary.action.term", definition: "glossary.action.definition" },
  {
    id: "advantage",
    term: "glossary.advantage.term",
    definition: "glossary.advantage.definition",
  },
  {
    id: "bonusAction",
    term: "glossary.bonusAction.term",
    definition: "glossary.bonusAction.definition",
  },
  { id: "cantrip", term: "glossary.cantrip.term", definition: "glossary.cantrip.definition" },
  {
    id: "concentration",
    term: "glossary.concentration.term",
    definition: "glossary.concentration.definition",
  },
  { id: "critical", term: "glossary.critical.term", definition: "glossary.critical.definition" },
  { id: "dc", term: "glossary.dc.term", definition: "glossary.dc.definition" },
  {
    id: "disadvantage",
    term: "glossary.disadvantage.term",
    definition: "glossary.disadvantage.definition",
  },
  { id: "hitDice", term: "glossary.hitDice.term", definition: "glossary.hitDice.definition" },
  {
    id: "hitPoints",
    term: "glossary.hitPoints.term",
    definition: "glossary.hitPoints.definition",
  },
  {
    id: "longRest",
    term: "glossary.longRest.term",
    definition: "glossary.longRest.definition",
  },
  { id: "reaction", term: "glossary.reaction.term", definition: "glossary.reaction.definition" },
  {
    id: "savingThrow",
    term: "glossary.savingThrow.term",
    definition: "glossary.savingThrow.definition",
  },
  {
    id: "shortRest",
    term: "glossary.shortRest.term",
    definition: "glossary.shortRest.definition",
  },
  {
    id: "spellAttack",
    term: "glossary.spellAttack.term",
    definition: "glossary.spellAttack.definition",
  },
  {
    id: "spellSaveDc",
    term: "glossary.spellSaveDc.term",
    definition: "glossary.spellSaveDc.definition",
  },
];

function RuleSection({
  data,
  defaultOpen = false,
}: {
  data: RuleSectionData;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const title = t(data.title);
  return (
    <section className="flex flex-col rounded-card border border-border bg-surface px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {data.titleHelp && (
            <span className="truncate text-xs text-foreground-subtle">{t(data.titleHelp)}</span>
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-primary ease-emphasized",
            open && "rotate-180",
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-primary ease-emphasized",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        inert={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "flex flex-col gap-2 pt-2 transition-opacity duration-primary ease-emphasized",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">{t(data.summary)}</p>
            <ul className="flex flex-col gap-1">
              {data.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground"
                  />
                  <span>{t(point)}</span>
                </li>
              ))}
            </ul>
            {data.help !== undefined && (
              <HelpTip label={t("common.about", { subject: title })}>{t(data.help)}</HelpTip>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowToPlayPane() {
  return (
    <div
      id="archive-panel-how-to-play"
      role="tabpanel"
      aria-labelledby="archive-tab-how-to-play"
      className="flex flex-col gap-3"
    >
      {HOW_TO_PLAY_POINTS.map((point) => (
        <section
          key={point.id}
          className="flex flex-col gap-1 rounded-card border border-border bg-surface px-4 py-3"
        >
          <h2 className="text-sm font-semibold text-foreground">{t(point.title)}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t(point.body)}</p>
        </section>
      ))}
    </div>
  );
}

export function RulesPane() {
  const beginnerMode = useBeginnerMode();
  return (
    <div
      id="archive-panel-rules"
      role="tabpanel"
      aria-labelledby="archive-tab-rules"
      className="flex flex-col gap-3"
    >
      <label className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3">
        <span className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">{t("rules.beginnerTips")}</span>
          <span className="text-xs text-muted-foreground">{t("rules.beginnerTipsBody")}</span>
        </span>
        <span className="relative inline-flex">
          <input
            type="checkbox"
            role="switch"
            aria-label={t("rules.beginnerTipsToggle")}
            checked={beginnerMode}
            onChange={(e) => userStore.getState().setBeginnerMode(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full border border-border bg-muted transition-colors duration-150 peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-focus" />
          <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-foreground transition-transform duration-150 peer-checked:translate-x-5" />
        </span>
      </label>

      <div className="flex flex-col gap-2">
        {RULE_SECTIONS.map((data, index) => (
          <RuleSection key={data.id} data={data} defaultOpen={index === 0} />
        ))}
      </div>
    </div>
  );
}

export function GlossaryPane() {
  const language = useLanguage();

  // Sorted on the *translated* term, so the Spanish glossary reads
  // alphabetically in Spanish rather than following the English order.
  const entries = useMemo(
    () =>
      [...GLOSSARY_TERMS].sort((a, b) =>
        t(a.term).localeCompare(t(b.term), language === "es" ? "es" : "en"),
      ),
    [language],
  );

  return (
    <div
      id="archive-panel-glossary"
      role="tabpanel"
      aria-labelledby="archive-tab-glossary"
      className="flex flex-col gap-2"
    >
      {entries.map((entry) => (
        <section
          key={entry.id}
          className="flex flex-col gap-1 rounded-card border border-border bg-surface px-4 py-3"
        >
          <h3 className="text-sm font-semibold text-foreground">{t(entry.term)}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{t(entry.definition)}</p>
        </section>
      ))}
    </div>
  );
}

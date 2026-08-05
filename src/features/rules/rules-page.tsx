import { useState } from "react";
import { cn } from "@/lib/utils";
import { useBeginnerMode, userStore } from "@/user-state";
import { HelpTip } from "@/components/ui";

interface RuleSectionData {
  readonly title: string;
  readonly titleHelp?: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly help?: string;
}

const RULE_SECTIONS: readonly RuleSectionData[] = [
  {
    title: "The D20",
    summary:
      "Almost every check in D&D starts with rolling a 20-sided die (the d20). Higher is better.",
    points: [
      "Roll the d20 and add your relevant modifier (bonus).",
      "Beat or match the difficulty number (DC) to succeed.",
      "Advantage: roll twice, keep the higher. Disadvantage: roll twice, keep the lower.",
    ],
    help: "A \"1\" on an attack roll is a critical miss and always fails. A \"20\" is a critical hit and always hits, with extra damage!",
  },
  {
    title: "Ability Checks",
    titleHelp: "STR · DEX · CON · INT · WIS · CHA",
    summary:
      "When you try something risky, the DM asks for an ability check using one of your six ability scores.",
    points: [
      "Strength (STR): pushing, lifting, breaking.",
      "Dexterity (DEX): sneaking, balancing, reacting.",
      "Constitution (CON): resisting poison, exhaustion, focus.",
      "Intelligence (INT): remembering, solving, researching.",
      "Wisdom (WIS): noticing, sensing danger, reading people.",
      "Charisma (CHA): persuading, performing, intimidating.",
    ],
    help: "Your ability modifier is your score's bonus: score 10 gives +0, 12 gives +1, 14 gives +2, and so on.",
  },
  {
    title: "Saving Throws",
    summary:
      "When a spell or trap tries to affect you, you roll a saving throw to resist it.",
    points: [
      "The DM tells you which ability to use (e.g. \"make a Dexterity save\").",
      "Roll the d20 and add that ability's modifier.",
      "If you beat the spell's DC, the effect is reduced or avoided.",
    ],
  },
  {
    title: "Your Turn in Combat",
    titleHelp: "Action · Bonus Action · Movement · Reaction",
    summary: "On your turn you can do a few things, in any order.",
    points: [
      "Movement: move up to your speed (usually 30 ft).",
      "Action: attack, cast a spell, dash, dodge, hide, or more.",
      "Bonus Action: a small extra action if a feature or spell grants one.",
      "Reaction: a special response to someone else's trigger, once per round.",
    ],
    help: "You only get one Action, one Bonus Action, and one Reaction per round — use them wisely!",
  },
  {
    title: "Attacks & Damage",
    summary: "To attack, roll a d20 and add your attack bonus. If you hit, roll damage.",
    points: [
      "Attack roll: d20 + attack bonus vs. the target's Armor Class (AC).",
      "Damage roll: the weapon or spell's dice, plus your ability modifier.",
      "Criticals: a natural 20 hits and rolls double the damage dice.",
    ],
  },
  {
    title: "Hit Points & Resting",
    titleHelp: "HP",
    summary: "Your Hit Points (HP) measure how much punishment you can take.",
    points: [
      "Damage reduces your HP. At 0 HP you fall unconscious.",
      "Short rest: 1 hour — spend Hit Dice to heal.",
      "Long rest: 8 hours — recover all HP and half your Hit Dice.",
    ],
    help: "Track your current HP in the Combat tab while you play.",
  },
  {
    title: "Spellcasting",
    summary: "Casting a spell takes an Action unless the spell says otherwise.",
    points: [
      "Spell Attack: roll d20 + your spell attack bonus vs. the target's AC.",
      "Saving Throw: the target rolls against your spell save DC.",
      "Concentration: if the spell says so, you lose it if you take damage and fail a Constitution save.",
    ],
    help: "Your spell save DC and spell attack bonus live on your character in the Party tab.",
  },
];

function RuleSection({ data, defaultOpen = false }: { data: RuleSectionData; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{data.title}</span>
          {data.titleHelp && (
            <span className="truncate text-xs text-foreground-subtle">{data.titleHelp}</span>
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-2 animate-slide-up">
          <p className="text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
          <ul className="flex flex-col gap-1">
            {data.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {data.help !== undefined && (
            <HelpTip label={`More about ${data.title}`}>{data.help}</HelpTip>
          )}
        </div>
      )}
    </section>
  );
}

export function RulesPage() {
  const beginnerMode = useBeginnerMode();
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
        <span className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Beginner tips</span>
          <span className="text-xs text-muted-foreground">
            Show the ? helpers that explain the rules as you go.
          </span>
        </span>
        <span className="relative inline-flex">
          <input
            type="checkbox"
            role="switch"
            aria-label="Toggle beginner tips"
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
          <RuleSection key={data.title} data={data} defaultOpen={index === 0} />
        ))}
      </div>
    </div>
  );
}

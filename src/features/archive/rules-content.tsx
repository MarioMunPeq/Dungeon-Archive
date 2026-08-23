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
    help: 'A "1" on an attack roll is a critical miss and always fails. A "20" is a critical hit and always hits, with extra damage!',
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
    summary: "When a spell or trap tries to affect you, you roll a saving throw to resist it.",
    points: [
      'The DM tells you which ability to use (e.g. "make a Dexterity save").',
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
    help: "Your spell save DC and spell attack bonus live on your character in the Character tab.",
  },
];

interface HowToPlayPointData {
  readonly title: string;
  readonly body: string;
}

const HOW_TO_PLAY_POINTS: readonly HowToPlayPointData[] = [
  {
    title: "Your character won't be good at everything — and that's fine.",
    body: "Every class has strengths and weaknesses. Failing a roll now and then is part of the game, not a failure on your part.",
  },
  {
    title: "The session isn't only about you.",
    body: "Some scenes will center on other characters. That doesn't mean you sit out — react, chime in, support whoever has the spotlight, without taking the scene away from them.",
  },
  {
    title: 'The goal is to have fun, not to "win."',
    body: "There's no scoreboard. A good session is one where everyone at the table enjoyed themselves, including you, even when things don't go the way you hoped.",
  },
  {
    title: "Participate actively.",
    body: 'Describe what your character does, don\'t just roll dice. Asking "what do I see/feel/know about this?" is always a valid thing to do.',
  },
];

interface GlossaryEntryData {
  readonly term: string;
  readonly definition: string;
}

const GLOSSARY_TERMS: readonly GlossaryEntryData[] = [
  {
    term: "AC",
    definition:
      "Armor Class. How hard you are to hit: an attack lands when its total roll equals or beats your AC.",
  },
  {
    term: "Ability Check",
    definition:
      "A d20 roll plus an ability modifier, used when you try something risky — like a Dexterity check to balance across a beam.",
  },
  {
    term: "Action",
    definition:
      "The main thing you do on your turn: attack, cast a spell, dash, dodge, hide, or use an object.",
  },
  {
    term: "Advantage",
    definition:
      "Roll two d20s and keep the higher one — granted when circumstances work in your favor.",
  },
  {
    term: "Bonus Action",
    definition:
      "A small extra action some features or spells grant. You get one per turn, and only if something gives you one.",
  },
  {
    term: "Cantrip",
    definition: "A level 0 spell you can cast at will, without spending spell slots.",
  },
  {
    term: "Concentration",
    definition:
      "Some spells need your focus to keep going. Take damage and you must pass a Constitution save or the spell ends.",
  },
  {
    term: "Critical Hit",
    definition:
      "A natural 20 on an attack roll. It always hits, and you roll double the damage dice.",
  },
  {
    term: "DC",
    definition:
      "Difficulty Class. The number a roll has to meet or beat to succeed — a higher DC means a harder task.",
  },
  {
    term: "Disadvantage",
    definition:
      "Roll two d20s and keep the lower one — imposed when circumstances work against you.",
  },
  {
    term: "Hit Dice",
    definition:
      "Dice you spend on a short rest to heal yourself. You have one per level; they refresh on a long rest.",
  },
  {
    term: "Hit Points",
    definition: "Your HP measures how much punishment you can take. At 0 HP you fall unconscious.",
  },
  {
    term: "Long Rest",
    definition:
      "8 hours of sleep and light activity. You recover all lost HP and half your spent Hit Dice.",
  },
  {
    term: "Reaction",
    definition:
      "A quick response outside your turn — like an opportunity attack — taken when its trigger happens. One per round.",
  },
  {
    term: "Saving Throw",
    definition:
      "A d20 roll plus an ability modifier to resist a spell, trap, or effect. Meet or beat its DC.",
  },
  {
    term: "Short Rest",
    definition: "An hour of rest. Spend Hit Dice to heal, and some features recharge.",
  },
  {
    term: "Spell Attack",
    definition:
      "The roll you make when a spell attacks directly: d20 plus your spell attack bonus vs. the target's AC.",
  },
  {
    term: "Spell Save DC",
    definition:
      "The number enemies must beat to resist your spells. It grows with your proficiency and spellcasting ability.",
  },
];

const SORTED_GLOSSARY_TERMS: readonly GlossaryEntryData[] = [...GLOSSARY_TERMS].sort((a, b) =>
  a.term.localeCompare(b.term),
);

function RuleSection({
  data,
  defaultOpen = false,
}: {
  data: RuleSectionData;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="flex flex-col rounded-card border border-border bg-surface px-4 py-3">
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
          key={point.title}
          className="flex flex-col gap-1 rounded-card border border-border bg-surface px-4 py-3"
        >
          <h2 className="text-sm font-semibold text-foreground">{point.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{point.body}</p>
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

export function GlossaryPane() {
  return (
    <div
      id="archive-panel-glossary"
      role="tabpanel"
      aria-labelledby="archive-tab-glossary"
      className="flex flex-col gap-2"
    >
      {SORTED_GLOSSARY_TERMS.map((entry) => (
        <section
          key={entry.term}
          className="flex flex-col gap-1 rounded-card border border-border bg-surface px-4 py-3"
        >
          <h3 className="text-sm font-semibold text-foreground">{entry.term}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{entry.definition}</p>
        </section>
      ))}
    </div>
  );
}

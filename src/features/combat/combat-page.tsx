import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCharacters, usePrimaryCharacter, userStore } from "@/user-state";
import type { CharacterReference, CharacterReferenceUpdate } from "@/user-state";
import {
  Button,
  EmptyState,
  HelpTip,
  InfoPopover,
  Stepper,
  useLongPressInfo,
} from "@/components/ui";
import { resolveEntity } from "@/compendium";
import type { Condition, ContentBlock } from "@/compendium";
import { cn } from "@/lib/utils";

interface TurnItem {
  readonly title: string;
  readonly help: string;
}

const TURN_ITEMS: readonly TurnItem[] = [
  {
    title: "Action",
    help: "Attack, cast a spell, dash, dodge, hide, disengage, or use an object.",
  },
  {
    title: "Bonus Action",
    help: "A small extra action granted by a feature, spell, or item.",
  },
  {
    title: "Movement",
    help: "Move up to your speed (usually 30 ft), split any way across your turn.",
  },
  {
    title: "Reaction",
    help: "A response to something that happens, like an opportunity attack.",
  },
];

const CONDITION_IDS: readonly string[] = [
  "condition.poisoned",
  "condition.stunned",
  "condition.prone",
  "condition.grappled",
  "condition.blinded",
  "condition.restrained",
  "condition.frightened",
  "condition.paralyzed",
  "condition.charmed",
  "condition.deafened",
  "condition.incapacitated",
  "condition.invisible",
  "condition.unconscious",
];

const QUICK_DELTAS: readonly number[] = [-5, -1, 1, 5];

type CombatStatKey = "armorClass" | "passivePerception" | "spellSaveDc";

const COMBAT_STATS: readonly {
  label: string;
  key: CombatStatKey;
  help: string;
}[] = [
  {
    label: "AC",
    key: "armorClass",
    help: "Armor Class is what enemies must beat to hit you.",
  },
  {
    label: "Perception",
    key: "passivePerception",
    help: "A score used to notice hidden things without rolling.",
  },
  {
    label: "DC",
    key: "spellSaveDc",
    help: "Spell save DC is the number enemies must beat to resist your spells.",
  },
];

function combatStatValue(character: CharacterReference, key: CombatStatKey): number {
  switch (key) {
    case "armorClass":
      return character.combatValues.armorClass;
    case "passivePerception":
      return character.combatValues.passivePerception;
    case "spellSaveDc":
      return character.combatValues.spellSaveDc ?? 10;
  }
}

function conditionName(canonicalId: string): string {
  const resolved = resolveEntity(canonicalId);
  if (resolved?.selected.category === "condition") return resolved.selected.name;
  const slug = canonicalId.slice(canonicalId.lastIndexOf(".") + 1);
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function conditionSummary(condition: Condition): string {
  const walk = (blocks: readonly ContentBlock[]): string => {
    for (const block of blocks) {
      if (block.type === "paragraph") {
        const text = block.text.trim();
        if (text) return text;
      } else if (block.type === "list") {
        for (const item of block.items) {
          if (typeof item === "string") {
            const text = item.trim();
            if (text) return text;
          }
        }
      } else if (block.type === "entries" || block.type === "inset" || block.type === "quote") {
        const text = walk(block.blocks);
        if (text) return text;
      }
    }
    return "";
  };
  return walk(condition.description);
}

const FALLBACK_SUMMARY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function conditionDefinition(id: string): string {
  const resolved = resolveEntity(id);
  const summary =
    resolved?.selected.category === "condition" ? conditionSummary(resolved.selected) : "";
  return summary || FALLBACK_SUMMARY;
}

const ConditionChip = memo(function ConditionChip({
  id,
  active,
  onToggle,
}: {
  readonly id: string;
  readonly active: boolean;
  readonly onToggle: () => void;
}) {
  const {
    open,
    setOpen,
    placement,
    shiftX,
    containerRef,
    popoverRef,
    longPress,
    clearLongPress,
    startPress,
    clearTimer,
  } = useLongPressInfo<HTMLSpanElement>();

  const name = conditionName(id);

  return (
    <span ref={containerRef} className="relative block">
      <button
        type="button"
        onClick={() => {
          if (longPress) {
            clearLongPress();
            return;
          }
          if (open) {
            setOpen(false);
            return;
          }
          onToggle();
        }}
        onPointerDown={startPress}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}
        onPointerCancel={clearTimer}
        aria-pressed={active}
        aria-expanded={open}
        className={cn(
          "w-full rounded-control border px-3 py-1.5 text-left text-xs font-medium transition-all duration-secondary ease-standard active:scale-95",
          active
            ? "border-primary/60 bg-primary/15 text-foreground"
            : "border-border bg-transparent text-muted-foreground",
        )}
      >
        {name}
      </button>
      {open && (
        <InfoPopover placement={placement} shiftX={shiftX} popoverRef={popoverRef} title={name}>
          {conditionDefinition(id)}
        </InfoPopover>
      )}
    </span>
  );
});

function CharacterSelector() {
  const characters = useCharacters();
  const activeCharacterId = userStore((s) => s.activeCharacterId);
  if (characters.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {characters.map((character) => (
        <button
          key={character.id}
          type="button"
          onClick={() => userStore.getState().setActiveCharacter(character.id)}
          aria-pressed={character.id === activeCharacterId}
          className={cn(
            "rounded-control border border-border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95",
            character.id === activeCharacterId
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {character.name}
        </button>
      ))}
    </div>
  );
}

const TurnItemRow = memo(function TurnItemRow({
  item,
  isUsed,
  onToggle,
}: {
  readonly item: TurnItem;
  readonly isUsed: boolean;
  readonly onToggle: () => void;
}) {
  const {
    open,
    placement,
    shiftX,
    containerRef,
    popoverRef,
    longPress,
    clearLongPress,
    startPress,
    clearTimer,
  } = useLongPressInfo<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      onPointerDown={startPress}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      className={cn(
        "relative flex items-center gap-2 rounded-control border border-border-amber bg-surface readout-card px-3 py-2 transition-all duration-secondary ease-standard",
        isUsed && "border-primary/40",
      )}
    >
      <button
        type="button"
        onClick={() => {
          if (longPress) {
            clearLongPress();
            return;
          }
          onToggle();
        }}
        aria-pressed={isUsed}
        className="flex flex-1 items-center gap-2 text-left"
      >
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-stat border transition-all duration-secondary ease-standard",
            isUsed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-transparent",
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            className="h-3 w-3"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span className="relative">
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-secondary ease-standard",
              isUsed && "text-muted-foreground",
            )}
          >
            {item.title}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-1/2 h-px w-full -translate-y-1/2 origin-left bg-muted-foreground transition-transform duration-secondary ease-standard",
              isUsed ? "scale-x-100" : "scale-x-0",
            )}
          />
        </span>
      </button>
      {open && (
        <InfoPopover
          placement={placement}
          shiftX={shiftX}
          popoverRef={popoverRef}
          title={item.title}
        >
          {item.help}
        </InfoPopover>
      )}
    </div>
  );
});

function TurnChecklist() {
  const [used, setUsed] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = (title: string) => {
    setUsed((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const reset = () => setUsed(new Set());

  return (
    <>
      <div className="flex flex-col gap-2">
        {TURN_ITEMS.map((item) => (
          <TurnItemRow
            key={item.title}
            item={item}
            isUsed={used.has(item.title)}
            onToggle={() => toggle(item.title)}
          />
        ))}
      </div>
      <div className="flex justify-end border-t border-border/60 pt-3">
        <Button variant="outline" size="sm" onClick={reset}>
          Next turn
        </Button>
      </div>
    </>
  );
}

function CombatCharacterView({ character }: { character: CharacterReference }) {
  const update = useCallback(
    (data: CharacterReferenceUpdate) => {
      userStore.getState().updateCharacter(character.id, data);
    },
    [character.id],
  );

  const hpLow =
    character.hitPoints.max > 0 && character.hitPoints.current <= character.hitPoints.max / 2;

  const hpPercent =
    character.hitPoints.max > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((character.hitPoints.current / character.hitPoints.max) * 100)),
        )
      : 0;

  const adjustHp = useCallback(
    (delta: number) => {
      const hp =
        userStore.getState().characters.find((p) => p.id === character.id)?.hitPoints ??
        character.hitPoints;
      update({ hitPoints: { current: Math.min(Math.max(hp.current + delta, 0), hp.max) } });
    },
    [character.id, character.hitPoints, update],
  );

  const toggleCondition = useCallback(
    (id: string) => {
      const current = userStore.getState().characters.find((p) => p.id === character.id);
      if (!current) return;
      const activeConditions = current.activeConditions;
      const active = new Set(activeConditions);
      if (active.has(id)) active.delete(id);
      else active.add(id);
      update({ activeConditions: [...active] });
    },
    [character.id, update],
  );

  const toggleHandlers = useMemo(
    () => Object.fromEntries(CONDITION_IDS.map((id) => [id, () => toggleCondition(id)])),
    [toggleCondition],
  );

  const activeConditions = new Set(character.activeConditions);

  const {
    open: hpOpen,
    placement: hpPlacement,
    shiftX: hpShiftX,
    containerRef: hpContainerRef,
    popoverRef: hpPopoverRef,
    startPress: hpStartPress,
    clearTimer: hpClearTimer,
  } = useLongPressInfo<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-card border border-border-amber bg-surface readout-card p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Hit Points
          </span>
          <HelpTip label="What are Hit Points?">
            Hit Points (HP) measure how much damage you can take. Damage lowers your current HP; at
            0 you fall unconscious. Heal to bring it back up.
          </HelpTip>
        </div>
        <div
          ref={hpContainerRef}
          onPointerDown={hpStartPress}
          onPointerUp={hpClearTimer}
          onPointerLeave={hpClearTimer}
          onPointerCancel={hpClearTimer}
          className={cn(
            "relative flex items-center justify-between gap-3 rounded-stat border border-border-amber bg-card readout-card px-3 py-2",
            hpLow && "border-destructive/40",
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current
            </span>
            <Stepper
              variant="ghost"
              hiddenControls
              value={character.hitPoints.current}
              min={0}
              max={9999}
              onChange={(value) => update({ hitPoints: { current: value } })}
              label="Current HP"
              className="h-9 w-24"
              valueClassName={cn(
                "font-mono text-2xl font-bold tabular-nums",
                hpLow && "text-destructive",
              )}
            />
          </div>
          <span className="text-lg font-medium text-foreground-subtle">/</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Max
            </span>
            <Stepper
              variant="ghost"
              hiddenControls
              value={character.hitPoints.max}
              min={1}
              max={9999}
              onChange={(value) => update({ hitPoints: { max: value } })}
              label="Max HP"
              className="h-9 w-24"
              valueClassName="font-mono text-2xl font-bold tabular-nums"
            />
          </div>
          {hpOpen && (
            <InfoPopover
              placement={hpPlacement}
              shiftX={hpShiftX}
              popoverRef={hpPopoverRef}
              title="Hit Points"
            >
              Hit Points (HP) measure how much damage you can take. Damage lowers your current HP;
              at 0 you fall unconscious. Heal to bring it back up.
            </InfoPopover>
          )}
        </div>
        <div className="rounded-full bg-muted p-0.5">
          <div
            role="progressbar"
            aria-valuenow={character.hitPoints.current}
            aria-valuemin={0}
            aria-valuemax={character.hitPoints.max}
            className={cn(
              "h-1.5 rounded-full transition-all duration-150",
              hpLow ? "bg-destructive" : "bg-success",
            )}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_DELTAS.map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => adjustHp(delta)}
              className="rounded-control border border-border bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
            >
              {delta > 0 ? `+${delta}` : `${delta}`}
            </button>
          ))}
        </div>
        {hpLow && (
          <p className="text-xs font-medium text-destructive">
            Below half — your character is hurting!
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Conditions
        </span>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_IDS.map((id) => (
            <ConditionChip
              key={id}
              id={id}
              active={activeConditions.has(id)}
              onToggle={toggleHandlers[id]!}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            On Your Turn
          </span>
          <HelpTip label="What can I do on my turn?">
            Each round you get one Action, one Bonus Action, and one Reaction. You can also move up
            to your speed and split the movement however you like. Tap a row once you have used it
            this turn, then hit “Next turn” when your turn ends.
          </HelpTip>
        </div>
        <TurnChecklist key={character.id} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="flex items-center gap-2 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Stats
          <HelpTip label="What are these numbers?">
            These are your combat numbers. Edit them on your character in the Character tab.
          </HelpTip>
        </span>
        <div className="grid grid-cols-3 gap-2">
          {COMBAT_STATS.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-1 rounded-stat border border-border-amber bg-card readout-card px-2 py-3"
            >
              <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                {stat.label}
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {combatStatValue(character, stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CombatPage() {
  const character = usePrimaryCharacter();

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {character === null ? (
        <EmptyState
          title="No character yet"
          description="Add your character in the Character tab, then come back here to track hit points during combat."
          icon={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          action={
            <Link to="/character">
              <Button>Go to Character</Button>
            </Link>
          }
        />
      ) : (
        <>
          <CharacterSelector />
          <CombatCharacterView character={character} />
        </>
      )}
    </div>
  );
}

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
import { formatCondition, resolveEntity } from "@/compendium";
import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";

interface TurnItem {
  readonly title: TranslationKey;
  readonly help: TranslationKey;
}

const TURN_ITEMS: readonly TurnItem[] = [
  {
    title: "combat.action",
    help: "combat.actionHelp",
  },
  {
    title: "combat.bonusAction",
    help: "combat.bonusActionHelp",
  },
  {
    title: "combat.movement",
    help: "combat.movementHelp",
  },
  {
    title: "combat.reaction",
    help: "combat.reactionHelp",
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
  label: TranslationKey;
  key: CombatStatKey;
  help: TranslationKey;
}[] = [
  {
    label: "character.armorClass",
    key: "armorClass",
    help: "help.armorClass.body",
  },
  {
    label: "character.perception",
    key: "passivePerception",
    help: "combat.perceptionHelp",
  },
  {
    label: "character.spellDc",
    key: "spellSaveDc",
    help: "help.spellSaveDc.body",
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
  const slug = canonicalId.slice(canonicalId.lastIndexOf(".") + 1);
  const resolved = resolveEntity(canonicalId);
  if (resolved?.selected.category === "condition") return formatCondition(slug);
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

const CONDITION_DEFINITIONS: Record<string, TranslationKey> = {
  "condition.blinded": "condition.def.blinded",
  "condition.charmed": "condition.def.charmed",
  "condition.deafened": "condition.def.deafened",
  "condition.exhaustion": "condition.def.exhaustion",
  "condition.frightened": "condition.def.frightened",
  "condition.grappled": "condition.def.grappled",
  "condition.incapacitated": "condition.def.incapacitated",
  "condition.invisible": "condition.def.invisible",
  "condition.paralyzed": "condition.def.paralyzed",
  "condition.petrified": "condition.def.petrified",
  "condition.poisoned": "condition.def.poisoned",
  "condition.prone": "condition.def.prone",
  "condition.restrained": "condition.def.restrained",
  "condition.stunned": "condition.def.stunned",
  "condition.unconscious": "condition.def.unconscious",
};

function conditionDefinition(id: string): string {
  const slug = id.slice(id.lastIndexOf(".") + 1);
  const key = CONDITION_DEFINITIONS[`condition.${slug}`];
  return key ? t(key) : t("combat.noConditionDescription");
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
            {t(item.title)}
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
          title={t(item.title)}
        >
          {t(item.help)}
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
      <div className="grid grid-cols-2 gap-2">
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
          {t("combat.nextTurn")}
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
      <div className="flex flex-col gap-2 rounded-card border border-border-amber bg-surface readout-card p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("combat.hitPoints")}
            <HelpTip label={t("help.hitPoints.title")}>
              {t("help.hitPoints.body")}
            </HelpTip>
          </div>
          <HelpTip label={t("help.hitPoints.title")}>
            {t("help.hitPoints.body")}
          </HelpTip>
        </div>
        <div
          ref={hpContainerRef}
          onPointerDown={hpStartPress}
          onPointerUp={hpClearTimer}
          onPointerLeave={hpClearTimer}
          onPointerCancel={hpClearTimer}
          className={cn(
            "relative flex items-center justify-between gap-2 rounded-stat border border-border-amber bg-card readout-card px-2 py-1.5",
            hpLow && "border-destructive/40",
          )}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("combat.current")}
            </span>
            <Stepper
              variant="ghost"
              hiddenControls
              value={character.hitPoints.current}
              min={0}
              max={9999}
              onChange={(value) => update({ hitPoints: { current: value } })}
              label={t("combat.currentHp")}
              className="h-8 w-20"
              valueClassName={cn(
                "font-mono text-xl font-bold tabular-nums",
                hpLow && "text-destructive",
              )}
            />
          </div>
          <span className="text-base font-medium text-foreground-subtle">/</span>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("combat.max")}
            </span>
            <Stepper
              variant="ghost"
              hiddenControls
              value={character.hitPoints.max}
              min={1}
              max={9999}
              onChange={(value) => update({ hitPoints: { max: value } })}
              label={t("combat.maxHp")}
              className="h-8 w-20"
              valueClassName="font-mono text-xl font-bold tabular-nums"
            />
          </div>
          {hpOpen && (
            <InfoPopover
              placement={hpPlacement}
              shiftX={hpShiftX}
              popoverRef={hpPopoverRef}
              title={t("combat.hitPoints")}
            >
              {t("help.hitPoints.body")}
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
              "h-1 rounded-full transition-all duration-150",
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
              className="rounded-control border border-border bg-card px-1.5 py-0.5 text-xs font-semibold text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
            >
              {delta > 0 ? `+${delta}` : `${delta}`}
            </button>
          ))}
        </div>
        {hpLow && (
          <p className="text-xs font-medium text-destructive">
            {t("combat.belowHalf")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="flex items-center gap-2 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {t("combat.stats")}
          <HelpTip label={t("help.combatStats.short")}>
            {t("combat.statsHelp")}
          </HelpTip>
        </span>
        <div className="grid grid-cols-3 gap-2">
          {COMBAT_STATS.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-1 rounded-stat border border-border-amber bg-card readout-card px-2 py-3"
            >
              <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                {t(stat.label)}
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {combatStatValue(character, stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {t("combat.conditions")}
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
            {t("combat.onYourTurn")}
          </span>
          <HelpTip label={t("combat.onYourTurnHelp.title")}>
            {t("combat.onYourTurnHelp.body")}
          </HelpTip>
        </div>
        <TurnChecklist key={character.id} />
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
          title={t("character.emptyTitle")}
          description={t("combat.emptyBody")}
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
              <Button>{t("combat.goToCharacter")}</Button>
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
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePlayerReferences, useActivePlayer, userStore } from "@/user-state";
import type { PlayerReference, PlayerReferenceUpdate } from "@/user-state";
import { Button, EmptyState, HelpTip, Stepper } from "@/components/ui";
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

function combatStatValue(player: PlayerReference, key: CombatStatKey): number {
  switch (key) {
    case "armorClass":
      return player.combatValues.armorClass;
    case "passivePerception":
      return player.combatValues.passivePerception;
    case "spellSaveDc":
      return player.combatValues.spellSaveDc ?? 10;
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

function ConditionsHelp() {
  return (
    <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
      {CONDITION_IDS.map((id) => {
        const resolved = resolveEntity(id);
        if (resolved?.selected.category !== "condition") return null;
        return (
          <div key={id}>
            <span className="text-xs font-semibold text-foreground">{resolved.selected.name}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              {conditionSummary(resolved.selected)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PlayerSelector() {
  const players = usePlayerReferences();
  const activePlayerId = userStore((s) => s.activePlayerId);
  if (players.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => (
        <button
          key={player.id}
          type="button"
          onClick={() => userStore.getState().setActivePlayer(player.id)}
          aria-pressed={player.id === activePlayerId}
          className={cn(
            "rounded-control border border-border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95",
            player.id === activePlayerId
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {player.name}
        </button>
      ))}
    </div>
  );
}

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
        {TURN_ITEMS.map((item) => {
          const isUsed = used.has(item.title);
          return (
            <div
              key={item.title}
              className={cn(
                "flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2 transition-all duration-150",
                isUsed && "border-primary/40",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.title)}
                aria-pressed={isUsed}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-stat border transition-all duration-150",
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
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-150",
                    isUsed && "text-muted-foreground line-through",
                  )}
                >
                  {item.title}
                </span>
              </button>
              <HelpTip label={`More about ${item.title}`}>{item.help}</HelpTip>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end border-t border-border/60 pt-3">
        <Button variant="outline" size="sm" onClick={reset}>
          Next turn
        </Button>
      </div>
    </>
  );
}

function CombatPlayerView({ player }: { player: PlayerReference }) {
  const update = (data: PlayerReferenceUpdate) =>
    userStore.getState().updatePlayerReference(player.id, data);

  const hpLow = player.hitPoints.max > 0 && player.hitPoints.current <= player.hitPoints.max / 2;

  const hpPercent =
    player.hitPoints.max > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((player.hitPoints.current / player.hitPoints.max) * 100)),
        )
      : 0;

  const adjustHp = (delta: number) => {
    const hp =
      userStore.getState().players.find((p) => p.id === player.id)?.hitPoints ?? player.hitPoints;
    update({ hitPoints: { current: Math.min(Math.max(hp.current + delta, 0), hp.max) } });
  };

  const toggleCondition = (id: string) => {
    const activeConditions =
      userStore.getState().players.find((p) => p.id === player.id)?.activeConditions ??
      player.activeConditions;
    const active = new Set(activeConditions);
    if (active.has(id)) active.delete(id);
    else active.add(id);
    update({ activeConditions: [...active] });
  };

  const activeConditions = new Set(player.activeConditions);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
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
          className={cn(
            "flex items-center justify-between gap-4 rounded-stat border border-border bg-card px-4 py-3",
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
              value={player.hitPoints.current}
              min={0}
              max={9999}
              onChange={(value) => update({ hitPoints: { current: value } })}
              label="Current HP"
              className="w-24"
              valueClassName={cn(
                "font-mono text-3xl font-bold tabular-nums",
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
              value={player.hitPoints.max}
              min={1}
              max={9999}
              onChange={(value) => update({ hitPoints: { max: value } })}
              label="Max HP"
              className="w-24"
              valueClassName="font-mono text-3xl font-bold tabular-nums"
            />
          </div>
        </div>
        <div className="rounded-full bg-muted p-0.5">
          <div
            role="progressbar"
            aria-valuenow={player.hitPoints.current}
            aria-valuemin={0}
            aria-valuemax={player.hitPoints.max}
            className={cn(
              "h-2 rounded-full transition-all duration-150",
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
              className="rounded-control border border-border bg-card px-2 py-1 text-xs font-semibold text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
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
        <div className="flex items-center gap-2">
          <span className="border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Conditions
          </span>
          <HelpTip label="What are conditions?">
            <ConditionsHelp />
          </HelpTip>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_IDS.map((id) => {
            const isActive = activeConditions.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCondition(id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-control border px-3 py-1.5 text-left text-xs font-medium transition-all duration-150 active:scale-95",
                  isActive
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {conditionName(id)}
              </button>
            );
          })}
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
        <TurnChecklist key={player.id} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="flex items-center gap-2 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Stats
          <HelpTip label="What are these numbers?">
            These are your combat numbers. Edit them on your character in the Party tab.
          </HelpTip>
        </span>
        <div className="grid grid-cols-3 gap-2">
          {COMBAT_STATS.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-1 rounded-stat border border-border bg-card px-2 py-3"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {combatStatValue(player, stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CombatPage() {
  const players = usePlayerReferences();
  const activePlayer = useActivePlayer();

  const player = activePlayer ?? players[0] ?? null;

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {players.length === 0 ? (
        <EmptyState
          title="No character yet"
          description="Add your character in the Party tab, then come back here to track hit points during combat."
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
            <Link to="/party">
              <Button>Go to Party</Button>
            </Link>
          }
        />
      ) : player ? (
        <>
          <PlayerSelector />
          <CombatPlayerView player={player} />
        </>
      ) : null}
    </div>
  );
}

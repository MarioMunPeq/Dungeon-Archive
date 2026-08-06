import { Link } from "react-router-dom";
import { usePlayerReferences, useActivePlayer, userStore } from "@/user-state";
import type { PlayerReference, PlayerReferenceUpdate } from "@/user-state";
import { Button, EmptyState, HelpTip, Stepper } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CombatAction {
  readonly title: string;
  readonly detail: string;
  readonly help?: string;
}

const TURN_ACTIONS: readonly CombatAction[] = [
  {
    title: "Action",
    detail: "Attack, cast a spell, dash, dodge, hide, disengage, or use an object.",
    help: "Your Action is the big thing you do on your turn — you get one.",
  },
  {
    title: "Bonus Action",
    detail: "A small extra action granted by a feature, spell, or item.",
    help: "Not everyone has a bonus action available — only if a feature or spell says so.",
  },
  {
    title: "Movement",
    detail: "Move up to your speed (usually 30 ft), split any way across your turn.",
    help: "You can move, attack, and keep moving — movement can be broken up.",
  },
  {
    title: "Reaction",
    detail: "A response to something that happens, like an opportunity attack.",
    help: "You get one reaction per round, and it refreshes at the start of your turn.",
  },
];

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

function formatSigned(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
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

function CombatPlayerView({ player }: { player: PlayerReference }) {
  const update = (data: PlayerReferenceUpdate) =>
    userStore.getState().updatePlayerReference(player.id, data);

  const hpLow = player.hitPoints.max > 0 && player.hitPoints.current <= player.hitPoints.max / 2;

  const hasSpell =
    player.combatValues.spellSaveDc !== undefined ||
    player.combatValues.spellAttackBonus !== undefined;

  const hpPercent =
    player.hitPoints.max > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((player.hitPoints.current / player.hitPoints.max) * 100)),
        )
      : 0;

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
        {hpLow && (
          <p className="text-xs font-medium text-destructive">
            Below half — your character is hurting!
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="border-l-2 border-primary pl-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            On Your Turn
          </span>
          <HelpTip label="What can I do on my turn?">
            Each round you get one Action, one Bonus Action, and one Reaction. You can also move up
            to your speed and split the movement however you like.
          </HelpTip>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TURN_ACTIONS.map((action) => (
            <div
              key={action.title}
              className="flex flex-col gap-1 rounded-card border border-border bg-surface px-4 py-3"
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {action.title}
                {action.help && (
                  <HelpTip label={`More about ${action.title}`}>{action.help}</HelpTip>
                )}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{action.detail}</span>
            </div>
          ))}
        </div>
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-2">
          <span className="flex items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Init
            </span>
            <span className="font-mono text-sm font-medium tabular-nums text-foreground-subtle">
              {formatSigned(player.combatValues.initiativeModifier)}
            </span>
          </span>
          {hasSpell && (
            <span className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Spell Atk
              </span>
              <span className="font-mono text-sm font-medium tabular-nums text-foreground-subtle">
                {formatSigned(player.combatValues.spellAttackBonus ?? 0)}
              </span>
            </span>
          )}
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

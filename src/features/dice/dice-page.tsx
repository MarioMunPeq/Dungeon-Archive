import { lazy, Suspense, useCallback, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Stepper } from "@/components/ui";
import type { DiceGroup, DiceRoll, DiceRollResult } from "./dice-stage";
import { DiceChip } from "./dice-chip";
import { useRoll } from "./use-roll";

const DiceStage = lazy(() => import("./dice-stage"));

const MAX_DIE_COUNT = 20;

/** Fixed die order, left-to-right in a 3-column grid:
 *  row 1: d20 d6 d8 — row 2: d10 d4 d12 — row 3: d100 + Modifier. */
const DICE_ORDER = ["20", "6", "8", "10", "4", "12", "100"];

function formatGroups(groups: readonly DiceGroup[], modifier: number): string {
  const parts = groups.map((group) => `${group.count}d${group.sides}`);
  if (modifier !== 0) {
    parts.push(`${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}`);
  }
  return parts.join(" + ");
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      typeof window.WebGLRenderingContext !== "undefined" &&
      (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) !== null
    );
  } catch {
    return false;
  }
}

export function DicePage() {
  const [groups, setGroups] = useState<DiceGroup[]>([{ sides: 20, count: 1 }]);
  const [modifier, setModifier] = useState(0);
  const { rolling: instantRolling, display, rollMany: instantRollMany } = useRoll();

  const [reduceMotion] = useState(prefersReducedMotion);
  const [webgl] = useState(supportsWebGL);
  const [stageUnavailable, setStageUnavailable] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rollResult, setRollResult] = useState<DiceRollResult | null>(null);
  const [rollId, setRollId] = useState(0);

  const show3D = !reduceMotion && webgl && !stageUnavailable;

  const roll: DiceRoll = { groups, modifier };
  const label = formatGroups(groups, modifier);
  const totalCount = groups.reduce((sum, group) => sum + group.count, 0);
  const pendingRollRef = useRef<DiceRoll | null>(null);

  const setDieCount = useCallback((sides: number, count: number) => {
    setGroups((prev) => {
      if (count <= 0) return prev.filter((group) => group.sides !== sides);
      const existing = prev.find((group) => group.sides === sides);
      if (existing !== undefined) {
        return prev.map((group) => (group.sides === sides ? { ...group, count } : group));
      }
      return [...prev, { sides, count }];
    });
  }, []);

  const renderChips = (options: readonly string[]) =>
    options.map((value) => {
      const sides = Number(value);
      const count = groups.find((group) => group.sides === sides)?.count ?? 0;
      return (
        <DiceChip
          key={value}
          sides={sides}
          count={count}
          onChange={(next) => setDieCount(sides, next)}
          max={MAX_DIE_COUNT}
        />
      );
    });

  const handleRoll = () => {
    if (!show3D) {
      instantRollMany(groups, modifier);
      return;
    }
    pendingRollRef.current = roll;
    setRollResult(null);
    setResult(null);
    setRolling(true);
    setRollId((id) => id + 1);
  };

  const rollEnabled = !rolling && !instantRolling && totalCount > 0;

  const triggerRoll = () => {
    if (!rollEnabled) return;
    handleRoll();
  };

  const handleRollKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      triggerRoll();
    }
  };

  const handleSettle = useCallback((settled: DiceRollResult) => {
    pendingRollRef.current = null;
    setRollResult(settled);
    setResult(settled.total);
    setRolling(false);
  }, []);

  const handleUnavailable = useCallback(
    (pending: DiceRoll | null) => {
      setStageUnavailable(true);
      setRolling(false);
      pendingRollRef.current = null;
      if (pending !== null) instantRollMany(pending.groups, pending.modifier);
    },
    [instantRollMany],
  );

  const displayValue = show3D ? (rolling ? "…" : result ? result : "—") : (display ?? "—");
  const showBreakdown =
    show3D &&
    rollResult !== null &&
    !rolling &&
    (rollResult.groups.length > 1 || rollResult.modifier !== 0);

  return (
    <div className="flex min-h-full flex-col gap-3 px-4 py-4">
      {show3D && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Reroll dice"
          aria-disabled={!rollEnabled}
          onClick={triggerRoll}
          onKeyDown={handleRollKeyDown}
          className="h-48 w-full cursor-pointer overflow-hidden rounded-stat border border-border bg-surface"
        >
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs text-muted-foreground">Loading dice…</span>
              </div>
            }
          >
            <DiceStage
              roll={roll}
              rollId={rollId}
              onSettle={handleSettle}
              onUnavailable={() => handleUnavailable(pendingRollRef.current)}
            />
          </Suspense>
        </div>
      )}

      <div className="flex flex-col items-center gap-1 rounded-stat border border-border-amber bg-card p-2 readout-card">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Result
        </span>
        <div aria-live="polite" className="w-full">
          <div
            key={String(displayValue)}
            role="button"
            tabIndex={0}
            aria-label="Reroll dice"
            aria-disabled={!rollEnabled}
            onClick={triggerRoll}
            onKeyDown={handleRollKeyDown}
            className="flex h-11 w-full cursor-pointer items-center justify-center font-mono text-3xl font-bold tabular-nums text-foreground animate-value-tick"
          >
            {displayValue}
          </div>
        </div>
        {showBreakdown && (
          <div className="flex w-full flex-col gap-0.5">
            {rollResult.groups.map((group) => (
              <div
                key={`${group.sides}-${group.count}`}
                className="flex items-baseline justify-between gap-6 font-mono text-sm"
              >
                <span className="text-muted-foreground">
                  {group.count}d{group.sides}
                </span>
                <span className="tabular-nums text-foreground">{group.sum}</span>
              </div>
            ))}
            {rollResult.modifier !== 0 && (
              <div className="flex items-baseline justify-between gap-6 font-mono text-sm">
                <span className="text-muted-foreground">
                  {rollResult.modifier > 0 ? "+" : "−"}
                  {Math.abs(rollResult.modifier)}
                </span>
                <span className="tabular-nums text-foreground">{rollResult.modifier}</span>
              </div>
            )}
          </div>
        )}
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      </div>

      <div className="mx-auto grid w-full max-w-lg grid-cols-3 gap-2">
        {renderChips(DICE_ORDER)}

        <div className="col-span-2 flex flex-col gap-1.5 rounded-card border border-primary/40 bg-primary/10 p-2">
          <span className="flex items-center gap-1.5 text-primary">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-3.5 w-3.5"
            >
              <path d="M4 12h6" />
              <path d="M17 9v6" />
              <path d="M14 12h6" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wide">Modifier</span>
          </span>
          <Stepper
            variant="ghost"
            value={modifier}
            min={-20}
            max={20}
            onChange={setModifier}
            label="Modifier"
            format={(v) => (v > 0 ? `+${v}` : String(v))}
            className="w-full"
            valueClassName="text-sm"
          />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-auto border-t border-border bg-background px-4 pb-3 pt-2 shadow-[0_-8px_16px_rgb(0_0_0/0.35)]">
        <Button
          onClick={handleRoll}
          disabled={rolling || instantRolling || totalCount === 0}
          className="mx-auto w-full max-w-lg"
        >
          <span className="font-mono tabular-nums">Roll {label}</span>
        </Button>
      </div>
    </div>
  );
}

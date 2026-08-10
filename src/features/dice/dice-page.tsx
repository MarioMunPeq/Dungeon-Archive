import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Button, Stepper } from "@/components/ui";
import type { DiceGroup, DiceRoll, DiceRollResult } from "./dice-stage";
import { useRoll } from "./use-roll";

const DiceStage = lazy(() => import("./dice-stage"));

const DIE_OPTIONS = [
  { value: "4", label: "d4" },
  { value: "6", label: "d6" },
  { value: "8", label: "d8" },
  { value: "10", label: "d10" },
  { value: "12", label: "d12" },
  { value: "20", label: "d20" },
  { value: "100", label: "d100" },
] as const;

const MAX_DIE_COUNT = 20;

const SECTION_LABEL =
  "border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground";

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
    <div className="flex min-h-full flex-col gap-5 px-4 py-6">
      {show3D && (
        <div className="h-56 w-full overflow-hidden rounded-stat border border-border bg-surface">
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

      <div className="flex flex-col items-center gap-2 rounded-stat border border-border-amber bg-card p-4 readout-card">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Result
        </span>
        <div
          key={String(displayValue)}
          className="flex h-16 items-center justify-center font-mono text-5xl font-bold tabular-nums text-foreground animate-value-tick"
          aria-live="polite"
        >
          {displayValue}
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
        <span className="font-mono text-sm text-muted-foreground">{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {DIE_OPTIONS.map((option) => {
          const sides = Number(option.value);
          const count = groups.find((group) => group.sides === sides)?.count ?? 0;
          return (
            <div key={option.value} className="flex items-center gap-2">
              <span className="w-10 shrink-0 font-mono text-sm text-foreground">
                {option.label}
              </span>
              <Stepper
                variant="ghost"
                value={count}
                min={0}
                max={MAX_DIE_COUNT}
                onChange={(next) => setDieCount(sides, next)}
                label={`${option.label} die count`}
                className="min-w-0 flex-1"
                valueClassName="text-sm"
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className={SECTION_LABEL}>Modifier</span>
        <Stepper
          value={modifier}
          min={-20}
          max={20}
          onChange={setModifier}
          label="Modifier"
          format={(v) => (v > 0 ? `+${v}` : String(v))}
        />
      </div>

      <Button
        onClick={handleRoll}
        disabled={rolling || instantRolling || totalCount === 0}
        className="w-full"
      >
        <span className="font-mono tabular-nums">Roll {label}</span>
      </Button>
    </div>
  );
}

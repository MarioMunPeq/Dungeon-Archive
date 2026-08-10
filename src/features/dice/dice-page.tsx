import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Button, Stepper } from "@/components/ui";
import { FilterChips } from "@/components/search";
import { formatDiceExpression, parseDiceExpression } from "@/lib/dice";
import type { DiceExpression } from "@/lib/dice";
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

const SECTION_LABEL =
  "border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground";

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
  const [sides, setSides] = useState(20);
  const [count, setCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const { rolling: instantRolling, display, roll: instantRoll } = useRoll();

  const [reduceMotion] = useState(prefersReducedMotion);
  const [webgl] = useState(supportsWebGL);
  const [stageUnavailable, setStageUnavailable] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rollId, setRollId] = useState(0);

  const show3D = !reduceMotion && webgl && !stageUnavailable;

  const expression: DiceExpression = { count, sides, modifier };
  const label = formatDiceExpression(expression);
  const pendingExpressionRef = useRef<DiceExpression | null>(null);

  const handleRoll = () => {
    if (!show3D) {
      const parsed = parseDiceExpression(label);
      if (parsed !== null) instantRoll(parsed);
      return;
    }
    pendingExpressionRef.current = expression;
    setResult(null);
    setRolling(true);
    setRollId((id) => id + 1);
  };

  const handleSettle = useCallback((total: number) => {
    pendingExpressionRef.current = null;
    setResult(total);
    setRolling(false);
  }, []);

  const handleUnavailable = useCallback(
    (pending: DiceExpression | null) => {
      setStageUnavailable(true);
      setRolling(false);
      pendingExpressionRef.current = null;
      if (pending !== null) instantRoll(pending);
    },
    [instantRoll],
  );

  const displayValue = show3D ? (rolling ? "…" : result ? result : "—") : (display ?? "—");

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
              expression={expression}
              rollId={rollId}
              onSettle={handleSettle}
              onUnavailable={() => handleUnavailable(pendingExpressionRef.current)}
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
        <span className="font-mono text-sm text-muted-foreground">{label}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className={SECTION_LABEL}>Die</span>
        <FilterChips
          options={DIE_OPTIONS}
          selected={String(sides)}
          onChange={(value) => {
            if (value) setSides(Number(value));
          }}
          ariaLabel="Die"
          wrap
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <span className={SECTION_LABEL}>Count</span>
          <Stepper value={count} min={1} max={20} onChange={setCount} label="Count" />
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
      </div>

      <Button onClick={handleRoll} disabled={rolling || instantRolling} className="w-full">
        <span className="font-mono tabular-nums">Roll {label}</span>
      </Button>
    </div>
  );
}

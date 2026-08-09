import { useState } from "react";
import { Button, Stepper } from "@/components/ui";
import { FilterChips } from "@/components/search";
import { formatDiceExpression, parseDiceExpression } from "@/lib/dice";
import type { DiceExpression } from "@/lib/dice";
import { useRoll } from "./use-roll";

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

export function DicePage() {
  const [sides, setSides] = useState(20);
  const [count, setCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const { rolling, display, roll } = useRoll();

  const expression: DiceExpression = { count, sides, modifier };
  const label = formatDiceExpression(expression);

  const handleRoll = () => {
    const parsed = parseDiceExpression(label);
    if (parsed !== null) roll(parsed);
  };

  return (
    <div className="flex min-h-full flex-col gap-5 px-4 py-6">
      <div className="flex flex-col items-center gap-2 rounded-stat border border-border-amber bg-card p-4 readout-card">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Result
        </span>
        <div
          key={display ?? "idle"}
          className="flex h-16 items-center justify-center font-mono text-5xl font-bold tabular-nums text-foreground animate-value-tick"
          aria-live="polite"
        >
          {display ?? "—"}
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

      <Button onClick={handleRoll} disabled={rolling} className="w-full">
        <span className="font-mono tabular-nums">Roll {label}</span>
      </Button>
    </div>
  );
}

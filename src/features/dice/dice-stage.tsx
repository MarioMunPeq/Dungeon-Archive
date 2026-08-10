import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { rollDice } from "@/lib/dice";

const FALLBACK_ACCENT = "#3ab492";

/** Single-die size in world units. The library default is 5; 25 is ~5x larger
 *  so one die dominates the stage. */
const BASE_DICE_SCALE = 25;
/** Floor for the per-die scale so many dice never shrink to tiny. */
const MIN_DICE_SCALE = 5;

/** Per-die scale for a roll of `count` dice. A die's footprint grows with the
 *  square of its size, so total area scales as count * scale^2; shrinking the
 *  scale by 1/sqrt(count) keeps any number of dice fitting in the table area
 *  while staying as large as possible: 1 die = full size, decreasing smoothly. */
function diceScaleFor(count: number): number {
  return Math.max(MIN_DICE_SCALE, BASE_DICE_SCALE / Math.sqrt(count));
}

/** Public theme assets copied by `pnpm assets:dice-box` (see scripts/assets). */
const ASSET_PATH = `${import.meta.env.BASE_URL}dice-box/`;

function readAccentColor(): string {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--theme-accent").trim();
  return accent === "" ? FALLBACK_ACCENT : accent;
}

/** One die group in a multi-die roll: `count` dice of `sides` faces each. */
export interface DiceGroup {
  readonly sides: number;
  readonly count: number;
}

/** A complete dice roll: any number of die groups plus an optional modifier. */
export interface DiceRoll {
  readonly groups: readonly DiceGroup[];
  readonly modifier: number;
}

/** The settled outcome of a `DiceRoll`, with the sum of each group broken out. */
export interface DiceRollResult {
  readonly groups: readonly (DiceGroup & { readonly sum: number })[];
  readonly modifier: number;
  readonly total: number;
}

/** Slice the flat per-die results (returned in notation order) back into groups. */
function sumResults(results: readonly { value?: unknown }[], roll: DiceRoll): DiceRollResult {
  const groups: (DiceGroup & { readonly sum: number })[] = [];
  let index = 0;
  for (const group of roll.groups) {
    let sum = 0;
    for (let i = 0; i < group.count; i += 1) {
      const value = Number(results[index]?.value);
      sum += Number.isFinite(value) ? value : 0;
      index += 1;
    }
    groups.push({ sides: group.sides, count: group.count, sum });
  }
  const diceTotal = groups.reduce((total, group) => total + group.sum, 0);
  return { groups, modifier: roll.modifier, total: diceTotal + roll.modifier };
}

/** Deterministic fallback breakdown used when the 3D roll rejects. */
function fallbackResult(roll: DiceRoll): DiceRollResult {
  const groups = roll.groups.map((group) => ({
    sides: group.sides,
    count: group.count,
    sum: rollDice({ count: group.count, sides: group.sides, modifier: 0 }),
  }));
  const diceTotal = groups.reduce((total, group) => total + group.sum, 0);
  return { groups, modifier: roll.modifier, total: diceTotal + roll.modifier };
}

export interface DiceStageProps {
  readonly roll: DiceRoll;
  /** Increments once per requested roll; 0 means idle. */
  readonly rollId: number;
  /** Called with the per-group breakdown once the physics settle. */
  readonly onSettle: (result: DiceRollResult) => void;
  /** Called when the 3D stage cannot initialize (caller falls back to instant rolls). */
  readonly onUnavailable: () => void;
}

export default function DiceStage({ roll, rollId, onSettle, onUnavailable }: DiceStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<DiceBox | null>(null);
  const [ready, setReady] = useState(false);

  const propsRef = useRef({ roll, onSettle, onUnavailable });
  propsRef.current = { roll, onSettle, onUnavailable };

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (container === null) return;

    const init = async () => {
      let box: DiceBox;
      try {
        box = new DiceBox({
          container: "#dice-stage-canvas",
          assetPath: ASSET_PATH,
          theme: "default",
          themeColor: readAccentColor(),
          scale: diceScaleFor(
            propsRef.current.roll.groups.reduce((sum, group) => sum + group.count, 0),
          ),
        });
        await box.init();
      } catch (error) {
        // eslint-disable-next-line no-console -- init failure must be debuggable
        console.error("[dice] 3D stage failed to initialize:", error);
        if (!cancelled) propsRef.current.onUnavailable();
        return;
      }
      if (cancelled) {
        box.clear();
        return;
      }
      boxRef.current = box;
      setReady(true);
    };
    void init();

    return () => {
      cancelled = true;
      const box = boxRef.current;
      boxRef.current = null;
      box?.clear();
      container.querySelectorAll(".dice-box-canvas").forEach((node) => node.remove());
    };
  }, []);

  const lastRolledRef = useRef(0);
  const rollTokenRef = useRef(0);

  useEffect(() => {
    if (rollId === 0 || lastRolledRef.current === rollId) return;
    const box = boxRef.current;
    if (box === null) return;

    lastRolledRef.current = rollId;
    const { roll: current, onSettle: settle } = propsRef.current;
    const token = ++rollTokenRef.current;

    const count = current.groups.reduce((sum, group) => sum + group.count, 0);
    const notation = current.groups.map((group) => `${group.count}d${group.sides}`);

    box
      .updateConfig({ scale: diceScaleFor(count) })
      .then(() => box.roll(notation, { themeColor: readAccentColor() }))
      .then((results) => {
        if (token !== rollTokenRef.current) return;
        settle(sumResults(results, current));
      })
      .catch((error) => {
        if (token !== rollTokenRef.current) return;
        // eslint-disable-next-line no-console -- roll failure must be debuggable
        console.error("[dice] 3D roll failed:", error);
        settle(fallbackResult(current));
      });
  }, [rollId, ready]);

  return (
    <div id="dice-stage-canvas" ref={containerRef} className="h-full w-full" aria-hidden="true" />
  );
}

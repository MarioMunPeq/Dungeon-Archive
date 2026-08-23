import { useCallback, useEffect, useRef, useState } from "react";
import type { DiceExpression } from "@/lib/dice";
import { rollDice } from "@/lib/dice";

const ROLL_TICK_MS = 35;
const ROLL_TICKS = 6;

/** A die group for an instant roll: `count` dice of `sides` faces each. */
export interface RollGroup {
  readonly sides: number;
  readonly count: number;
}

export interface RollState {
  /** True while the result is cycling after a roll. */
  readonly rolling: boolean;
  /** The number currently shown (cycles while rolling, settles on the total). */
  readonly display: number | null;
  /** The final result, set once the roll has settled. */
  readonly total: number | null;
  readonly roll: (expression: DiceExpression) => void;
  readonly rollMany: (groups: readonly RollGroup[], modifier: number) => void;
}

export function useRoll(): RollState {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const roll = useCallback((expression: DiceExpression) => {
    const finalTotal = rollDice(expression);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setRolling(true);
    setTotal(null);
    let ticks = 0;
    timerRef.current = window.setInterval(() => {
      ticks += 1;
      if (ticks >= ROLL_TICKS) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setDisplay(finalTotal);
        setTotal(finalTotal);
        setRolling(false);
      } else {
        setDisplay(1 + Math.floor(Math.random() * expression.sides));
      }
    }, ROLL_TICK_MS);
  }, []);

  const rollMany = useCallback((groups: readonly RollGroup[], modifier: number) => {
    const finalTotal =
      groups.reduce(
        (sum, group) => sum + rollDice({ count: group.count, sides: group.sides, modifier: 0 }),
        0,
      ) + modifier;
    const maxSides = groups.reduce((max, group) => Math.max(max, group.sides), 1);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setRolling(true);
    setTotal(null);
    let ticks = 0;
    timerRef.current = window.setInterval(() => {
      ticks += 1;
      if (ticks >= ROLL_TICKS) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setDisplay(finalTotal);
        setTotal(finalTotal);
        setRolling(false);
      } else {
        setDisplay(1 + Math.floor(Math.random() * maxSides));
      }
    }, ROLL_TICK_MS);
  }, []);

  return { rolling, display, total, roll, rollMany };
}

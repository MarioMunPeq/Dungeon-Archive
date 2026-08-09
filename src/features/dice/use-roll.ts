import { useCallback, useEffect, useRef, useState } from "react";
import type { DiceExpression } from "@/lib/dice";
import { rollDice } from "@/lib/dice";

const ROLL_TICK_MS = 35;
const ROLL_TICKS = 6;

export interface RollState {
  /** True while the result is cycling after a roll. */
  readonly rolling: boolean;
  /** The number currently shown (cycles while rolling, settles on the total). */
  readonly display: number | null;
  /** The final result, set once the roll has settled. */
  readonly total: number | null;
  readonly roll: (expression: DiceExpression) => void;
}

export function useRoll(): RollState {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return { rolling, display, total, roll };
}

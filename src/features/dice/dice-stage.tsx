import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { diceBoxNotation, rollDice } from "@/lib/dice";
import type { DiceExpression } from "@/lib/dice";

const FALLBACK_ACCENT = "#3ab492";

/** Public theme assets copied by `pnpm assets:dice-box` (see scripts/assets). */
const ASSET_PATH = `${import.meta.env.BASE_URL}dice-box/`;

function readAccentColor(): string {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--theme-accent").trim();
  return accent === "" ? FALLBACK_ACCENT : accent;
}

export interface DiceStageProps {
  readonly expression: DiceExpression;
  /** Increments once per requested roll; 0 means idle. */
  readonly rollId: number;
  /** Called with the summed total once the physics settle. */
  readonly onSettle: (total: number) => void;
  /** Called when the 3D stage cannot initialize (caller falls back to instant rolls). */
  readonly onUnavailable: () => void;
}

export default function DiceStage({ expression, rollId, onSettle, onUnavailable }: DiceStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<DiceBox | null>(null);
  const [ready, setReady] = useState(false);

  const propsRef = useRef({ expression, onSettle, onUnavailable });
  propsRef.current = { expression, onSettle, onUnavailable };

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
    const { expression: current, onSettle: settle } = propsRef.current;
    const token = ++rollTokenRef.current;

    box
      .roll(diceBoxNotation(current), { themeColor: readAccentColor() })
      .then((results) => {
        if (token !== rollTokenRef.current) return;
        const diceTotal = results.reduce(
          (sum, die) => sum + (Number.isFinite(die.value) ? die.value : 0),
          0,
        );
        settle(diceTotal + current.modifier);
      })
      .catch((error) => {
        if (token !== rollTokenRef.current) return;
        // eslint-disable-next-line no-console -- roll failure must be debuggable
        console.error("[dice] 3D roll failed:", error);
        settle(rollDice(current));
      });
  }, [rollId, ready]);

  return (
    <div id="dice-stage-canvas" ref={containerRef} className="h-full w-full" aria-hidden="true" />
  );
}

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/ui";

interface DiceChipProps {
  readonly sides: number;
  readonly count: number;
  readonly onChange: (count: number) => void;
  readonly max: number;
}

interface DieGeometry {
  /** Outer polygon silhouette (closed path). */
  readonly outline: string;
  /** Internal face-edge lines drawn thinner than the outline. */
  readonly detail?: string;
  /** Draw the number with a surface-colored halo so face lines never cut
   *  through the digits. */
  readonly halo?: boolean;
  readonly label: string;
  readonly labelY: number;
  readonly fontSize: number;
}

/** Line-art die icons. Each silhouette matches how the real die projects:
 *  d4 triangle, d6 square, d8 rhombus (edge-on octahedron), d10 kite with its
 *  girdle edge (pentagonal trapezohedron), d12 pentagon (face-on
 *  dodecahedron), d20 hexagon with the classic icosahedron projection — the
 *  same geometry as the export sheet's D20Mark. Consistent 2.5px outline,
 *  1.4px details, no fill, across all seven dice. */
const DIE_GEOMETRY: Record<number, DieGeometry> = {
  4: { outline: "M12 3 20 19H4Z", label: "4", labelY: 13.5, fontSize: 9 },
  6: { outline: "M5 5h14v14H5z", label: "6", labelY: 12, fontSize: 9.5 },
  8: { outline: "M12 3l8 9-8 9-8-9Z", label: "8", labelY: 12, fontSize: 9.5 },
  10: {
    outline: "M12 2 19.8 13.5 12 22 4.2 13.5Z",
    detail: "M4.2 13.5h15.6",
    halo: true,
    label: "10",
    labelY: 13.5,
    fontSize: 8,
  },
  12: {
    outline: "M12 2.85 2.97 9.41 6.42 20.04H17.58L21.03 9.41Z",
    label: "12",
    labelY: 12.9,
    fontSize: 8,
  },
  20: {
    outline: "M12 3.75 5.9 8.25v7.5L12 20.25l6.1-4.5v-7.5Z",
    detail:
      "M5.9 8.25h12.2M5.9 15.75h12.2M12 8.25v7.5M12 8.25 5.9 12l6.1 3.75M12 8.25l6.1 3.75L12 15.75",
    halo: true,
    label: "20",
    labelY: 12,
    fontSize: 8,
  },
  100: {
    outline: "M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z",
    label: "100",
    labelY: 12,
    fontSize: 6.5,
  },
};

function DieIcon({ sides, className }: { sides: number; className?: string }) {
  const geometry = DIE_GEOMETRY[sides];
  if (geometry === undefined) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("font-mono shrink-0", className)}
    >
      <path d={geometry.outline} />
      {geometry.detail && <path d={geometry.detail} strokeWidth={1.4} />}
      <text
        x={12}
        y={geometry.labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        stroke={geometry.halo ? "var(--color-surface)" : "none"}
        strokeWidth={geometry.halo ? 3 : undefined}
        paintOrder={geometry.halo ? "stroke" : undefined}
        fontSize={geometry.fontSize}
        fontWeight={700}
      >
        {geometry.label}
      </text>
    </svg>
  );
}

export function DiceChip({ sides, count, onChange, max }: DiceChipProps) {
  const [haloVisible, setHaloVisible] = useState(false);
  const [haloKey, setHaloKey] = useState(0);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current) {
      setHaloKey((key) => key + 1);
      setHaloVisible(true);
    }
    prevCountRef.current = count;
  }, [count]);

  const active = count > 0;

  return (
    <div
      role="group"
      aria-label={`d${sides} die`}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-card border p-2 transition-colors duration-150",
        active ? "border-primary/60 bg-primary/5" : "border-border bg-surface",
      )}
    >
      {haloVisible && (
        <span
          key={haloKey}
          aria-hidden="true"
          onAnimationEnd={() => setHaloVisible(false)}
          className="pointer-events-none absolute -inset-1 rounded-card border border-primary/50 animate-dice-active"
        />
      )}
      <DieIcon
        sides={sides}
        className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")}
      />
      <Stepper
        variant="ghost"
        value={count}
        min={0}
        max={max}
        onChange={onChange}
        label={`d${sides} die count`}
        className="w-full"
        valueClassName="text-sm"
      />
    </div>
  );
}

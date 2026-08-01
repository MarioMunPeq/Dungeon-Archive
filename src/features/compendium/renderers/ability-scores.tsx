interface AbilityScoresProps {
  readonly abilities: {
    readonly str: number;
    readonly dex: number;
    readonly con: number;
    readonly int: number;
    readonly wis: number;
    readonly cha: number;
  };
}

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

const ABILITIES = [
  { key: "str" as const, label: "STR" },
  { key: "dex" as const, label: "DEX" },
  { key: "con" as const, label: "CON" },
  { key: "int" as const, label: "INT" },
  { key: "wis" as const, label: "WIS" },
  { key: "cha" as const, label: "CHA" },
];

export function AbilityScores({ abilities }: AbilityScoresProps) {
  return (
    <div className="grid grid-cols-6 gap-1">
      {ABILITIES.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">{label}</span>
          <span className="text-lg font-bold tabular-nums">{abilities[key]}</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            ({mod(abilities[key])})
          </span>
        </div>
      ))}
    </div>
  );
}

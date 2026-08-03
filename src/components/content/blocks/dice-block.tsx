interface DiceBlockProps {
  readonly formula: string;
  readonly label?: string;
}

export function DiceBlock({ formula, label }: DiceBlockProps) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm text-accent-foreground border border-border rounded-md px-2 py-1">
      {label && <span className="text-xs text-muted-foreground">{label}:</span>}
      <span>{formula}</span>
    </span>
  );
}

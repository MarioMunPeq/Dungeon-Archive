interface MetadataItemProps {
  readonly label: string;
  readonly value: string;
}

export function MetadataItem({ label, value }: MetadataItemProps) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

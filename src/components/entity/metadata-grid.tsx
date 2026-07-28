import { MetadataItem } from "./metadata-item";

interface MetadataField {
  readonly label: string;
  readonly value: string;
}

interface MetadataGridProps {
  readonly fields: readonly MetadataField[];
}

export function MetadataGrid({ fields }: MetadataGridProps) {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-3">
      {fields.map((field) => (
        <MetadataItem key={field.label} label={field.label} value={field.value} />
      ))}
    </dl>
  );
}

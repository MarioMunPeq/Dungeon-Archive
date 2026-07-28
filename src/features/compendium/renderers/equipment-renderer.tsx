import type { Equipment } from "@/compendium";
import { MetadataGrid, Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";

interface EquipmentRendererProps {
  readonly entity: Equipment;
}

export function EquipmentRenderer({ entity }: EquipmentRendererProps) {
  const fields: { label: string; value: string }[] = [{ label: "Type", value: entity.type }];

  if (entity.cost) fields.push({ label: "Cost", value: entity.cost });
  if (entity.weight) fields.push({ label: "Weight", value: entity.weight });
  if (entity.damage) fields.push({ label: "Damage", value: entity.damage });
  if (entity.damageType) fields.push({ label: "Damage Type", value: entity.damageType });
  if (entity.ac !== undefined) fields.push({ label: "AC", value: String(entity.ac) });
  if (entity.strength) fields.push({ label: "Strength", value: entity.strength });
  if (entity.stealth) fields.push({ label: "Stealth", value: entity.stealth });
  if (entity.properties && entity.properties.length > 0) {
    fields.push({ label: "Properties", value: entity.properties.join(", ") });
  }

  return (
    <div className="space-y-6">
      <MetadataGrid fields={fields} />

      {entity.description.length > 0 && (
        <Section title="Description">
          <ContentRenderer blocks={entity.description} />
        </Section>
      )}
    </div>
  );
}

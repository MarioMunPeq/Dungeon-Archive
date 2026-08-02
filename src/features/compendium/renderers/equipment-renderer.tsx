import type { Equipment } from "@/compendium";
import { formatDamage, formatDamageType } from "@/compendium";
import { Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";

interface EquipmentRendererProps {
  readonly entity: Equipment;
}

export function EquipmentRenderer({ entity }: EquipmentRendererProps) {
  return (
    <div className="space-y-6">
      <EntityMetadataGrid>
        <EntityProperty label="Type" value={entity.type} />
        {entity.cost && <EntityProperty label="Cost" value={entity.cost} />}
        {entity.weight && <EntityProperty label="Weight" value={entity.weight} />}
        {entity.damage && (
          <EntityProperty label="Damage" value={formatDamage(entity.damage, entity.damageType)} stat />
        )}
        {entity.damageType && !entity.damage && (
          <EntityProperty label="Damage Type" value={formatDamageType(entity.damageType)} />
        )}
        {entity.ac !== undefined && <EntityProperty label="AC" value={String(entity.ac)} stat />}
        {entity.strength && <EntityProperty label="Strength" value={entity.strength} />}
        {entity.stealth && <EntityProperty label="Stealth" value={entity.stealth} />}
        {entity.properties && entity.properties.length > 0 && (
          <EntityProperty label="Properties" value={entity.properties.join(", ")} />
        )}
      </EntityMetadataGrid>

      {entity.description.length > 0 && (
        <Section title="Description">
          <ContentRenderer blocks={entity.description} />
        </Section>
      )}
    </div>
  );
}

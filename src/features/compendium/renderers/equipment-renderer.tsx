import type { Equipment } from "@/compendium";
import { formatEquipmentType } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { DamageTypeTag } from "@/components/entity";

interface EquipmentRendererProps {
  readonly entity: Equipment;
}

export function EquipmentRenderer({ entity }: EquipmentRendererProps) {
  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        <EntityProperty label="Type" value={formatEquipmentType(entity.type)} />
        {entity.cost && <EntityProperty label="Cost" value={entity.cost} />}
        {entity.weight && <EntityProperty label="Weight" value={entity.weight} />}
        {(entity.damage || entity.damageType) && (
          <EntityProperty
            label="Damage"
            stat={Boolean(entity.damage)}
            value={
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {entity.damage}
                <DamageTypeTag code={entity.damageType} />
              </span>
            }
          />
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
    </Stack>
  );
}

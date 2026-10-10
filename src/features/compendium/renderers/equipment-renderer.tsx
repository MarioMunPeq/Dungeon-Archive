import type { Equipment } from "@/compendium";
import { formatEquipmentType } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { DamageTypeTag } from "@/components/entity";
import { t } from "@/i18n";

interface EquipmentRendererProps {
  readonly entity: Equipment;
}

export function EquipmentRenderer({ entity }: EquipmentRendererProps) {
  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        <EntityProperty label={t("filter.type")} value={formatEquipmentType(entity.type)} />
        {entity.cost && <EntityProperty label={t("equipment.cost")} value={entity.cost} />}
        {entity.weight && <EntityProperty label={t("equipment.weight")} value={entity.weight} />}
        {(entity.damage || entity.damageType) && (
          <EntityProperty
            label={t("term.damage")}
            stat={Boolean(entity.damage)}
            value={
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {entity.damage}
                <DamageTypeTag code={entity.damageType} />
              </span>
            }
          />
        )}
        {entity.ac !== undefined && (
          <EntityProperty label={t("character.armorClass")} value={String(entity.ac)} stat />
        )}
        {entity.strength && (
          <EntityProperty label={t("ability.strength")} value={entity.strength} />
        )}
        {entity.stealth && <EntityProperty label={t("equipment.stealth")} value={entity.stealth} />}
        {entity.properties && entity.properties.length > 0 && (
          <EntityProperty label={t("filter.property")} value={entity.properties.join(", ")} />
        )}
      </EntityMetadataGrid>

      {entity.description.length > 0 && (
        <Section title={t("common.description")}>
          <ContentRenderer blocks={entity.description} />
        </Section>
      )}
    </Stack>
  );
}

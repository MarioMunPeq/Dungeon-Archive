import type { MagicItem } from "@/compendium";
import { Section } from "@/components/entity";
import { Stack } from "@/components/ui/Stack";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { ContentRenderer } from "@/components/content";

interface MagicItemRendererProps {
  readonly entity: MagicItem;
}

function attunementLabel(req: string): string {
  if (!req) return "";
  if (req === "true") return "Required";
  return `Required (${req})`;
}

export function MagicItemRenderer({ entity }: MagicItemRendererProps) {
  return (
    <Stack gap="lg">
      <EntityMetadataGrid>
        <EntityProperty label="Rarity" value={entity.rarity} stat />
        <EntityProperty label="Type" value={entity.itemType} />
        {entity.requiresAttunement && (
          <EntityProperty label="Attunement" value={attunementLabel(entity.requiresAttunement)} />
        )}
        {entity.value && <EntityProperty label="Value" value={entity.value} />}
        {entity.weight && <EntityProperty label="Weight" value={entity.weight} />}
      </EntityMetadataGrid>

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

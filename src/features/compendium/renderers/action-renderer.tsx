import type { Action } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";

interface ActionRendererProps {
  readonly entity: Action;
}

export function ActionRenderer({ entity }: ActionRendererProps) {
  return (
    <Stack gap="lg">
      <EntityMetadataGrid>
        <EntityProperty label="Type" value={entity.actionType} />
      </EntityMetadataGrid>

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

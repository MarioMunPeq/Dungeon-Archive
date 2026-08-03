import type { Feat } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { ContentRenderer } from "@/components/content";

interface FeatRendererProps {
  readonly entity: Feat;
}

export function FeatRenderer({ entity }: FeatRendererProps) {
  return (
    <Stack gap="lg">
      <EntityMetadataGrid>
        {entity.featCategory && <EntityProperty label="Category" value={entity.featCategory} />}
        {entity.prerequisite && <EntityProperty label="Prerequisite" value={entity.prerequisite} />}
        {entity.repeatable !== undefined && (
          <EntityProperty label="Repeatable" value={entity.repeatable ? "Yes" : "No"} />
        )}
      </EntityMetadataGrid>

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

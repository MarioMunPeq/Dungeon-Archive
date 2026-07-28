import type { Action } from "@/compendium";
import { Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";

interface ActionRendererProps {
  readonly entity: Action;
}

export function ActionRenderer({ entity }: ActionRendererProps) {
  return (
    <div className="space-y-6">
      <EntityMetadataGrid>
        <EntityProperty label="Type" value={entity.actionType} />
      </EntityMetadataGrid>

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </div>
  );
}

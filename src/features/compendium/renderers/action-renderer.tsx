import type { Action } from "@/compendium";
import { MetadataGrid, Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";

interface ActionRendererProps {
  readonly entity: Action;
}

export function ActionRenderer({ entity }: ActionRendererProps) {
  return (
    <div className="space-y-6">
      <MetadataGrid fields={[{ label: "Type", value: entity.actionType }]} />

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </div>
  );
}

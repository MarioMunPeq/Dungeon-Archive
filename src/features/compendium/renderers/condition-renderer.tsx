import type { Condition } from "@/compendium";
import { Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";

interface ConditionRendererProps {
  readonly entity: Condition;
}

export function ConditionRenderer({ entity }: ConditionRendererProps) {
  return (
    <div className="space-y-6">
      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </div>
  );
}

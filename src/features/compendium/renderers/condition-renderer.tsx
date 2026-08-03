import type { Condition } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";

interface ConditionRendererProps {
  readonly entity: Condition;
}

export function ConditionRenderer({ entity }: ConditionRendererProps) {
  return (
    <Stack gap="lg">
      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

import type { Condition } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { t } from "@/i18n";

interface ConditionRendererProps {
  readonly entity: Condition;
}

export function ConditionRenderer({ entity }: ConditionRendererProps) {
  return (
    <Stack gap="md">
      <Section title={t("common.description")}>
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

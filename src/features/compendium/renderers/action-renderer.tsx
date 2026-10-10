import type { Action } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { t } from "@/i18n";

interface ActionRendererProps {
  readonly entity: Action;
}

export function ActionRenderer({ entity }: ActionRendererProps) {
  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        <EntityProperty label={t("filter.type")} value={entity.actionType} />
      </EntityMetadataGrid>

      <Section title={t("common.description")}>
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

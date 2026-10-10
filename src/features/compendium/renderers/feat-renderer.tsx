import type { Feat } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { ContentRenderer } from "@/components/content";
import { t } from "@/i18n";

interface FeatRendererProps {
  readonly entity: Feat;
}

export function FeatRenderer({ entity }: FeatRendererProps) {
  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        {entity.featCategory && (
          <EntityProperty label={t("filter.type")} value={entity.featCategory} />
        )}
        {entity.prerequisite && (
          <EntityProperty label={t("term.prerequisite")} value={entity.prerequisite} />
        )}
        {entity.repeatable !== undefined && (
          <EntityProperty
            label="Repeatable"
            value={entity.repeatable ? t("filter.yes") : t("filter.no")}
          />
        )}
      </EntityMetadataGrid>

      <Section title={t("common.description")}>
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

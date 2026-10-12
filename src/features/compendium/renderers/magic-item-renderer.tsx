import { formatRarity } from "@/compendium";
import type { MagicItem } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { HelpTip } from "@/components/ui/HelpTip";
import { ContentRenderer } from "@/components/content";
import { t } from "@/i18n";

interface MagicItemRendererProps {
  readonly entity: MagicItem;
}

function attunementLabel(req: string): string {
  if (!req) return "";
  if (req === "true") return t("filter.required");
  return t("filter.requiredWithReason", { reason: req });
}

export function MagicItemRenderer({ entity }: MagicItemRendererProps) {
  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        <EntityProperty label={t("filter.rarity")} value={formatRarity(entity.rarity)} stat />
        <EntityProperty label={t("filter.type")} value={entity.itemType} />
        {entity.requiresAttunement && (
          <EntityProperty
            label={t("filter.attunement")}
            value={
              <span className="inline-flex items-center gap-1">
                {attunementLabel(entity.requiresAttunement)}
                <HelpTip label={t("help.attunement.title")}>{t("help.attunement.body")}</HelpTip>
              </span>
            }
          />
        )}
        {entity.value && <EntityProperty label={t("equipment.value")} value={entity.value} />}
        {entity.weight && <EntityProperty label={t("equipment.weight")} value={entity.weight} />}
      </EntityMetadataGrid>

      <Section title={t("common.description")}>
        <ContentRenderer blocks={entity.description} />
      </Section>
    </Stack>
  );
}

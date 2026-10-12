import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ErrorState } from "@/components/ui/error-state";
import {
  resolveEntity,
  formatSource,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
  METADATA_SEPARATOR,
} from "@/compendium";
import type { AnyEntity, EntityCategory } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { EntityRenderer } from "@/features/compendium/renderers/entity-renderer";
import { spellLeadSubtitle } from "@/features/compendium/renderers/spell-renderer";
import { RelatedEntities } from "@/features/compendium/components/related-entities";
import { userStore } from "@/user-state";
import { t } from "@/i18n";

/**
 * Category-specific lead for the page subtitle. Kept as an explicit table so a
 * new entity type opts in deliberately, instead of every renderer reaching for
 * the layout's subtitle slot — which is how the spell page ended up stacking two
 * subtitles under the top-bar title.
 */
const ENTITY_LEADS: Partial<Record<EntityCategory, (entity: AnyEntity) => string>> = {
  spell: (entity) => (entity.category === "spell" ? spellLeadSubtitle(entity) : ""),
};

function leadSubtitle(entity: AnyEntity): string {
  const build = ENTITY_LEADS[entity.category];
  return build ? build(entity) : "";
}

interface CompendiumPageProps {
  category: EntityCategory;
}

export function CompendiumPage({ category }: CompendiumPageProps) {
  const { canonicalId: slug } = useParams<{ canonicalId: string }>();
  const [source, setSource] = useState<string | undefined>(undefined);

  const fullCanonicalId = slug ? canonicalIdFromSlug(category, slug) : "";
  const resolved = resolveEntity(fullCanonicalId, source);

  const handleSourceChange = useCallback((newSource: string) => {
    setSource(newSource);
  }, []);

  useEffect(() => {
    if (fullCanonicalId) {
      userStore.getState().addRecentEntity(fullCanonicalId);
    }
  }, [fullCanonicalId]);

  const notFound = `${categoryLabelSingular(category)} ${t("entity.notFound")}`;

  if (!slug) {
    return <ErrorState message={notFound} />;
  }

  if (!resolved) {
    return <ErrorState message={notFound} />;
  }

  // Per-category lead, prepended to the generic "Category · Source" line. Spells
  // carry level + school, which used to be a second <Subtitle> rendered by the
  // spell renderer itself, stacking two subtitles under the top-bar title.
  const lead = leadSubtitle(resolved.selected);

  return (
    <EntityDetailLayout
      subtitle={[lead, categoryLabelSingular(category), formatSource(resolved.selected.source)]
        .filter(Boolean)
        .join(` ${METADATA_SEPARATOR} `)}
      source={resolved.selected.source}
      versions={resolved.versions}
      onSourceChange={handleSourceChange}
      breadcrumbs={[
        { label: t("nav.home"), to: "/" },
        { label: categoryLabel(category), to: `/${category}` },
        { label: resolved.selected.name },
      ]}
    >
      <EntityRenderer entity={resolved.selected} />
      <RelatedEntities canonicalId={fullCanonicalId} />
    </EntityDetailLayout>
  );
}

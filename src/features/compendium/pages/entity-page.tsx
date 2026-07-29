import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { ErrorState } from "@/components/ui/error-state";
import {
  resolveEntity,
  formatSource,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
} from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { EntityRenderer } from "@/features/compendium/renderers/entity-renderer";
import { RelatedEntities } from "@/features/compendium/components/related-entities";

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

  if (!slug) {
    return <ErrorState message="Missing entity identifier" />;
  }

  if (!resolved) {
    return <ErrorState message={`${categoryLabelSingular(category)} not found: ${slug}`} />;
  }

  return (
    <EntityDetailLayout
      name={resolved.selected.name}
      subtitle={`${categoryLabelSingular(category)} \u00B7 ${formatSource(resolved.selected.source)}`}
      source={resolved.selected.source}
      versions={resolved.versions}
      onSourceChange={handleSourceChange}
      breadcrumbs={[
        { label: "Dungeon Archive", to: "/" },
        { label: categoryLabel(category), to: "/search" },
        { label: resolved.selected.name },
      ]}
    >
      <EntityRenderer entity={resolved.selected} />
      <RelatedEntities canonicalId={fullCanonicalId} />
    </EntityDetailLayout>
  );
}

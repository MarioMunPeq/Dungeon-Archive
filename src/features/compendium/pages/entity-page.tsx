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
import type { EntityCategory } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { EntityRenderer } from "@/features/compendium/renderers/entity-renderer";
import { RelatedEntities } from "@/features/compendium/components/related-entities";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { SessionButton } from "@/components/ui/SessionButton";
import { userStore } from "@/user-state";

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

  if (!slug) {
    return <ErrorState message="Missing entity identifier" />;
  }

  if (!resolved) {
    return <ErrorState message={`${categoryLabelSingular(category)} not found: ${slug}`} />;
  }

  return (
    <EntityDetailLayout
      name={resolved.selected.name}
      subtitle={`${categoryLabelSingular(category)} ${METADATA_SEPARATOR} ${formatSource(resolved.selected.source)}`}
      source={resolved.selected.source}
      versions={resolved.versions}
      onSourceChange={handleSourceChange}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: categoryLabel(category), to: `/${category}` },
        { label: resolved.selected.name },
      ]}
    >
      <div className="flex items-center gap-2">
        <FavoriteButton canonicalId={fullCanonicalId} />
        <SessionButton canonicalId={fullCanonicalId} />
      </div>
      <EntityRenderer entity={resolved.selected} />
      <RelatedEntities canonicalId={fullCanonicalId} />
    </EntityDetailLayout>
  );
}

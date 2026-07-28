import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { ErrorState } from "@/components/ui/error-state";
import { resolveEntity, formatSource } from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { EntityRenderer } from "@/features/compendium/renderers/entity-renderer";

const CATEGORY_LABEL: Record<string, string> = {
  spell: "Spell",
  condition: "Condition",
  equipment: "Equipment",
  action: "Action",
};

interface CompendiumPageProps {
  category: EntityCategory;
}

export function CompendiumPage({ category }: CompendiumPageProps) {
  const { canonicalId } = useParams<{ canonicalId: string }>();
  const [source, setSource] = useState<string | undefined>(undefined);

  const resolved = resolveEntity(canonicalId ?? "", source);

  const handleSourceChange = useCallback((newSource: string) => {
    setSource(newSource);
  }, []);

  if (!canonicalId) {
    return <ErrorState message="Missing canonical ID" />;
  }

  if (!resolved) {
    return (
      <ErrorState message={`${CATEGORY_LABEL[category] ?? "Entity"} not found: ${canonicalId}`} />
    );
  }

  return (
    <EntityDetailLayout
      name={resolved.selected.name}
      subtitle={`${CATEGORY_LABEL[category] ?? "Entity"} \u00B7 ${formatSource(resolved.selected.source)}`}
      source={resolved.selected.source}
      versions={resolved.versions}
      onSourceChange={handleSourceChange}
    >
      <EntityRenderer entity={resolved.selected} />
    </EntityDetailLayout>
  );
}

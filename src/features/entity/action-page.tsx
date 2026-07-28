import { useParams } from "react-router";
import { getAction } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { ErrorState } from "@/components/ui/error-state";

export function ActionPage() {
  const { id } = useParams<{ id: string }>();
  const action = getAction(id!);

  if (!action) {
    return <ErrorState message={`Action not found: ${id}`} />;
  }

  return (
    <EntityDetailLayout
      name={action.name}
      subtitle={action.source}
      source={action.source}
      metadata={[]}
      description={action.description}
    />
  );
}

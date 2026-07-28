import { useParams } from "react-router";
import { getCondition } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { ErrorState } from "@/components/ui/error-state";

export function ConditionPage() {
  const { id } = useParams<{ id: string }>();
  const condition = getCondition(id!);

  if (!condition) {
    return <ErrorState message={`Condition not found: ${id}`} />;
  }

  return (
    <EntityDetailLayout
      name={condition.name}
      subtitle={condition.source}
      source={condition.source}
      metadata={[]}
      description={condition.description}
    />
  );
}

import { useParams } from "react-router";
import { getEquipment } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { ErrorState } from "@/components/ui/error-state";

export function EquipmentPage() {
  const { id } = useParams<{ id: string }>();
  const item = getEquipment(id!);

  if (!item) {
    return <ErrorState message={`Equipment not found: ${id}`} />;
  }

  return (
    <EntityDetailLayout
      name={item.name}
      subtitle={item.type}
      source={item.source}
      metadata={[
        ...(item.cost ? [{ label: "Cost", value: item.cost }] : []),
        ...(item.weight ? [{ label: "Weight", value: item.weight }] : []),
        ...(item.damage
          ? [{ label: "Damage", value: `${item.damage} ${item.damageType ?? ""}` }]
          : []),
        ...(item.ac ? [{ label: "AC", value: String(item.ac) }] : []),
      ]}
      description={item.description}
    />
  );
}

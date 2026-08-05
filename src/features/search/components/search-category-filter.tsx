import type { EntityCategory } from "@/compendium";
import { CATEGORY_REGISTRY } from "@/compendium";

interface SearchCategoryFilterProps {
  readonly selected: string;
  readonly onChange: (category: string) => void;
}

const BUTTON_BASE =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors shrink-0";
const BUTTON_ACTIVE = "border-foreground bg-accent font-medium text-foreground";
const BUTTON_INACTIVE = "border-border text-muted-foreground hover:bg-accent hover:text-foreground";

export function SearchCategoryFilter({ selected, onChange }: SearchCategoryFilterProps) {
  const entries = Object.entries(CATEGORY_REGISTRY) as [
    EntityCategory,
    (typeof CATEGORY_REGISTRY)[EntityCategory],
  ][];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`${BUTTON_BASE} ${selected === "" ? BUTTON_ACTIVE : BUTTON_INACTIVE}`}
      >
        All
      </button>
      {entries.map(([key, reg]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key === selected ? "" : key)}
          className={`${BUTTON_BASE} ${key === selected ? BUTTON_ACTIVE : BUTTON_INACTIVE}`}
        >
          {reg.plural}
        </button>
      ))}
    </div>
  );
}

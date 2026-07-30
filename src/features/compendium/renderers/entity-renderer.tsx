import type { Spell, Condition, Equipment, Action, Monster, MagicItem, Feat } from "@/compendium";
import { SpellRenderer } from "./spell-renderer";
import { EquipmentRenderer } from "./equipment-renderer";
import { ConditionRenderer } from "./condition-renderer";
import { ActionRenderer } from "./action-renderer";
import { MonsterRenderer } from "./monster-renderer";
import { MagicItemRenderer } from "./magic-item-renderer";
import { FeatRenderer } from "./feat-renderer";

interface EntityRendererProps {
  readonly entity: Spell | Condition | Equipment | Action | Monster | MagicItem | Feat;
}

export function EntityRenderer({ entity }: EntityRendererProps) {
  switch (entity.category) {
    case "spell":
      return <SpellRenderer entity={entity} />;
    case "equipment":
      return <EquipmentRenderer entity={entity} />;
    case "condition":
      return <ConditionRenderer entity={entity} />;
    case "action":
      return <ActionRenderer entity={entity} />;
    case "monster":
      return <MonsterRenderer entity={entity} />;
    case "magicitem":
      return <MagicItemRenderer entity={entity} />;
    case "feat":
      return <FeatRenderer entity={entity} />;
  }
}

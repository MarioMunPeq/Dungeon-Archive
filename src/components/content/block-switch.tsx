import type { ContentBlock } from "@/compendium";
import { ParagraphBlock } from "./paragraph-block";
import { ListBlock } from "./list-block";
import { TableBlock } from "./table-block";

interface BlockSwitchProps {
  readonly block: ContentBlock;
}

export function BlockSwitch({ block }: BlockSwitchProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} />;
    case "list":
      return <ListBlock items={block.items} />;
    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} />;
    default:
      return null;
  }
}

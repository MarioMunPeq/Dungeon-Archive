import type { ContentBlock } from "@/compendium";
import { BlockSwitch } from "./block-switch";

interface ContentRendererProps {
  readonly blocks: readonly ContentBlock[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <BlockSwitch key={i} block={block} />
      ))}
    </div>
  );
}

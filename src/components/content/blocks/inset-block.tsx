import type { ContentBlock } from "@/types/content-block";
import { BlockSwitch } from "./block-switch";

interface InsetBlockProps {
  readonly blocks: readonly ContentBlock[];
}

export function InsetBlock({ blocks }: InsetBlockProps) {
  return (
    <div className="border border-border rounded-card bg-muted/30 px-4 py-3 my-3 text-sm">
      <div className="space-y-2">
        {blocks.map((block, i) => (
          <BlockSwitch key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

import type { ContentBlock } from "@/types/content-block";
import { BlockSwitch } from "./block-switch";

interface EntriesBlockProps {
  readonly name?: string;
  readonly blocks: readonly ContentBlock[];
}

export function EntriesBlock({ name, blocks }: EntriesBlockProps) {
  return (
    <div>
      {name && <p className="text-sm font-semibold text-foreground">{name}</p>}
      <div className="space-y-2">
        {blocks.map((block, i) => (
          <BlockSwitch key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

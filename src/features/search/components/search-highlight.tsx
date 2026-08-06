import { buildHighlightParts } from "./build-highlight-parts";

interface SearchHighlightProps {
  readonly text: string;
  readonly query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const parts = buildHighlightParts(text, query);

  return (
    <>
      {parts.map((part, i) =>
        part.type === "match" ? (
          <mark key={i} className="rounded-sm bg-accent font-medium text-accent-foreground">
            {part.value}
          </mark>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </>
  );
}

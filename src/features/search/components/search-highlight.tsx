interface SearchHighlightProps {
  readonly text: string;
  readonly query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { type: "text" | "match"; value: string }[] = [];
  let last = 0;
  let idx = lower.indexOf(q, last);

  while (idx !== -1) {
    if (idx > last) {
      parts.push({ type: "text", value: text.slice(last, idx) });
    }
    parts.push({ type: "match", value: text.slice(idx, idx + q.length) });
    last = idx + q.length;
    idx = lower.indexOf(q, last);
  }

  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }

  if (parts.length === 0) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) =>
        part.type === "match" ? (
          <mark key={i} className="rounded-sm bg-accent px-1 text-accent-foreground">
            {part.value}
          </mark>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </>
  );
}

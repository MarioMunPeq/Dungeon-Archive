export interface HighlightPart {
  readonly type: "text" | "match";
  readonly value: string;
}

export function buildHighlightParts(text: string, query: string): readonly HighlightPart[] {
  const q = query.trim().toLowerCase();
  if (!q) return [{ type: "text", value: text }];

  const lower = text.toLowerCase();
  const parts: HighlightPart[] = [];
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

  return parts.length === 0 ? [{ type: "text", value: text }] : parts;
}

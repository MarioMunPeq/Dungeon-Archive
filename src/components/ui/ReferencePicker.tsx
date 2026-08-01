import { useMemo, useRef, useEffect, useState } from "react";

export interface PickerCandidate {
  readonly canonicalId: string;
  readonly name: string;
  readonly subtitle: string;
}

interface ReferencePickerProps {
  readonly title: string;
  readonly candidates: readonly PickerCandidate[];
  readonly onSelect: (canonicalId: string) => void;
  readonly onClose: () => void;
}

interface ScoredCandidate extends PickerCandidate {
  readonly score: number;
}

const MAX_ROWS = 60;

export function ReferencePicker({ title, candidates, onSelect, onClose }: ReferencePickerProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates.slice(0, MAX_ROWS);
    const scored: ScoredCandidate[] = [];
    for (const c of candidates) {
      const nameLower = c.name.toLowerCase();
      let score = 0;
      if (nameLower === q) score = 100;
      else if (nameLower.startsWith(q)) score = 80;
      else if (nameLower.includes(q)) score = 60;
      else continue;
      scored.push({ canonicalId: c.canonicalId, name: c.name, subtitle: c.subtitle, score });
    }
    scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return scored.slice(0, MAX_ROWS);
  }, [candidates, query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-card animate-slide-up">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="flex-1 text-sm font-semibold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close picker"
          className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="px-4 pt-3">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No results</p>
        ) : (
          <ul>
            {filtered.map((c) => (
              <li key={c.canonicalId}>
                <button
                  type="button"
                  onClick={() => onSelect(c.canonicalId)}
                  className="flex w-full flex-col items-start gap-0.5 border-b border-border py-3 text-left transition-all duration-150 hover:bg-accent/50 active:bg-accent/80"
                >
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

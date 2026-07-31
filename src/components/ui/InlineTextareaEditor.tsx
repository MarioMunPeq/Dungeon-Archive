import type { ChangeEvent } from "react";

interface InlineTextareaEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly rows?: number;
}

export function InlineTextareaEditor({ value, onChange, onSave, onCancel, rows = 2 }: InlineTextareaEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        rows={rows}
        autoFocus
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

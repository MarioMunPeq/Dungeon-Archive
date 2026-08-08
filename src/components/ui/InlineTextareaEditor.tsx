import { useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface InlineTextareaEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSave: (value: string) => void;
  readonly onCancel: () => void;
  readonly rows?: number;
  readonly placeholder?: string;
  readonly ariaLabel?: string;
}

export function InlineTextareaEditor({
  value,
  onChange,
  onSave,
  onCancel,
  rows = 2,
  placeholder,
  ariaLabel,
}: InlineTextareaEditorProps) {
  const done = useRef(false);

  const commit = () => {
    if (done.current) return;
    done.current = true;
    onSave(value);
  };

  const cancel = () => {
    if (done.current) return;
    done.current = true;
    onCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      rows={rows}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoFocus
      className="w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all duration-150 focus:border-focus focus:ring-1 focus:ring-focus"
    />
  );
}

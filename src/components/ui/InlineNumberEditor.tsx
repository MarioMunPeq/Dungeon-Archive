import { useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface InlineNumberEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSave: (value: string) => void;
  readonly onCancel: () => void;
  readonly className?: string;
}

export function InlineNumberEditor({
  value,
  onChange,
  onSave,
  onCancel,
  className = "",
}: InlineNumberEditorProps) {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="-?[0-9]*"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      autoFocus
      className={cn(
        "w-full rounded-lg border border-border bg-background px-3 py-1.5 text-foreground outline-none focus:border-focus focus:ring-1 focus:ring-focus",
        className,
      )}
    />
  );
}

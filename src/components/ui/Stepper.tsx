import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode, PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { InlineNumberEditor } from "./InlineNumberEditor";

interface StepperProps {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
  readonly label: string;
  readonly format?: (value: number) => string;
  readonly variant?: "bordered" | "ghost";
  readonly valueClassName?: string;
  readonly className?: string;
  readonly hiddenControls?: boolean;
}

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 55;

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  format = (v) => String(v),
  variant = "bordered",
  valueClassName = "",
  className = "",
  hiddenControls = false,
}: StepperProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const valueRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const stopRepeat = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => stopRepeat, [stopRepeat]);

  const applyDelta = useCallback(
    (delta: number) => {
      const next = Math.max(min, Math.min(max, valueRef.current + delta));
      if (next === valueRef.current) return;
      setDraft(String(next));
      onChange(next);
    },
    [min, max, onChange],
  );

  const beginRepeat = useCallback(
    (delta: number) => (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      applyDelta(delta);
      stopRepeat();
      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => applyDelta(delta), REPEAT_INTERVAL_MS);
      }, REPEAT_DELAY_MS);
    },
    [applyDelta, stopRepeat],
  );

  const commitDraft = useCallback(() => {
    const parsed = Math.floor(Number(draft.trim()));
    if (Number.isFinite(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    }
    setEditing(false);
  }, [draft, min, max, onChange]);

  const controlClass =
    variant === "ghost"
      ? "hitbox-expand flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-control text-muted-foreground transition-all duration-150 active:scale-90 active:text-foreground disabled:cursor-default disabled:text-disabled-foreground disabled:active:scale-100 hover:text-foreground"
      : "hitbox-expand flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-control border border-border bg-background text-base font-semibold text-foreground transition-all duration-150 active:scale-90 disabled:cursor-default disabled:bg-disabled disabled:text-disabled-foreground disabled:active:scale-100 hover:border-border-strong";

  const iconClass = "h-4 w-4";

  const stepButton = (delta: number, key: string, icon: ReactNode) => (
    <button
      key={key}
      type="button"
      onPointerDown={beginRepeat(delta)}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onPointerCancel={stopRepeat}
      disabled={delta < 0 ? value <= min : value >= max}
      aria-label={delta < 0 ? `Decrease ${label}` : `Increase ${label}`}
      className={controlClass}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className={iconClass}
      >
        {icon}
      </svg>
    </button>
  );

  const minusIcon = <line x1="5" y1="12" x2="19" y2="12" />;
  const plusIcon = (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  );

  const openEditor = () => {
    setDraft(String(value));
    setEditing(true);
  };

  if (hiddenControls && !editing) {
    return (
      <button
        type="button"
        onClick={openEditor}
        aria-label={`Edit ${label}`}
        className={cn(
          "flex h-11 w-full min-w-0 select-none items-center justify-center rounded-control font-bold tabular-nums text-foreground transition-all duration-150 active:scale-95 hover:bg-accent/60",
          className,
          valueClassName,
        )}
      >
        {format(value)}
      </button>
    );
  }

  if (hiddenControls && editing) {
    return (
      <div className={cn("flex w-full flex-col items-center gap-1", className)}>
        <InlineNumberEditor
          value={draft}
          onChange={setDraft}
          onSave={commitDraft}
          onCancel={() => setEditing(false)}
          aria-label={`Edit ${label}`}
          className={cn(
            "h-10 w-full px-2 text-center text-lg font-bold tabular-nums",
            valueClassName,
          )}
        />
        <div className="flex items-center gap-2">
          {stepButton(-1, "decrease", minusIcon)}
          {stepButton(1, "increase", plusIcon)}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center gap-1", className)}>
      {stepButton(-1, "decrease", minusIcon)}
      {editing ? (
        <InlineNumberEditor
          value={draft}
          onChange={setDraft}
          onSave={commitDraft}
          onCancel={() => setEditing(false)}
          aria-label={`Edit ${label}`}
          className={cn("h-9 w-14 px-2 text-center font-semibold", valueClassName)}
        />
      ) : (
        <button
          type="button"
          onClick={openEditor}
          aria-label={`Edit ${label}`}
          className={cn(
            "flex h-11 min-w-0 flex-1 select-none items-center justify-center rounded-control font-bold tabular-nums text-foreground transition-all duration-150 active:scale-95 hover:bg-accent/60",
            variant === "bordered" &&
              "border border-border bg-background px-1 text-base font-semibold hover:border-border-strong",
            valueClassName,
          )}
        >
          {format(value)}
        </button>
      )}
      {stepButton(1, "increase", plusIcon)}
    </div>
  );
}

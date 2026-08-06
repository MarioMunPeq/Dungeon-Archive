import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { CloseIcon } from "./icons";
import { SnackbarContext } from "./snackbar-context";
import type { SnackbarAction, SnackbarOptions, SnackbarTone } from "./snackbar-context";

const DEFAULT_DURATION_MS = 5000;

const TONE_CLASSES: Record<SnackbarTone, string> = {
  default: "border-border",
  success: "border-success/50",
  error: "border-destructive/50",
  warning: "border-warning/50",
  info: "border-info/50",
};

interface SnackbarEntry {
  readonly id: number;
  readonly message: string;
  readonly tone: SnackbarTone;
  readonly durationMs: number;
  readonly action?: SnackbarAction;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SnackbarEntry[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, options?: SnackbarOptions) => {
      const id = nextId.current++;
      const entry: SnackbarEntry = {
        id,
        message,
        tone: options?.tone ?? "default",
        durationMs: options?.durationMs ?? DEFAULT_DURATION_MS,
        ...(options?.action !== undefined ? { action: options.action } : {}),
      };
      setEntries((current) => [...current, entry]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), entry.durationMs),
      );
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                role="status"
                className={cn(
                  "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card border bg-card px-4 py-3 shadow-lg animate-slide-up",
                  TONE_CLASSES[entry.tone],
                )}
              >
                <p className="min-w-0 flex-1 text-sm text-foreground">{entry.message}</p>
                {entry.action !== undefined && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      entry.action?.onPress();
                      dismiss(entry.id);
                    }}
                  >
                    {entry.action.label}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(entry.id)}
                >
                  <CloseIcon size="xs" />
                </Button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </SnackbarContext.Provider>
  );
}

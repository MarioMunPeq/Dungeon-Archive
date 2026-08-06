import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useBeginnerMode } from "@/user-state";
import { cn } from "@/lib/utils";

interface HelpTipProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function HelpTip({ label, children, className }: HelpTipProps) {
  const beginnerMode = useBeginnerMode();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!beginnerMode) return null;

  return (
    <span ref={containerRef} className={cn("relative inline-flex shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="hitbox-expand inline-flex h-4 w-4 select-none items-center justify-center rounded-full bg-info/10 text-xs font-semibold leading-none text-info/80 transition-all duration-150 active:scale-90"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-card border border-border bg-elevated px-3 py-2 text-xs leading-relaxed text-foreground shadow-lg animate-pop"
        >
          {children}
        </span>
      )}
    </span>
  );
}

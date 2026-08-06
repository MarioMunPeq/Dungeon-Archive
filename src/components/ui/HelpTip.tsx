import type { ReactNode } from "react";
import { useBeginnerMode } from "@/user-state";
import { cn } from "@/lib/utils";
import { useConstrainedPopover } from "./use-constrained-popover";

interface HelpTipProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function HelpTip({ label, children, className }: HelpTipProps) {
  const beginnerMode = useBeginnerMode();
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } =
    useConstrainedPopover<HTMLSpanElement>();

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
          ref={popoverRef}
          role="tooltip"
          className={cn(
            "absolute left-0 z-20 w-64 rounded-card border border-border bg-elevated px-3 py-2 text-xs leading-relaxed text-foreground shadow-lg animate-pop transition-transform duration-150",
            placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
          )}
          style={{ transform: shiftX !== 0 ? `translateX(${shiftX}px)` : undefined }}
        >
          {children}
        </span>
      )}
    </span>
  );
}

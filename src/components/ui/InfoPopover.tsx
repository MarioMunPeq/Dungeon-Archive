import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

interface InfoPopoverProps {
  readonly placement: "below" | "above";
  readonly shiftX: number;
  readonly popoverRef: RefObject<HTMLElement | null>;
  readonly title: string;
  readonly children: ReactNode;
}

export function InfoPopover({
  placement,
  shiftX,
  popoverRef,
  title,
  children,
}: InfoPopoverProps) {
  return (
    <span
      ref={popoverRef as RefObject<HTMLSpanElement | null>}
      role="tooltip"
      className={cn(
        "absolute left-1/2 z-20 transition-transform duration-150",
        placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
      )}
      style={{ transform: `translateX(calc(-50% + ${shiftX}px))` }}
    >
      <span className="block w-64 rounded-card border border-border bg-elevated px-3 py-2 text-xs leading-relaxed text-foreground shadow-lg animate-pop">
        <span className="block text-xs font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {children}
        </span>
      </span>
    </span>
  );
}

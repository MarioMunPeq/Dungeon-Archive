import { useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

const EDGE_MARGIN = 8;

interface ConstrainedPopover<T extends HTMLElement> {
  readonly open: boolean;
  readonly setOpen: Dispatch<SetStateAction<boolean>>;
  readonly placement: "below" | "above";
  readonly shiftX: number;
  readonly containerRef: RefObject<T | null>;
  readonly popoverRef: RefObject<T | null>;
}

export function useConstrainedPopover<T extends HTMLElement>(): ConstrainedPopover<T> {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"below" | "above">("below");
  const [shiftX, setShiftX] = useState(0);
  const containerRef = useRef<T>(null);
  const popoverRef = useRef<T>(null);

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

  useEffect(() => {
    if (!open || !popoverRef.current) return;
    const measure = () => {
      const popover = popoverRef.current;
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      const overLeft = EDGE_MARGIN - rect.left;
      const overRight = rect.right - (window.innerWidth - EDGE_MARGIN);
      if (overLeft > 0) setShiftX(overLeft);
      else if (overRight > 0) setShiftX(-Math.min(overRight, Math.max(0, rect.left - EDGE_MARGIN)));
      else setShiftX(0);
      if (placement === "below" && rect.bottom > window.innerHeight - EDGE_MARGIN) {
        setPlacement("above");
      } else if (placement === "above" && rect.top < EDGE_MARGIN) {
        setPlacement("below");
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, placement]);

  return { open, setOpen, placement, shiftX, containerRef, popoverRef };
}

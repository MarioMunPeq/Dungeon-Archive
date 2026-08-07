import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const shiftXRef = useRef(0);
  shiftXRef.current = shiftX;

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

  useLayoutEffect(() => {
    if (!open || !popoverRef.current) return;
    const measure = () => {
      const popover = popoverRef.current;
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Recompute from the anchor position (measured rect minus the current clamp
      // shift) so re-measures on scroll/resize stay idempotent.
      const baseLeft = rect.left - shiftXRef.current;
      const width = rect.width;
      const minLeft = EDGE_MARGIN;
      const maxRight = vw - EDGE_MARGIN;
      let nextShift = 0;
      if (baseLeft < minLeft) nextShift = minLeft - baseLeft;
      else if (baseLeft + width > maxRight) nextShift = maxRight - (baseLeft + width);
      if (nextShift !== shiftXRef.current) setShiftX(nextShift);
      if (placement === "below" && rect.bottom > vh - EDGE_MARGIN) {
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

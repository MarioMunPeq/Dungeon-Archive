import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useConstrainedPopover } from "./use-constrained-popover";

export const LONG_PRESS_MS = 500;

interface LongPressInfo<T extends HTMLElement> {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly placement: "below" | "above";
  readonly shiftX: number;
  readonly containerRef: RefObject<T | null>;
  readonly popoverRef: RefObject<T | null>;
  readonly longPress: boolean;
  readonly clearLongPress: () => void;
  readonly startPress: (event: ReactPointerEvent) => void;
  readonly clearTimer: () => void;
}

export function useLongPressInfo<T extends HTMLElement>(): LongPressInfo<T> {
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } =
    useConstrainedPopover<T>();
  const [longPress, setLongPress] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPress = useCallback(
    (event: ReactPointerEvent) => {
      if (event.button !== 0) return;
      clearTimer();
      setLongPress(false);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setLongPress(true);
        setOpen(true);
      }, LONG_PRESS_MS);
    },
    [clearTimer, setOpen],
  );

  const clearLongPress = useCallback(() => setLongPress(false), []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    open,
    setOpen,
    placement,
    shiftX,
    containerRef,
    popoverRef,
    longPress,
    clearLongPress,
    startPress,
    clearTimer,
  };
}

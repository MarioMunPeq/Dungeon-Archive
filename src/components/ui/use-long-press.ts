import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FocusEvent as ReactFocusEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
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
  /** Opens the popover when the trigger is reached by keyboard only. */
  readonly onFocus: (event: ReactFocusEvent) => void;
  /** Closes the popover when focus leaves the trigger. */
  readonly onBlur: (event: ReactFocusEvent) => void;
}

/**
 * `true` when the element was focused by the keyboard rather than by a tap.
 *
 * Without this guard, tapping a condition chip would open its info popover as
 * well as toggling the condition, which is wrong on a touch screen. This is the
 * same question `:focus-visible` answers for focus rings.
 */
function isKeyboardFocus(target: EventTarget | null): boolean {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) return false;
  try {
    return target.matches(":focus-visible");
  } catch {
    // Selector unsupported in this browser: stay closed rather than pop up on
    // every tap.
    return false;
  }
}

export function useLongPressInfo<T extends HTMLElement>(): LongPressInfo<T> {
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } = useConstrainedPopover<T>();
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

  const onFocus = useCallback(
    (event: ReactFocusEvent) => {
      if (!isKeyboardFocus(event.target)) return;
      clearTimer();
      setLongPress(true);
      setOpen(true);
    },
    [clearTimer, setOpen],
  );

  const onBlur = useCallback(
    (event: ReactFocusEvent) => {
      const next = event.relatedTarget;
      // Focus moving inside the trigger (e.g. onto its own button) keeps it open.
      if (next instanceof Node && containerRef.current?.contains(next)) return;
      clearTimer();
      setLongPress(false);
      setOpen(false);
    },
    [clearTimer, setOpen],
  );

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
    onFocus,
    onBlur,
  };
}

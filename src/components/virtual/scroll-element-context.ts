import { createContext, useContext } from "react";
import type { RefObject } from "react";

export type ScrollElementRef = RefObject<HTMLElement | null>;

export const ScrollElementContext = createContext<ScrollElementRef | null>(null);

export function useScrollElementRef(): ScrollElementRef | null {
  return useContext(ScrollElementContext);
}

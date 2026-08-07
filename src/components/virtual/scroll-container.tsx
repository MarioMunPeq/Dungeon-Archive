import type { ReactNode } from "react";
import { ScrollElementContext } from "./scroll-element-context";
import type { ScrollElementRef } from "./scroll-element-context";

interface ScrollElementProviderProps {
  readonly elementRef: ScrollElementRef;
  readonly children: ReactNode;
}

export function ScrollElementProvider({ elementRef, children }: ScrollElementProviderProps) {
  return (
    <ScrollElementContext.Provider value={elementRef}>{children}</ScrollElementContext.Provider>
  );
}

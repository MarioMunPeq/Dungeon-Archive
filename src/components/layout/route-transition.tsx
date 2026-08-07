import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="route-transition flex-1">
      {children}
    </div>
  );
}

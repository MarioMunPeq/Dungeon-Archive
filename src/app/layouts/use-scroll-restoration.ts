import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "da:scroll:";

export function useScrollRestoration() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const seenKeys = useRef(new Set<string>(location.key ? [location.key] : []));

  useEffect(() => {
    const main = mainRef.current;
    if (!main || !location.key) return;
    if (seenKeys.current.has(location.key)) {
      const saved = sessionStorage.getItem(STORAGE_PREFIX + location.key);
      if (saved !== null) {
        const top = Number(saved);
        if (Number.isFinite(top)) main.scrollTop = top;
      }
    } else {
      seenKeys.current.add(location.key);
      main.scrollTop = 0;
    }
  }, [location.key]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || !location.key) return;
    const onScroll = () => {
      sessionStorage.setItem(STORAGE_PREFIX + location.key, String(main.scrollTop));
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, [location.key]);

  return mainRef;
}

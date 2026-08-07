import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "da:scroll:";

export function useScrollRestoration() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const seenKeys = useRef(new Set<string>(location.key ? [location.key] : []));

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main || !location.key) return;
    let pending = false;
    const save = () => {
      pending = false;
      sessionStorage.setItem(STORAGE_PREFIX + location.key, String(main.scrollTop));
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(save);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      main.removeEventListener("scroll", onScroll);
      if (pending) {
        pending = false;
        save();
      }
    };
  }, [location.key]);

  return mainRef;
}

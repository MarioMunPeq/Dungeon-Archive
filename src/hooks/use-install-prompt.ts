import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  readonly userChoice: Promise<{
    readonly outcome: "accepted" | "dismissed";
    readonly platform: string;
  }>;
  prompt(): Promise<void>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream;
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(isStandalone);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setStandalone(true);
      setDeferred(null);
    };
    setStandalone(isStandalone());
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (deferred === null) return;
    const event = deferred;
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === "accepted") setStandalone(true);
    } finally {
      // The beforeinstallprompt event is single-use: prompt() can only be
      // invoked once per captured event, so drop it after the flow completes
      // (accepted, dismissed, or an unexpected error).
      setDeferred(null);
    }
  }, [deferred]);

  return {
    canPrompt: deferred !== null && !standalone,
    showIosHint: isIosSafari() && !standalone,
    install,
  };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadCompendium } from "@/compendium";
import { hydrate } from "@/user-state";
import { App } from "@/app";
import { BootScreen } from "@/app/boot-screen";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
// TEMP DEBUG
import {
  authDebug,
  debugBrowserEnvironment,
  debugFirebasePersistence,
  debugLocationSnapshot,
  debugStorageAvailability,
} from "@/lib/firebase/auth-debug";

// TEMP DEBUG — Phase 3 + 6 + 9: startup snapshot, as early as the app module runs.
authDebug("APP START", {
  ...debugLocationSnapshot(),
  ...debugBrowserEnvironment(),
  ...debugStorageAvailability(),
});
// TEMP DEBUG — Phase 6: where Firebase keeps the session (async, non-blocking).
void debugFirebasePersistence().then((persistence) => {
  authDebug("STORAGE: Firebase persistence inspection", persistence);
});
// TEMP DEBUG — Phase 7: observe the service worker lifecycle without touching it.
{
  const sw = "serviceWorker" in navigator ? navigator.serviceWorker : null;
  authDebug("SW state at startup", {
    supported: sw !== null,
    controller: sw?.controller?.scriptURL ?? null,
  });
  if (sw) {
    sw.addEventListener("controllerchange", () => {
      authDebug("SW controllerchange", {
        controller: sw.controller?.scriptURL ?? null,
        href: window.location.href,
      });
    });
    void sw.ready.then((registration) => {
      authDebug("SW ready", {
        scope: registration.scope,
        active: registration.active?.scriptURL ?? null,
        waiting: registration.waiting?.scriptURL ?? null,
        installing: registration.installing?.scriptURL ?? null,
      });
      const observeState = (worker: ServiceWorker) => {
        worker.addEventListener("statechange", (event) => {
          authDebug("SW worker statechange", {
            scriptURL: worker.scriptURL,
            state: (event.target as ServiceWorker | null)?.state ?? null,
          });
        });
      };
      if (registration.active) observeState(registration.active);
      registration.addEventListener("updatefound", () => {
        const next = registration.installing;
        authDebug("SW updatefound", { installing: next?.scriptURL ?? null });
        if (next) observeState(next);
      });
    });
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const container = rootElement;

const root = createRoot(container);
root.render(
  <StrictMode>
    <BootScreen />
  </StrictMode>,
);

async function main() {
  try {
    await loadCompendium();
    hydrate();

    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    container.textContent = "Failed to load compendium data.";
    container.style.padding = "2rem";
    container.style.fontFamily = "system-ui";
    // eslint-disable-next-line no-console -- fatal boot error must be reported
    console.error("Compendium initialization failed:", error);
  }
}

main();

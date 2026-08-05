import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadCompendium } from "@/compendium";
import { hydrate } from "@/user-state";
import { App } from "@/app";
import { BootScreen } from "@/app/boot-screen";
import "./index.css";

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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadCompendium } from "@/compendium";
import { hydrate } from "@/user-state";
import { App } from "@/app";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const container = rootElement;

async function main() {
  try {
    await loadCompendium();
    hydrate();

    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    container.textContent = "Failed to load compendium data.";
    container.style.padding = "2rem";
    container.style.fontFamily = "system-ui";
    console.error("Compendium initialization failed:", error);
  }
}

main();
